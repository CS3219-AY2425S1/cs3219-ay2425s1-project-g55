import { useQuery } from "@tanstack/react-query";
import { Question, QuestionsArraySchema } from '../types/question';

async function fetchQuestions(): Promise<Question[]> {
  const response = await fetch("http://localhost:8080/api/question/questions");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();

  return data;

  return QuestionsArraySchema.parse(data);
}

export function useQuestions() {
  return useQuery<Question[], Error>({
    queryKey: ["questions"],
    queryFn: fetchQuestions,
  });
};