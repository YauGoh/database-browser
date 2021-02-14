export enum DbType {
    SAMPLE = "Sample"
}

export interface DbConfig {
    name: string,
    dbType: DbType,
    connectionString: string
}
