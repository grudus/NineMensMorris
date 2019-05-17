import { NineMensMorrisGame } from './NineMensMorrisGame';
import { areCoordsEquals, Coordinate } from './Coordinate';
import { GameState } from './GameState';
import { GameMoveResult } from './GameMoveResult';
import { Player } from './Player';

export class GameMoveEngine {
    public constructor(private game: NineMensMorrisGame) {}

    public makeMove(point: Coordinate): GameMoveResult {
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

    private makeInitialMove(point: Coordinate) {
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

    private makeMoveInNormalPhase(point: Coordinate): GameMoveResult {
        if (!this.game.currentMove) {
            return this.makeFirstMovePart(point);
        }
        return this.makeFinalMovePart(point);
    }

    private makeFirstMovePart(point: Coordinate): GameMoveResult {
        const player = this.game.boardService.playerAt(point);
        if (!player || player !== this.game.currentPlayer) {
            return GameMoveResult.CANNOT_MOVE;
        }
        this.game.currentMove = { point, neighbours: this.game.possibleMoves(point), player: this.game.currentPlayer };
        this.game.setState(GameState.MOVE_SELECTED_POINT);
        return GameMoveResult.FIRST_MOVE_PART;
    }

    private makeFinalMovePart(point: Coordinate): GameMoveResult {
        const pointToMove = this.game.currentMove.neighbours.find(p => areCoordsEquals(p, point));

        if (!pointToMove) {
            this.game.currentMove = null;
            this.game.setState(GameState.SELECT_POINT_TO_MOVE);
            return GameMoveResult.RESTART_MOVE;
        }

        this.game.movePoint(this.game.currentMove.point, point);
        this.game.currentMove = null;

        if (this.game.detectMill(point)) {
            return GameMoveResult.MILL;
        }

        this.game.setNextPlayerMove();
        return GameMoveResult.SUCCESSFUL_MOVE;
    }

    private makeMillMove(point: Coordinate): GameMoveResult {
        if (this.game.isOpponentPoint(point)) {
            this.game.removePoint(point);
            this.game.clearMill();
            this.game.setNextPlayerMove();
            return GameMoveResult.OPPONENT_DESTROYED;
        }
        return GameMoveResult.INVALID_MILL_MOVE;
    }
}

export interface CurrentMove {
    point: Coordinate;
    neighbours: Coordinate[];
    player: Player;
}
