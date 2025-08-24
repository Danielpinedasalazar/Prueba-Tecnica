import type { NextApiRequest, NextApiResponse } from 'next';

const openapi = {
  openapi: '3.0.3',
  info: {
    title: 'Prueba Técnica – API',
    version: '1.0.0',
    description: 'Documentación de endpoints (auth vía cookie/sesión Better Auth).',
  },
  servers: [{ url: 'http://localhost:3000' }],
  components: {
    securitySchemes: {
      sessionCookie: { type: 'apiKey', in: 'cookie', name: 'auth_session' },
    },
    schemas: {
      Movement: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          concept: { type: 'string' },
          amount: { type: 'number' },
          date: { type: 'string', format: 'date-time' },
          userId: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string' },
          phone: { type: 'string', nullable: true },
          role: { type: 'string', enum: ['ADMIN', 'USER'] },
        },
      },
      ReportResponse: {
        type: 'object',
        properties: {
          balance: { type: 'number' },
          series: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                month: { type: 'string' },
                income: { type: 'number' },
                expense: { type: 'number' },
                net: { type: 'number' },
              },
            },
          },
        },
      },
    },
  },
  security: [{ sessionCookie: [] }],
  paths: {
    '/api/movimientos': {
      get: {
        summary: 'Listar movimientos',
        security: [{ sessionCookie: [] }],
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/Movement' } },
              },
            },
          },
        },
      },
      post: {
        summary: 'Crear movimiento (solo ADMIN)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['concept', 'amount', 'date'],
                properties: {
                  concept: { type: 'string' },
                  amount: { type: 'number' },
                  date: { type: 'string', format: 'date' },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Creado',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Movement' } } },
          },
        },
      },
    },
    '/api/usuarios': {
      get: {
        summary: 'Listar usuarios (solo ADMIN)',
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/User' } },
              },
            },
          },
        },
      },
      put: {
        summary: 'Editar usuario (solo ADMIN)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['id'],
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  phone: { type: 'string' },
                  role: { type: 'string', enum: ['ADMIN', 'USER'] },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Actualizado',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } },
          },
        },
      },
    },
    '/api/reportes': {
      get: {
        summary: 'Obtener saldo y series para gráfico (solo ADMIN)',
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ReportResponse' } },
            },
          },
        },
      },
    },
    '/api/reportes/csv': {
      get: {
        summary: 'Descargar CSV de movimientos (solo ADMIN)',
        responses: {
          200: { description: 'CSV', content: { 'text/csv': { schema: { type: 'string' } } } },
        },
      },
    },
    '/api/movimientos/{id}': {
      put: {
        summary: 'Editar movimiento (solo ADMIN)',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  concept: { type: 'string' },
                  amount: { type: 'number' },
                  date: { type: 'string', format: 'date' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'OK' } },
      },
      delete: {
        summary: 'Eliminar movimiento (solo ADMIN)',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 204: { description: 'Sin contenido' } },
      },
    },
  },
};

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(openapi);
}
