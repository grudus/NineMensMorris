import { Coordinate, coord } from '../game/Coordinate';

export class GameCanvasContext {
    public constructor(private ctx: CanvasRenderingContext2D, private squareSize: number) {}

    public setColor(color: string) {
        this.ctx.strokeStyle = color;
        this.ctx.fillStyle = color;
    }

    public moveTo(coordinate: Coordinate) {
        this.ctx.moveTo(
            this.squareSize * (coordinate.col - 1) + this.squareSize / 2,
            this.squareSize * (coordinate.row - 1) + this.squareSize / 2,
        );
    }

    public lineTo(coordinate: Coordinate) {
        this.ctx.lineTo(
            this.squareSize * (coordinate.col - 1) + this.squareSize / 2,
            this.squareSize * (coordinate.row - 1) + this.squareSize / 2,
        );
    }

    public strokeRect(start: Coordinate, end: Coordinate) {
        const x = this.squareSize * (start.col - 1) + this.squareSize / 2;
        const y = this.squareSize * (start.row - 1) + this.squareSize / 2;

        this.ctx.strokeRect(
            x,
            y,
            this.squareSize * (end.col - 1) - x + this.squareSize / 2,
            this.squareSize * (end.row - 1) - y + this.squareSize / 2,
        );
    }

    public stroke() {
        this.ctx.stroke();
    }

    public fillCircle(coordinate: Coordinate, radius: number) {
        this.drawCircle(coordinate, radius);
        this.ctx.fill();
    }
    public strokeCircle(coordinate: Coordinate, radius: number) {
        this.drawCircle(coordinate, radius);
        this.ctx.stroke();
    }

    public clearAll() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.beginPath();
    }

    public getCoordinate(pos: { x: number; y: number }): Coordinate {
        const row = Math.floor(pos.y / this.squareSize);
        const col = Math.floor(pos.x / this.squareSize);
        return coord(row + 1, col + 1);
    }

    private drawCircle(coordinate: Coordinate, radius: number) {
        const xPosition = (coordinate.col - 1) * this.squareSize + this.squareSize / 2;
        const yPosition = (coordinate.row - 1) * this.squareSize + this.squareSize / 2;

        this.ctx.beginPath();
        this.ctx.arc(xPosition, yPosition, radius, 0, 2 * Math.PI);
    }
}
