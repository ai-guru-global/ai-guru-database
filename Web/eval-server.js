/**
 * K8s Real Model Evaluation Backend Server
 * Proxies requests to Qwen / Kimi / MiniMax APIs and auto-scores responses.
 *
 * Usage:  node eval-server.js
 * Env:    QWEN_API_KEY, KIMI_API_KEY, MINIMAX_API_KEY, MINIMAX_GROUP_ID
 */

import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const app = express();
app.use(express.json({ limit: '2mb' }));

const PORT = process.env.EVAL_SERVER_PORT || 3100;
const HISTORY_DIR = path.join(process.cwd(), '.eval-history');
if (!fs.existsSync(HISTORY_DIR)) fs.mkdirSync(HISTORY_DIR, { recursive: true });

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
      Authorization: `Bearer ${process.env.QWEN_API_KEY}`,
    }),
    buildBody: (model, messages) => ({ model, messages, temperature: 0.3 }),
    extractContent: (data) => data?.choices?.[0]?.message?.content ?? '',
  },
  kimi: {
    name: 'Kimi K2.5',
    model: 'kimi-k2.5',
    baseUrl: 'https://api.moonshot.cn/v1/chat/completions',
    getHeaders: () => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.KIMI_API_KEY}`,
    }),
    buildBody: (model, messages) => ({ model, messages, temperature: 0.3 }),
    extractContent: (data) => data?.choices?.[0]?.message?.content ?? '',
  },
  minimax: {
    name: 'MiniMax M2.1',
    model: 'MiniMax-M2.1',
    baseUrl: 'https://api.minimax.chat/v1/text/chatcompletion_v2',
    getHeaders: () => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.MINIMAX_API_KEY}`,
    }),
    buildBody: (model, messages) => ({ model, messages, temperature: 0.3 }),
    extractContent: (data) => data?.choices?.[0]?.message?.content ?? '',
  },
};

async function callModel(modelId, question) {
  const cfg = MODEL_CONFIG[modelId];
  if (!cfg) throw new Error(`Unknown model: ${modelId}`);

  const apiKey =
    modelId === 'qwen' ? process.env.QWEN_API_KEY :
    modelId === 'kimi' ? process.env.KIMI_API_KEY :
    process.env.MINIMAX_API_KEY;

  if (!apiKey) throw new Error(`API key not configured for ${modelId}`);

  const messages = [
    { role: 'system', content: 'You are a Kubernetes expert. Answer the question accurately, concisely, and in Chinese. If writing YAML configs, include complete and correct examples.' },
    { role: 'user', content: question },
  ];

  const startTime = Date.now();
  const resp = await fetch(cfg.baseUrl, {
    method: 'POST',
    headers: cfg.getHeaders(),
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

function saveHistory(record) {
  const id = crypto.randomUUID();
  record.id = id;
  record.timestamp = new Date().toISOString();
  fs.writeFileSync(path.join(HISTORY_DIR, `${id}.json`), JSON.stringify(record, null, 2));
  return id;
}

function loadHistoryList() {
  if (!fs.existsSync(HISTORY_DIR)) return [];
  return fs
    .readdirSync(HISTORY_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => {
      try {
        const raw = JSON.parse(fs.readFileSync(path.join(HISTORY_DIR, f), 'utf-8'));
        return { id: raw.id, timestamp: raw.timestamp, type: raw.type, models: raw.models, summary: raw.summary };
      } catch { return null; }
    })
    .filter(Boolean)
    .sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || ''));
}

function loadHistoryDetail(id) {
  const fp = path.join(HISTORY_DIR, `${id}.json`);
  if (!fs.existsSync(fp)) return null;
  return JSON.parse(fs.readFileSync(fp, 'utf-8'));
}

/* ------------------------------------------------------------------ */
/*  API routes                                                         */
/* ------------------------------------------------------------------ */

// Health check
app.get('/api/k8s-eval/health', (_req, res) => {
  const status = {
    qwen: !!process.env.QWEN_API_KEY,
    kimi: !!process.env.KIMI_API_KEY,
    minimax: !!process.env.MINIMAX_API_KEY,
  };
  res.json({ ok: true, models: status });
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
    // question should contain { id, question, referenceAnswer, keywords, maxScore, ... }
    const result = await callModel(modelId, question.question);
    const score = autoScore(result.content, question);
    res.json({ ok: true, result: { ...result, score } });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Batch evaluate — run all questions for specified models
app.post('/api/k8s-eval/batch', async (req, res) => {
  try {
    const { modelIds, questions } = req.body;
    const results = {};
    const summary = {};

    for (const modelId of modelIds) {
      results[modelId] = [];
      let totalScore = 0;
      const dimScores = {};

      for (const q of questions) {
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
        totalQuestions: questions.length,
        averageScore: Math.round((totalScore / questions.length) * 10) / 10,
        dimensionScores: dimAverages,
      };
    }

    // Save to history
    const historyId = saveHistory({
      type: 'batch',
      models: modelIds,
      summary,
      results,
      questionCount: questions.length,
    });

    res.json({ ok: true, summary, results, historyId });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// History list
app.get('/api/k8s-eval/history', (_req, res) => {
  res.json({ ok: true, history: loadHistoryList() });
});

// History detail
app.get('/api/k8s-eval/history/:id', (req, res) => {
  const record = loadHistoryDetail(req.params.id);
  if (!record) return res.status(404).json({ ok: false, error: 'Not found' });
  res.json({ ok: true, record });
});

/* ------------------------------------------------------------------ */
/*  Start                                                              */
/* ------------------------------------------------------------------ */

app.listen(PORT, () => {
  console.log(`\n🚀 K8s Eval Server running on http://localhost:${PORT}`);
  console.log(`   Models configured:`);
  console.log(`     Qwen:    ${process.env.QWEN_API_KEY ? '✅' : '❌ (missing QWEN_API_KEY)'}`);
  console.log(`     Kimi:    ${process.env.KIMI_API_KEY ? '✅' : '❌ (missing KIMI_API_KEY)'}`);
  console.log(`     MiniMax: ${process.env.MINIMAX_API_KEY ? '✅' : '❌ (missing MINIMAX_API_KEY)'}\n`);
});
