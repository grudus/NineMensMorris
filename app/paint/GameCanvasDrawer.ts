import { NineMensMorrisGame } from '../game/NineMensMorrisGame';
import { BoardPosition } from '../game/BoardPosition';
import { point } from '../game/Point';
import { GameCanvas } from './GameCanvas';

export class GameCanvasDrawer {
    private readonly squareSize: number;
    private readonly boardColor = '#212121';
    private readonly gameCanvas: GameCanvas;

    public constructor(private canvas: HTMLCanvasElement, private game: NineMensMorrisGame) {
        this.fitToContainer(canvas);
        this.squareSize = canvas.width / NineMensMorrisGame.BOARD_SIZE;
        this.gameCanvas = new GameCanvas(canvas.getContext('2d'), this.squareSize);

        this.drawInitialCanvas(canvas);
    }

    private fitToContainer(canvas: HTMLCanvasElement) {
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }

    private drawInitialCanvas(canvas: HTMLCanvasElement) {
        this.drawHelperLines(canvas);

        this.drawDots();
        this.drawLines();
    }

    private drawHelperLines(canvas: HTMLCanvasElement) {
        const ctx: CanvasRenderingContext2D = canvas.getContext('2d');

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
        this.gameCanvas.setColor('#e0e0e0');
        ctx.stroke();
    }

    private drawDots() {
        this.gameCanvas.setColor(this.boardColor);
        const radius = 5;

        this.game.getBoard().forEach((board: BoardPosition) => {
            this.gameCanvas.fillCircle(board.point, radius);
        });
    }

    private drawLines() {
        this.gameCanvas.setColor(this.boardColor);

        this.gameCanvas.strokeRect(point(1, 'a'), point(7, 'g'));
        this.gameCanvas.strokeRect(point(2, 'b'), point(6, 'f'));
        this.gameCanvas.strokeRect(point(3, 'c'), point(5, 'e'));

        this.gameCanvas.moveTo(point(1, 'd'));
        this.gameCanvas.lineTo(point(3, 'd'));

        this.gameCanvas.moveTo(point(5, 'd'));
        this.gameCanvas.lineTo(point(7, 'd'));

        this.gameCanvas.moveTo(point(4, 'a'));
        this.gameCanvas.lineTo(point(4, 'c'));

        this.gameCanvas.moveTo(point(4, 'e'));
        this.gameCanvas.lineTo(point(4, 'g'));

        this.gameCanvas.stroke();
    }
}
