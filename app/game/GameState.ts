import { Player } from './Player';
import { Move } from './MovesHistory';
import { CurrentMove } from './CurrentMove';
import { GamePhase } from './GamePhase';

export interface GameState {
    initialHandQueue: Player[];
    currentPlayerMove: Player;
    millPlayer?: Player;
    gamePhase: GamePhase;
    prevPhase: GamePhase;
    playerPoints: { [Player.PLAYER_1]: number; [Player.PLAYER_2]: number };
    destroyedOpponents: { [Player.PLAYER_1]: number; [Player.PLAYER_2]: number };
    board: Map<number, Player>;
    history: Move[];
    currentMove?: CurrentMove;
    winner?: Player;
    movesWithoutMill: number;
}
