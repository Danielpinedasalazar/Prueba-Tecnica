import { auth } from '@/lib/auth';
import type { NextApiRequest, NextApiResponse } from 'next';

export const config = { api: { bodyParser: false } };

function toWebHeaders(req: NextApiRequest): Headers {
  const h = new Headers();
  for (const [k, v] of Object.entries(req.headers)) {
    if (typeof v === 'string') h.append(k, v);
    else if (Array.isArray(v)) v.forEach((vv) => vv && h.append(k, vv));
  }
  return h;
}

async function readBody(req: NextApiRequest): Promise<ArrayBuffer | undefined> {
  if (req.method === 'GET' || req.method === 'HEAD') return undefined;
  const chunks: Buffer[] = [];
  await new Promise<void>((resolve, reject) => {
    req.on('data', (c) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)));
    req.on('end', resolve);
    req.on('error', reject);
  });
  const buf = Buffer.concat(chunks);
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const proto = (req.headers['x-forwarded-proto'] as string) ?? 'http';
  const host = req.headers.host ?? 'localhost:3000';
  const url = new URL(req.url ?? '/', `${proto}://${host}`);

  const webReq = new Request(url, {
    method: req.method,
    headers: toWebHeaders(req),
    body: await readBody(req),
  });

  const response = await auth.handler(webReq);

  res.status(response.status);
  response.headers.forEach((v, k) => res.setHeader(k, v));
  const body = Buffer.from(await response.arrayBuffer());
  res.end(body);
}
