import { GameHeuristic } from './GameHeuristic';
import { nextPlayer, Player } from '../../game/Player';
import { NineMensMorrisState } from '../../game/NineMensMorrisGame';

export class PlayerRemainingPointsHeuristic implements GameHeuristic {
    public calculateBoard(state: NineMensMorrisState, player: Player): number {
        return state.destroyedOpponents[player] - state.destroyedOpponents[nextPlayer(player)];
    }
}
