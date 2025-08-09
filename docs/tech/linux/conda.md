## 虚拟环境

### 创建虚拟环境
```bash
conda create --name myenv python=3.x
conda create --prefix ./AIChatServerEnv python=3.10
```

### 激活虚拟环境
```bash
conda activate ./AIChatServerEnv
```

### 退出虚拟环境
```bash
conda deactivate
```
### 列出所有环境
```bash
conda env list
```

### 删除环境
```bash
conda env remove --name myenv
```

## 包管理
### 安装包
```bash
conda install package_name
pip install -r ./requirements.txt
```

### 更新包
```bash
conda update package_name
```

### 删除包
```bash
conda remove package_name
```

