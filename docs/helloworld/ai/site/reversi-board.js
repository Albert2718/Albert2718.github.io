// reversi-board.js
// 黑白棋棋盘类

class ReversiBoard {
    constructor() {
        this.board = [];
        this.initBoard();
    }

    initBoard() {
        // 初始化 8x8 棋盘
        this.board = Array(8).fill(null).map(() => Array(8).fill('.'));
        
        // 设置初始4个棋子
        this.board[3][3] = 'O';  // 白
        this.board[3][4] = 'X';  // 黑
        this.board[4][3] = 'X';  // 黑
        this.board[4][4] = 'O';  // 白
    }

    clone() {
        const newBoard = new ReversiBoard();
        newBoard.board = this.board.map(row => [...row]);
        return newBoard;
    }

    get(row, col) {
        if (row < 0 || row >= 8 || col < 0 || col >= 8) return null;
        return this.board[row][col];
    }

    set(row, col, color) {
        if (row < 0 || row >= 8 || col < 0 || col >= 8) return;
        this.board[row][col] = color;
    }

    count(color) {
        let count = 0;
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (this.board[row][col] === color) count++;
            }
        }
        return count;
    }

    // 获取合法落子位置
    getLegalMoves(color) {
        const moves = [];
        const opponent = color === 'X' ? 'O' : 'X';
        
        // 8个方向
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],           [0, 1],
            [1, -1],  [1, 0],  [1, 1]
        ];

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (this.board[row][col] !== '.') continue;

                // 检查这个位置是否合法
                for (const [dr, dc] of directions) {
                    let r = row + dr;
                    let c = col + dc;
                    let hasOpponent = false;

                    // 第一步必须是对手的棋子
                    while (r >= 0 && r < 8 && c >= 0 && c < 8 && this.board[r][c] === opponent) {
                        hasOpponent = true;
                        r += dr;
                        c += dc;
                    }

                    // 如果遇到自己的棋子，且中间有对手的棋子，则合法
                    if (hasOpponent && r >= 0 && r < 8 && c >= 0 && c < 8 && this.board[r][c] === color) {
                        moves.push([row, col]);
                        break; // 这个位置已经确认合法，不需要继续检查其他方向
                    }
                }
            }
        }

        return moves;
    }

    // 检查某个落子位置是否合法
    isLegalMove(row, col, color) {
        if (this.board[row][col] !== '.') return false;

        const opponent = color === 'X' ? 'O' : 'X';
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],           [0, 1],
            [1, -1],  [1, 0],  [1, 1]
        ];

        for (const [dr, dc] of directions) {
            let r = row + dr;
            let c = col + dc;
            let hasOpponent = false;

            while (r >= 0 && r < 8 && c >= 0 && c < 8 && this.board[r][c] === opponent) {
                hasOpponent = true;
                r += dr;
                c += dc;
            }

            if (hasOpponent && r >= 0 && r < 8 && c >= 0 && c < 8 && this.board[r][c] === color) {
                return true;
            }
        }

        return false;
    }

    // 执行落子，返回翻转的棋子位置
    makeMove(row, col, color) {
        if (!this.isLegalMove(row, col, color)) {
            return null;
        }

        const flipped = [];
        const opponent = color === 'X' ? 'O' : 'X';
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],           [0, 1],
            [1, -1],  [1, 0],  [1, 1]
        ];

        // 检查每个方向
        for (const [dr, dc] of directions) {
            const toFlip = [];
            let r = row + dr;
            let c = col + dc;

            // 收集要翻转的棋子
            while (r >= 0 && r < 8 && c >= 0 && c < 8 && this.board[r][c] === opponent) {
                toFlip.push([r, c]);
                r += dr;
                c += dc;
            }

            // 如果最后是自己的棋子，则翻转
            if (r >= 0 && r < 8 && c >= 0 && c < 8 && this.board[r][c] === color && toFlip.length > 0) {
                flipped.push(...toFlip);
            }
        }

        // 执行翻转
        this.board[row][col] = color;
        for (const [r, c] of flipped) {
            this.board[r][c] = color;
        }

        return flipped;
    }

    // 撤销落子
    undoMove(row, col, flipped, color) {
        const opponent = color === 'X' ? 'O' : 'X';
        this.board[row][col] = '.';
        for (const [r, c] of flipped) {
            this.board[r][c] = opponent;
        }
    }

    // 检查游戏是否结束
    isGameOver() {
        const blackMoves = this.getLegalMoves('X').length;
        const whiteMoves = this.getLegalMoves('O').length;
        return blackMoves === 0 && whiteMoves === 0;
    }

    // 获取胜者
    getWinner() {
        const blackCount = this.count('X');
        const whiteCount = this.count('O');
        
        if (blackCount > whiteCount) {
            return { winner: 'X', diff: blackCount - whiteCount };
        } else if (whiteCount > blackCount) {
            return { winner: 'O', diff: whiteCount - blackCount };
        } else {
            return { winner: 'draw', diff: 0 };
        }
    }

    // 打印棋盘（调试用）
    print() {
        console.log('  A B C D E F G H');
        for (let row = 0; row < 8; row++) {
            let line = (row + 1) + ' ';
            for (let col = 0; col < 8; col++) {
                line += this.board[row][col] + ' ';
            }
            console.log(line);
        }
    }
}
