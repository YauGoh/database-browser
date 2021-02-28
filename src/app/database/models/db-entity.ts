import { DbQuery } from "./db-query";
import { DbTableForeignKey } from "./db-table-foreign-key";
import { DbTableSchema } from "./db-table-schema";

export type DbValue = number | string | Date | boolean | null;

export type DbProperties = {
    [column: string]: DbValue;
};

export class DbEntity {
    constructor(
        public readonly table: DbTableSchema,
        public readonly primaryKey: DbProperties,
        public readonly preview: DbProperties,
        public data: DbProperties | undefined = undefined
    ) {}

    public get isPopulated(): boolean {
        return !!this.data;
    }

    public getDataQuery(): DbQuery {
        return new DbQuery(this.table.columns, this.table, this.primaryKey);
    }

    setData(data: DbProperties) {
        this.data = data;
    }
}

export class DbChildEntitiesContainer {
    private _isPopulateed: boolean;
    private _children: DbEntity[];

    constructor(public readonly foreignKey: DbTableForeignKey) {
        this._children = [];

        this._isPopulateed = false;
    }

    public get children(): DbEntity[] {
        return this._children;
    }

    public get isPopulate(): boolean {
        return this._isPopulateed;
    }

    populate(children: DbEntity[]) {
        this._isPopulateed = true;
        this._children = children;
    }
}
