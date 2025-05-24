export class QueryBuilder {
    private query: Record<string, any> = {};

    constructor(query: any) {
        this.query = { ...query };
    }

    static from(query: any): QueryBuilder {
        return new QueryBuilder(query);
    }

    withNumber(key: string, defaultValue?: number): QueryBuilder {
        this.query[key] = this.query[key] !== undefined
            ? Number(this.query[key]) || defaultValue
            : defaultValue;
        return this;
    }

    withString(key: string, defaultValue?: string): QueryBuilder {
        this.query[key] = this.query[key] !== undefined ? String(this.query[key]) : defaultValue;
        return this;
    }

    build<T = any>(): T {
        return this.query as unknown as T;
    }
}