import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

type AuthedHandler = (req: NextApiRequest, res: NextApiResponse) => Promise<void>;

export function withApiAuth(handler: AuthedHandler): NextApiHandler {
  return async (req, res) => {
    await handler(req, res);
  };
}
