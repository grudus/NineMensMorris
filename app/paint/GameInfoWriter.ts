import { NineMensMorrisGame } from '../game/NineMensMorrisGame';
import { getPaintablePlayer } from './PaintablePlayer';
import { Player } from '../game/Player';
import { GamePhase } from '../game/GamePhase';

export class GameInfoWriter {
    private readonly currentPlayerText = document.getElementById('current-player-text');
    private readonly moveTypeText = document.getElementById('game-state');
    private readonly playerPoints = {
        [Player.PLAYER_1]: document.getElementById('player-1-points'),
        [Player.PLAYER_2]: document.getElementById('player-2-points'),
    };

    private readonly gamePhaseToText = {
        [GamePhase.INITIAL]: 'Initial',
        [GamePhase.MOVE_SELECTED_POINT]: 'Move coordinate',
        [GamePhase.SELECT_POINT_TO_MOVE]: 'Select coordinate',
        [GamePhase.MILL]: 'Mill',
        [GamePhase.GAME_OVER]: 'The end',
    };

    public constructor(private game: NineMensMorrisGame) {}

    public update() {
        this.updateCurrentPlayerText();
        this.updateGameState();
        this.updateHistoryMoves();
        this.updatePoints();
    }

    private updateCurrentPlayerText() {
        const paintablePlayer = getPaintablePlayer(this.game.currentPlayer);
        this.currentPlayerText.innerText = paintablePlayer.label;
        this.currentPlayerText.style.color = paintablePlayer.color;
    }

    private updateGameState() {
        this.moveTypeText.innerText = this.gamePhaseToText[this.game.currentPhase] || 'Unknown phase';
    }

    private updateHistoryMoves() {
        // console.log(this.game.getMovesHistory());
    }

    private updatePoints() {
        Object.entries(this.game.getState().playerPoints).forEach(([player, points]) => {
            this.playerPoints[player].innerText = points + '';
        });
    }
}
