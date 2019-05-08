import { Player } from '../game/Player';

export interface PaintablePlayer {
    radius: number;
    color: string;
    label: string;
}

const players: Map<Player, PaintablePlayer> = new Map();
players.set(Player.PLAYER_1, { color: 'red', radius: 10, label: 'Player 1' });
players.set(Player.PLAYER_2, { color: 'blue', radius: 10, label: 'Player 2' });
players.set(Player.NO_PLAYER, { color: 'black', radius: 5, label: 'No player' });

export const getPaintablePlayer = (player: Player): PaintablePlayer => players.get(player);
