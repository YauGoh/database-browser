import { Pipe, PipeTransform } from "@angular/core";

import { Link } from "../models/db-browser";

@Pipe({
    name: "path",
})
export class PathPipe implements PipeTransform {
    transform(link: Link, ...args: unknown[]): string {
        return `M ${link.a.x} ${link.a.y} h ${link.turnA.x - link.a.x} v ${
            link.turnB.y - link.turnA.y
        } h ${link.b.x - link.turnB.x}`;
    }
}
