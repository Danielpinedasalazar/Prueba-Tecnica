import { auth } from '@/lib/auth';
import type { NextApiRequest, NextApiResponse } from 'next';

export const config = { api: { bodyParser: false } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const proto = (req.headers['x-forwarded-proto'] as string) ?? 'http';
  const host = req.headers.host!;
  const url = new URL(req.url || '', `${proto}://${host}`);

  const headers = new Headers();
  Object.entries(req.headers).forEach(([k, v]) => {
    if (typeof v === 'string') headers.append(k, v);
    else if (Array.isArray(v)) v.forEach((vv) => vv && headers.append(k, vv));
  });

  const webRequest = new Request(url, {
    method: req.method,
    headers,
    body: req.method === 'GET' || req.method === 'HEAD' ? undefined : (req as any),
    // @ts-expect-error Node18: flag necesario para streams
    duplex: 'half',
  });

  const response = await auth.handler(webRequest);

  res.status(response.status);
  response.headers.forEach((value, key) => res.setHeader(key, value));

  const buf = Buffer.from(await response.arrayBuffer());
  res.end(buf);
}
