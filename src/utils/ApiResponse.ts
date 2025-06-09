/**
 * Interface para padronização de respostas da API
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    total?: number;
    page?: number;
    size?: number;
    totalPages?: number;
  };
  errors?: any[];
}

/**
 * Classe para criação de respostas padronizadas da API
 */
export class ApiResponseBuilder<T> {
  private response: ApiResponse<T> = {
    success: true,
    message: ''
  };

  /**
   * Define a resposta como sucesso
   * @param message Mensagem de sucesso
   */
  withSuccess(message: string): ApiResponseBuilder<T> {
    this.response.success = true;
    this.response.message = message;
    return this;
  }

  /**
   * Define a resposta como erro
   * @param message Mensagem de erro
   */
  withError(message: string): ApiResponseBuilder<T> {
    this.response.success = false;
    this.response.message = message;
    return this;
  }

  /**
   * Adiciona dados à resposta
   * @param data Dados a serem adicionados
   */
  withData(data: T): ApiResponseBuilder<T> {
    this.response.data = data;
    return this;
  }

  /**
   * Adiciona metadados de paginação à resposta
   * @param meta Metadados de paginação
   */
  withMeta(meta: ApiResponse<T>['meta']): ApiResponseBuilder<T> {
    this.response.meta = meta;
    return this;
  }

  /**
   * Adiciona erros à resposta
   * @param errors Lista de erros
   */
  withErrors(errors: any[]): ApiResponseBuilder<T> {
    this.response.errors = errors;
    return this;
  }

  /**
   * Constrói a resposta final
   */
  build(): ApiResponse<T> {
    return this.response;
  }
} 