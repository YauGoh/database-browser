import { DbBrowser, Rectangle } from "../models/db-browser";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "position",
})
export class PositionPipe implements PipeTransform {
    transform(
        value: Rectangle | undefined,
        ...args: unknown[]
    ): { [k: string]: any } {
        return {
            left: `${value?.location.x}px`,
            top: `${value?.location.y}px`,
            width: `${value?.size.width}px`,
            height: `${value?.size.height}px`,
        };
    }
}
