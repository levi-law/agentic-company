// Cloudflare Pages Function for /api/health
export async function onRequest(context: any) {
  const { request } = context;
  
  // Handle CORS
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (request.method !== 'GET') {
    return new Response('Method not allowed', { 
      status: 405, 
      headers: corsHeaders 
    });
  }

  const status = {
    ok: true,
    timestamp: new Date().toISOString(),
    uptime: Date.now(), // Simplified for Cloudflare
  };

  return new Response(JSON.stringify(status), {
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  });
}
