import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { ApiResponseBuilder } from '../utils/ApiResponse';
import { ErrorResponse } from '../utils/ErrorResponse';

/**
 * Middleware para tratamento centralizado de erros
 */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(err);

  // Erros de validação do Zod
  if (err instanceof ZodError) {
    const response = new ApiResponseBuilder()
      .withError('Requisição inválida')
      .withErrors(err.issues)
      .build();

    res.status(400).json(response);
    return;
  }

  // Erros personalizados da aplicação
  if (err instanceof ErrorResponse) {
    const response = new ApiResponseBuilder()
      .withError(err.message)
      .build();

    res.status(err.statusCode).json(response);
    return;
  }

  // Erros desconhecidos
  const response = new ApiResponseBuilder()
    .withError('Erro interno do servidor')
    .build();

  res.status(500).json(response);
}; 