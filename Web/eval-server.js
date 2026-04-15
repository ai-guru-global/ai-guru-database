/**
 * K8s Real Model Evaluation Backend Server
 * Proxies requests to Qwen / Kimi / MiniMax APIs and auto-scores responses.
 * Supports:
 *   - Manual batch evaluation
 *   - Scheduled evaluation (cron)
 *   - SSE progress streaming
 *   - Historical trends
 *
 * Usage:  node eval-server.js
 * Env:    QWEN_API_KEY, KIMI_API_KEY, MINIMAX_API_KEY, MINIMAX_GROUP_ID
 */

import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import cron from 'node-cron';

const app = express();
app.use(express.json({ limit: '10mb' }));

const PORT = process.env.EVAL_SERVER_PORT || 3100;
const HISTORY_DIR = path.join(process.cwd(), '.eval-history');
const RUNS_DIR = path.join(HISTORY_DIR, 'runs');
const TRENDS_DIR = path.join(HISTORY_DIR, 'trends');

// Ensure directories exist
[HISTORY_DIR, RUNS_DIR, TRENDS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

/* ------------------------------------------------------------------ */
/*  Model adapters                                                     */
/* ------------------------------------------------------------------ */

const MODEL_CONFIG = {
  qwen: {
    name: 'Qwen3-Max',
    model: 'qwen-max',
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
    getHeaders: () => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getApiKey('qwen')}`,
    }),
    buildBody: (model, messages) => ({ model, messages, temperature: 0.3 }),
    extractContent: (data) => data?.choices?.[0]?.message?.content ?? '',
  },
  kimi: {
    name: 'Kimi K2.5',
    model: 'moonshot-v1-8k',
    baseUrl: 'https://api.moonshot.cn/v1/chat/completions',
    getHeaders: () => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getApiKey('kimi')}`,
    }),
    buildBody: (model, messages) => ({ model, messages, temperature: 1 }),
    extractContent: (data) => data?.choices?.[0]?.message?.content ?? '',
  },
  minimax: {
    name: 'MiniMax M2.1',
    model: 'MiniMax-M2.1',
    baseUrl: 'https://api.minimax.chat/v1/text/chatcompletion_v2',
    getHeaders: () => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getApiKey('minimax')}`,
    }),
    buildBody: (model, messages) => ({ model, messages, temperature: 0.3 }),
    extractContent: (data) => data?.choices?.[0]?.message?.content ?? '',
  },
};

/* ------------------------------------------------------------------ */
/*  API Key management                                                  */
/* ------------------------------------------------------------------ */

const API_KEYS_FILE = path.join(HISTORY_DIR, 'api-keys.json');

function loadApiKeysFromFile() {
  try {
    if (fs.existsSync(API_KEYS_FILE)) {
      return JSON.parse(fs.readFileSync(API_KEYS_FILE, 'utf-8'));
    }
  } catch (e) {
    console.warn('Failed to load API keys from file:', e.message);
  }
  return {};
}

function saveApiKeysToFile(keys) {
  try {
    fs.writeFileSync(API_KEYS_FILE, JSON.stringify(keys, null, 2));
  } catch (e) {
    console.error('Failed to save API keys to file:', e.message);
  }
}

function getApiKey(modelId) {
  const envKey =
    modelId === 'qwen' ? process.env.QWEN_API_KEY :
    modelId === 'kimi' ? process.env.KIMI_API_KEY :
    modelId === 'minimax' ? process.env.MINIMAX_API_KEY : null;

  if (envKey) return envKey;

  const fileKeys = loadApiKeysFromFile();
  return fileKeys[modelId] || null;
}

/* ------------------------------------------------------------------ */
/*  Model calling                                                       */
/* ------------------------------------------------------------------ */

async function callModel(modelId, question) {
  const cfg = MODEL_CONFIG[modelId];
  if (!cfg) throw new Error(`Unknown model: ${modelId}`);

  const apiKey = getApiKey(modelId);
  if (!apiKey) throw new Error(`API key not configured for ${modelId}`);

  const messages = [
    { role: 'system', content: 'You are a Kubernetes expert. Answer the question accurately, concisely, and in Chinese. If writing YAML configs, include complete and correct examples.' },
    { role: 'user', content: question },
  ];

  const startTime = Date.now();
  const resp = await fetch(cfg.baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(cfg.buildBody(cfg.model, messages)),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`${modelId} API error ${resp.status}: ${errText}`);
  }

  const data = await resp.json();
  const latencyMs = Date.now() - startTime;
  const content = cfg.extractContent(data);

  return { modelId, modelName: cfg.name, model: cfg.model, content, latencyMs };
}

/* ------------------------------------------------------------------ */
/*  Auto-scoring                                                       */
/* ------------------------------------------------------------------ */

function autoScore(answer, question) {
  if (!answer || answer.trim().length === 0) return { total: 0, breakdown: {} };

  const lowerAnswer = answer.toLowerCase();
  const { keywords = [], referenceAnswer = '', maxScore = 100 } = question;

  // 1. Keyword hit rate (40%)
  const hits = keywords.filter((kw) => lowerAnswer.includes(kw.toLowerCase()));
  const keywordScore = keywords.length > 0 ? (hits.length / keywords.length) * 100 : 50;

  // 2. Length adequacy (15%) — too short or too long penalized
  const len = answer.length;
  let lengthScore = 100;
  if (len < 50) lengthScore = 30;
  else if (len < 100) lengthScore = 60;
  else if (len < 200) lengthScore = 80;
  else if (len > 3000) lengthScore = 70;

  // 3. Structure (15%) — has paragraphs, lists, code blocks?
  let structureScore = 50;
  if (answer.includes('\n')) structureScore += 15;
  if (answer.includes('```') || answer.includes('yaml') || answer.includes('apiVersion')) structureScore += 15;
  if (/\d+\.|[-*]\s/.test(answer)) structureScore += 10;
  if (answer.includes('##') || answer.includes('**')) structureScore += 10;
  structureScore = Math.min(100, structureScore);

  // 4. Reference similarity (30%) — simple token overlap with reference
  let refScore = 50;
  if (referenceAnswer) {
    const refTokens = new Set(referenceAnswer.toLowerCase().split(/\s+/).filter((t) => t.length > 2));
    const ansTokens = new Set(lowerAnswer.split(/\s+/).filter((t) => t.length > 2));
    const overlap = [...refTokens].filter((t) => ansTokens.has(t)).length;
    refScore = refTokens.size > 0 ? Math.min(100, (overlap / refTokens.size) * 120) : 50;
  }

  const total = Math.round(
    keywordScore * 0.4 + refScore * 0.3 + lengthScore * 0.15 + structureScore * 0.15
  );

  return {
    total: Math.min(maxScore, total),
    breakdown: {
      keywordScore: Math.round(keywordScore),
      keywordHits: hits,
      keywordTotal: keywords.length,
      referenceScore: Math.round(refScore),
      lengthScore: Math.round(lengthScore),
      structureScore: Math.round(structureScore),
    },
  };
}

/* ------------------------------------------------------------------ */
/*  History persistence                                                */
/* ------------------------------------------------------------------ */

function getDateDir() {
  const today = new Date().toISOString().split('T')[0];
  const dir = path.join(RUNS_DIR, today);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function saveRun(record) {
  const id = crypto.randomUUID();
  record.id = id;
  record.timestamp = new Date().toISOString();

  const fp = path.join(getDateDir(), `run-${Date.now()}.json`);
  fs.writeFileSync(fp, JSON.stringify(record, null, 2));

  // Update trends
  updateTrends(record);

  return id;
}

function updateTrends(runRecord) {
  if (!runRecord.summary) return;

  for (const [modelId, sum] of Object.entries(runRecord.summary)) {
    const trendFile = path.join(TRENDS_DIR, `${modelId}.json`);
    let trend = { history: [] };

    if (fs.existsSync(trendFile)) {
      try {
        trend = JSON.parse(fs.readFileSync(trendFile, 'utf-8'));
      } catch (e) {}
    }

    trend.history.push({
      date: runRecord.timestamp.split('T')[0],
      timestamp: runRecord.timestamp,
      avgScore: sum.averageScore,
      dimensionScores: sum.dimensionScores,
      modelName: sum.modelName,
      model: sum.model,
    });

    // Keep only last 90 days
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 90);
    trend.history = trend.history.filter(h => new Date(h.timestamp) > cutoff);

    fs.writeFileSync(trendFile, JSON.stringify(trend, null, 2));
  }
}

function loadTrends(modelId) {
  const fp = path.join(TRENDS_DIR, `${modelId}.json`);
  if (!fs.existsSync(fp)) return { model: modelId, data: [] };

  try {
    const trend = JSON.parse(fs.readFileSync(fp, 'utf-8'));
    const data = trend.history.map(h => ({
      date: h.date,
      avgScore: h.avgScore,
      dimensions: h.dimensionScores,
    }));

    let delta = null;
    if (data.length >= 2) {
      const diff = data[data.length - 1].avgScore - data[data.length - 2].avgScore;
      delta = `${diff >= 0 ? '+' : ''}${diff.toFixed(1)}`;
    }

    return { model: MODEL_CONFIG[modelId]?.name || modelId, data, delta };
  } catch (e) {
    return { model: modelId, data: [], delta: null };
  }
}

function listRuns(limit = 20) {
  const runs = [];

  if (!fs.existsSync(RUNS_DIR)) return runs;

  const dirs = fs.readdirSync(RUNS_DIR).sort().reverse();

  for (const dir of dirs) {
    const dirPath = path.join(RUNS_DIR, dir);
    if (!fs.statSync(dirPath).isDirectory()) continue;

    const files = fs.readdirSync(dirPath)
      .filter(f => f.endsWith('.json'))
      .sort()
      .reverse();

    for (const file of files) {
      try {
        const raw = JSON.parse(fs.readFileSync(path.join(dirPath, file), 'utf-8'));
        runs.push({
          id: raw.id,
          timestamp: raw.timestamp,
          date: dir,
          type: raw.type,
          models: raw.summary ? Object.keys(raw.summary) : [],
          avgScores: raw.summary ?
            Object.fromEntries(Object.entries(raw.summary).map(([k, v]) => [k, v.averageScore])) : {},
        });
      } catch (e) {}
    }

    if (runs.length >= limit) break;
  }

  return runs.slice(0, limit);
}

function loadRunDetail(id) {
  if (!fs.existsSync(RUNS_DIR)) return null;

  for (const dir of fs.readdirSync(RUNS_DIR)) {
    const dirPath = path.join(RUNS_DIR, dir);
    if (!fs.statSync(dirPath).isDirectory()) continue;

    for (const file of fs.readdirSync(dirPath)) {
      if (!file.endsWith('.json')) continue;
      const fp = path.join(dirPath, file);
      try {
        const raw = JSON.parse(fs.readFileSync(fp, 'utf-8'));
        if (raw.id === id) return raw;
      } catch (e) {}
    }
  }
  return null;
}

/* ------------------------------------------------------------------ */
/*  Scheduling                                                          */
/* ------------------------------------------------------------------ */

const SCHEDULE_FILE = path.join(HISTORY_DIR, 'schedule.json');
let scheduledTask = null;

function loadSchedule() {
  try {
    if (fs.existsSync(SCHEDULE_FILE)) {
      return JSON.parse(fs.readFileSync(SCHEDULE_FILE, 'utf-8'));
    }
  } catch (e) {}
  return { enabled: false, cron: '0 2 * * *', models: ['kimi'] };
}

function saveScheduleConfig(cfg) {
  fs.writeFileSync(SCHEDULE_FILE, JSON.stringify(cfg, null, 2));

  // Cancel existing
  if (scheduledTask) {
    scheduledTask.stop();
    scheduledTask = null;
  }

  // Schedule new if enabled
  if (cfg.enabled && cfg.cron) {
    if (cron.validate(cfg.cron)) {
      scheduledTask = cron.schedule(cfg.cron, () => {
        console.log(`[SCHEDULE] Running scheduled evaluation for models: ${cfg.models.join(', ')}`);
        triggerEvaluation(cfg.models);
      });
      console.log(`[SCHEDULE] Next run: ${scheduledTask.nextDates()}`);
    }
  }
}

function initSchedule() {
  const cfg = loadSchedule();
  if (cfg.enabled && cfg.cron) {
    if (cron.validate(cfg.cron)) {
      scheduledTask = cron.schedule(cfg.cron, () => {
        console.log(`[SCHEDULE] Running scheduled evaluation`);
        triggerEvaluation(cfg.models || ['kimi']);
      });
      console.log(`[SCHEDULE] Initialized with cron: ${cfg.cron}, next: ${scheduledTask.nextDates()}`);
    }
  }
}

// Initialize schedule on load
initSchedule();

/* ------------------------------------------------------------------ */
/*  Evaluation trigger                                                  */
/* ------------------------------------------------------------------ */

// Active SSE connections for progress
const sseClients = new Map(); // runId -> Set of response objects

async function triggerEvaluation(modelIds, questions = null) {
  // Import questions inline to avoid circular deps
  const K8S_TEST_QUESTIONS = getK8sTestQuestions();
  const questionsToRun = questions || K8S_TEST_QUESTIONS;

  const runId = crypto.randomUUID();
  const results = {};
  const summary = {};

  // Notify SSE clients of start
  broadcastSSE(runId, 'start', { totalQuestions: questionsToRun.length * modelIds.length, models: modelIds });

  let current = 0;
  const total = questionsToRun.length * modelIds.length;

  for (const modelId of modelIds) {
    results[modelId] = [];
    let totalScore = 0;
    const dimScores = {};

    for (const q of questionsToRun) {
      current++;
      broadcastSSE(runId, 'progress', {
        current, total, percent: Math.round((current / total) * 100),
        currentQuestion: q.id, model: modelId,
        question: q.question, dimension: q.dimension, keywords: q.keywords || []
      });

      try {
        const result = await callModel(modelId, q.question);
        const score = autoScore(result.content, q);
        const fullResult = { questionId: q.id, dimension: q.dimension, ...result, score };
        results[modelId].push(fullResult);
        totalScore += score.total;

        if (!dimScores[q.dimension]) dimScores[q.dimension] = { sum: 0, count: 0 };
        dimScores[q.dimension].sum += score.total;
        dimScores[q.dimension].count += 1;

        // Broadcast partial result for visualization
        broadcastSSE(runId, 'partial-result', {
          model: modelId,
          question: q.question,
          questionId: q.id,
          dimension: q.dimension,
          content: result.content,
          latencyMs: result.latencyMs,
          score
        });

        // Rate limiting: wait 500ms between calls
        await new Promise(r => setTimeout(r, 500));
      } catch (err) {
        results[modelId].push({ questionId: q.id, dimension: q.dimension, error: err.message, score: { total: 0 } });
        broadcastSSE(runId, 'error', { model: modelId, question: q.id, error: err.message });
      }
    }

    const dimAverages = {};
    for (const [dim, vals] of Object.entries(dimScores)) {
      dimAverages[dim] = Math.round((vals.sum / vals.count) * 10) / 10;
    }

    summary[modelId] = {
      modelName: MODEL_CONFIG[modelId]?.name || modelId,
      model: MODEL_CONFIG[modelId]?.model || modelId,
      totalQuestions: questionsToRun.length,
      averageScore: Math.round((totalScore / questionsToRun.length) * 10) / 10,
      dimensionScores: dimAverages,
    };
  }

  const record = {
    type: 'batch',
    models: modelIds,
    summary,
    results,
    questionCount: questionsToRun.length,
  };

  const historyId = saveRun(record);

  broadcastSSE(runId, 'complete', { runId: historyId, summary });

  return { runId: historyId, summary, results };
}

function broadcastSSE(runId, event, data) {
  const clients = sseClients.get(runId);
  if (!clients) return;

  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const res of clients) {
    try { res.write(payload); } catch (e) { clients.delete(res); }
  }
}

/* ------------------------------------------------------------------ */
/*  K8s Test Questions (inline)                                        */
/* ------------------------------------------------------------------ */

function getK8sTestQuestions() {
  // Minimal subset - in production would import from shared module
  return [
    { id: 'cc-01', dimension: 'core_concepts', question: '请解释 Kubernetes 中 Pod 的概念，以及为什么 Pod 是 K8s 的最小调度单元而不是容器？', keywords: ['最小调度单元', '共享网络', '共享存储', '容器'], maxScore: 100 },
    { id: 'cc-02', dimension: 'core_concepts', question: '请说明 Kubernetes Service 的四种类型及其使用场景。', keywords: ['ClusterIP', 'NodePort', 'LoadBalancer', 'ExternalName'], maxScore: 100 },
    { id: 'cc-03', dimension: 'core_concepts', question: '请详细解释 Kubernetes 控制平面的核心组件及各自职责。', keywords: ['apiserver', 'etcd', 'scheduler', 'controller-manager'], maxScore: 100 },
    { id: 'cc-04', dimension: 'core_concepts', question: '解释 Kubernetes 中 Deployment、ReplicaSet 和 Pod 三者之间的关系和层级结构。', keywords: ['Deployment', 'ReplicaSet', '滚动更新', '副本'], maxScore: 100 },
    { id: 'cc-05', dimension: 'core_concepts', question: '什么是 Kubernetes 的声明式 API？它与命令式 API 有什么本质区别？', keywords: ['声明式', '期望状态', 'reconcile', '调和'], maxScore: 100 },
    { id: 'cc-06', dimension: 'core_concepts', question: '请解释 Kubernetes 中 QoS 类别（Guaranteed、Burstable、BestEffort）的判定规则和驱逐优先级。', keywords: ['Guaranteed', 'Burstable', 'BestEffort', 'requests', 'limits'], maxScore: 100 },
    { id: 'cc-07', dimension: 'core_concepts', question: '解释 Kubernetes 中 ConfigMap 和 Secret 的区别、使用方式，以及 Secret 的安全局限性。', keywords: ['ConfigMap', 'Secret', 'Base64', '加密', 'etcd'], maxScore: 100 },
    { id: 'cc-08', dimension: 'core_concepts', question: '什么是 Kubernetes Namespace？它解决了什么问题？默认有哪些 Namespace？', keywords: ['Namespace', '资源隔离', '多租户', 'default', 'kube-system'], maxScore: 100 },
  ];
}

/* ------------------------------------------------------------------ */
/*  API routes                                                         */
/* ------------------------------------------------------------------ */

// Health check
app.get('/api/k8s-eval/health', (_req, res) => {
  const status = {
    qwen: !!getApiKey('qwen'),
    kimi: !!getApiKey('kimi'),
    minimax: !!getApiKey('minimax'),
  };
  res.json({ ok: true, models: status });
});

// Save API keys
app.post('/api/k8s-eval/keys', (req, res) => {
  try {
    const { qwen, kimi, minimax } = req.body;
    const keys = {};
    if (qwen) keys.qwen = qwen;
    if (kimi) keys.kimi = kimi;
    if (minimax) keys.minimax = minimax;
    saveApiKeysToFile(keys);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Single chat — send question to one model, return raw response
app.post('/api/k8s-eval/chat', async (req, res) => {
  try {
    const { modelId, question } = req.body;
    const result = await callModel(modelId, question);
    res.json({ ok: true, result });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Evaluate — send question + auto-score
app.post('/api/k8s-eval/evaluate', async (req, res) => {
  try {
    const { modelId, question } = req.body;
    const result = await callModel(modelId, question.question);
    const score = autoScore(result.content, question);
    res.json({ ok: true, result: { ...result, score } });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Trigger immediate evaluation
app.post('/api/k8s-eval/run', async (req, res) => {
  try {
    const { models } = req.body || {};
    const modelIds = models && models.length > 0 ? models : ['kimi'];

    // Run in background, use 'latest' as runId so SSE clients can listen
    triggerEvaluation(modelIds).catch(err => {
      console.error('Evaluation error:', err);
    });

    res.json({ ok: true, message: 'Evaluation started', runId: 'latest' });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Batch evaluate — run all questions for specified models
app.post('/api/k8s-eval/batch', async (req, res) => {
  try {
    const { modelIds, questions } = req.body;
    const K8S_TEST_QUESTIONS = getK8sTestQuestions();
    const questionsToRun = questions || K8S_TEST_QUESTIONS;

    const results = {};
    const summary = {};

    for (const modelId of modelIds) {
      results[modelId] = [];
      let totalScore = 0;
      const dimScores = {};

      for (const q of questionsToRun) {
        try {
          const result = await callModel(modelId, q.question);
          const score = autoScore(result.content, q);
          results[modelId].push({ questionId: q.id, dimension: q.dimension, ...result, score });
          totalScore += score.total;

          if (!dimScores[q.dimension]) dimScores[q.dimension] = { sum: 0, count: 0 };
          dimScores[q.dimension].sum += score.total;
          dimScores[q.dimension].count += 1;
        } catch (err) {
          results[modelId].push({ questionId: q.id, dimension: q.dimension, error: err.message, score: { total: 0 } });
        }
      }

      const dimAverages = {};
      for (const [dim, vals] of Object.entries(dimScores)) {
        dimAverages[dim] = Math.round((vals.sum / vals.count) * 10) / 10;
      }

      summary[modelId] = {
        modelName: MODEL_CONFIG[modelId]?.name || modelId,
        model: MODEL_CONFIG[modelId]?.model || modelId,
        totalQuestions: questionsToRun.length,
        averageScore: Math.round((totalScore / questionsToRun.length) * 10) / 10,
        dimensionScores: dimAverages,
      };
    }

    const historyId = saveRun({
      type: 'batch',
      models: modelIds,
      summary,
      results,
      questionCount: questionsToRun.length,
    });

    res.json({ ok: true, summary, results, historyId });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// SSE progress stream
app.get('/api/k8s-eval/stream', (req, res) => {
  const runId = req.query.runId || 'latest';

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  if (!sseClients.has(runId)) {
    sseClients.set(runId, new Set());
  }
  sseClients.get(runId).add(res);

  // Send initial connection event
  res.write(`event: connected\ndata: ${JSON.stringify({ runId })}\n\n`);

  // Keep connection alive with heartbeat
  const heartbeat = setInterval(() => {
    try { res.write(`: heartbeat\n\n`); } catch (e) { clearInterval(heartbeat); }
  }, 30000);

  req.on('close', () => {
    clearInterval(heartbeat);
    const clients = sseClients.get(runId);
    if (clients) clients.delete(res);
  });
});

// Schedule management
app.get('/api/k8s-eval/schedule', (_req, res) => {
  const cfg = loadSchedule();
  const nextRun = scheduledTask ? scheduledTask.nextDates() : null;
  res.json({ ok: true, schedule: { ...cfg, nextRun } });
});

app.post('/api/k8s-eval/schedule', (req, res) => {
  try {
    const { enabled, cron, models } = req.body;

    if (cron && !cron.validate(cron)) {
      return res.status(400).json({ ok: false, error: 'Invalid cron expression' });
    }

    saveScheduleConfig({ enabled: !!enabled, cron: cron || '0 2 * * *', models: models || ['kimi'] });
    const cfg = loadSchedule();
    res.json({ ok: true, schedule: { ...cfg, nextRun: scheduledTask?.nextDates() } });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.delete('/api/k8s-eval/schedule', (_req, res) => {
  saveScheduleConfig({ enabled: false, cron: '0 2 * * *', models: ['kimi'] });
  res.json({ ok: true });
});

// History list
app.get('/api/k8s-eval/runs', (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  res.json({ ok: true, runs: listRuns(limit) });
});

// Trends
app.get('/api/k8s-eval/trends', (req, res) => {
  const { model, days } = req.query;
  if (model) {
    res.json({ ok: true, ...loadTrends(model) });
  } else {
    // Return all models
    const trends = {};
    for (const modelId of Object.keys(MODEL_CONFIG)) {
      trends[modelId] = loadTrends(modelId);
    }
    res.json({ ok: true, trends });
  }
});

// History detail
app.get('/api/k8s-eval/history/:id', (req, res) => {
  const record = loadRunDetail(req.params.id);
  if (!record) return res.status(404).json({ ok: false, error: 'Not found' });
  res.json({ ok: true, record });
});

/* ------------------------------------------------------------------ */
/*  Start                                                              */
/* ------------------------------------------------------------------ */

app.listen(PORT, () => {
  console.log(`\n🚀 K8s Eval Server running on http://localhost:${PORT}`);
  console.log(`   Models configured:`);
  console.log(`     Qwen:    ${getApiKey('qwen') ? '✅' : '❌ (missing QWEN_API_KEY)'}`);
  console.log(`     Kimi:    ${getApiKey('kimi') ? '✅' : '❌ (missing KIMI_API_KEY)'}`);
  console.log(`     MiniMax: ${getApiKey('minimax') ? '✅' : '❌ (missing MINIMAX_API_KEY)'}`);

  const schedule = loadSchedule();
  if (schedule.enabled) {
    console.log(`   Schedule: ${schedule.cron} (${schedule.models?.join(', ')})`);
  }
});
