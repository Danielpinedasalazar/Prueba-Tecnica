import { auth } from '@/lib/auth';
import type { NextApiRequest, NextApiResponse } from 'next';

export const config = { api: { bodyParser: false } };

function toWebHeaders(req: NextApiRequest): Headers {
  const headers = new Headers();
  for (const [k, v] of Object.entries(req.headers)) {
    if (typeof v === 'string') headers.append(k, v);
    else if (Array.isArray(v)) v.forEach((vv) => vv && headers.append(k, vv));
  }
  return headers;
}

// Devuelve ArrayBuffer para que cumpla BodyInit
async function readBodyAsArrayBuffer(req: NextApiRequest): Promise<ArrayBuffer | undefined> {
  if (req.method === 'GET' || req.method === 'HEAD') return undefined;
  const chunks: Buffer[] = [];
  await new Promise<void>((resolve, reject) => {
    req.on('data', (c) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)));
    req.on('end', () => resolve());
    req.on('error', reject);
  });
  const buf = Buffer.concat(chunks);
  // Recorta el ArrayBuffer al tamaño exacto
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const proto = (req.headers['x-forwarded-proto'] as string) ?? 'http';
  const host = req.headers.host ?? 'localhost:3000';
  const url = new URL(req.url ?? '/', `${proto}://${host}`);

  const webRequest = new Request(url, {
    method: req.method,
    headers: toWebHeaders(req),
    body: await readBodyAsArrayBuffer(req), // <- ahora es ArrayBuffer (BodyInit)
  });

  const response = await auth.handler(webRequest);

  res.status(response.status);
  response.headers.forEach((value, key) => res.setHeader(key, value));
  const body = Buffer.from(await response.arrayBuffer());
  res.end(body);
}
