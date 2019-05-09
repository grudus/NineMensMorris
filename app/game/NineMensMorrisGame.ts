import { nextPlayer, Player } from './Player';
import { BoardPosition } from './BoardPosition';
import { areCoordsEquals, Coordinate } from './Coordinate';
import * as InitialGameHelper from './InitialGameHelper';
import { GameState } from './GameState';
import { GameMoveEngine } from './GameMoveEngine';
import { GameMoveResult } from './GameMoveResult';
import { Move, MovesHistory } from './MovesHistory';
import { BoardService } from './BoardService';

const POINTS_TO_ENABLE_FLYING = 3;
const POINTS_TO_GAME_OVER = 2;

export class NineMensMorrisGame {
    public static readonly NUMBER_OF_POINTS = 9;
    public static readonly BOARD_SIZE = 7;

    private initialHandQueue: Player[];
    private currentPlayerMove = Player.PLAYER_1;
    private gameMoveEngine: GameMoveEngine;
    private millPlayer?: Player = null;
    private gameState: GameState = GameState.INITIAL;
    private prevState: GameState = GameState.INITIAL;
    public readonly playerPoints = { [Player.PLAYER_1]: 0, [Player.PLAYER_2]: 0 };

    private cannotGoCoordinates = [
        { from: { row: 4, col: 'c' }, to: { row: 4, col: 'e' } },
        { from: { row: 3, col: 'd' }, to: { row: 5, col: 'd' } },
    ];

    public constructor(private movesHistory: MovesHistory, public boardService: BoardService) {
        this.gameMoveEngine = new GameMoveEngine(this);
        this.initialHandQueue = InitialGameHelper.initHandQueue();
    }

    public addInitialPoint(coordinate: Coordinate) {
        if (this.initialHandQueue.length) {
            const position = this.boardService.position(coordinate);
            position.player = position.player === Player.NO_PLAYER ? this.currentPlayerMove : position.player;
            this.playerPoints[this.currentPlayer]++;
            this.movesHistory.addInitialMove(coordinate, this.currentPlayer);
        } else throw Error('Initial hand queue is empty!');
    }

    public setNextPlayerMove() {
        if (this.initialHandQueue.length) {
            this.currentPlayerMove = this.initialHandQueue.pop();
            this.setState(this.initialHandQueue.length ? GameState.INITIAL : GameState.SELECT_POINT_TO_MOVE);
        } else {
            this.setState(GameState.SELECT_POINT_TO_MOVE);
            this.currentPlayerMove = nextPlayer(this.currentPlayerMove);
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
        this.millPlayer = isMill ? this.currentPlayer : null;
        if (isMill) {
            this.setState(GameState.MILL);
        }
        return isMill;
    }

    public isMill(): boolean {
        return this.millPlayer !== null;
    }

    public forEachBoardPosition(func: (pos: BoardPosition) => void) {
        this.boardService.forEach(func);
    }

    public isGameOver(): boolean {
        return this.gameState === GameState.GAME_OVER;
    }

    public isNoPlayer(coordinate: Coordinate): boolean {
        const triedPosition: BoardPosition = this.boardService.position(coordinate);
        return triedPosition && triedPosition.player == Player.NO_PLAYER;
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
        if (this.playerPoints[this.currentPlayer] === POINTS_TO_ENABLE_FLYING) {
            return this.boardService.findPlayerCoordinates(Player.NO_PLAYER);
        }
        const { colsInLine, rowsInLine } = this.boardService.findColsAndRowsInLine(coordinate);
        const neighbours: Coordinate[] = this.findNearestPoints(coordinate, colsInLine, rowsInLine);
        this.filterNeighboursImpossibleToGo(coordinate, neighbours);

        return neighbours;
    }

    public get currentState(): GameState {
        return this.gameState;
    }

    public setState(state: GameState) {
        if (this.isGameOver()) return;
        this.prevState = this.gameState;
        this.gameState = state;
    }

    public get currentPlayer(): Player {
        return this.currentPlayerMove;
    }

    private findNearestPoints(
        coordinate: Coordinate,
        colsInLine: BoardPosition[],
        rowsInLine: BoardPosition[],
    ): Coordinate[] {
        const sameColumnsIndex = colsInLine.findIndex(p => areCoordsEquals(p.coordinate, coordinate));
        const sameRowsIndex = rowsInLine.findIndex(p => areCoordsEquals(p.coordinate, coordinate));

        return [
            colsInLine[sameColumnsIndex + 1],
            colsInLine[sameColumnsIndex - 1],
            rowsInLine[sameRowsIndex + 1],
            rowsInLine[sameRowsIndex - 1],
        ]
            .filter(x => x)
            .map(p => p.coordinate);
    }

    private filterNeighboursImpossibleToGo(coordinate: Coordinate, neighbours: Coordinate[]) {
        this.cannotGoCoordinates.forEach(({ from, to }) => {
            if (areCoordsEquals(coordinate, from)) {
                const i = neighbours.findIndex(p => areCoordsEquals(p, to));
                neighbours.splice(i, 1);
            } else if (areCoordsEquals(coordinate, to)) {
                const i = neighbours.findIndex(p => areCoordsEquals(p, from));
                neighbours.splice(i, 1);
            }
        });
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
                return [
                    ...this.possibleMoves(coordinate),
                    ...this.boardService.findPlayerCoordinates(this.currentPlayer),
                ];
            default:
                return [];
        }
    }

    public removePoint(point: Coordinate) {
        const boardPosition = this.boardService.position(point);
        this.playerPoints[boardPosition.player]--;
        boardPosition.player = Player.NO_PLAYER;

        if (Object.values(this.playerPoints).some(points => points === POINTS_TO_GAME_OVER)) {
            this.setState(GameState.GAME_OVER);
        }
    }

    public clearMill() {
        this.setState(this.prevState);
        this.millPlayer = null;
    }

    public getMovesHistory(): Move[] {
        return this.movesHistory.getHistory();
    }
}
