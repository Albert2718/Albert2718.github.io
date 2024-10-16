
## 相量法的引入
![alt text](svg/1.drawio.svg "RLC电路")

列出KVL方程如下：
$$
Ri + L \frac{di}{dt} + \frac{1}{C} \int idt = u_s
$$ 
当电源 $u_s$ 是一个正弦交流电源：
$u_S = \sqrt{2}U_S \cos(\omega t + \phi_u)$

电流 $i$ 为同频率的正弦量：
$i = \sqrt{2}I \cos(\omega t + \phi_i)$

代入KVL方程：
$$
\begin{aligned}
    R\sqrt{2}I\cos(\omega t + \phi_i) - \omega L \sqrt{2} \sin(\omega t + \phi_i) + \frac{1}{\omega C} \sqrt{2} \sin(\omega t + \phi_i) \\
    =\sqrt{2}U_S \cos(\omega t + \phi_u) \\
\end{aligned}
$$ 

整个方程看起来变得非常复杂，一堆三角函数导致难以下手。

