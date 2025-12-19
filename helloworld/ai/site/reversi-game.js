// reversi-game.js
// 游戏主逻辑和 UI 控制

class ReversiGame {
    constructor() {
        this.board = new ReversiBoard();
        this.currentColor = 'X'; // 黑棋先手
        this.isThinking = false;
        this.gameOver = false;
        this.history = []; // 用于悔棋
        
        this.blackPlayer = 'human';
        this.whitePlayer = 'ai';
        this.nPlayout = 1000;
        this.showHints = true;
        
        this.mcts = new MCTS(this.nPlayout);
        
        this.initUI();
        this.renderBoard();
        this.updateStatus();
    }

    initUI() {
        // 获取UI元素
        this.boardElement = document.getElementById('board');
        this.blackScoreElement = document.getElementById('blackScore');
        this.whiteScoreElement = document.getElementById('whiteScore');
        this.currentTurnElement = document.getElementById('currentTurn');
        this.thinkingStatusElement = document.getElementById('thinkingStatus');
        this.gameOverMsgElement = document.getElementById('gameOverMsg');
        
        // 设置事件监听
        document.getElementById('blackPlayer').addEventListener('change', (e) => {
            this.blackPlayer = e.target.value;
            this.checkAIMove();
        });
        
        document.getElementById('whitePlayer').addEventListener('change', (e) => {
            this.whitePlayer = e.target.value;
            this.checkAIMove();
        });
        
        document.getElementById('playout').addEventListener('input', (e) => {
            this.nPlayout = parseInt(e.target.value);
            document.getElementById('playoutValue').textContent = this.nPlayout;
            this.mcts = new MCTS(this.nPlayout);
        });
        
        document.getElementById('showHints').addEventListener('change', (e) => {
            this.showHints = e.target.checked;
            this.renderBoard();
        });
    }

    renderBoard() {
        this.boardElement.innerHTML = '';
        const legalMoves = this.board.getLegalMoves(this.currentColor);
        const legalSet = new Set(legalMoves.map(m => `${m[0]},${m[1]}`));
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                // 显示棋子
                const piece = this.board.get(row, col);
                if (piece === 'X') {
                    const pieceDiv = document.createElement('div');
                    pieceDiv.className = 'piece black';
                    cell.appendChild(pieceDiv);
                } else if (piece === 'O') {
                    const pieceDiv = document.createElement('div');
                    pieceDiv.className = 'piece white';
                    cell.appendChild(pieceDiv);
                }
                
                // 显示合法落子提示
                if (this.showHints && !this.gameOver && !this.isThinking && 
                    legalSet.has(`${row},${col}`) && this.isHumanTurn()) {
                    cell.classList.add('legal-move');
                }
                
                // 添加点击事件
                cell.addEventListener('click', () => this.handleCellClick(row, col));
                
                this.boardElement.appendChild(cell);
            }
        }
    }

    handleCellClick(row, col) {
        if (this.gameOver || this.isThinking || !this.isHumanTurn()) {
            return;
        }
        
        if (this.board.isLegalMove(row, col, this.currentColor)) {
            this.makeMove(row, col);
        }
    }

    makeMove(row, col) {
        // 保存历史记录
        const historyEntry = {
            board: this.board.clone(),
            color: this.currentColor,
            move: [row, col]
        };
        this.history.push(historyEntry);
        
        // 执行落子
        this.board.makeMove(row, col, this.currentColor);
        
        // 切换玩家
        this.switchPlayer();
        
        // 更新UI
        this.renderBoard();
        this.updateStatus();
        
        // 检查游戏是否结束
        if (this.checkGameOver()) {
            return;
        }
        
        // 如果下一个玩家是AI，让AI思考
        setTimeout(() => this.checkAIMove(), 100);
    }

    switchPlayer() {
        const nextColor = this.currentColor === 'X' ? 'O' : 'X';
        
        // 检查下一个玩家是否有合法落子
        if (this.board.getLegalMoves(nextColor).length > 0) {
            this.currentColor = nextColor;
        } else {
            // 下一个玩家无子可下，检查当前玩家是否还能下
            if (this.board.getLegalMoves(this.currentColor).length === 0) {
                // 双方都无子可下，游戏结束
                this.gameOver = true;
            }
            // 否则当前玩家继续
        }
    }

    isHumanTurn() {
        if (this.currentColor === 'X') {
            return this.blackPlayer === 'human';
        } else {
            return this.whitePlayer === 'human';
        }
    }

    async checkAIMove() {
        if (this.gameOver || this.isThinking || this.isHumanTurn()) {
            return;
        }
        
        // 检查是否有合法落子
        const legalMoves = this.board.getLegalMoves(this.currentColor);
        if (legalMoves.length === 0) {
            this.switchPlayer();
            this.updateStatus();
            this.checkGameOver();
            return;
        }
        
        this.isThinking = true;
        this.updateStatus();
        
        try {
            // 使用MCTS搜索
            const move = await this.mcts.searchAsync(
                this.board, 
                this.currentColor,
                (current, total) => {
                    const percent = Math.round((current / total) * 100);
                    this.thinkingStatusElement.innerHTML = `
                        <div class="thinking">
                            🤔 AI 思考中... ${percent}%
                            <br>
                            <small>(${current}/${total} 次模拟)</small>
                        </div>
                    `;
                }
            );
            
            if (move) {
                this.makeMove(move[0], move[1]);
            }
        } catch (error) {
            console.error('AI思考出错:', error);
        } finally {
            this.isThinking = false;
            this.thinkingStatusElement.innerHTML = '';
            this.updateStatus();
        }
    }

    updateStatus() {
        // 更新分数
        const blackCount = this.board.count('X');
        const whiteCount = this.board.count('O');
        this.blackScoreElement.textContent = blackCount;
        this.whiteScoreElement.textContent = whiteCount;
        
        // 更新当前回合
        if (this.gameOver) {
            const result = this.board.getWinner();
            let msg = '';
            if (result.winner === 'X') {
                msg = `游戏结束: ⚫ 黑棋获胜! (${result.diff}子)`;
            } else if (result.winner === 'O') {
                msg = `游戏结束: ⚪ 白棋获胜! (${result.diff}子)`;
            } else {
                msg = '游戏结束: 平局!';
            }
            this.currentTurnElement.textContent = msg;
            this.currentTurnElement.style.background = '#4CAF50';
            this.currentTurnElement.style.color = 'white';
            
            this.gameOverMsgElement.innerHTML = `
                <div class="game-over">
                    ${msg}
                    <br>
                    <small>黑棋: ${blackCount} | 白棋: ${whiteCount}</small>
                </div>
            `;
        } else if (this.isThinking) {
            const colorName = this.currentColor === 'X' ? '⚫ 黑棋' : '⚪ 白棋';
            this.currentTurnElement.textContent = `${colorName} 思考中...`;
            this.currentTurnElement.style.background = '#ff9800';
            this.currentTurnElement.style.color = 'white';
        } else {
            const colorName = this.currentColor === 'X' ? '⚫ 黑棋' : '⚪ 白棋';
            this.currentTurnElement.textContent = `轮到: ${colorName}`;
            this.currentTurnElement.style.background = '#fff3cd';
            this.currentTurnElement.style.color = '#856404';
        }
    }

    checkGameOver() {
        if (this.board.isGameOver()) {
            this.gameOver = true;
            this.updateStatus();
            this.renderBoard();
            return true;
        }
        return false;
    }

    reset() {
        this.board = new ReversiBoard();
        this.currentColor = 'X';
        this.isThinking = false;
        this.gameOver = false;
        this.history = [];
        this.gameOverMsgElement.innerHTML = '';
        
        this.renderBoard();
        this.updateStatus();
        
        // 如果黑棋是AI，让它先走
        setTimeout(() => this.checkAIMove(), 100);
    }

    undo() {
        if (this.history.length === 0 || this.isThinking || this.gameOver) {
            return;
        }
        
        // 如果对战AI，需要悔两步（人类的一步 + AI的一步）
        const isAgainstAI = (this.blackPlayer === 'ai' && this.whitePlayer === 'human') ||
                           (this.blackPlayer === 'human' && this.whitePlayer === 'ai');
        
        const stepsToUndo = isAgainstAI ? Math.min(2, this.history.length) : 1;
        
        for (let i = 0; i < stepsToUndo; i++) {
            if (this.history.length > 0) {
                const lastState = this.history.pop();
                this.board = lastState.board;
                this.currentColor = lastState.color;
            }
        }
        
        this.gameOver = false;
        this.gameOverMsgElement.innerHTML = '';
        this.renderBoard();
        this.updateStatus();
    }
}

// 全局变量和函数
let game;

function newGame() {
    if (game) {
        game.reset();
    } else {
        game = new ReversiGame();
    }
}

function undoMove() {
    if (game) {
        game.undo();
    }
}

// 页面加载完成后初始化游戏
window.addEventListener('load', () => {
    newGame();
});
