import { GameHeuristic } from './GameHeuristic';
import { nextPlayer, Player } from '../../game/Player';
import { GameState } from '../../game/GameState';

export class PlayerRemainingPointsHeuristic implements GameHeuristic {
    public calculateBoard(state: GameState, player: Player): number {
        return state.destroyedOpponents[player] - state.destroyedOpponents[nextPlayer(player)];
    }
}
