import { nextPlayer, Player } from './Player';
import { BoardPosition } from './BoardPosition';
import { arePointsEqual, Point } from './Point';
import * as InitialGameHelper from './InitialGameHelper';
import { GameState } from './GameState';
import { GameMoveEngine } from './GameMoveEngine';
import { GameMoveResult } from './GameMoveResult';
import { Move, MovesHistory } from './MovesHistory';

const POINTS_TO_ENABLE_FLYING = 3;
const POINTS_TO_GAME_OVER = 2;

export class NineMensMorrisGame {
    public static readonly NUMBER_OF_POINTS = 9;
    public static readonly BOARD_SIZE = 7;
    public readonly board: BoardPosition[];

    private initialHandQueue: Player[];
    private currentPlayerMove = Player.PLAYER_1;
    private gameMoveEngine: GameMoveEngine;
    private millPlayer?: Player = null;
    private gameState: GameState = GameState.INITIAL;
    private prevState: GameState = GameState.INITIAL;
    public readonly playerPoints = { [Player.PLAYER_1]: 0, [Player.PLAYER_2]: 0 };

    private cannotGoPoints = [
        { from: { row: 4, col: 'c' }, to: { row: 4, col: 'e' } },
        { from: { row: 3, col: 'd' }, to: { row: 5, col: 'd' } },
    ];

    public constructor(private movesHistory: MovesHistory) {
        this.gameMoveEngine = new GameMoveEngine(this);
        this.initialHandQueue = InitialGameHelper.initHandQueue();
        this.board = InitialGameHelper.initBoard();
    }

    public addInitialPoint(point: Point) {
        if (this.initialHandQueue.length) {
            const position = this.board.find(p => arePointsEqual(p.point, point));
            position.player = position.player === Player.NO_PLAYER ? this.currentPlayerMove : position.player;
            this.playerPoints[this.currentPlayer]++;
            this.movesHistory.addInitialMove(point, this.currentPlayer);
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

    public tryToMakeMove(point: Point): GameMoveResult {
        return this.gameMoveEngine.makeMove(point);
    }

    public movePoint(from: Point, to: Point) {
        const fromPosition = this.board.find(p => arePointsEqual(p.point, from));
        const toPosition = this.board.find(p => arePointsEqual(p.point, to));

        if (toPosition.player === Player.NO_PLAYER) {
            toPosition.player = fromPosition.player;
            fromPosition.player = Player.NO_PLAYER;

            this.movesHistory.addMove({ from, to, player: this.currentPlayer });
        }
    }

    public detectMill(changedPoint: Point): boolean {
        const { colsInLine, rowsInLine } = this.findColsAndRowsInLine(changedPoint);

        const checkMill = (inLineArray: BoardPosition[], point: Point): boolean => {
            const inLineIndex = inLineArray.findIndex(p => arePointsEqual(p.point, point));
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

        const isMill = checkMill(colsInLine, changedPoint) || checkMill(rowsInLine, changedPoint);
        this.millPlayer = isMill ? this.currentPlayer : null;
        if (isMill) {
            this.setState(GameState.MILL);
        }
        return isMill;
    }

    public isMill(): boolean {
        return this.millPlayer !== null;
    }

    public isGameOver(): boolean {
        return this.gameState === GameState.GAME_OVER;
    }

    public isNoPlayer(point: Point): boolean {
        const triedPosition: BoardPosition = this.findPosition(point);
        return triedPosition && triedPosition.player == Player.NO_PLAYER;
    }

    public findPosition(point: Point): BoardPosition {
        return this.board.find(p => arePointsEqual(p.point, point));
    }

    public isOpponentPoint(point: Point): boolean {
        const position = this.findPosition(point);
        return this.isOpponentPosition(position);
    }

    private isOpponentPosition(position) {
        return position && position.player != Player.NO_PLAYER && position.player != this.currentPlayer;
    }

    public possibleMoves(point: Point): Point[] {
        const previousPoint: Point = this.movesHistory.getPreviousPoint(point);
        return this.findNeighbours(point)
            .filter(p => this.isNoPlayer(p))
            .filter(p => !(previousPoint && arePointsEqual(previousPoint, p)));
    }

    public allOpponentPositions(): BoardPosition[] {
        return this.board.filter((position: BoardPosition) => this.isOpponentPosition(position));
    }

    public findNeighbours(point: Point): Point[] {
        if (this.playerPoints[this.currentPlayer] === POINTS_TO_ENABLE_FLYING) {
            return this.board.filter(p => p.player === Player.NO_PLAYER).map(p => p.point);
        }
        const { colsInLine, rowsInLine } = this.findColsAndRowsInLine(point);
        const neighbours: Point[] = this.findNearestPoints(point, colsInLine, rowsInLine);
        this.filterNeighboursImpossibleToGo(point, neighbours);

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

    private findColsAndRowsInLine(point: Point): FindInLinePointsResults {
        return this.board.reduce(
            (acc, curr) => {
                if (arePointsEqual(curr.point, point)) {
                    acc.rowsInLine.push(curr);
                    acc.colsInLine.push(curr);
                } else if (curr.point.colIndex === point.colIndex) {
                    acc.colsInLine.push(curr);
                } else if (curr.point.row === point.row) {
                    acc.rowsInLine.push(curr);
                }
                return acc;
            },
            { colsInLine: [], rowsInLine: [] },
        );
    }

    private findNearestPoints(point: Point, colsInLine: BoardPosition[], rowsInLine: BoardPosition[]): Point[] {
        const sameColumnsIndex = colsInLine.findIndex(p => arePointsEqual(p.point, point));
        const sameRowsIndex = rowsInLine.findIndex(p => arePointsEqual(p.point, point));

        return [
            colsInLine[sameColumnsIndex + 1],
            colsInLine[sameColumnsIndex - 1],
            rowsInLine[sameRowsIndex + 1],
            rowsInLine[sameRowsIndex - 1],
        ]
            .filter(x => x)
            .map(p => p.point);
    }

    private filterNeighboursImpossibleToGo(point: Point, neighbours: Point[]) {
        this.cannotGoPoints.forEach(({ from, to }) => {
            if (arePointsEqual(point, from)) {
                const i = neighbours.findIndex(p => arePointsEqual(p, to));
                neighbours.splice(i, 1);
            } else if (arePointsEqual(point, to)) {
                const i = neighbours.findIndex(p => arePointsEqual(p, from));
                neighbours.splice(i, 1);
            }
        });
    }

    public findSelectablePoints(point?: Point): Point[] {
        switch (this.currentState) {
            case GameState.INITIAL:
                return this.board.filter(p => p.player === Player.NO_PLAYER).map(p => p.point);
            case GameState.SELECT_POINT_TO_MOVE:
                return this.board.filter(p => p.player === this.currentPlayer).map(p => p.point);
            case GameState.MILL:
                return this.allOpponentPositions().map(p => p.point);
            case GameState.MOVE_SELECTED_POINT:
                return this.possibleMoves(point);
            default:
                return [];
        }
    }

    public removePoint(point: Point) {
        const boardPosition = this.findPosition(point);
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

interface FindInLinePointsResults {
    colsInLine: BoardPosition[];
    rowsInLine: BoardPosition[];
}
