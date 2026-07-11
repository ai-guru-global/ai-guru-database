import { useState, useEffect, useCallback, useRef } from "react";

interface StreamProgress {
  current: number;
  total: number;
  percent: number;
  currentQuestion: string;
  model: string;
}

interface StreamState {
  connected: boolean;
  progress: StreamProgress | null;
  completed: boolean;
  runId: string | null;
  error: string | null;
}

export function useEvaluationStream(runId: string | null) {
  const [state, setState] = useState<StreamState>({
    connected: false,
    progress: null,
    completed: false,
    runId: null,
    error: null,
  });

  const eventSourceRef = useRef<EventSource | null>(null);

  const connect = useCallback((id: string) => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const url = `/api/k8s-eval/stream?runId=${id}`;
    const es = new EventSource(url);
    eventSourceRef.current = es;

    es.addEventListener('connected', () => {
      setState(s => ({ ...s, connected: true, runId: id }));
    });

    es.addEventListener('progress', (e) => {
      try {
        const data = JSON.parse(e.data);
        setState(s => ({ ...s, progress: data, error: null }));
      } catch {}
    });

    es.addEventListener('complete', (e) => {
      try {
        const data = JSON.parse(e.data);
        setState(s => ({ ...s, completed: true, runId: data.runId }));
      } catch {}
    });

    es.addEventListener('error', (e) => {
      try {
        const data = JSON.parse((e as MessageEvent).data);
        setState(s => ({ ...s, error: data.error || 'Connection error' }));
      } catch {}
    });

    es.onerror = () => {
      setState(s => ({ ...s, connected: false }));
    };
  }, []);

  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setState({
      connected: false,
      progress: null,
      completed: false,
      runId: null,
      error: null,
    });
  }, []);

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  return { state, connect, disconnect };
}
