import { ColumnType, DbTableColumn } from "../models/db-table-column";

import { DbConfig } from "../models/db-config";
import { DbForeignKeyDetails } from "../models/db-foreign-key-details";
import { DbTableForeignKeyMap } from "../models/db-table-foreign-key";
import { DbTableName } from "../models/db-table-name";
import { DbTableSchema } from "../models/db-table-schema";
import { DbTableSchemaProvider } from "./db-table-schema-provider";

class MockDbTableSchemaProvider extends DbTableSchemaProvider {
  protected getTableSchemas(): Promise<DbTableSchema[]> {
    return Promise.resolve([
      new DbTableSchema(
        new DbTableName("dbo", "users"), 
        [
          new DbTableColumn("id", ColumnType.NUMBER)
        ], 
        [
          new DbTableColumn("id", ColumnType.NUMBER), 
          new DbTableColumn("assistantId", ColumnType.NUMBER),
          new DbTableColumn("name", ColumnType.STRING)
        ]
      ),

      new DbTableSchema(
        new DbTableName("dbo", "trips"), 
        [
          new DbTableColumn("id", ColumnType.NUMBER)
        ], 
        [
          new DbTableColumn("id", ColumnType.NUMBER),
          new DbTableColumn("userId", ColumnType.NUMBER), 
          new DbTableColumn("locationId", ColumnType.NUMBER), 
          new DbTableColumn("at", ColumnType.DATE)
        ]
      )
    ]);
  }
  protected getForiegnKeys(): Promise<DbForeignKeyDetails[]> {
    return Promise.resolve(
      [
        new DbForeignKeyDetails(
          "fk_users_trips", 
          new DbTableName("dbo", "trips"), 
          new DbTableName("dbo", "users"), 
          [ new DbTableForeignKeyMap(new DbTableColumn("userId", ColumnType.NUMBER),  new DbTableColumn("id", ColumnType.NUMBER)) ]
        ),

        new DbForeignKeyDetails(
          "fk_trips_locations", 
          new DbTableName("dbo", "trips"), 
          new DbTableName("dbo", "locations"), 
          [ new DbTableForeignKeyMap(new DbTableColumn("locationId", ColumnType.NUMBER),  new DbTableColumn("id", ColumnType.NUMBER)) ]
        ),
      ]
    );
  }
  
}

const config: DbConfig = {};

describe('DbTableSchemaProvider', () => {
  let sut: MockDbTableSchemaProvider;

  beforeEach(() => {
    sut = new MockDbTableSchemaProvider(config);

  });

  it('should return tables with foreign key associations', async () => {
    const tables = await sut.getTables();

    // users
    expect(tables[0].name.schema).toBe("dbo");
    expect(tables[0].name.name).toBe("users");

    expect(tables[0].primaryKey[0].name).toBe("id");
    expect(tables[0].primaryKey[0].type).toBe(ColumnType.NUMBER);

    expect(tables[0].columns[0].name).toBe("id");
    expect(tables[0].columns[0].type).toBe(ColumnType.NUMBER);

    expect(tables[0].columns[1].name).toBe("assistantId");
    expect(tables[0].columns[1].type).toBe(ColumnType.NUMBER);

    expect(tables[0].columns[2].name).toBe("name");
    expect(tables[0].columns[2].type).toBe(ColumnType.STRING);

    expect(tables[0].foreignKeys[0].name).toBe("fk_users_trips");
    expect(tables[0].foreignKeys[0].toTable.name.schema).toBe("dbo");
    expect(tables[0].foreignKeys[0].toTable.name.name).toBe("trips");
    expect(tables[0].foreignKeys[0].key[0].from.name).toBe("id");
    expect(tables[0].foreignKeys[0].key[0].to.name).toBe("userId");

    // trips
    expect(tables[1].name.schema).toBe("dbo");
    expect(tables[1].name.name).toBe("trips");

    expect(tables[1].primaryKey[0].name).toBe("id");
    expect(tables[1].primaryKey[0].type).toBe(ColumnType.NUMBER);

    expect(tables[1].columns[0].name).toBe("id");
    expect(tables[1].columns[0].type).toBe(ColumnType.NUMBER);

    expect(tables[1].columns[1].name).toBe("userId");
    expect(tables[1].columns[1].type).toBe(ColumnType.NUMBER);

    expect(tables[1].columns[2].name).toBe("locationId");
    expect(tables[1].columns[2].type).toBe(ColumnType.NUMBER);

    expect(tables[1].columns[3].name).toBe("at");
    expect(tables[1].columns[3].type).toBe(ColumnType.DATE);

    expect(tables[1].foreignKeys[0].name).toBe("fk_users_trips");
    expect(tables[1].foreignKeys[0].toTable.name.schema).toBe("dbo");
    expect(tables[1].foreignKeys[0].toTable.name.name).toBe("users");
    expect(tables[1].foreignKeys[0].key[0].from.name).toBe("userId");
    expect(tables[1].foreignKeys[0].key[0].to.name).toBe("id");
  });
});
