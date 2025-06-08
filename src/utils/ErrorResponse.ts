// Classe para padronização de respostas de erro da aplicação
export class ErrorResponse {
    public message: string;
    public statusCode: number;
    private error?: Error;

    /**
     * Cria uma nova instância de resposta de erro
     * @param message Mensagem de erro
     * @param statusCode Código HTTP do erro
     */
    constructor(message: string, statusCode: number) {
        this.message = message;
        this.statusCode = statusCode;
    }

    /**
     * Registra o erro no console e retorna a instância
     * @param error Erro original (opcional)
     */
    log(error?: Error) {
        if (error) {
            this.error = error;
            console.error(`[Erro ${this.statusCode}] ${this.message}:`, error);
        }
        return this;
    }

    /**
     * Converte a resposta de erro para JSON
     */
    toJSON() {
        return {
            message: this.message,
            statusCode: this.statusCode
        };
    }
}
