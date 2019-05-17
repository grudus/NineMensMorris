import { nextPlayer, Player } from './Player';
import { BoardPosition } from './BoardPosition';
import { areCoordsEquals, Coordinate } from './Coordinate';
import * as InitialGameHelper from './InitialGameHelper';
import { GameState } from './GameState';
import { CurrentMove, GameMoveEngine } from './GameMoveEngine';
import { GameMoveResult } from './GameMoveResult';
import { Move, MovesHistory } from './MovesHistory';
import { BoardService } from './BoardService';

const POINTS_TO_ENABLE_FLYING = 3;
const POINTS_TO_GAME_OVER = 2;

export class NineMensMorrisGame {
    public static readonly NUMBER_OF_POINTS = 9;
    public static readonly BOARD_SIZE = 7;

    private gameMoveEngine: GameMoveEngine;
    private state: NineMensMorrisState = this.resetState();

    public constructor(private movesHistory: MovesHistory, public boardService: BoardService) {
        this.gameMoveEngine = new GameMoveEngine(this);
        this.boardService.resetBoard(this.state.board);
    }

    public resetState(state?: NineMensMorrisState): NineMensMorrisState {
        const newState = state || {
            initialHandQueue: InitialGameHelper.initHandQueue(),
            millPlayer: null,
            gameState: GameState.INITIAL,
            prevState: GameState.INITIAL,
            playerPoints: { [Player.PLAYER_1]: 0, [Player.PLAYER_2]: 0 },
            currentPlayerMove: Player.PLAYER_1,
            board: InitialGameHelper.initBoard(),
            history: [],
            destroyedOpponents: { [Player.PLAYER_1]: 0, [Player.PLAYER_2]: 0 },
            currentMove: null,
        };
        this.state = this.clone(newState);
        this.boardService.resetBoard(this.state.board);
        this.movesHistory.resetHistory(this.state.history);
        return newState;
    }

    public getState(): NineMensMorrisState {
        return this.clone(this.state);
    }

    private clone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
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
            const position = this.boardService.position(coordinate);
            position.player = position.player === Player.NO_PLAYER ? this.state.currentPlayerMove : position.player;
            this.state.playerPoints[this.currentPlayer]++;
            this.movesHistory.addInitialMove(coordinate, this.currentPlayer);
        } else throw Error('Initial hand queue is empty!');
    }

    public setNextPlayerMove() {
        if (this.state.initialHandQueue.length) {
            this.state.currentPlayerMove = this.state.initialHandQueue.pop();
            this.setState(this.state.initialHandQueue.length ? GameState.INITIAL : GameState.SELECT_POINT_TO_MOVE);
        } else {
            this.setState(GameState.SELECT_POINT_TO_MOVE);
            this.state.currentPlayerMove = nextPlayer(this.state.currentPlayerMove);
        }
    }

    public tryToMakeMove(coordinate: Coordinate): GameMoveResult {
        return this.gameMoveEngine.makeMove(coordinate);
    }

    public movePoint(from: Coordinate, to: Coordinate) {
        const fromPosition = this.boardService.position(from);
        const toPosition = this.boardService.position(to);

        if (toPosition.player === Player.NO_PLAYER) {
            toPosition.player = fromPosition.player;
            fromPosition.player = Player.NO_PLAYER;

            this.movesHistory.addMove({ from, to, player: this.currentPlayer });
        }
    }

    public detectMill(changedCoordinate: Coordinate): boolean {
        const { colsInLine, rowsInLine } = this.boardService.findColsAndRowsInLine(changedCoordinate);

        const checkMill = (inLineArray: BoardPosition[], coordinate: Coordinate): boolean => {
            const inLineIndex = inLineArray.findIndex(p => areCoordsEquals(p.coordinate, coordinate));
            for (let i = 0; i < inLineArray.length; i += 3) {
                if (inLineIndex >= i && inLineIndex < i + 3) {
                    const currPlayer = inLineArray[inLineIndex].player;
                    let millCount = 0;
                    for (let j = 0; j < 3; j++) {
                        if (currPlayer == inLineArray[i + j].player) millCount++;
                    }
                    if (millCount == 3) return true;
                }
            }
            return false;
        };

        const isMill = checkMill(colsInLine, changedCoordinate) || checkMill(rowsInLine, changedCoordinate);
        this.state.millPlayer = isMill ? this.currentPlayer : null;
        if (isMill) {
            this.setState(GameState.MILL);
        }
        return isMill;
    }

    public isMill(): boolean {
        return this.state.millPlayer !== null;
    }

    public forEachBoardPosition(func: (pos: BoardPosition) => void) {
        this.boardService.forEach(func);
    }

    public isGameOver(): boolean {
        return this.state.gameState === GameState.GAME_OVER;
    }

    public isNoPlayer(coordinate: Coordinate): boolean {
        const triedPosition: BoardPosition = this.boardService.position(coordinate);
        return triedPosition.player == Player.NO_PLAYER;
    }

    public isOpponentPoint(point: Coordinate): boolean {
        const position = this.boardService.position(point);
        return this.isOpponentPosition(position);
    }

    private isOpponentPosition(position) {
        return position && position.player != Player.NO_PLAYER && position.player != this.currentPlayer;
    }

    public possibleMoves(coordinate: Coordinate): Coordinate[] {
        const previousCoordinate: Coordinate = this.movesHistory.getPreviousCoordinate(this.currentPlayer, coordinate);
        return this.findNeighbours(coordinate)
            .filter(p => this.isNoPlayer(p))
            .filter(p => !(previousCoordinate && areCoordsEquals(previousCoordinate, p)));
    }

    public allOpponentPositions(): BoardPosition[] {
        return this.boardService.filter((position: BoardPosition) => this.isOpponentPosition(position));
    }

    public findNeighbours(coordinate: Coordinate): Coordinate[] {
        if (this.state.playerPoints[this.currentPlayer] === POINTS_TO_ENABLE_FLYING) {
            return this.boardService.findPlayerCoordinates(Player.NO_PLAYER);
        }
        return this.boardService.findNeighbours(coordinate);
    }

    public get currentState(): GameState {
        return this.state.gameState;
    }

    public setState(state: GameState) {
        if (this.isGameOver()) return;
        if (state !== GameState.MOVE_SELECTED_POINT) this.state.prevState = this.state.gameState;
        this.state.gameState = state;
    }

    public get currentPlayer(): Player {
        return this.state.currentPlayerMove;
    }

    public findSelectableCoordinates(coordinate?: Coordinate): Coordinate[] {
        switch (this.currentState) {
            case GameState.INITIAL:
                return this.boardService.findPlayerCoordinates(Player.NO_PLAYER);
            case GameState.SELECT_POINT_TO_MOVE:
                return this.boardService.findPlayerCoordinates(this.currentPlayer);
            case GameState.MILL:
                return this.allOpponentPositions().map(p => p.coordinate);
            case GameState.MOVE_SELECTED_POINT:
                return this.possibleMoves(coordinate);
            default:
                return [];
        }
    }

    public removePoint(point: Coordinate) {
        const boardPosition = this.boardService.position(point);
        this.state.playerPoints[boardPosition.player]--;
        this.state.destroyedOpponents[this.currentPlayer]++;
        boardPosition.player = Player.NO_PLAYER;

        if (Object.values(this.state.playerPoints).some(points => points === POINTS_TO_GAME_OVER)) {
            this.setState(GameState.GAME_OVER);
        }
    }

    public clearMill() {
        this.setState(this.state.prevState);
        this.state.millPlayer = null;
    }

    public set currentMove(move: CurrentMove) {
        this.state.currentMove = move;
    }

    public get currentMove(): CurrentMove {
        return this.state.currentMove;
    }
}

export interface NineMensMorrisState {
    initialHandQueue: Player[];
    currentPlayerMove: Player;
    millPlayer?: Player;
    gameState: GameState;
    prevState: GameState;
    playerPoints: { [Player.PLAYER_1]: number; [Player.PLAYER_2]: number };
    destroyedOpponents: { [Player.PLAYER_1]: number; [Player.PLAYER_2]: number };
    board: BoardPosition[];
    history: Move[];
    currentMove?: CurrentMove;
}
