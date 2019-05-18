import { Coordinate } from './Coordinate';
import { Player } from './Player';

export interface CurrentMove {
    point: Coordinate;
    neighbours: Coordinate[];
    player: Player;
}
