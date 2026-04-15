import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface LLMConfig {
  apiKey: string;
  endpoint: string;
  modelName: string;
  temperature: number;
  maxTokens: number;
  contextWindow?: string;
}

interface SettingsState {
  qwen: LLMConfig;
  glm: LLMConfig;
  minimax: LLMConfig;
  kimi: LLMConfig;
  updateQwen: (config: Partial<LLMConfig>) => void;
  updateGlm: (config: Partial<LLMConfig>) => void;
  updateMinimax: (config: Partial<LLMConfig>) => void;
  updateKimi: (config: Partial<LLMConfig>) => void;
}

const defaultConfig: LLMConfig = {
  apiKey: '',
  endpoint: '',
  modelName: '',
  temperature: 0.7,
  maxTokens: 2048,
};

const defaultKimiConfig: LLMConfig = {
  apiKey: '',
  endpoint: 'https://api.moonshot.cn/v1',
  modelName: 'moonshot-v1-8k',
  temperature: 0.7,
  maxTokens: 2048,
  contextWindow: '8k',
};

const defaultQwenConfig: LLMConfig = {
  apiKey: '',
  endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  modelName: 'qwen-plus',
  temperature: 0.7,
  maxTokens: 2048,
};

const defaultGlmConfig: LLMConfig = {
  apiKey: '',
  endpoint: 'https://open.bigmodel.cn/api/paas/v4',
  modelName: 'glm-4',
  temperature: 0.7,
  maxTokens: 2048,
};

const defaultMinimaxConfig: LLMConfig = {
  apiKey: '',
  endpoint: 'https://api.minimax.chat/v1',
  modelName: 'abab6-chat',
  temperature: 0.7,
  maxTokens: 2048,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      qwen: defaultQwenConfig,
      glm: defaultGlmConfig,
      minimax: defaultMinimaxConfig,
      kimi: defaultKimiConfig,
      updateQwen: (config) =>
        set((state) => ({ qwen: { ...state.qwen, ...config } })),
      updateGlm: (config) =>
        set((state) => ({ glm: { ...state.glm, ...config } })),
      updateMinimax: (config) =>
        set((state) => ({ minimax: { ...state.minimax, ...config } })),
      updateKimi: (config) =>
        set((state) => ({ kimi: { ...state.kimi, ...config } })),
    }),
    {
      name: 'settings-storage',
    }
  )
);
