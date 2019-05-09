import { NineMensMorrisGame } from '../game/NineMensMorrisGame';
import { getPaintablePlayer } from './PaintablePlayer';
import { GameMoveResult } from '../game/GameMoveResult';

export class GameInfoWriter {
    private readonly currentPlayerText = document.getElementById('current-player-text');
    private readonly moveTypeText = document.getElementById('current-move-info');

    private readonly moveTypeToLabel = {
        [GameMoveResult.MILL]: 'Mill',
        [GameMoveResult.CANNOT_MOVE]: 'Cannot move',
        [GameMoveResult.FIRST_MOVE_PART]: 'First move',
        [GameMoveResult.RESTART_MOVE]: 'Restart',
        [GameMoveResult.SUCCESSFULL_MOVE]: 'Successfull move',
        [GameMoveResult.INVALID_MILL_MOVE]: 'Invalid mill move',
        [GameMoveResult.OPPONENT_DESTROYED]: 'Opponent destroyed',
    };

    public constructor(private game: NineMensMorrisGame) {}

    public update(gameMoveResult?: GameMoveResult) {
        this.updateCurrentPlayerText();
        this.updateMoveInfo(gameMoveResult);
        this.updateHistoryMoves();
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
}
