import { fromEvent } from "rxjs";
import { horizontalSpacing } from "../services/db-browser-layout.service";

export const rowHeight = 108;
export const previewHeight = 36;
export const dataRowHeight = 36;

export const width = 320;

export class Size {
    constructor(readonly width: number, readonly height: number) {}
}

export class Point {
    isAbove(from: Point): boolean {
        return this.y < from.y;
    }

    maxY(max: number): Point {
        if (this.y < max) return new Point(this.x, max);

        return this;
    }
    constructor(readonly x: number, readonly y: number) {}

    offsetX(width: number): Point {
        return new Point(this.x + width, this.y);
    }

    offsetY(height: number): Point {
        return new Point(this.x, this.y + height);
    }

    withY(y: number): Point {
        return new Point(this.x, y);
    }

    relative(rectangle: Rectangle): Point {
        return this.subtract(rectangle.location);
    }

    subtract(point: Point): Point {
        return new Point(this.x - point.x, this.y - point.y);
    }
}

export class Link {
    constructor(public readonly from: Point, public readonly to: Point, public readonly linkCollection: Link[]) {}

    public get a(): Point {
        return this.from.relative(this.rectangle);
    }

    public get turnA(): Point {
        let index = this.belows.indexOf(this);

        let ratio = (this.belows.length - index) / (this.belows.length + 1.0);

        if (this.to.isAbove(this.from)) {
            index = this.aboves.indexOf(this);
            ratio = (index + 1.0) / (this.aboves.length + 1.0);
        }

        const offset = horizontalSpacing * ratio;

        return this.from.offsetX(offset).relative(this.rectangle);
    }

    public get turnB(): Point {
        return this.turnA.withY(this.b.y);
    }

    public get b(): Point {
        return this.to.relative(this.rectangle);
    }

    public get rectangle(): Rectangle {
        return Rectangle.from(this.from, this.to);
    }

    private get aboves(): Link[] {
        return this.linkCollection.filter((_) => _.to.isAbove(_.from));
    }

    private get belows(): Link[] {
        return this.linkCollection.filter((_) => !_.to.isAbove(_.from));
    }
}

export class Rectangle {
    constructor(public readonly location: Point, public readonly size: Size) {}

    public get left(): number {
        return this.location.x;
    }

    public get right(): number {
        return this.location.x + this.size.width;
    }

    public get top(): number {
        return this.location.y;
    }

    public get bottom(): number {
        return this.location.y + this.size.height;
    }

    public static from(from: Point, to: Point): Rectangle {
        const point = new Point(Math.min(from.x, to.x), Math.min(from.y, to.y));

        const size = new Size(Math.abs(from.x - to.x), Math.abs(from.y - to.y));

        return new Rectangle(point, size);
    }

    public overlaps(other: Rectangle): boolean {
        return (
            ((this.location.x >= other.left && this.location.x <= other.right) || (other.location.x >= this.left && other.location.x <= this.right)) &&
            ((this.location.y >= other.top && this.location.y <= other.bottom) || (other.location.y >= this.top && other.location.y <= this.bottom))
        );
    }
}

export abstract class DbBrowser {
    public link: Link | undefined = undefined;

    public rectangle: Rectangle = new Rectangle(new Point(0, 0), new Size(0, 0));
    public isVisible: boolean = true;

    abstract getRequiredRectangle(start: Point): Rectangle;

    public get linkTo(): Point {
        return this.rectangle.location.offsetY(previewHeight * 0.5);
    }

    public get linkFrom(): Point {
        return this.rectangle.location.offsetY(previewHeight * 0.5).offsetX(width);
    }
}
