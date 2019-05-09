import { NineMensMorrisGame } from './NineMensMorrisGame';
import { arePointsEqual, Point } from './Point';
import { GameState } from './GameState';
import { GameMoveResult } from './GameMoveResult';
import { Player } from './Player';

export class GameMoveEngine {
    private currentMove: CurrentMove = null;

    public constructor(private game: NineMensMorrisGame) {}

    public makeMove(point: Point): GameMoveResult {
        if (this.game.isGameOver()) {
            return;
        }
        if (this.game.isMill()) {
            return this.makeMillMove(point);
        } else if (this.game.currentState == GameState.INITIAL) {
            return this.makeInitialMove(point);
        } else {
            return this.makeMoveInNormalPhase(point);
        }
    }

    private makeInitialMove(point: Point) {
        if (!this.game.isNoPlayer(point)) {
            return GameMoveResult.CANNOT_MOVE;
        }

        this.game.addInitialPoint(point);

        if (this.game.detectMill(point)) {
            return GameMoveResult.MILL;
        }
        this.game.setNextPlayerMove();
        return GameMoveResult.SUCCESSFUL_MOVE;
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
        this.currentMove = { point, neighbours: this.game.possibleMoves(point), player: this.game.currentPlayer };
        this.game.setState(GameState.MOVE_SELECTED_POINT);
        return GameMoveResult.FIRST_MOVE_PART;
    }

    private makeFinalMovePart(point: Point): GameMoveResult {
        const pointToMove = this.currentMove.neighbours.find(p => arePointsEqual(p, point));

        if (!pointToMove) {
            this.currentMove = null;
            this.game.setState(GameState.SELECT_POINT_TO_MOVE);
            return GameMoveResult.RESTART_MOVE;
        }

        this.game.movePoint(this.currentMove.point, point);
        this.currentMove = null;
        if (this.game.detectMill(point)) {
            return GameMoveResult.MILL;
        }
        this.game.setNextPlayerMove();
        return GameMoveResult.SUCCESSFUL_MOVE;
    }

    private makeMillMove(point: Point): GameMoveResult {
        if (this.game.isOpponentPoint(point)) {
            this.game.removePoint(point);
            this.game.clearMill();
            this.game.setNextPlayerMove();
            return GameMoveResult.OPPONENT_DESTROYED;
        }
        return GameMoveResult.INVALID_MILL_MOVE;
    }
}

interface CurrentMove {
    point: Point;
    neighbours: Point[];
    player: Player;
}
