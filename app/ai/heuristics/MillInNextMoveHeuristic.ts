import { GameHeuristic } from './GameHeuristic';
import { GameState } from '../../game/GameState';
import { nextPlayer, Player } from '../../game/Player';
import { BoardService } from '../../game/BoardService';
import { GamePhase } from '../../game/GamePhase';
import { Coordinate } from '../../game/Coordinate';

export class MillInNextMoveHeuristic implements GameHeuristic {
    public constructor(private boardService: BoardService, private millPointsFactor = 10) {}

    public calculateBoard(state: GameState, player: Player): number {
        if (state.gamePhase === GamePhase.GAME_OVER) {
            console.log("GAME OVER", state.winner);
            return state.winner === player ? 10_000 : -10_000;
        }
        const opponentPlayer = nextPlayer(player);
        const millPoints =
            this.millPointsFactor * (state.destroyedOpponents[player] - state.destroyedOpponents[nextPlayer(player)]);

        const millCheckPositions: [number, Coordinate[][]][] = [...this.boardService.millCheckPositions.entries()];

        let additionalPoints = 0;

        for (const [coordinateHash, millCheckCoords] of millCheckPositions) {
            const player = this.boardService.playerAtHash(coordinateHash);

            if (player !== Player.NO_PLAYER) continue;

            const millCheckPlayers: Player[] = [].concat(...millCheckCoords).map(_c => this.boardService.playerAt(_c));

            const mensPerPlayer = [player, ...millCheckPlayers].reduce((acc, curr) => {
                acc[curr] = acc[curr] ? acc[curr] + 1 : 1;
                return acc;
            }, {});

            if (mensPerPlayer[Player.NO_PLAYER] === 2) {
                if (mensPerPlayer[player] === 3) additionalPoints++;
                else if (mensPerPlayer[opponentPlayer] === 3) additionalPoints--;
            }
        }

        return millPoints + additionalPoints;
    }
}
