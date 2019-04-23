import { NineMensMorrisGame } from '../game/NineMensMorrisGame';
import { BoardPosition } from '../game/BoardPosition';
import { point, Point } from '../game/Point';

export class GameCanvasDrawer {
    private squareSize: number;
    private readonly boardColor = '#212121';

    public constructor(private canvas: HTMLCanvasElement, private game: NineMensMorrisGame) {
        this.fitToContainer(canvas);
        this.drawInitialCanvas(canvas);
    }

    private drawInitialCanvas(canvas: HTMLCanvasElement) {
        const ctx: CanvasRenderingContext2D = canvas.getContext('2d');

        this.squareSize = canvas.width / NineMensMorrisGame.BOARD_SIZE;
        this.drawHelperLines(ctx, canvas);

        this.drawDots(ctx);
        this.drawLines(ctx);
    }


    private fitToContainer(canvas: HTMLCanvasElement) {
        // Make it visually fill the positioned parent
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        // ...then set the internal size to match
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    private drawHelperLines(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
        for (let i = 0; i < NineMensMorrisGame.BOARD_SIZE; ++i) {
            ctx.moveTo(i * this.squareSize, 0);
            // noinspection JSSuspiciousNameCombination
            ctx.lineTo(i * this.squareSize, canvas.width);
        }

        for (let i = 0; i < NineMensMorrisGame.BOARD_SIZE; ++i) {
            ctx.moveTo(0, i * this.squareSize);
            // noinspection JSSuspiciousNameCombination
            ctx.lineTo(canvas.height, i * this.squareSize);
        }
        ctx.strokeStyle = '#e0e0e0';
        ctx.stroke();
    }

    private drawDots(ctx: CanvasRenderingContext2D) {
        ctx.moveTo(0, 0);
        ctx.fillStyle = this.boardColor;

        this.game.getBoard().forEach((board: BoardPosition) => {
            const xPosition = board.point.colIndex * this.squareSize + this.squareSize / 2;
            const yPosition = (board.point.row - 1) * this.squareSize + this.squareSize / 2;
            const radius = 5;

            ctx.beginPath();
            ctx.arc(xPosition, yPosition, radius, 0, 2 * Math.PI);
            ctx.fill();
        });
    }

    private drawLines(ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = this.boardColor;

        this.strokeRect(ctx, point(1, 'a'), point(7, 'g'));
        this.strokeRect(ctx, point(2, 'b'), point(6, 'f'));
        this.strokeRect(ctx, point(3, 'c'), point(5, 'e'));

        this.moveTo(ctx, point(1, 'd'));
        this.lineTo(ctx, point(3, 'd'));

        this.moveTo(ctx, point(5, 'd'));
        this.lineTo(ctx, point(7, 'd'));

        this.moveTo(ctx, point(4, 'a'));
        this.lineTo(ctx, point(4, 'c'));

        this.moveTo(ctx, point(4, 'e'));
        this.lineTo(ctx, point(4, 'g'));

        ctx.stroke();
    }

    private moveTo(ctx: CanvasRenderingContext2D, point: Point) {
        ctx.moveTo(
            this.squareSize * point.colIndex + this.squareSize / 2,
            this.squareSize * (point.row - 1) + this.squareSize / 2,
        );
    }

    private lineTo(ctx: CanvasRenderingContext2D, point: Point) {
        ctx.lineTo(
            this.squareSize * point.colIndex + this.squareSize / 2,
            this.squareSize * (point.row - 1) + this.squareSize / 2,
        );
    }

    private strokeRect(ctx: CanvasRenderingContext2D, start: Point, end: Point) {
        let x = this.squareSize * start.colIndex + this.squareSize / 2;
        let y = this.squareSize * (start.row - 1) + this.squareSize / 2;
        ctx.strokeRect(
            x,
            y,
            this.squareSize * end.colIndex - x + this.squareSize / 2,
            this.squareSize * (end.row - 1) - y + this.squareSize / 2,
        );
    }
}
