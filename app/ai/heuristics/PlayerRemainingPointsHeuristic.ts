import { GameHeuristic } from './GameHeuristic';
import { nextPlayer, Player } from '../../game/Player';
import { GameState } from '../../game/GameState';
import { GamePhase } from '../../game/GamePhase';

export class PlayerRemainingPointsHeuristic implements GameHeuristic {
    public calculateBoard(state: GameState, player: Player): number {
        if (state.gamePhase === GamePhase.GAME_OVER) {
            return state.winner === player ? 10_000 : -10_000;
        }
        return state.destroyedOpponents[player] - state.destroyedOpponents[nextPlayer(player)];
    }

    public name() {
        return 'PLAYER_REMAINING';
    }
}
