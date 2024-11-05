import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CodeExecutionResponse } from '@/hooks/useExecuteCode';
import { cn } from '@/lib/utils';

export default function CodeExecutionView({
  response,
}: {
  response?: CodeExecutionResponse;
}) {
  if (!response) {
    return (
      <Card className='h-screen overflow-scroll'>
        <CardHeader className='p-4'>
          <CardTitle className='text-sm text-muted-foreground'>
            Code Execution Results
          </CardTitle>
        </CardHeader>
        <CardContent className='p-4'>
          <div className='flex items-center justify-center h-full text-muted-foreground italic'>
            You must run your code first
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='h-[85vh] overflow-scroll'>
      <CardHeader className='p-4'>
        <CardTitle className='text-sm'>
          Code Execution Results
          <span className='ml-2 text-xs text-muted-foreground'>
            ({(response.executionTime / 1000).toFixed(2)}
            s, {Math.round(response.memoryUsage / 1024)}KB)
          </span>
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
