import { DbProperties } from "../models/db-entity";
import { DbQuery } from "../models/db-query";

export interface DbQueryService {
    select(query: DbQuery): Promise<DbProperties[]>;
}
