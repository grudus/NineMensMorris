import { arePointsEqual, Point } from './Point';
import { Player } from './Player';

export class MovesHistory {
    private history: Move[] = [];

    public addMove(move: Move) {
        this.history.push(move);
    }

    public addInitialMove(point: Point, player: Player) {
        this.addMove({ to: point, player });
    }

    public getHistory(): Move[] {
        return this.history;
    }

    public getPreviousPoint(point: Point): Point | null {
        for (let i = this.history.length - 1; i >= 0; i--) {
            if (arePointsEqual(this.history[i].to, point)) return this.history[i].from;
        }
        return null;
    }
}

export interface Move {
    from?: Point;
    to: Point;
    player: Player;
}
