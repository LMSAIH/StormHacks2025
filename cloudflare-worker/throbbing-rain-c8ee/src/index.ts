/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
	async fetch(request: Request, _env: unknown, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);
		// Update this to your Cloudflare Tunnel URL
		const BACKEND_URL = 'https://api.mapd.tech';  // or https://TUNNEL_ID.cfargotunnel.com
		
		// Handle CORS preflight requests
		if (request.method === 'OPTIONS') {
			return new Response(null, {
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
					'Access-Control-Allow-Headers': 'Content-Type, Authorization',
					'Access-Control-Max-Age': '86400',
				}
			});
		}
		
		// Only proxy /api requests
		if (url.pathname.startsWith('/api')) {
			const backendPath = url.pathname.replace('/api', '');
			const backendUrl = `${BACKEND_URL}${backendPath}${url.search}`;
			
			// Create cache key
			const cacheKey = new Request(backendUrl, request);
			const cache = caches.default;
			
			// Check cache first for GET requests
			if (request.method === 'GET') {
				let response = await cache.match(cacheKey);
				
				if (response) {
					// Cache hit
					response = new Response(response.body, response);
					response.headers.set('X-Cache-Status', 'HIT');
				} else {
					// Cache miss - fetch from backend
					try {
						response = await fetch(backendUrl, {
							method: request.method,
							headers: request.headers,
						});
						
						// Cache successful responses for 5 minutes
						if (response.ok) {
							response = new Response(response.body, response);
							response.headers.set('Cache-Control', 'public, max-age=300');
							response.headers.set('X-Cache-Status', 'MISS');
							ctx.waitUntil(cache.put(cacheKey, response.clone()));
						}
					} catch (error) {
						return new Response(JSON.stringify({ 
							error: 'Backend unavailable',
							message: error instanceof Error ? error.message : 'Unknown error',
							backend_url: backendUrl
						}), {
							status: 503,
							headers: {
								'Content-Type': 'application/json',
								'Access-Control-Allow-Origin': '*',
							}
						});
					}
				}
				
				// Add CORS headers
				const modifiedResponse = new Response(response.body, response);
				modifiedResponse.headers.set('Access-Control-Allow-Origin', '*');
				modifiedResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
				modifiedResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
				
				return modifiedResponse;
			}
			
			// Non-GET requests - just proxy without caching
			try {
				const response = await fetch(backendUrl, {
					method: request.method,
					headers: request.headers,
					body: request.body,
				});
				
				const modifiedResponse = new Response(response.body, response);
				modifiedResponse.headers.set('Access-Control-Allow-Origin', '*');
				modifiedResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
				modifiedResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
				
				return modifiedResponse;
			} catch (error) {
				return new Response(JSON.stringify({ 
					error: 'Backend unavailable',
					message: error instanceof Error ? error.message : 'Unknown error'
				}), {
					status: 503,
					headers: {
						'Content-Type': 'application/json',
						'Access-Control-Allow-Origin': '*',
					}
				});
			}
		}
		
		// Not an API request - return 404
		return new Response('Not found', { status: 404 });
	}
};
