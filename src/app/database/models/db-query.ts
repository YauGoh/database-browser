import { DbProperties } from "./db-entity";
import { DbTableColumn } from "./db-table-column";
import { DbTableSchema } from "./db-table-schema";

export class DbQuery {
    constructor(
        public readonly select: DbTableColumn[],
        public readonly from: DbTableSchema,
        public readonly where: DbProperties | undefined
    ) {}
}
