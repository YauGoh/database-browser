export enum ColumnType {
    NUMBER,
    STRING,
    DATE,
    BOOLEAN,
}

export interface ColumnOptions {
    maxLength?: number;

    precission?: number;
}

export class DbTableColumn {
    constructor(
        public readonly name: string,
        public readonly type: ColumnType,
        public readonly options: ColumnOptions = {}
    ) {}
}
