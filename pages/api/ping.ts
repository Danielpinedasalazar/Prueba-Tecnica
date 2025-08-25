import type { NextApiRequest, NextApiResponse } from 'next';
export default function ping(_req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ ok: true });
}
