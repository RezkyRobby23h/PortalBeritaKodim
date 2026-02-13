import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';

const UPLOAD_DIR = path.resolve('public/uploads');

// Pastikan folder uploads ada
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return new Response(JSON.stringify({ ok: false, error: 'No file uploaded' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validasi tipe file
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return new Response(JSON.stringify({ ok: false, error: 'Format file tidak didukung. Gunakan JPG, PNG, GIF, atau WebP.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validasi ukuran file (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return new Response(JSON.stringify({ ok: false, error: 'Ukuran file terlalu besar. Maksimal 5MB.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Generate nama file unik
    const timestamp = Date.now();
    const ext = path.extname(file.name);
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9]/g, '-').substring(0, 30);
    const filename = `${timestamp}-${sanitizedName}${ext}`;
    const filepath = path.join(UPLOAD_DIR, filename);

    // Simpan file
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(filepath, buffer);

    // Return URL publik
    const publicUrl = `/uploads/${filename}`;

    return new Response(JSON.stringify({ ok: true, url: publicUrl }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    console.error('Upload error:', e);
    return new Response(JSON.stringify({ ok: false, error: 'Terjadi kesalahan saat upload file.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};