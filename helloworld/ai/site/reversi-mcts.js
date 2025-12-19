// reversi-mcts.js
// 纯 MCTS 算法实现

class MCTSNode {
    constructor(board, color, parent = null, move = null) {
        this.board = board.clone();
        this.color = color;  // 当前节点要下棋的颜色
        this.parent = parent;
        this.move = move;    // 从父节点到这个节点的落子位置 [row, col]
        
        this.children = [];
        this.visits = 0;
        this.wins = 0;       // 从根节点颜色的角度计数
        
        this.untriedMoves = this.board.getLegalMoves(color);
        this.isTerminal = this.board.isGameOver();
    }

    // UCB1 公式
    getUCB1(explorationParam = Math.sqrt(2)) {
        if (this.visits === 0) return Infinity;
        
        const exploitation = this.wins / this.visits;
        const exploration = explorationParam * Math.sqrt(Math.log(this.parent.visits) / this.visits);
        
        return exploitation + exploration;
    }

    // 选择最佳子节点
    selectChild() {
        return this.children.reduce((best, child) => {
            const childUCB = child.getUCB1();
            const bestUCB = best.getUCB1();
            return childUCB > bestUCB ? child : best;
        });
    }

    // 扩展一个新节点
    expand() {
        if (this.untriedMoves.length === 0) return null;

        const move = this.untriedMoves.pop();
        const newBoard = this.board.clone();
        newBoard.makeMove(move[0], move[1], this.color);
        
        const nextColor = this.color === 'X' ? 'O' : 'X';
        const childNode = new MCTSNode(newBoard, nextColor, this, move);
        this.children.push(childNode);
        
        return childNode;
    }

    // 随机模拟到游戏结束
    simulate(rootColor) {
        const simulationBoard = this.board.clone();
        let currentColor = this.color;
        
        let maxMoves = 60; // 防止无限循环
        let moveCount = 0;
        
        while (!simulationBoard.isGameOver() && moveCount < maxMoves) {
            const legalMoves = simulationBoard.getLegalMoves(currentColor);
            
            if (legalMoves.length === 0) {
                // 当前玩家无子可下，切换到对手
                currentColor = currentColor === 'X' ? 'O' : 'X';
                
                // 检查对手是否也无子可下
                if (simulationBoard.getLegalMoves(currentColor).length === 0) {
                    break; // 游戏结束
                }
                continue;
            }
            
            // 随机选择一个合法落子
            const move = legalMoves[Math.floor(Math.random() * legalMoves.length)];
            simulationBoard.makeMove(move[0], move[1], currentColor);
            
            // 切换玩家
            currentColor = currentColor === 'X' ? 'O' : 'X';
            moveCount++;
        }
        
        // 返回模拟结果（从根节点颜色的角度）
        const result = simulationBoard.getWinner();
        
        if (result.winner === 'draw') {
            return 0.5; // 平局
        } else if (result.winner === rootColor) {
            return 1.0; // 根节点颜色获胜
        } else {
            return 0.0; // 根节点颜色失败
        }
    }

    // 反向传播
    backpropagate(result) {
        this.visits += 1;
        this.wins += result;
        
        if (this.parent) {
            // 从对手角度看，结果相反
            this.parent.backpropagate(1 - result);
        }
    }

    // 获取最佳子节点（根据访问次数）
    getBestChild() {
        return this.children.reduce((best, child) => {
            return child.visits > best.visits ? child : best;
        });
    }
}

class MCTS {
    constructor(nPlayout = 1000) {
        this.nPlayout = nPlayout;
    }

    // 执行 MCTS 搜索
    search(board, color, onProgress = null) {
        // 检查是否只有一个合法落子
        const legalMoves = board.getLegalMoves(color);
        if (legalMoves.length === 0) return null;
        if (legalMoves.length === 1) return legalMoves[0];

        // 创建根节点
        const root = new MCTSNode(board, color);
        
        // 执行 n 次模拟
        for (let i = 0; i < this.nPlayout; i++) {
            let node = root;
            
            // 1. Selection - 选择最有潜力的节点
            while (node.untriedMoves.length === 0 && node.children.length > 0) {
                node = node.selectChild();
            }
            
            // 2. Expansion - 扩展一个新节点
            if (node.untriedMoves.length > 0 && !node.isTerminal) {
                node = node.expand();
            }
            
            // 3. Simulation - 随机模拟到游戏结束
            const result = node.simulate(color);
            
            // 4. Backpropagation - 反向传播结果
            node.backpropagate(result);
            
            // 进度回调
            if (onProgress && i % 100 === 0) {
                onProgress(i + 1, this.nPlayout);
            }
        }
        
        // 返回访问次数最多的子节点的移动
        const bestChild = root.getBestChild();
        return bestChild.move;
    }

    // 异步搜索（不阻塞UI）
    async searchAsync(board, color, onProgress = null) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const move = this.search(board, color, onProgress);
                resolve(move);
            }, 10);
        });
    }
}

// 简单的随机玩家（用于快速测试）
class RandomPlayer {
    getMove(board, color) {
        const legalMoves = board.getLegalMoves(color);
        if (legalMoves.length === 0) return null;
        return legalMoves[Math.floor(Math.random() * legalMoves.length)];
    }
}
