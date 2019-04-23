import { NineMensMorrisGame } from '../game/NineMensMorrisGame';
import { BoardPosition } from '../game/BoardPosition';

export class GameCanvasDrawer {
    private squareSize: number;
    private readonly boardColor = '#212121';
    private static readonly A_CODE = 'a'.charCodeAt(0);

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

    private fitToContainer(canvas: HTMLCanvasElement) {
        // Make it visually fill the positioned parent
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        // ...then set the internal size to match
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }

    private drawDots(ctx: CanvasRenderingContext2D) {
        ctx.moveTo(0, 0);
        ctx.fillStyle = this.boardColor;

        this.game.getBoard().forEach((board: BoardPosition) => {
            const xPosition =
                (board.point.col.charCodeAt(0) - GameCanvasDrawer.A_CODE) * this.squareSize + this.squareSize / 2;
            const yPosition = (board.point.row - 1) * this.squareSize + this.squareSize / 2;
            const radius = 5;

            ctx.beginPath();
            ctx.arc(xPosition, yPosition, radius, 0, 2 * Math.PI);
            ctx.fill();
        });
    }

    private drawLines(ctx: CanvasRenderingContext2D) {
        const center = this.squareSize / 2;
        ctx.strokeStyle = this.boardColor;
        let boardSize = NineMensMorrisGame.BOARD_SIZE;

        ctx.strokeRect(center, center, this.squareSize * (boardSize - 1), this.squareSize * (boardSize - 1));
        ctx.strokeRect(
            this.squareSize + center,
            this.squareSize + center,
            this.squareSize * (boardSize - 3),
            this.squareSize * (boardSize - 3),
        );

        ctx.strokeRect(
            2 * this.squareSize + center,
            2 * this.squareSize + center,
            this.squareSize * (boardSize - 5),
            this.squareSize * (boardSize - 5),
        );

        ctx.moveTo(this.squareSize * (boardSize / 2), center);
        ctx.lineTo(this.squareSize * (boardSize / 2), 3 * this.squareSize - center);

        ctx.moveTo(this.squareSize * (boardSize / 2), 5 * this.squareSize - center);
        ctx.lineTo(this.squareSize * (boardSize / 2), boardSize * this.squareSize - center);

        ctx.moveTo(center, this.squareSize * (boardSize / 2));
        ctx.lineTo(3 * this.squareSize - center, this.squareSize * (boardSize / 2));

        ctx.moveTo(5 * this.squareSize - center, this.squareSize * (boardSize / 2));
        ctx.lineTo(boardSize * this.squareSize - center, this.squareSize * (boardSize / 2));

        ctx.stroke();
    }
}
