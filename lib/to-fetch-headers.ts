import type { NextApiRequest } from 'next';

export function toFetchHeaders(req: NextApiRequest): Headers {
  const h = new Headers();
  for (const [key, val] of Object.entries(req.headers)) {
    if (Array.isArray(val)) {
      h.set(key, val.join(','));
    } else if (typeof val === 'string') {
      h.set(key, val);
    }
  }
  return h;
}
