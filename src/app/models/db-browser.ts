export const rowHeight = 108;
export const previewHeight = 36;
export const dataRowHeight = 36;

export const width = 320;

export class Size {
    constructor(readonly width: number, readonly height: number) {}
}

export class Point {
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
}

export class Link {
    constructor(from: Point, to: Point) {}
}

export class Rectangle {
    constructor(public readonly location: Point, public readonly size: Size) {}
}

export abstract class DbBrowser {
    public link: Link | undefined = undefined;

    public rectangle: Rectangle = new Rectangle(
        new Point(0, 0),
        new Size(0, 0)
    );
    public isVisible: boolean = true;

    abstract getRequiredRectangle(start: Point): Rectangle;
}
