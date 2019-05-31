import { Player } from '../game/Player';
import { Tree } from '../tree/Tree';
import { GameNodeValue } from '../tree/GameNodeValue';

export interface GameAlgorithm {
    buildGameTree(maximizingPlayer: Player): Tree<GameNodeValue>;
    name(): string;
    depth: number;
}
