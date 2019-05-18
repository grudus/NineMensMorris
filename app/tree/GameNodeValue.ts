import { Coordinate } from '../game/Coordinate';

export interface GameNodeValue {
    evaluation: number;
    movesToValidState: Coordinate[];
}
