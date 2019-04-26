import { Point, pointFromIndexes } from '../game/Point';

export class GameCanvasContext {
    public constructor(private ctx: CanvasRenderingContext2D, private squareSize: number) {}

    public setColor(color: string) {
        this.ctx.strokeStyle = color;
        this.ctx.fillStyle = color;
    }

    public moveTo(point: Point) {
        this.ctx.moveTo(
            this.squareSize * point.colIndex + this.squareSize / 2,
            this.squareSize * (point.row - 1) + this.squareSize / 2,
        );
    }

    public lineTo(point: Point) {
        this.ctx.lineTo(
            this.squareSize * point.colIndex + this.squareSize / 2,
            this.squareSize * (point.row - 1) + this.squareSize / 2,
        );
    }

    public strokeRect(start: Point, end: Point) {
        const x = this.squareSize * start.colIndex + this.squareSize / 2;
        const y = this.squareSize * (start.row - 1) + this.squareSize / 2;

        this.ctx.strokeRect(
            x,
            y,
            this.squareSize * end.colIndex - x + this.squareSize / 2,
            this.squareSize * (end.row - 1) - y + this.squareSize / 2,
        );
    }

    public stroke() {
        this.ctx.stroke();
    }

    public fillCircle(point: Point, radius: number) {
        this.drawCircle(point, radius);
        this.ctx.fill();
    }
    public strokeCircle(point: Point, radius: number) {
        this.drawCircle(point, radius);
        this.ctx.stroke();
    }

    public clearCircle(point: Point, radius: number) {
        this.drawCircle(point, radius);
        this.ctx.clip();
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    public clearAll() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.beginPath();
    }

    public getPoint(pos: { x: number; y: number }): Point {
        const row = Math.floor(pos.y / this.squareSize);
        const col = Math.floor(pos.x / this.squareSize);
        return pointFromIndexes(row, col);
    }

    private drawCircle(point: Point, radius: number) {
        const xPosition = point.colIndex * this.squareSize + this.squareSize / 2;
        const yPosition = (point.row - 1) * this.squareSize + this.squareSize / 2;

        this.ctx.beginPath();
        this.ctx.arc(xPosition, yPosition, radius, 0, 2 * Math.PI);
    }
}
