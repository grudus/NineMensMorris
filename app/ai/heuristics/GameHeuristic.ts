import { Player } from '../../game/Player';
import { GameState } from '../../game/GameState';

export interface GameHeuristic {
    calculateBoard(state: GameState, player: Player): number;
    name(): string;
}
