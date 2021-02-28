import { Pipe, PipeTransform } from "@angular/core";

import { DbProperties } from "../database/models/db-entity";

@Pipe({
    name: "primaryKey",
})
export class PrimaryKeyPipe implements PipeTransform {
    transform(value: DbProperties): string {
        let str: string = "";

        console.log("PrimaryKeyPipe", value);

        for (const key in value) {
            if (str != "") str = `${str}, `;

            str = `${str}${key}: ${value[key]}`;
        }

        return str || "";
    }
}
