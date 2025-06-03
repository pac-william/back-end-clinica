export class QueryParamsBuilder<TQuery extends Record<string, any> = {}> {
    private query: Record<string, any>;

    constructor(query: Record<string, any>) {
        this.query = { ...query };
    }

    static from<TQuery extends Record<string, any>>(query: TQuery): QueryParamsBuilder<TQuery> {
        return new QueryParamsBuilder(query);
    }

    withNumber<K extends string, V extends number | undefined = number | undefined>(
        key: K,
        defaultValue?: V
    ): QueryParamsBuilder<TQuery & { [P in K]: number | V }> {
        const value = Number(this.query[key]);
        this.query[key] = !isNaN(value) ? value : defaultValue;
        return this as any;
    }

    withString<K extends string, V extends string | undefined = string | undefined>(
        key: K,
        defaultValue?: V
    ): QueryParamsBuilder<TQuery & { [P in K]: string | V }> {
        const value = this.query[key];
        this.query[key] = typeof value === 'string' ? value : defaultValue;
        return this as any;
    }

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

    build(): TQuery {
        return this.query as TQuery;
    }
}
