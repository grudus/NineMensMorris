import { NineMensMorrisGame } from '../game/NineMensMorrisGame';

export class GameCanvasDrawer {
    public constructor(private canvas: HTMLCanvasElement, private game: NineMensMorrisGame) {
        this.fitToContainer(canvas);
        this.drawInitialCanvas(canvas);
    }

    private drawInitialCanvas(canvas: HTMLCanvasElement) {
        const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
    }

    private fitToContainer(canvas: HTMLCanvasElement) {
        // Make it visually fill the positioned parent
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        // ...then set the internal size to match
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
}
