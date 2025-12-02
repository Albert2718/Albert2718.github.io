TRIMUI SMART PRO 掌机

## TF卡文件夹结构说明

| 文件夹 | 用途 |
|--------|------|
| `.config` | 放置 PSP 游戏的存档 |
| `Apps` | 放置非模拟器软件 |
| `Best` | 精选游戏 |
| `Emus` | 放置模拟器程序 |
| `Imgs` | 放置游戏预览图 |
| `jdk` | Java 游戏文件 |
| `RetroArch` | 放置模拟器核心、金手指、遮罩 |
| `Roms` |  **放置游戏（重要）** |
| `Themes` | 放置主题 |
| `Videos` | 放置视频 |

## 游戏安装方法

### 方法步骤：
1. 将游戏文件放入 `Roms` 对应的平台文件夹  
2. 删除该文件夹内的 `XXX_cache7.db` 缓存文件  
3. 在掌机上打开对应模拟器，游戏即会出现在列表中  

### 示例1：安装 PSP 游戏
```
游戏格式：.iso
存放路径：Roms/PSP/
操作：删除 PSP_cache7.db
启动：打开 PPSSPP 模拟器
```

### 示例2：安装 GBA 游戏
```
游戏格式：.gba 或 .zip
存放路径：Roms/GBA/
操作：删除 GBA_cache7.db
启动：打开 GBA 模拟器
```


