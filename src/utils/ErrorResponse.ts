export class ErrorResponse {
    public message: string;
    public statusCode: number;
    private error?: Error;

    constructor(message: string, statusCode: number) {
        this.message = message;
        this.statusCode = statusCode;
    }

    log(error?: Error) {
        if (error) {
            this.error = error;
            console.error(`[Erro ${this.statusCode}] ${this.message}:`, error);
        }
        return this;
    }

    toJSON() {
        return {
            message: this.message,
            statusCode: this.statusCode
        };
    }
}
