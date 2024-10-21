面向对象编程是一种非常流行的**编程范式**（programming paradigm），所谓编程范式就是**程序设计的方法论**，简单的说就是程序员对程序的认知和理解以及他们编写代码的方式。

如果要用一句话来概括面向对象编程，我认为下面的说法是相当精辟和准确的。
>面向对象编程：把一组数据和处理数据的方法组成**对象**，把行为相同的对象归纳为**类**，通过**封装**隐藏对象的内部细节，通过**继承**实现类的特化和泛化，通过**多态**实现基于对象类型的动态分派。

## 类和对象
>在面向对象编程中，类是一个抽象的概念，对象是一个具体的概念。我们把同一类对象的共同特征抽取出来就是一个类，比如我们经常说的人类，这是一个抽象概念，而我们每个人就是人类的这个抽象概念下的实实在在的存在，也就是一个对象。简而言之，类是对象的蓝图和模板，对象是类的实例，是可以接受消息的实体。

在我学习本节的过程中，我会通过Python自己编写一个简易的杀戮尖塔游戏以加深自己的理解。这里截取Python代码的一部分：


``` python
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
```

### 定义类

### 创建和使用对象

### 初始化方法