import { Player } from '../../game/Player';
import { NineMensMorrisState } from '../../game/NineMensMorrisGame';

export interface GameHeuristic {
    calculateBoard(state: NineMensMorrisState, player: Player): number;
}
