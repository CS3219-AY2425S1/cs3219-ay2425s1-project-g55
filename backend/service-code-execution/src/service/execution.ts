import ivm from 'isolated-vm';
import ts from 'typescript';
import { exec } from 'child_process';

interface ExecutionResult {
  stdout: string[];
  stderr: string[];
  result: any;
  error?: string;
  executionTime: number;
  memoryUsage: number;
  compiledCode?: string; // for debugging
}

export class IsolatedExecutionService {
  private readonly DEFAULT_TIMEOUT = 3000; // 3 seconds
  private readonly MEMORY_LIMIT = 128; // MB
  private readonly DEFAULT_CPU_LIMIT = 100; // percentage

  async compileTypeScript(code: string): Promise<string> {
    try {
      const result = ts.transpileModule(code, {
        compilerOptions: {
          module: ts.ModuleKind.ESNext,
          target: ts.ScriptTarget.ES2020,
          strict: true,
        },
      });
      return result.outputText;
    } catch (error) {
      throw new Error(
        `TypeScript compilation error: ${(error as Error).message}`
      );
    }
  }

  async executeCode(
    code: string,
    timeout: number = this.DEFAULT_TIMEOUT,
    language: 'python' | 'javascript' | 'typescript' = 'javascript'
  ): Promise<ExecutionResult> {
    console.log('Executing code', code);
    const stdout: string[] = [];
    const stderr: string[] = [];
    const startTime = process.hrtime();

    if (language === 'python') {
      try {
        return await this.executePythonCode(code, timeout);
      } catch (error) {
        return {
          stdout,
          stderr,
          result: null,
          error: (error as Error).message,
          executionTime: 0,
          memoryUsage: 0,
        };
      }
    }
    // Compile TypeScript if needed
    let jsCode = code;
    if (language === 'typescript') {
      try {
        jsCode = await this.compileTypeScript(code);
      } catch (error) {
        return {
          stdout,
          stderr,
          result: null,
          error: (error as Error).message,
          executionTime: 0,
          memoryUsage: 0,
          compiledCode: jsCode,
        };
      }
    }

    console.log('Creating isolate with memory limit:', this.MEMORY_LIMIT);
    console.log('Creating isolate');
    // Create a new isolate
    const isolate = new ivm.Isolate({
      memoryLimit: this.MEMORY_LIMIT,
    });

    console.log('Creating context');
    // Create a new context within the isolate
    const context = await isolate.createContext();

    // Get a reference to the global object within the context
    const jail = context.global;

    console.log('Creating log callback');
    // Create the console functions as reference functions
    const logCallback = new ivm.Reference((...args: any[]) => {
      stdout.push(args.join(' '));
    });

    const errorCallback = new ivm.Reference((...args: any[]) => {
      stderr.push(args.join(' '));
    });

    console.log('Setting log callback');
    await jail.set('_log', logCallback);
    await jail.set('_error', errorCallback);

    console.log('Creating console object');
    // Then create the console object inside the isolate
    await context.eval(`
    const console = {
        log: (...args) => _log.apply(undefined, args),
        error: (...args) => _error.apply(undefined, args)
    };
`);

    console.log('Evaluating code');
    try {
      // Wrap the code in a try-catch and return statement
      const wrappedCode = `
    (function() {
        try {
            ${jsCode}
        } catch (error) {
            console.error(error.message);
        }
    })();
            `;

      const result = await context.eval(wrappedCode, {
        timeout,
      });

      const [seconds, nanoseconds] = process.hrtime(startTime);
      const executionTime = seconds * 1000 + nanoseconds / 1000000;

      console.log('Getting memory usage statistics');
      // Get memory usage statistics
      const stats = isolate.getHeapStatistics();

      console.log('Returning execution result');
      return {
        stdout,
        stderr,
        result: JSON.stringify(result), // Copy the result from the isolate
        executionTime,
        memoryUsage: Math.round((await stats).heap_size_limit / (1024 * 1024)), // Convert to MB
      };
    } catch (error) {
      const [seconds, nanoseconds] = process.hrtime(startTime);
      const executionTime = seconds * 1000 + nanoseconds / 1000000;

      console.log('Returning error result');

      return {
        stdout,
        stderr,
        result: null,
        error: (error as Error).message,
        executionTime,
        memoryUsage: 0,
      };
    } finally {
      // Dispose of the isolate to free memory
      console.log('Disposing of isolate');
      context.release();
      isolate.dispose();
    }
  }

  async executePythonCode(code: string, timeout: number = this.DEFAULT_TIMEOUT): Promise<ExecutionResult> {
    return new Promise((resolve, reject) => {
      const start = Date.now();
      const process = exec('python3', { timeout });

      let stdout: string[] = [];
      let stderr: string[] = [];

      process.stdout?.on('data', (data) => {
        stdout.push(data.toString());
      });

      process.stderr?.on('data', (data) => {
        stderr.push(data.toString());
      });

      process.on('close', (code) => {
        const executionTime = Date.now() - start;
        const memoryUsage = require('process').memoryUsage().heapUsed / 1024 / 1024; // Convert to MB

        if (code !== 0) {
          return reject({
            stdout,
            stderr,
            result: null,
            error: `Process exited with code ${code}`,
            executionTime,
            memoryUsage,
          });
        }

        resolve({
          stdout,
          stderr,
          result: stdout.join(''),
          executionTime,
          memoryUsage,
        });
      });

      process.stdin?.write(code);
      process.stdin?.end();
    });
  }
}
