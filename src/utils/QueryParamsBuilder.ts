// Classe para construção e validação de parâmetros de consulta
export class QueryParamsBuilder<TQuery extends Record<string, any> = {}> {
    private query: Record<string, any>;

    /**
     * Cria uma nova instância do construtor de parâmetros
     * @param query Parâmetros de consulta originais
     */
    constructor(query: Record<string, any>) {
        this.query = { ...query };
    }

    /**
     * Cria uma nova instância a partir de um objeto de consulta
     * @param query Objeto de consulta
     */
    static from<TQuery extends Record<string, any>>(query: TQuery): QueryParamsBuilder<TQuery> {
        return new QueryParamsBuilder(query);
    }

    /**
     * Adiciona um parâmetro numérico
     * @param key Nome do parâmetro
     * @param defaultValue Valor padrão (opcional)
     */
    withNumber<K extends string, V extends number | undefined = number | undefined>(
        key: K,
        defaultValue?: V
    ): QueryParamsBuilder<TQuery & { [P in K]: number | V }> {
        const value = Number(this.query[key]);
        this.query[key] = !isNaN(value) ? value : defaultValue;
        return this as any;
    }

    /**
     * Adiciona um parâmetro de texto
     * @param key Nome do parâmetro
     * @param defaultValue Valor padrão (opcional)
     */
    withString<K extends string, V extends string | undefined = string | undefined>(
        key: K,
        defaultValue?: V
    ): QueryParamsBuilder<TQuery & { [P in K]: string | V }> {
        const value = this.query[key];
        this.query[key] = typeof value === 'string' ? value : defaultValue;
        return this as any;
    }

    /**
     * Adiciona um parâmetro booleano
     * @param key Nome do parâmetro
     * @param defaultValue Valor padrão (opcional)
     */
    withBoolean<K extends string, V extends boolean | undefined = boolean | undefined>(
        key: K,
        defaultValue?: V
    ): QueryParamsBuilder<TQuery & { [P in K]: boolean | V }> {
        const value = this.query[key];
        this.query[key] =
            value === 'true' || value === true
                ? true
                : value === 'false' || value === false
                ? false
                : defaultValue;
        return this as any;
    }

    /**
     * Adiciona um parâmetro array
     * @param key Nome do parâmetro
     * @param defaultValue Valor padrão (opcional)
     */
    withArray<K extends string, V extends any[] | undefined = any[] | undefined>(
        key: K,
        defaultValue?: V
    ): QueryParamsBuilder<TQuery & { [P in K]: any[] | V }> {
        const value = this.query[key];
        
        if (Array.isArray(value)) {
            this.query[key] = value;
        } else if (value !== undefined) {
            this.query[key] = [value];
        } else {
            this.query[key] = defaultValue;
        }
        
        return this as any;
    }

    /**
     * Constrói o objeto final com os parâmetros processados
     */
    build(): TQuery {
        return this.query as TQuery;
    }
}
