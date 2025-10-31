.PHONY: live build clean

# 判断系统类型（Windows_NT 表示 Windows）
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

# 自定义端口号（可根据需要改）
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
