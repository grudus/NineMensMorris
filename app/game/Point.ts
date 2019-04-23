export interface Point {
    row: number;
    col: string;
    colIndex: number;
}

const A_CODE = 'a'.charCodeAt(0);

export function point(row: number, col: string): Point {
    return { row, col, colIndex: col.charCodeAt(0) - A_CODE };
}
