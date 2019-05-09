import { NineMensMorrisGame } from '../game/NineMensMorrisGame';
import { getPaintablePlayer } from './PaintablePlayer';
import { GameMoveResult } from '../game/GameMoveResult';
import { Player } from '../game/Player';
import { GameState } from '../game/GameState';

export class GameInfoWriter {
    private readonly currentPlayerText = document.getElementById('current-player-text');
    private readonly moveTypeText = document.getElementById('game-state');
    private readonly playerPoints = {
        [Player.PLAYER_1]: document.getElementById('player-1-points'),
        [Player.PLAYER_2]: document.getElementById('player-2-points'),
    };

    private readonly gameStateToText = {
        [GameState.INITIAL]: 'Initial',
        [GameState.MOVE_SELECTED_POINT]: 'Move point',
        [GameState.SELECT_POINT_TO_MOVE]: 'Select point',
        [GameState.MILL]: 'Mill',
        [GameState.GAME_OVER]: 'The end',
    };

    public constructor(private game: NineMensMorrisGame) {}

    public update(gameMoveResult?: GameMoveResult) {
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
        this.moveTypeText.innerText = this.gameStateToText[this.game.currentState] || 'Unknown state';
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
