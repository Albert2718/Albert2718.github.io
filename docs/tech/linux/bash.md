## 文件操作


## 网络配置

### 开启wifi
> wlan0即无线局域网接口的名称

```sh
if config wlan0 up
```

### 连接wifi

通过 `wpa_supplicant` 程序，根据配置文件 `/etc/wpa_supplicant.conf` 连接到指定的 Wi-Fi 网络，并完成加密认证。

```sh
wpa_supplicant -B -c /etc/wpa_supplicant.conf -i wlan0
```

### 配置IP
通过DHCP协议自动获取IP地址
```sh
udhcpc -i wlan0
```

### 基础网络诊断

`ping` 命令是网络诊断中最基础且实用的工具，用于测试主机之间的网络连通性。它通过发送 ICMP（Internet Control Message Protocol）回显请求包到目标主机，并等待对方的回显应答，从而判断网络是否通畅、延迟是否正常。

```bash
ping 8.8.8.8
```