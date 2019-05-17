import { areCoordsEquals, Coordinate } from './Coordinate';
import { Player } from './Player';

export class MovesHistory {
    private history: Move[] = [];

    public addMove(move: Move) {
        this.history.push(move);
    }

    public getHistory(): Move[] {
        return this.history;
    }

    public resetHistory(history: Move[]) {
        this.history = history;
    }

    public addInitialMove(coordinate: Coordinate, player: Player) {
        this.addMove({ to: coordinate, player });
    }

    public getPreviousCoordinate(player: Player, coordinate: Coordinate): Coordinate | null {
        for (let i = this.history.length - 1; i >= 0; i--) {
            if (this.history[i].player === player) {
                return areCoordsEquals(this.history[i].to, coordinate) ? this.history[i].from : null;
            }
        }
        return null;
    }
}

export interface Move {
    from?: Coordinate;
    to: Coordinate;
    player: Player;
}
