import { Coordinate } from '../game/Coordinate';

export interface GameNodeValue {
    evaluation: number;
    move: Coordinate;
    nextMoves?: Coordinate[];
    validMove: boolean;
}
