import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = ({ redirect }) => {
  const clientId = import.meta.env.GITHUB_CLIENT_ID;

  if (!clientId) {
    return new Response('Missing GITHUB_CLIENT_ID environment variable', { status: 500 });
  }

  const params = new URLSearchParams({
    client_id: clientId,
    scope: 'repo,user',
  });

  return redirect(`https://github.com/login/oauth/authorize?${params.toString()}`);
};
