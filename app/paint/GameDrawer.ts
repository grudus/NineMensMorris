import { NineMensMorrisGame } from '../game/NineMensMorrisGame';
import { BoardPosition } from '../game/BoardPosition';
import { Point, point } from '../game/Point';
import { GameCanvasContext } from './GameCanvasContext';
import { Player } from '../game/Player';
import { GameMoveResult } from '../game/GameMoveResult';
import { getPaintablePlayer } from './PaintablePlayer';

export class GameDrawer {
    private readonly squareSize: number;
    private readonly boardColor = '#212121';
    private readonly gameCanvas: GameCanvasContext;

    public constructor(
        private canvas: HTMLCanvasElement,
        private game: NineMensMorrisGame,
        private afterUpdate: Function,
    ) {
        this.fitToContainer(canvas);

        this.addMouseListener(canvas);

        this.squareSize = canvas.width / NineMensMorrisGame.BOARD_SIZE;
        this.gameCanvas = new GameCanvasContext(canvas.getContext('2d'), this.squareSize);

        this.drawInitialCanvas();
    }

    private onMouseClick(point: Point) {
        const gameMoveResult = this.game.tryToMakeMove(point);
        console.log(gameMoveResult);

        switch (gameMoveResult) {
            case GameMoveResult.SUCCESSFUL_MOVE:
            case GameMoveResult.OPPONENT_DESTROYED:
                this.resetCanvasAndDrawGame();
                break;
            case GameMoveResult.FIRST_MOVE_PART:
                this.drawPossibleMoves(point);
                break;
            case GameMoveResult.RESTART_MOVE:
                this.resetCanvasAndDrawGame();
                this.onMouseClick(point);
                break;
            case GameMoveResult.MILL:
                this.resetCanvasAndDrawGame();
                this.drawPossibleMillMoves();
                break;
            case GameMoveResult.CANNOT_MOVE:
                break;
        }
        this.afterUpdate(gameMoveResult);
    }

    private fitToContainer(canvas: HTMLCanvasElement) {
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }

    private drawInitialCanvas() {
        this.drawLines();
        this.drawDots();
    }

    private drawDots() {
        this.game.board.forEach((board: BoardPosition) => {
            const paintable = getPaintablePlayer(board.player);

            if (board.player === Player.NO_PLAYER) {
                this.gameCanvas.setColor(this.boardColor);
                this.gameCanvas.fillCircle(board.point, paintable.radius);
            } else {
                this.gameCanvas.setColor(paintable.color);
                this.gameCanvas.fillCircle(board.point, paintable.radius);
            }
        });
    }

    private drawPossibleMoves(point: Point) {
        this.game.possibleMoves(point).forEach(point => {
            this.gameCanvas.strokeCircle(point, 15);
        });
    }

    private drawPossibleMillMoves() {
        this.game.allOpponentPositions().forEach(position => {
            this.gameCanvas.strokeCircle(position.point, 15);
        });
    }

    private resetCanvasAndDrawGame() {
        this.gameCanvas.clearAll();
        this.drawInitialCanvas();
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

    private addMouseListener(canvas: HTMLCanvasElement) {
        function getMousePos(canvas, evt) {
            const rect = canvas.getBoundingClientRect();
            return {
                x: evt.clientX - rect.left,
                y: evt.clientY - rect.top,
            };
        }

        canvas.addEventListener('click', e => {
            const pos = getMousePos(canvas, e);
            const point = this.gameCanvas.getPoint(pos);
            this.onMouseClick(point);
        });
    }
}
