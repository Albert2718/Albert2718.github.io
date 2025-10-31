## 安装

    npm install -g reveal-md

## 使用

    reveal-md path/demo.md

## 基本语法
可参照[官方文档](https://github.com/webpro/reveal-md)

注意水平与竖直分页符即可

## 模板推荐
<https://github.com/TonyCrane/slide-template/tree/master?tab=readme-ov-file>

### Makefile 使用
>`Makefile` 是一个**任务自动化脚本**，最初是给 C 语言项目用来自动编译的。  
但在现代环境里，它更像是一个“命令快捷中心”，让你不用记那么多复杂的命令。

```makefile
.PHONY: live build clean

ifeq ($(OS),Windows_NT)
    RM = del /Q
    RMDIR = rmdir /S /Q
    TRUE = rem
    SEP = \\
else
    RM = rm -f
    RMDIR = rm -rf
    TRUE = true
    SEP = /
endif

PORT = 1950

live:
	@echo "Previewing main slides on port $(PORT)..."
	-@reveal-md main.md -w --port $(PORT) --scripts https://cdn.tonycrane.cc/heti/heti.js,heti_worker.js --template template.html || $(TRUE)

build:
	@echo "Building main slides..."
	@reveal-md main.md --scripts https://cdn.tonycrane.cc/heti/heti.js,heti_worker.js --template template.html --static ..$(SEP)site --assets-dir assets
	@$(RM) ..$(SEP)site$(SEP)main.html 2>nul || $(TRUE)

clean:
	@echo "Cleaning up..."
	@$(RMDIR) ..$(SEP)site
```

## Keyboard Shortcuts

| KEY | ACTION |
|-----|---------|
| N , SPACE | Next slide |
| P , Shift SPACE | Previous slide |
| ← , H | Navigate left |
| → , L | Navigate right |
| ↑ , K | Navigate up |
| ↓ , J | Navigate down |
| Alt + ←/↑/→/↓ | Navigate without fragments |
| Shift + ←/↑/→/↓ | Jump to first/last slide |
| B , . | Pause |
| F | Fullscreen |
| G | Jump to slide |
| ESC , O | Slide overview |
| S | Speaker notes view |
