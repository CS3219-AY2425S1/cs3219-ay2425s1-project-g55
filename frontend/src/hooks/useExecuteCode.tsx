import { BACKEND_URL_EXECUTE_CODE } from "@/lib/common";
import { getToken } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

type CodeExecutionInput = {
  code: string;
  language: "javascript" | "typescript" | "python" | "java";
};

const executeCodeResponseSchema = z.object({
  stdout: z.array(z.string()),
  stderr: z.array(z.string()),
  result: z.any().optional(),
  error: z.string().optional(),
  executionTime: z.number(),
  memoryUsage: z.number(),
  compiledCode: z.string().optional(),
});

export type CodeExecutionResponse = z.infer<typeof executeCodeResponseSchema>;

export default function useExecuteCode({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: z.infer<typeof executeCodeResponseSchema>) => void;
  onError?: (error: Error) => void;
} = {}) {
  return useMutation({
    mutationFn: async (input: CodeExecutionInput) => {
      const token = getToken();
      console.log("token", token);
      console.log("input", input);
      const response = await fetch(`${BACKEND_URL_EXECUTE_CODE}/execute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(input),
      });
      console.log("response", response);
      if (!response.ok) {
        throw new Error("Failed to execute code");
      }

      const data = await response.json();
      return executeCodeResponseSchema.parse(data);
    },
    onSuccess: (data) => {
      onSuccess?.(data);
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });
}
