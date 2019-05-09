import { Coordinate } from './Coordinate';
import { Player } from './Player';

export interface BoardPosition {
    coordinate: Coordinate;
    player: Player;
}
