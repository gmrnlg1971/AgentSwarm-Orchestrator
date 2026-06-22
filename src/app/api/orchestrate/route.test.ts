import { describe, it, expect } from 'vitest';
import { GET } from './route';

describe('Orchestrate API Route', () => {
  it('returns a readable stream with correct headers', async () => {
    const response = await GET();
    expect(response.headers.get('Content-Type')).toBe('text/event-stream');
    expect(response.headers.get('Cache-Control')).toBe('no-cache, no-transform');
    expect(response.headers.get('Connection')).toBe('keep-alive');
    expect(response.body).toBeInstanceOf(ReadableStream);
  });
});
