import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CodeExecutionResponse } from '@/hooks/useExecuteCode';
import { cn } from '@/lib/utils';
import { Code, PlayIcon } from 'lucide-react';

export default function CodeExecutionView({
  response,
}: {
  response?: CodeExecutionResponse;
}) {
  if (!response) {
    return (
      <Card className='h-screen overflow-scroll'>
        <CardHeader className='p-4'>
          <CardTitle className='text-2xl font-bold'>
            Code Execution Results
          </CardTitle>
        </CardHeader>
        <CardContent className='p-4'>
          <div className='flex flex-col gap-3 items-center justify-center h-40 text-muted-foreground'>
            <Code className='h-8 w-8 mr-2 text-muted-foreground' />
            <div>You must run your code first</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='h-[85vh] overflow-scroll'>
      <CardHeader className='p-4'>
        <CardTitle className='text-sm'>
          <div className='text-2xl font-bold'>Code Execution Results</div>
          <div className='text-xs text-muted-foreground mt-4'>
            Usage: ({(response.executionTime / 1000).toFixed(2)}
            s, {Math.round(response.memoryUsage / 1024)}KB)
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className=''>
        <div className='w-full h-full rounded-md border'>
          <div className='p-4'>
            {response.stdout.length > 0 && (
              <div className='mb-4'>
                <div className='text-sm font-medium mb-2'>Output:</div>
                <pre
                  className={cn(
                    'p-4 rounded bg-secondary font-mono text-sm',
                    'whitespace-pre-wrap break-all'
                  )}
                >
                  {response.stdout.join('\n')}
                </pre>
              </div>
            )}

            {response.stderr.length > 0 && (
              <div>
                <div className='text-sm font-medium mb-2'>Standard Error:</div>
                <pre
                  className={cn(
                    'p-4 rounded font-mono text-sm',
                    'whitespace-pre-wrap break-all'
                  )}
                >
                  {response.stderr.join('\n')}
                </pre>
              </div>
            )}

            {response.error && (
              <div>
                <div className='text-sm font-medium mb-2 text-destructive'>
                  Error:
                </div>
                <pre
                  className={cn(
                    'p-4 rounded bg-destructive/10 font-mono text-sm text-destructive',
                    'whitespace-pre-wrap break-all'
                  )}
                >
                  {response.error}
                </pre>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
