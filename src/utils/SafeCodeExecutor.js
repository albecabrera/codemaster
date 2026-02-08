
export const executeCode = async (code) => {
  const logs = [];
  const originalLog = console.log;
  const originalError = console.error;
  const originalWarn = console.warn;

  // Capture console output
  const logHelper = (type, args) => {
    const timestamp = new Date().toLocaleTimeString();
    const content = args.map(arg => {
      if (typeof arg === 'object') {
        try {
          return JSON.stringify(arg, null, 2);
        } catch (e) {
          return String(arg);
        }
      }
      return String(arg);
    }).join(' ');
    logs.push({ type, content, timestamp });
  };

  try {
    // Mock console in the execution scope
    const mockConsole = {
      log: (...args) => logHelper('info', args),
      error: (...args) => logHelper('error', args),
      warn: (...args) => logHelper('warn', args),
    };

    // Create a safe context by masking dangerous globals
    const context = {
      console: mockConsole,
      window: undefined,
      document: undefined,
      fetch: undefined, // Prevent network requests unless mocked
      eval: undefined,
      Function: undefined,
      setTimeout: setTimeout, // Allow for async testing
      Promise: Promise,
    };

    const contextKeys = Object.keys(context);
    const contextValues = Object.values(context);

    // Wrap code to return result if it's an expression or the last statement
    const wrappedCode = `
      "use strict";
      return (async () => {
        try {
          ${code}
        } catch (err) {
          throw err;
        }
      })();
    `;

    // Create the function with the masked scope
    // eslint-disable-next-line no-new-func
    const runCode = new Function(...contextKeys, wrappedCode);

    // Execute
    const result = await runCode(...contextValues);
    
    // If the code returns a value but didn't log it, we could log it (optional)
    if (result !== undefined && logs.length === 0) {
       // logs.push({ type: 'result', content: String(result), timestamp: new Date().toLocaleTimeString() });
    }

    return { logs, result, error: null };

  } catch (err) {
    // Parse error to find line number if possible
    let line = 'unknown';
    if (err.stack) {
       // unexpected validation error in SafeCodeExecutor
       // Try to extract line number relative to the user code
    }
    
    const errorMsg = {
      type: 'error',
      content: `${err.name}: ${err.message}`,
      timestamp: new Date().toLocaleTimeString(),
      line
    };
    logs.push(errorMsg);
    
    return { logs, result: null, error: err };
  }
};
