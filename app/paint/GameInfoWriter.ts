import { NineMensMorrisGame } from '../game/NineMensMorrisGame';
import { getPaintablePlayer } from './PaintablePlayer';

export class GameInfoWriter {
    private readonly currentPlayerText = document.getElementById('current-player-text');

    public constructor(private game: NineMensMorrisGame) {}

    public update() {
        this.updateCurrentPlayerText();
    }

    private updateCurrentPlayerText() {
        const paintablePlayer = getPaintablePlayer(this.game.currentPlayer);
        this.currentPlayerText.innerText = paintablePlayer.label;
        this.currentPlayerText.style.color = paintablePlayer.color;
    }
}
