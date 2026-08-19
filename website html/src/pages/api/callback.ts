import type { APIRoute } from 'astro';

export const prerender = false;

function popupResponse(status: 'success' | 'error', content: unknown) {
  const message = `authorization:github:${status}:${JSON.stringify(content)}`;
  const html = `<!doctype html>
<html><body>
<script>
(function() {
  function receiveMessage(e) {
    window.opener.postMessage('${message}', e.origin);
    window.removeEventListener('message', receiveMessage, false);
  }
  window.addEventListener('message', receiveMessage, false);
  window.opener.postMessage('authorizing:github', '*');
})();
</script>
</body></html>`;
  return new Response(html, { headers: { 'Content-Type': 'text/html' } });
}

export const GET: APIRoute = async ({ url }) => {
  const code = url.searchParams.get('code');
  const clientId = import.meta.env.GITHUB_CLIENT_ID;
  const clientSecret = import.meta.env.GITHUB_CLIENT_SECRET;

  if (!code) {
    return new Response('Missing authorization code', { status: 400 });
  }
  if (!clientId || !clientSecret) {
    return new Response('Missing GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET environment variables', { status: 500 });
  }

  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
  });
  const tokenData = await tokenRes.json();

  if (tokenData.error || !tokenData.access_token) {
    return popupResponse('error', { message: tokenData.error_description || 'GitHub OAuth failed' });
  }

  return popupResponse('success', { token: tokenData.access_token, provider: 'github' });
};
