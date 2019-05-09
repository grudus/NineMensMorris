import { NineMensMorrisGame } from '../game/NineMensMorrisGame';
import { getPaintablePlayer } from './PaintablePlayer';
import { GameMoveResult } from '../game/GameMoveResult';
import { Player } from '../game/Player';

export class GameInfoWriter {
    private readonly currentPlayerText = document.getElementById('current-player-text');
    private readonly moveTypeText = document.getElementById('current-move-info');
    private readonly playerPoints = {
        [Player.PLAYER_1]: document.getElementById('player-1-points'),
        [Player.PLAYER_2]: document.getElementById('player-2-points'),
    };

    private readonly moveTypeToLabel = {
        [GameMoveResult.MILL]: 'Mill',
        [GameMoveResult.CANNOT_MOVE]: 'Cannot move',
        [GameMoveResult.FIRST_MOVE_PART]: 'First move',
        [GameMoveResult.RESTART_MOVE]: 'Restart',
        [GameMoveResult.SUCCESSFUL_MOVE]: 'Successful move',
        [GameMoveResult.INVALID_MILL_MOVE]: 'Invalid mill move',
        [GameMoveResult.OPPONENT_DESTROYED]: 'Opponent destroyed',
    };

    public constructor(private game: NineMensMorrisGame) {}

    public update(gameMoveResult?: GameMoveResult) {
        this.updateCurrentPlayerText();
        this.updateMoveInfo(gameMoveResult);
        this.updateHistoryMoves();
        this.updatePoints();
    }

    private updateCurrentPlayerText() {
        const paintablePlayer = getPaintablePlayer(this.game.currentPlayer);
        this.currentPlayerText.innerText = paintablePlayer.label;
        this.currentPlayerText.style.color = paintablePlayer.color;
    }

    private updateMoveInfo(gameMoveResult?: GameMoveResult) {
        this.moveTypeText.innerText = this.moveTypeToLabel[gameMoveResult] || 'None';
    }

    private updateHistoryMoves() {
        console.log(this.game.getMovesHistory());
    }

    private updatePoints() {
        Object.entries(this.game.playerPoints).forEach(([player, points]) => {
            this.playerPoints[player].innerText = points + '';
        });
    }
}
