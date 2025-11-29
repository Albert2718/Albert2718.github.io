
## zip 

参考：<https://www.runoob.com/linux/linux-comm-zip.html>

### 语法

``` shell
zip [options] output.zip file1 file2 ...
```

-   `output.zip`：生成的压缩文件名。
-   `file1 file2 ...`：要压缩的文件或目录。

**options 参数选项：**

-   `-r`：递归压缩目录及其子目录中的所有文件。
-   `-e`：为压缩文件设置密码保护。
-   `-q`：静默模式，不显示压缩过程。
-   `-v`：显示详细的压缩过程。
-   `-x`：排除某些文件或目录，不进行压缩。
-   `-m`：压缩后删除原始文件。
-   `-0` 到 `-9`：指定压缩级别，`-0` 表示存储不压缩，`-9` 表示最高压缩率，默认是 `-6`。

### 注意事项

Python环境中运行zip命令需要通过 ! 前缀来执行 shell 命令。