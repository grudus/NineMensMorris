import { NineMensMorrisGame } from './NineMensMorrisGame';
import { arePointsEqual, Point } from './Point';
import { GamePhase } from './GamePhase';
import { GameMoveResult } from './GameMoveResult';
import { Player } from './Player';

export class GameMoveEngine {
    private currentMove: CurrentMove = null;

    public constructor(private game: NineMensMorrisGame) {}

    public makeMove(point: Point): GameMoveResult {
        if (this.game.currentPhase == GamePhase.INITIAL) {
            return this.makeInitialMove(point);
        } else {
            return this.makeMoveInNormalPhase(point);
        }
    }

    private makeInitialMove(point: Point) {
        if (this.game.isNoPlayer(point)) {
            this.game.addInitialPoint(point);
            return GameMoveResult.SUCCESSFUL_MOVE;
        }
        return GameMoveResult.CANNOT_MOVE;
    }

    private makeMoveInNormalPhase(point: Point): GameMoveResult {
        if (!this.currentMove) {
            return this.makeFirstMovePart(point);
        }
        return this.makeFinalMovePart(point);
    }

    private makeFirstMovePart(point: Point): GameMoveResult {
        const position = this.game.findPosition(point);
        if (!position || position.player !== this.game.currentPlayer) {
            return GameMoveResult.CANNOT_MOVE;
        }
        this.currentMove = { point, neighbours: this.game.findNeighbours(point), player: this.game.currentPlayer };
        return GameMoveResult.FIRST_MOVE_PART;
    }

    private makeFinalMovePart(point: Point): GameMoveResult {
        const pointToMove = this.currentMove.neighbours.find(p => arePointsEqual(p, point));

        if (!pointToMove) {
            this.currentMove = null;
            return GameMoveResult.RESTART_MOVE;
        }

        this.game.movePoint(this.currentMove.point, point);
        this.currentMove = null;
        return GameMoveResult.SUCCESSFUL_MOVE;
    }
}

interface CurrentMove {
    point: Point;
    neighbours: Point[];
    player: Player;
}
