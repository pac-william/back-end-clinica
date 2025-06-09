import swaggerJSDoc from 'swagger-jsdoc';

// Configuração do Swagger para documentação da API
const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Clínica Médica',
      version: '1.0.0',
      description: 'Documentação da API de gerenciamento de clínica médica',
    },
    servers: [
      {
        url: 'http://localhost:8080',
        description: 'Servidor local',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Arquivos que contêm as anotações do Swagger
  apis: ['./src/router/*.ts', './src/docs/*.yaml'],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec; 