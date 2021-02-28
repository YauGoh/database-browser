import {
    DbBrowser,
    Point,
    previewHeight,
    rowHeight,
} from "../models/db-browser";

import { DbBrowserEntity } from "../models/db-browser-entity";
import { DbBrowserTable } from "../models/db-browser-table";
import { Injectable } from "@angular/core";

const horizontalSpacing = 50;
const verticalSpacing = 50;
const width = 320;

@Injectable()
export class DbBrowserLayoutService {
    constructor() {}

    public layout(tables: DbBrowserTable[]): DbBrowser[] {
        const columns: DbBrowser[][] = [];

        let column = 0;

        this.origaniseIntoColumns(column, columns, tables);

        return this.layoutColumns(columns);
    }

    layoutColumns(columns: DbBrowser[][]): DbBrowser[] {
        let point = new Point(20, 0);

        const flattened: DbBrowser[] = [];

        // layout tables
        let i = 0;
        for (const column of columns) {
            if (i === 0) {
                point = this.layoutColumnOfTables(column, point, flattened);
            } else {
                this.layoutColumnOfEntities(column, point, flattened);
            }

            point = point.withY(0).offsetX(width + horizontalSpacing);

            i++;
        }

        return flattened;
    }

    private layoutColumnOfTables(
        column: DbBrowser[],
        point: Point,
        flattened: DbBrowser[]
    ) {
        for (const item of column) {
            const table: DbBrowserTable = item as DbBrowserTable;

            table.rectangle = table.getRequiredRectangle(point);
            flattened.push(table);

            if (table.isExpanded) {
                let point2 = point.offsetY(rowHeight);

                for (const preview of table.previews) {
                    const rectangle = preview.getRequiredRectangle(point2);

                    preview.rectangle = rectangle;
                    flattened.push(preview);

                    point2 = point2.offsetY(rectangle.size.height);
                }
            }

            point = point.offsetY(
                table.rectangle.size.height + verticalSpacing
            );
        }
        return point;
    }

    private layoutColumnOfEntities(
        column: DbBrowser[],
        point: Point,
        flattened: DbBrowser[]
    ) {
        for (const item of column) {
            const entity: DbBrowserEntity = item as DbBrowserEntity;

            entity.rectangle = entity.getRequiredRectangle(point);
            flattened.push(entity);

            let point2 = point.offsetY(
                entity.getHeaderHeight() + entity.getDataHeight()
            );

            for (const fk of entity.foreignKeys) {
                fk.rectangle = fk.getRequiredRectangle(point2);
                flattened.push(fk);

                if (fk.isExpanded) {
                    let point3 = point2.offsetY(previewHeight);

                    for (const preview of fk.previews) {
                        preview.rectangle = preview.getRequiredRectangle(
                            point3
                        );
                        flattened.push(preview);

                        point3 = point3.offsetY(preview.rectangle.size.height);
                    }
                }

                point2 = point2.offsetY(fk.rectangle.size.height);
            }

            point = point.offsetY(
                entity.rectangle.size.height + verticalSpacing
            );
        }
    }

    origaniseIntoColumns(
        column: number,
        columns: DbBrowser[][],
        tables: DbBrowserTable[]
    ) {
        if (columns.length == column) {
            columns.push([]);
        }

        columns[column].push(...tables);

        tables.forEach((t) => {
            this.columniseEntities(
                column + 1,
                columns,
                t.previews
                    .filter((p) => p.isExpended && p.entity)
                    .map((p) => p.entity!)
            );
        });
    }
    columniseEntities(
        column: number,
        columns: DbBrowser[][],
        entities: DbBrowserEntity[]
    ) {
        if (columns.length == column) {
            columns.push([]);
        }

        const visible = entities.filter((e) => e.isVisible && e.entity.data);

        columns[column].push(...visible);

        visible.forEach((e) => {
            e.foreignKeys.forEach((fk) => {
                this.columniseEntities(
                    column + 1,
                    columns,
                    fk.previews
                        .filter((p) => p.isExpended && p.entity)
                        .map((p) => p.entity!)
                );
            });
        });
    }
}
