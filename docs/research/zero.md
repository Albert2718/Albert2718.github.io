我的黑白棋AI近期训练地效果很好，于是乎再回过来读一下这篇经典的论文：**Mastering Chess and Shogi by Self-Play with a General Reinforcement Learning Algorithm**

BTW，是ALPHA不是AIPHA，之前一直以为是AI......
## AlphaGO 全系列

先回顾一下AlphaGO全系列吧：

1️⃣ **《Mastering the game of Go with deep neural networks and tree search》**

* **作者**：Silver et al. (DeepMind)
* **期刊**：*Nature*, 2016
* **通常称为**：AlphaGo（初代）

**核心贡献**

* 首次将：

  * **策略网络（Policy Network）**
  * **价值网络（Value Network）**
  * **蒙特卡洛树搜索（MCTS）**
深度结合
* 先用**人类棋谱监督学习**，再用**自我对弈强化学习**

**意义**

- 第一次击败人类职业围棋顶尖选手
- 奠定了 AlphaZero 的技术框架雏形

---

2️⃣ **《Mastering the game of Go without human knowledge》**

* **作者**：Silver et al.
* **期刊**：*Nature*, 2017
* **通常称为**：AlphaGo Zero

**核心贡献**

* **完全不使用人类棋谱**
* 只依靠：

  * 自我对弈
  * 单一神经网络同时输出 **Policy + Value**
* 用一个统一网络替代 AlphaGo 的多个网络

**关键创新**

* **端到端自我博弈**
* 神经网络直接学习棋感，而非模仿人类

---

3️⃣ **《Mastering Chess and Shogi by Self-Play with a General Reinforcement Learning Algorithm》**

* **作者**：Silver et al.
* **期刊**：*Science*, 2018
* **正式名称**：AlphaZero

>AlphaZero相对于AlphaGo Zero的改进不算大，毕竟也就只差2个月。它的贡献在于，证明了DRL对于很多棋类都是有效的。

## 背景

摘录原文的Abstract部分：
>The game of chess is the most widely-studied domain in the history of artificial intelligence. The strongest programs are based on a combination of sophisticated search techniques, domain-specific adaptations, and handcrafted evaluation functions that have been refined by human experts over several decades. In contrast, the AlphaGo Zero program recently achieved superhuman performance in the game of Go, by tabula rasa reinforcement learning from games of self-play. In this paper, we generalise this approach into a single AlphaZero algorithm that can achieve, tabula rasa, superhuman performance in many challenging domains. Starting from random play, and given no domain knowledge except the game rules, AlphaZero achieved within 24 hours a superhuman level of play in the games of chess and shogi (Japanese chess) as well as Go, and convincingly defeated a world-champion program in each case.

简要来说，仅凭游戏规则，通过自我对弈，可推广到很多游戏。

## 核心算法

### 神经网络架构

AlphaZero使用一个深度神经网络 $f_\theta(s)$ 同时输出两个值：
$$
(\mathbf{p}, v) = f_\theta(s)
$$
- **策略向量 $\mathbf{p}$**：每个合法动作的概率分布 $p_a = Pr(a|s)$  
- **价值标量 $v$**：当前局面的期望结果 $v \approx \mathbb{E}[z|s]$  

### 蒙特卡洛树搜索（MCTS）

AlphaZero采用MCTS，但不同的是，到达叶节点不再rollout，而是用神经网络评估，更详细地关于MCTS的内容，可以参见我的[这篇文章](../helloworld/ai/miniZero.md)。

1. **选择阶段**：从根节点开始，每次选择访问次数低、策略概率高、价值估计高的动作
2. **扩展与评估**：到达叶节点时，用神经网络评估
3. **回传**：将评估结果沿路径回传更新统计量
4. **决策**：根据根节点各动作的访问次数分布 $\boldsymbol{\pi}$ 选择落子

## 训练过程

训练的损失函数为：
$$
l = (z - v)^2 - \boldsymbol{\pi}^\top \log \mathbf{p} + c\|\theta\|^2
$$
三项分别是：
- **价值损失**：预测值与实际游戏结果的均方误差  
- **策略损失**：神经网络策略与MCTS搜索结果的交叉熵  
- **L2正则化**：防止过拟合  

训练数据完全来自自我博弈产生的 $(s_t, \boldsymbol{\pi}_t, z)$ 三元组。



## 状态与动作表示

在AlphaGo Zero中，一共使用了17个 19×19 的二值特征平面来描述当前局面，其中前16个平面描述了最近8步对应的双方player的棋子位置，最后一个平面描述当前player对应的棋子颜色，其实也就是先后手。


## 一图总结

非常厉害的一图总结，可以在新标签页中放大查看。

![alt text](images/alpha_go_zero_cheat_sheet.png)

## 论文细节

读完正文觉得没什么（因为当时已经了解了这些核心算法），读到附录才震惊于这篇文章的可读性与严谨性。虽然正文就6页，但是在附录中的技术细节写的非常清晰，可以解答我的大部分细节上的疑惑。
