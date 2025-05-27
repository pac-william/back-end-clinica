import { Meta } from "../models/meta";

export class MetaBuilder {
    private total: number;
    private page: number;
    private size: number;

    constructor(total: number, page: number, size: number) {
        this.total = total;
        this.page = page;
        this.size = size;
    }

    build(): Meta {
        return {
            total: this.total,
            page: this.page,
            size: this.size,
        };
    }
}