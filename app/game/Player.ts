export enum Player {
    PLAYER_1,
    PLAYER_2,
    NO_PLAYER,
}

export const nextPlayer = (player: Player): Player => (player === Player.PLAYER_1 ? Player.PLAYER_2 : Player.PLAYER_1);
