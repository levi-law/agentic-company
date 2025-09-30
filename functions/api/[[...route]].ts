import { NextRequest } from 'next/server';

// This is a catch-all route handler for Cloudflare Functions
// It delegates to the Next.js API routes in src/app/api/

export async function onRequest(context: any): Promise<Response> {
  const { request, env } = context;
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Extract the API route path (remove /api prefix)
  const apiPath = pathname.replace(/^\/api/, '');

  try {
    // Route to the appropriate Next.js API handler
    if (apiPath === '/health' || apiPath === '/health/') {
      const { GET } = await import('../../src/app/api/health/route');
      if (request.method === 'GET') {
        return await GET();
      }
    } else if (apiPath === '/session' || apiPath === '/session/') {
      const { GET } = await import('../../src/app/api/session/route');
      if (request.method === 'GET') {
        return await GET();
      }
    } else if (apiPath === '/responses' || apiPath === '/responses/') {
      const { POST } = await import('../../src/app/api/responses/route');
      if (request.method === 'POST') {
        const nextRequest = new NextRequest(request.url, {
          method: request.method,
          headers: request.headers,
          body: request.body,
        });
        return await POST(nextRequest);
      }
    }

    // If no route matches, return 404
    return new Response('Not Found', { status: 404 });
  } catch (error) {
    console.error('API route error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

// Export all HTTP methods
export const onRequestGet = onRequest;
export const onRequestPost = onRequest;
export const onRequestPut = onRequest;
export const onRequestDelete = onRequest;
export const onRequestPatch = onRequest;
export const onRequestOptions = onRequest;
