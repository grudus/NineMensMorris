import { nextPlayer, Player } from './Player';
import { areCoordsEquals, Coordinate } from './Coordinate';
import * as InitialGameHelper from './InitialGameHelper';
import { GameState } from './GameState';
import { GameMoveEngine } from './GameMoveEngine';
import { GameMoveResult } from './GameMoveResult';
import { MovesHistory } from './MovesHistory';
import { BoardService } from './BoardService';
import { GamePhase } from './GamePhase';
import { CurrentMove } from './CurrentMove';

const POINTS_TO_ENABLE_FLYING = 3;
const POINTS_TO_GAME_OVER = 2;

export class NineMensMorrisGame {
    public static readonly NUMBER_OF_POINTS = 9;
    public static readonly BOARD_SIZE = 7;
    public static readonly MOVES_WITHOUT_MILL_TO_GAME_OVER = 30;

    private gameMoveEngine: GameMoveEngine;
    private state: GameState = this.resetState();

    public constructor(private movesHistory: MovesHistory, public boardService: BoardService) {
        this.gameMoveEngine = new GameMoveEngine(this);
        this.boardService.resetBoard(this.state.board);
    }

    public resetState(state?: GameState): GameState {
        const newState = state || {
            initialHandQueue: InitialGameHelper.initHandQueue(),
            millPlayer: null,
            gamePhase: GamePhase.INITIAL,
            prevPhase: GamePhase.INITIAL,
            playerPoints: { [Player.PLAYER_1]: 0, [Player.PLAYER_2]: 0 },
            currentPlayerMove: Player.PLAYER_1,
            board: InitialGameHelper.initBoard(),
            history: [],
            destroyedOpponents: { [Player.PLAYER_1]: 0, [Player.PLAYER_2]: 0 },
            currentMove: null,
            winner: null,
            movesWithoutMill: 0,
        };
        this.state = this.clone(newState);
        this.boardService.resetBoard(this.state.board);
        this.movesHistory.resetHistory(this.state.history);
        return newState;
    }

    public getState(): GameState {
        return this.clone(this.state);
    }

    private clone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Map) {
            return new Map(obj);
        }
        const temp = obj.constructor(); // changed
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                obj['isActiveClone'] = null;
                temp[key] = this.clone(obj[key]);
                delete obj['isActiveClone'];
            }
        }
        return temp;
    }

    public addInitialPoint(coordinate: Coordinate) {
        if (this.state.initialHandQueue.length) {
            const player = this.boardService.playerAt(coordinate);
            const newPlayer = player === Player.NO_PLAYER ? this.state.currentPlayerMove : player;
            this.boardService.setPlayer(coordinate, newPlayer);
            this.state.playerPoints[this.currentPlayer]++;
            this.movesHistory.addInitialMove(coordinate, this.currentPlayer);
        } else throw Error('Initial hand queue is empty!');
    }

    public setNextPlayerMove() {
        if (this.state.initialHandQueue.length) {
            this.state.currentPlayerMove = this.state.initialHandQueue.pop();
            this.setPhase(this.state.initialHandQueue.length ? GamePhase.INITIAL : GamePhase.SELECT_POINT_TO_MOVE);
        } else {
            this.setPhase(GamePhase.SELECT_POINT_TO_MOVE);
            this.state.currentPlayerMove = nextPlayer(this.state.currentPlayerMove);
        }
    }

    public tryToMakeMove(coordinate: Coordinate): GameMoveResult {
        if (this.state.movesWithoutMill > NineMensMorrisGame.MOVES_WITHOUT_MILL_TO_GAME_OVER) {
            this.setGameOver(nextPlayer(this.currentPlayer));
            return GameMoveResult.CANNOT_MOVE_DUE_TO_GAME_END;
        }
        return this.gameMoveEngine.makeMove(coordinate);
    }

    public movePoint(from: Coordinate, to: Coordinate) {
        const fromPlayer = this.boardService.playerAt(from);
        const toPlayer = this.boardService.playerAt(to);

        this.state.movesWithoutMill++;

        if (toPlayer === Player.NO_PLAYER) {
            this.boardService.setPlayer(to, fromPlayer);
            this.boardService.setPlayer(from, Player.NO_PLAYER);

            this.movesHistory.addMove({ from, to, player: this.currentPlayer });
        }
    }

    public detectMill(changedCoordinate: Coordinate): boolean {
        const isMill = this.boardService.isCoordinatePartOfMill(changedCoordinate);
        this.state.millPlayer = isMill ? this.currentPlayer : null;
        if (isMill) {
            this.setPhase(GamePhase.MILL);
            this.state.movesWithoutMill = 0;
        }
        return isMill;
    }

    public isMill(): boolean {
        return this.state.millPlayer !== null;
    }

    public forEachBoardPosition(func: (coordinate: Coordinate, player: Player) => void) {
        this.boardService.forEach(func);
    }

    public isGameOver(): boolean {
        return this.state.gamePhase === GamePhase.GAME_OVER;
    }

    public isNoPlayer(coordinate: Coordinate): boolean {
        return this.boardService.playerAt(coordinate) === Player.NO_PLAYER;
    }

    public isOpponentPoint(point: Coordinate): boolean {
        const player = this.boardService.playerAt(point);
        return this.isOpponentPosition(player);
    }

    private isOpponentPosition(player: Player | null) {
        return player && player != Player.NO_PLAYER && player != this.currentPlayer;
    }

    public possibleMoves(coordinate: Coordinate): Coordinate[] {
        const previousCoordinate: Coordinate = this.movesHistory.getPreviousCoordinate(this.currentPlayer, coordinate);
        return this.findNeighbours(coordinate)
            .filter(p => this.isNoPlayer(p))
            .filter(p => !(previousCoordinate && areCoordsEquals(previousCoordinate, p)));
    }

    public allOpponentPositions(): Coordinate[] {
        return this.boardService.filterForCoordinates((player: Player) => this.isOpponentPosition(player));
    }

    public findNeighbours(coordinate: Coordinate): Coordinate[] {
        if (this.state.playerPoints[this.currentPlayer] === POINTS_TO_ENABLE_FLYING) {
            return this.boardService.findPlayerCoordinates(Player.NO_PLAYER);
        }
        return this.boardService.findNeighbours(coordinate);
    }

    public isFlyingActive(): boolean {
        return Object.values(this.state.playerPoints).some(points => points === POINTS_TO_ENABLE_FLYING);
    }

    public get currentPhase(): GamePhase {
        return this.state.gamePhase;
    }

    public setPhase(phase: GamePhase) {
        if (this.isGameOver()) return;
        if (phase !== GamePhase.MOVE_SELECTED_POINT) this.state.prevPhase = this.state.gamePhase;
        this.state.gamePhase = phase;
    }

    public get currentPlayer(): Player {
        return this.state.currentPlayerMove;
    }

    public findSelectableCoordinates(coordinate?: Coordinate): Coordinate[] {
        switch (this.currentPhase) {
            case GamePhase.INITIAL:
                return this.boardService.findPlayerCoordinates(Player.NO_PLAYER);
            case GamePhase.SELECT_POINT_TO_MOVE:
                const selectable = this.boardService.findPlayerCoordinates(this.currentPlayer);
                if (!selectable.length) {
                    this.setGameOver(nextPlayer(this.currentPlayer));
                }
                return selectable;
            case GamePhase.MILL:
                return this.allOpponentPositions();
            case GamePhase.MOVE_SELECTED_POINT:
                return this.possibleMoves(coordinate);
            case GamePhase.GAME_OVER:
                return [];
            default:
                return [];
        }
    }

    public removePoint(point: Coordinate) {
        const playerToRemove = this.boardService.playerAt(point);
        this.state.playerPoints[playerToRemove]--;
        this.state.destroyedOpponents[this.currentPlayer]++;
        this.boardService.setPlayer(point, Player.NO_PLAYER);

        if (!this.state.initialHandQueue.length && this.state.playerPoints[playerToRemove] <= POINTS_TO_GAME_OVER) {
            this.setGameOver(this.currentPlayer);
        }
    }

    public clearMill() {
        this.setPhase(this.state.prevPhase);
        this.state.millPlayer = null;
    }

    public set currentMove(move: CurrentMove) {
        this.state.currentMove = move;
    }

    public get currentMove(): CurrentMove {
        return this.state.currentMove;
    }

    private setGameOver(winner: Player) {
        this.setPhase(GamePhase.GAME_OVER);
        this.state.winner = winner;
    }
}
