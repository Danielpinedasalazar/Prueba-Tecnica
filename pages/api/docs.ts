import type { NextApiRequest, NextApiResponse } from 'next';

const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Prevalentware · Finanzas · API Docs</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist/swagger-ui.css" />
  <style>
    body { margin:0; background:#ffffff; color:#111827; font-family: system-ui, sans-serif; }
    #swagger-ui { max-width: 1100px; margin: 0 auto; padding: 24px; background: #fff; }
    .topbar { display:none; } /* ocultar barra default */
  </style>
</head>
<body>
  <div id="swagger-ui"></div>

  <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-standalone-preset.js"></script>

  <script>
    window.onload = () => {
      const ui = SwaggerUIBundle({
        url: "/api/openapi.json",
        dom_id: "#swagger-ui",
        deepLinking: true,
        filter: true,
        displayOperationId: true,
        tryItOutEnabled: true,
        presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
        layout: "StandaloneLayout"
      });
      window.ui = ui;
    };
  </script>
</body>
</html>`;

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(html);
}
