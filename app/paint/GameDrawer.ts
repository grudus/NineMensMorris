import { NineMensMorrisGame } from '../game/NineMensMorrisGame';
import { BoardPosition } from '../game/BoardPosition';
import { areCoordsEquals, Coordinate, point } from '../game/Coordinate';
import { GameCanvasContext } from './GameCanvasContext';
import { Player } from '../game/Player';
import { GameMoveResult } from '../game/GameMoveResult';
import { getPaintablePlayer } from './PaintablePlayer';

export class GameDrawer {
    private readonly squareSize: number;
    private readonly boardColor = '#212121';
    private readonly gameCanvas: GameCanvasContext;
    private selectablePoints: Coordinate[];

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
        this.selectablePoints = this.game.findSelectableCoordinates();
    }

    private onMouseClick(point: Coordinate) {
        const gameMoveResult = this.game.tryToMakeMove(point);

        switch (gameMoveResult) {
            case GameMoveResult.SUCCESSFUL_MOVE:
            case GameMoveResult.OPPONENT_DESTROYED:
                this.resetCanvasAndDrawGame();
                setTimeout(() => {
                    this.afterUpdate(gameMoveResult);
                    this.resetCanvasAndDrawGame();
                });
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

        this.selectablePoints = this.game.findSelectableCoordinates(point);
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
        this.game.forEachBoardPosition((board: BoardPosition) => {
            const paintable = getPaintablePlayer(board.player);

            if (board.player === Player.NO_PLAYER) {
                this.gameCanvas.setColor(this.boardColor);
                this.gameCanvas.fillCircle(board.coordinate, paintable.radius);
            } else {
                this.gameCanvas.setColor(paintable.color);
                this.gameCanvas.fillCircle(board.coordinate, paintable.radius);
            }
        });
    }

    private drawPossibleMoves(point: Coordinate) {
        this.game.possibleMoves(point).forEach(point => {
            this.gameCanvas.strokeCircle(point, 15);
        });
    }

    private drawPossibleMillMoves() {
        this.game.allOpponentPositions().forEach(position => {
            this.gameCanvas.strokeCircle(position.coordinate, 15);
        });
    }

    private resetCanvasAndDrawGame() {
        this.gameCanvas.clearAll();
        this.drawInitialCanvas();
    }

    private drawLines() {
        this.gameCanvas.setColor(this.boardColor);

        this.gameCanvas.strokeRect(point(1, 1), point(7, 7));
        this.gameCanvas.strokeRect(point(2, 2), point(6, 6));
        this.gameCanvas.strokeRect(point(3, 3), point(5, 5));

        this.gameCanvas.moveTo(point(1, 4));
        this.gameCanvas.lineTo(point(3, 4));

        this.gameCanvas.moveTo(point(5, 4));
        this.gameCanvas.lineTo(point(7, 4));

        this.gameCanvas.moveTo(point(4, 1));
        this.gameCanvas.lineTo(point(4, 3));

        this.gameCanvas.moveTo(point(4, 5));
        this.gameCanvas.lineTo(point(4, 7));

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
            const point = this.gameCanvas.getCoordinate(pos);
            this.onMouseClick(point);
        });

        canvas.addEventListener('mousemove', e => {
            const pos = getMousePos(canvas, e);
            const point = this.gameCanvas.getCoordinate(pos);
            const isSelectable = this.selectablePoints.some(p => areCoordsEquals(p, point));
            canvas.style.cursor = isSelectable ? 'pointer' : 'default';
        });
    }
}
