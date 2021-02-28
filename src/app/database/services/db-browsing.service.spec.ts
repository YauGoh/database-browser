import { ColumnType, DbTableColumn } from "../models/db-table-column";
import {
    DbTableForeignKey,
    DbTableForeignKeyMap,
} from "../models/db-table-foreign-key";

import { DbBrowsingService } from "./db-browsing.service";
import { DbQueryService } from "./db-query.service";
import { DbTableName } from "../models/db-table-name";
import { DbTableSchema } from "../models/db-table-schema";

describe("DbTableSchemaProvider", () => {
    let queryService: jasmine.SpyObj<DbQueryService>;
    let sut: DbBrowsingService;

    let users_id: DbTableColumn;
    let users_departmentId: DbTableColumn;
    let users_name: DbTableColumn;
    let users_department_foreignKey: DbTableForeignKey;

    let departments_id: DbTableColumn;

    let usersTable: DbTableSchema;

    let departmentTable: DbTableSchema;

    let schema: DbTableSchema[] = [];

    beforeEach(() => {
        queryService = jasmine.createSpyObj("DbQueryService", [
            "select",
        ]) as jasmine.SpyObj<DbQueryService>;
        sut = new DbBrowsingService();
        sut.useQueryService(queryService);

        usersTable = new DbTableSchema(
            new DbTableName("dbo", "users"),
            [(users_id = new DbTableColumn("id", ColumnType.NUMBER))],
            [
                new DbTableColumn("Id", ColumnType.NUMBER),
                (users_departmentId = new DbTableColumn(
                    "departmentId",
                    ColumnType.NUMBER
                )),
                (users_name = new DbTableColumn("name", ColumnType.STRING)),
            ]
        );

        departmentTable = new DbTableSchema(
            new DbTableName("dbo", "departments"),
            [(departments_id = new DbTableColumn("id", ColumnType.NUMBER))],
            [
                new DbTableColumn("id", ColumnType.NUMBER),
                new DbTableColumn("name", ColumnType.STRING),
            ]
        );

        usersTable.addForeinKey(
            (users_department_foreignKey = new DbTableForeignKey(
                "fk_users_department",
                [new DbTableForeignKeyMap(users_departmentId, departments_id)],
                departmentTable
            ))
        );

        departmentTable.addForeinKey(
            new DbTableForeignKey(
                "fk_users_department",
                [new DbTableForeignKeyMap(departments_id, users_departmentId)],
                usersTable
            )
        );

        schema = [usersTable, departmentTable];
    });

    it("should fetch preview data", async () => {
        queryService.select.and.returnValue(
            Promise.resolve([
                { id: 1, name: "John" },
                { id: 2, name: "Adam" },
            ])
        );

        const entities = await sut.getTablePreview(usersTable);

        expect(queryService.select).toHaveBeenCalledOnceWith(
            jasmine.objectContaining({
                select: [users_id, users_name],
                from: usersTable,
                where: undefined,
            })
        );

        expect(entities[0].primaryKey).toEqual({ id: 1 });
        expect(entities[0].preview).toEqual({ id: 1, name: "John" });
        expect(entities[0].table).toEqual(usersTable);

        expect(entities[1].primaryKey).toEqual({ id: 2 });
        expect(entities[1].preview).toEqual({ id: 2, name: "Adam" });
        expect(entities[1].table).toEqual(usersTable);
    });

    it("should populate entity's data", async () => {
        queryService.select.and.returnValue(
            Promise.resolve([
                { id: 1, name: "John" },
                { id: 2, name: "Adam" },
            ])
        );

        const [john] = await sut.getTablePreview(usersTable);

        queryService.select.and.returnValue(
            Promise.resolve([{ id: 1, name: "John", departmentId: 1 }])
        );

        await sut.populateEntity(john);

        expect(queryService.select).toHaveBeenCalledWith(
            jasmine.objectContaining({
                select: usersTable.columns,
                from: usersTable,
                where: john.primaryKey,
            })
        );

        expect(john.data).toEqual({
            id: 1,
            name: "John",
            departmentId: 1,
        });
    });

    it("should fetch entity's children preview data for the primary key", async () => {
        queryService.select.and.returnValue(
            Promise.resolve([
                { id: 1, name: "John" },
                { id: 2, name: "Adam" },
            ])
        );

        const [john] = await sut.getTablePreview(usersTable);

        queryService.select.and.returnValue(
            Promise.resolve([{ id: 1, name: "John", departmentId: 99 }])
        );

        await sut.populateEntity(john);

        queryService.select.and.returnValue(
            Promise.resolve([{ id: 99, name: "ICT" }])
        );

        const children = await sut.getForeignKeyEntities(
            john,
            users_department_foreignKey
        );

        expect(queryService.select).toHaveBeenCalledWith(
            jasmine.objectContaining({
                select: departmentTable.previewColumns,
                from: departmentTable,
                where: jasmine.objectContaining({ id: 99 }),
            })
        );

        expect(children[0].table).toBe(departmentTable);
        expect(children[0].primaryKey).toEqual({ id: 99 });
        expect(children[0].preview).toEqual({
            id: 99,
            name: "ICT",
        });
        expect(children[0].data).toBeUndefined();
    });
});
