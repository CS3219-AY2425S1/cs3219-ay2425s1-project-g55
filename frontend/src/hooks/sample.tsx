import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

const sampleDataSchema = z.object({
  id: z.number(),
  title: z.string(),
  completed: z.boolean(),
});

type SampleData = z.infer<typeof sampleDataSchema>;

async function fetchSampleData(): Promise<SampleData> {
  const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
  const data = await response.json();
  return sampleDataSchema.parse(data);
}

export const useSample = () => {
  return useQuery<SampleData, Error>({
    queryKey: ['sampleData'],
    queryFn: fetchSampleData,
  });
};
