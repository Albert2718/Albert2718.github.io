class Character:
    """表示玩家和敌人的基类"""
    def __init__(self, name, health):
        self.name = name
        self.health = health  # 生命值
        self.block = 0        # 格挡值
        self.vulnerable_turns = 0  # 易伤状态的持续回合数

    def take_damage(self, damage):
        """受到伤害时，先判断是否是易伤状态，然后再看格挡值"""
        if self.vulnerable_turns > 0:
            damage = int(damage * 1.5)  # 如果处于易伤状态，先将伤害乘以 1.5

        # 计算实际伤害（扣除格挡）
        effective_damage = max(0, damage - self.block)
        
        # 减少格挡值
        self.block = max(0, self.block - damage)

        # 扣除生命值
        self.health -= effective_damage
        print(f"{self.name} 受到 {effective_damage} 点伤害，剩余生命值：{self.health}")

    def gain_block(self, block_amount):
        """增加格挡值"""
        self.block += block_amount
        print(f"{self.name} 获得了 {block_amount} 点格挡值，当前格挡值：{self.block}")

    def apply_vulnerable(self, turns=2):
        """使敌人进入易伤状态2回合，累加已有的易伤回合"""
        self.vulnerable_turns += turns  # 累加已有的易伤回合数
        print(f"{self.name} 进入了易伤状态，将持续 {self.vulnerable_turns} 回合")

    def reset_block(self):
        """重置格挡"""
        self.block = 0

    def reduce_vulnerability(self):
        """每回合减少易伤状态的持续时间"""
        if self.vulnerable_turns > 0:
            self.vulnerable_turns -= 1
            if self.vulnerable_turns == 0:
                print(f"{self.name} 的易伤状态结束")

class Player(Character):  # 表示Player继承了Character的属性和方法
    """玩家的类"""
    def __init__(self, name, health):
        super().__init__(name, health)  # super()调用父类
        self.energy = 3  # 每回合玩家有3点能量

    def start_turn(self):
        """每回合开始时重置能量"""
        self.energy = 3
        print(f"{self.name} 的能量恢复到 {self.energy} 点")

class Enemy(Character):
    """敌人的类"""
    def __init__(self, name, health):
        super().__init__(name, health)

    def enemy_turn(self, player):
        """敌人的行动：一次攻击一次格挡（可以进行数值设计来保证玩家得睁着眼睛来玩这个游戏)"""
        print(f"\n{self.name} 的回合：")
        print(f"{self.name} 对 {player.name} 造成了 5 点伤害")
        player.take_damage(5)  # 攻击玩家，计算玩家的格挡
        self.gain_block(5)  # 敌人获得5点格挡

class Card:
    """表示卡牌的基类"""
    def play(self, player, enemy):
        pass  # pass就是一个占位符 什么都不做 但日后可能加    

class Strike(Card):
    """打击卡：攻击敌人"""
    def play(self, player, enemy):
        if player.energy >= 1:
            player.energy -= 1
            print(f"{player.name} 使用了 打击!")
            enemy.take_damage(6)  # 固定伤害值6
        else:
            print("能量不足！")

class Defend(Card):
    """防御卡：增加玩家的格挡值"""
    def play(self, player, enemy):
        if player.energy >= 1:
            player.energy -= 1
            print(f"{player.name} 使用了 防御!")
            player.gain_block(5)  # 固定格挡值5
        else:
            print("能量不足！")

class Bash(Card):
    """痛击卡：攻击敌人并使其进入易伤状态"""
    def play(self, player, enemy):
        if player.energy >= 2:
            player.energy -= 2
            print(f"{player.name} 使用了 痛击!")
            enemy.take_damage(8)  # 固定伤害值8
            enemy.apply_vulnerable(2)  # 使敌人进入易伤状态，持续两回合
        else:
            print("能量不足！")

def start_new_game():
    """游戏开始，初始化玩家和敌人"""
    player = Player("玩家", 66)
    enemy = Enemy("敌人", 50)

    # 初始化卡牌
    strike_card = Strike()
    defend_card = Defend()
    bash_card = Bash()

    # 游戏主循环
    while player.health > 0 and enemy.health > 0:
        print("\n===== 新的回合 =====")
        
        # 玩家回合
        player.start_turn()
        while True:
            action = input("选择行动 (strike/defend/bash 或 输入 'over' 结束回合): ").strip().lower()
            if action == "strike":
                strike_card.play(player, enemy)
            elif action == "defend":
                defend_card.play(player, enemy)
            elif action == "bash":
                bash_card.play(player, enemy)
            elif action == "over":
                print("玩家结束了回合")
                break
            else:
                print("无效的行动！")

            if enemy.health <= 0:
                print(f"\n{enemy.name} 被击败！你赢了！")
                break
        
        if enemy.health <= 0:
            break

        # 回合结束，敌人清除格挡，并减少易伤状态
        enemy.reset_block()
        enemy.reduce_vulnerability()

        # 敌人回合
        enemy.enemy_turn(player)
        
        # 敌人回合结束，玩家清除格挡
        player.reset_block()

        if player.health <= 0:
            print(f"\n{player.name} 被击败！游戏失败！")
            break

    # 游戏结束
    if player.health > 0 and enemy.health <= 0:
        print("恭喜你！你赢了游戏！")
    elif player.health <= 0:
        print("很遗憾，你输了游戏。")

# 启动游戏
while True:
    start_new_game()
    restart = input("是否想再玩一次？(yes/no): ").strip().lower()
    if restart != 'yes':
        break

print("感谢游玩！")
