import { initBoard } from './InitialGameHelper';
import { coord, Coordinate, fromHash, hash } from './Coordinate';
import { Player } from './Player';

export class BoardService {
    private readonly neighbours: Map<number, Coordinate[]> = this.initNeighbours();
    public readonly millCheckPositions: Map<number, Coordinate[][]> = this.initMillCheckPositions();

    public constructor(private board: Map<number, Player> = initBoard()) {}

    public resetBoard(board = initBoard()) {
        this.board = board;
    }

    public playerAt(coordinate: Coordinate): Player | null {
        return this.playerAtHash(hash(coordinate));
    }

    public playerAtHash(hash: number): Player | null {
        return this.board.get(hash);
    }

    public setPlayer(coordinate: Coordinate, player: Player) {
        this.board.set(hash(coordinate), player);
    }

    public filterForCoordinates(predicate: (player: Player) => boolean): Coordinate[] {
        const result = [];
        this.forEach((coord, player) => {
            if (predicate(player)) result.push(coord);
        });
        return result;
    }

    public findPlayerCoordinates(player: Player): Coordinate[] {
        return this.filterForCoordinates(_player => _player === player);
    }

    public isCoordinatePartOfMill(coordinate: Coordinate): boolean {
        const coordPlayer: Player = this.playerAt(coordinate);
        const millCoordsToCheck: Coordinate[][] = this.millCheckPositions.get(hash(coordinate));

        return millCoordsToCheck.some(coords => coords.every(_coord => this.playerAt(_coord) === coordPlayer));
    }

    public forEach(func: (coordinate: Coordinate, player: Player) => void) {
        this.board.forEach((player, hash) => {
            func(fromHash(hash), player);
        });
    }

    public findNeighbours(coordinate: Coordinate): Coordinate[] {
        return this.neighbours.get(hash(coordinate));
    }

    private initNeighbours(): Map<number, Coordinate[]> {
        return new Map([
            [hash(coord(1, 1)), [coord(1, 4), coord(4, 1)]],
            [hash(coord(1, 4)), [coord(1, 1), coord(1, 7), coord(2, 4)]],
            [hash(coord(1, 7)), [coord(1, 4), coord(4, 7)]],
            [hash(coord(2, 2)), [coord(2, 4), coord(4, 2)]],
            [hash(coord(2, 4)), [coord(1, 4), coord(2, 6), coord(3, 4), coord(2, 2)]],
            [hash(coord(2, 6)), [coord(2, 4), coord(4, 6)]],
            [hash(coord(3, 3)), [coord(3, 4), coord(4, 3)]],
            [hash(coord(3, 4)), [coord(3, 3), coord(2, 4), coord(3, 5)]],
            [hash(coord(3, 5)), [coord(3, 4), coord(4, 5)]],
            [hash(coord(4, 1)), [coord(1, 1), coord(4, 2), coord(7, 1)]],
            [hash(coord(4, 2)), [coord(4, 1), coord(2, 2), coord(6, 2), coord(4, 3)]],
            [hash(coord(4, 3)), [coord(4, 2), coord(3, 3), coord(5, 3)]],
            [hash(coord(4, 5)), [coord(3, 5), coord(5, 5), coord(4, 6)]],
            [hash(coord(4, 6)), [coord(4, 5), coord(2, 6), coord(4, 7), coord(6, 6)]],
            [hash(coord(4, 7)), [coord(4, 6), coord(1, 7), coord(7, 7)]],
            [hash(coord(5, 3)), [coord(4, 3), coord(5, 4)]],
            [hash(coord(5, 4)), [coord(5, 3), coord(5, 5), coord(6, 4)]],
            [hash(coord(5, 5)), [coord(5, 4), coord(4, 5)]],
            [hash(coord(6, 2)), [coord(4, 2), coord(6, 4)]],
            [hash(coord(6, 4)), [coord(6, 2), coord(5, 4), coord(6, 6), coord(7, 4)]],
            [hash(coord(6, 6)), [coord(6, 4), coord(4, 6)]],
            [hash(coord(7, 1)), [coord(4, 1), coord(7, 4)]],
            [hash(coord(7, 4)), [coord(7, 1), coord(6, 4), coord(7, 7)]],
            [hash(coord(7, 7)), [coord(7, 4), coord(4, 7)]],
        ]);
    }

    private initMillCheckPositions(): Map<number, Coordinate[][]> {
        return new Map([
            [hash(coord(1, 1)), [[coord(4, 1), coord(7, 1)], [coord(1, 4), coord(1, 7)]]],
            [hash(coord(1, 4)), [[coord(2, 4), coord(3, 4)], [coord(1, 1), coord(1, 7)]]],
            [hash(coord(1, 7)), [[coord(4, 7), coord(7, 7)], [coord(1, 1), coord(1, 4)]]],
            [hash(coord(2, 2)), [[coord(2, 4), coord(2, 6)], [coord(4, 2), coord(6, 2)]]],
            [hash(coord(2, 4)), [[coord(1, 4), coord(3, 4)], [coord(2, 2), coord(2, 6)]]],
            [hash(coord(2, 6)), [[coord(2, 2), coord(2, 4)], [coord(4, 6), coord(6, 6)]]],
            [hash(coord(3, 3)), [[coord(3, 4), coord(3, 5)], [coord(4, 3), coord(5, 3)]]],
            [hash(coord(3, 4)), [[coord(1, 4), coord(2, 4)], [coord(3, 3), coord(3, 5)]]],
            [hash(coord(3, 5)), [[coord(3, 3), coord(3, 4)], [coord(4, 5), coord(5, 5)]]],
            [hash(coord(4, 1)), [[coord(4, 2), coord(4, 3)], [coord(1, 1), coord(7, 1)]]],
            [hash(coord(4, 2)), [[coord(2, 2), coord(6, 2)], [coord(4, 1), coord(4, 3)]]],
            [hash(coord(4, 3)), [[coord(3, 3), coord(5, 3)], [coord(4, 1), coord(4, 2)]]],
            [hash(coord(4, 5)), [[coord(3, 5), coord(5, 5)], [coord(4, 6), coord(4, 7)]]],
            [hash(coord(4, 6)), [[coord(2, 6), coord(6, 6)], [coord(4, 5), coord(4, 7)]]],
            [hash(coord(4, 7)), [[coord(1, 7), coord(7, 7)], [coord(4, 5), coord(4, 6)]]],
            [hash(coord(5, 3)), [[coord(3, 3), coord(4, 3)], [coord(5, 4), coord(5, 5)]]],
            [hash(coord(5, 4)), [[coord(5, 3), coord(5, 5)], [coord(6, 4), coord(7, 4)]]],
            [hash(coord(5, 5)), [[coord(5, 3), coord(5, 4)], [coord(2, 6), coord(4, 6)]]],
            [hash(coord(6, 2)), [[coord(2, 2), coord(4, 2)], [coord(6, 4), coord(6, 6)]]],
            [hash(coord(6, 4)), [[coord(6, 2), coord(6, 6)], [coord(5, 4), coord(7, 4)]]],
            [hash(coord(6, 6)), [[coord(2, 6), coord(4, 6)], [coord(6, 2), coord(6, 4)]]],
            [hash(coord(7, 1)), [[coord(1, 1), coord(4, 1)], [coord(7, 4), coord(7, 7)]]],
            [hash(coord(7, 4)), [[coord(7, 1), coord(7, 7)], [coord(6, 4), coord(5, 4)]]],
            [hash(coord(7, 7)), [[coord(7, 1), coord(7, 4)], [coord(1, 7), coord(4, 7)]]],
        ]);
    }
}
