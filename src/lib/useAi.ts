import { useServerFn } from "@tanstack/react-start";
import { useCallback, useRef, useState } from "react";
import { runAi } from "@/lib/ai.functions";

type Msg = { role: "system" | "user" | "assistant"; content: string };

export function useAi() {
  const call = useServerFn(runAi);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [text, setText] = useState<string | null>(null);
  const [demo, setDemo] = useState(false);
  const lastMessages = useRef<Msg[] | null>(null);

  const generate = useCallback(
    async (messages: Msg[]) => {
      lastMessages.current = messages;
      setLoading(true);
      setError(null);
      try {
        const res = await call({ data: { messages } });
        setText(res.text);
        setDemo(res.demo);
        return res.text;
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unexpected error. Please retry.");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [call],
  );

  const regenerate = useCallback(() => {
    if (lastMessages.current) void generate(lastMessages.current);
  }, [generate]);

  const clear = useCallback(() => {
    setText(null);
    setError(null);
    setDemo(false);
  }, []);

  return { loading, error, text, demo, generate, regenerate, clear };
}
