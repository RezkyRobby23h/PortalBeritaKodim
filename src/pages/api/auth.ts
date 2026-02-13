import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { username, password } = await request.json();

    // Get credentials from environment variables
    const ADMIN_USERNAME = import.meta.env.ADMIN_USERNAME || 'admin';
    const ADMIN_PASSWORD = import.meta.env.ADMIN_PASSWORD || 'admin12345';

    // Validate credentials
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      return new Response(
        JSON.stringify({ ok: true, message: 'Login berhasil' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      return new Response(
        JSON.stringify({ ok: false, error: 'Username atau password salah' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ ok: false, error: 'Terjadi kesalahan server' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
