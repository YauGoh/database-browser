import { DbBrowser, Link, Point, previewHeight, rowHeight } from "../models/db-browser";

import { DbBrowserEntity } from "../models/db-browser-entity";
import { DbBrowserTable } from "../models/db-browser-table";
import { Injectable } from "@angular/core";

export const horizontalSpacing = 50;
export const verticalSpacing = 50;
export const width = 320;

@Injectable()
export class DbBrowserLayoutService {
    constructor() {}

    public layout(tables: DbBrowserTable[]): { items: DbBrowser[]; links: Link[] } {
        const columns: DbBrowser[][] = [];

        let column = 0;

        this.origaniseIntoColumns(column, columns, tables);

        return this.layoutColumns(columns);
    }

    layoutColumns(columns: DbBrowser[][]): { items: DbBrowser[]; links: Link[] } {
        let point = new Point(20, verticalSpacing);

        const items: DbBrowser[] = [];
        const links: Link[] = [];

        // layout tables
        let i = 0;
        for (const column of columns) {
            if (i === 0) {
                point = this.layoutColumnOfTables(column, point, items);
            } else {
                links.push(...this.layoutColumnOfEntities(column, point, items));
            }

            point = point.withY(verticalSpacing).offsetX(width + horizontalSpacing);

            i++;
        }

        return { items, links };
    }

    private layoutColumnOfTables(column: DbBrowser[], point: Point, flattened: DbBrowser[]) {
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

            point = point.offsetY(table.rectangle.size.height + verticalSpacing);
        }
        return point;
    }

    private layoutColumnOfEntities(column: DbBrowser[], point: Point, flattened: DbBrowser[]): Link[] {
        const links: Link[] = [];

        for (const item of column) {
            const entity: DbBrowserEntity = item as DbBrowserEntity;

            point = point.maxY(entity.source.rectangle.location.y);

            entity.rectangle = entity.getRequiredRectangle(point);
            flattened.push(entity);

            const link = new Link(entity.previewItem.linkFrom, entity.linkTo, links);

            links.push(link);

            let point2 = point.offsetY(entity.getHeaderHeight() + entity.getDataHeight());

            for (const fk of entity.foreignKeys) {
                fk.rectangle = fk.getRequiredRectangle(point2);
                flattened.push(fk);

                if (fk.isExpanded) {
                    let point3 = point2.offsetY(previewHeight);

                    for (const preview of fk.previews) {
                        preview.rectangle = preview.getRequiredRectangle(point3);
                        flattened.push(preview);

                        point3 = point3.offsetY(preview.rectangle.size.height);
                    }
                }

                point2 = point2.offsetY(fk.rectangle.size.height);
            }

            point = point.offsetY(entity.rectangle.size.height + verticalSpacing);
        }

        return links;
    }

    origaniseIntoColumns(column: number, columns: DbBrowser[][], tables: DbBrowserTable[]) {
        if (columns.length == column) {
            columns.push([]);
        }

        columns[column].push(...tables);

        tables.forEach((t) => {
            this.columniseEntities(
                column + 1,
                columns,
                t.previews.filter((p) => p.isExpended && p.entity).map((p) => p.entity!)
            );
        });
    }
    columniseEntities(column: number, columns: DbBrowser[][], entities: DbBrowserEntity[]) {
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
                    fk.previews.filter((p) => p.isExpended && p.entity).map((p) => p.entity!)
                );
            });
        });
    }
}
