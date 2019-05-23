import { GameHeuristic } from './GameHeuristic';
import { GameState } from '../../game/GameState';
import { nextPlayer, Player } from '../../game/Player';
import { BoardService } from '../../game/BoardService';
import { Coordinate } from '../../game/Coordinate';
import { GamePhase } from '../../game/GamePhase';

export class AlmostMillHeuristic implements GameHeuristic {
    private readonly millPointsFactor = 10;

    public constructor(private boardService: BoardService) {}

    public calculateBoard(state: GameState, player: Player): number {
        if (state.gamePhase === GamePhase.GAME_OVER) {
            return state.winner === player ? 10_000 : -10_000;
        }
        const millPoints =
            this.millPointsFactor * (state.destroyedOpponents[player] - state.destroyedOpponents[nextPlayer(player)]);

        let almostMillPoints = 0;

        const millCheckPositions: [number, Coordinate[][]][] = [...this.boardService.millCheckPositions.entries()];

        for (const [coordinateHash, millCheckCoords] of millCheckPositions) {
            const player = this.boardService.playerAtHash(coordinateHash);

            if (player !== Player.NO_PLAYER) {
                continue;
            }

            for (const millCoords of millCheckCoords) {
                const almostMillPlayer = millCoords.map(_c => this.boardService.playerAt(_c));

                if (almostMillPlayer[0] === almostMillPlayer[1]) {
                    almostMillPoints += almostMillPlayer[0] === player ? 1 : -1;
                }
            }
        }
        return millPoints + almostMillPoints;
    }
}
