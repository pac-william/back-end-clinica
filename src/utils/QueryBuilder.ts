export class QueryBuilder {
    private query: Record<string, any> = {};

    constructor(query: any) {
        this.query = { ...query };
    }

    static from(query: any): QueryBuilder {
        return new QueryBuilder(query);
    }

    /**
     * Processa um valor numérico da query
     * 
     * @param key Nome do parâmetro na query
     * @param defaultValue Valor padrão a ser utilizado caso o parâmetro não exista ou seja inválido
     * @returns Instância do QueryBuilder para encadeamento
     */
    withNumber(key: string, defaultValue?: number): QueryBuilder {
        this.query[key] = this.query[key] !== undefined
            ? Number(this.query[key]) || defaultValue
            : defaultValue;
        return this;
    }

    /**
     * Processa um valor de string da query
     * 
     * @param key Nome do parâmetro na query
     * @param defaultValue Valor padrão a ser utilizado caso o parâmetro não exista ou seja inválido
     * @returns Instância do QueryBuilder para encadeamento
     */
    withString(key: string, defaultValue?: string): QueryBuilder {
        this.query[key] = this.query[key] !== undefined ? String(this.query[key]) : defaultValue;
        return this;
    }

    /**
     * Processa um valor booleano da query
     * 
     * @param key Nome do parâmetro na query
     * @param defaultValue Valor padrão a ser utilizado caso o parâmetro não exista ou seja inválido
     */
    withBoolean(key: string, defaultValue?: boolean): QueryBuilder {
        this.query[key] = this.query[key] !== undefined ? this.query[key] === 'true' : defaultValue;
        return this;
    }

    build<T = any>(): T {
        return this.query as unknown as T;
    }
}