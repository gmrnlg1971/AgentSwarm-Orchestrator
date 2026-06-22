export const dynamic = 'force-dynamic';

export async function GET() {
  const encoder = new TextEncoder();
  const abortController = new AbortController();
  const { signal } = abortController;

  const stream = new ReadableStream({
    async start(controller) {
      let isClosed = false;

      const safeClose = () => {
        if (!isClosed) {
          isClosed = true;
          try { controller.close(); } catch (e) {}
        }
      };

      const sendEvent = (event: string, data: any) => {
        if (signal.aborted || isClosed) return;
        try {
          controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
        } catch (e) {
          abortController.abort();
          safeClose();
        }
      };

      const delay = (ms: number) => new Promise((resolve) => {
        if (signal.aborted) return resolve(null);
        const timeout = setTimeout(resolve, ms);
        signal.addEventListener('abort', () => {
          clearTimeout(timeout);
          resolve(null);
        });
      });

      try {
        // Initialization
        if (signal.aborted) return;
        sendEvent('status', { agent: 'System', message: 'Initializing Code Review Swarm...', status: 'starting' });
        await delay(1500);

        // Architect Agent Phase
        if (signal.aborted) return;
        sendEvent('active_node', { nodeId: 'architect' });
        sendEvent('status', { agent: 'Architect_Agent', message: 'Analyzing monolithic structure...', status: 'processing' });
        await delay(2000);
        if (signal.aborted) return;
        sendEvent('status', { agent: 'Architect_Agent', message: 'Identified 4 bottlenecks in module routing.', status: 'processing' });
        await delay(1500);
        if (signal.aborted) return;
        sendEvent('status', { agent: 'Architect_Agent', message: 'Generated architectural refactor plan. Passing context to Refactor_Agent.', status: 'passing' });
        await delay(1000);

        // Refactor Agent Phase
        if (signal.aborted) return;
        sendEvent('active_node', { nodeId: 'refactorer' });
        sendEvent('status', { agent: 'Refactor_Agent', message: 'Ingesting architectural plan...', status: 'processing' });
        await delay(2000);
        if (signal.aborted) return;
        sendEvent('status', { agent: 'Refactor_Agent', message: 'Splitting monolithic handlers into micro-services...', status: 'processing' });
        await delay(2500);
        if (signal.aborted) return;
        sendEvent('status', { agent: 'Refactor_Agent', message: 'Refactoring complete. Pushing to QA_Agent for validation.', status: 'passing' });
        await delay(1000);

        // QA Agent Phase
        if (signal.aborted) return;
        sendEvent('active_node', { nodeId: 'qa' });
        sendEvent('status', { agent: 'QA_Agent', message: 'Running static analysis and type checking...', status: 'processing' });
        await delay(2000);
        if (signal.aborted) return;
        sendEvent('status', { agent: 'QA_Agent', message: 'Detected type mismatch in Service B. Requesting quick-fix...', status: 'warning' });
        
        // Loop back briefly to Refactor
        await delay(1500);
        if (signal.aborted) return;
        sendEvent('active_node', { nodeId: 'refactorer' });
        sendEvent('status', { agent: 'Refactor_Agent', message: 'Applying quick-fix to Service B types...', status: 'processing' });
        await delay(2000);
        
        // Back to QA
        if (signal.aborted) return;
        sendEvent('active_node', { nodeId: 'qa' });
        sendEvent('status', { agent: 'QA_Agent', message: 'Re-running tests. All tests passed. 100% coverage achieved.', status: 'success' });
        await delay(1500);

        // Completion
        if (signal.aborted) return;
        sendEvent('active_node', { nodeId: 'none' });
        sendEvent('status', { agent: 'System', message: 'Swarm Execution Complete. Pipeline successful.', status: 'complete' });
        sendEvent('done', { finished: true });
        
        safeClose();
      } catch (err) {
        if (!signal.aborted && !isClosed) {
          sendEvent('error', { message: 'Swarm execution failed due to an internal error.' });
          safeClose();
        }
      }
    },
    cancel() {
      abortController.abort();
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
}
