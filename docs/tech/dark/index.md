<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>加密演示</title>
</head>
<body>
<script>
// 在这里定义密码
var xx = '0820';  // 设置正确密码

function password() {    
  var testV = 1; // 计数器，记录密码错误次数
  var psw = prompt("请输入密码：", ""); // 弹出密码框

  // 允许用户最多输入 3 次密码
  while (testV < 3) {
    if (!psw) {
      alert("密码不能为空，请输入密码！");
      psw = prompt("请输入密码：", "");  // 重新请求密码
      continue;
    }
    
    if (psw === xx) {  // 如果密码正确，跳转到新页面
      location.href = "intro"; 
      break;
    }
    
    // 密码错误时，增加错误计数live
    testV += 1;
    psw = prompt("密码错误，请重新输入密码：", "");  // 密码错误，继续请求密码
  }

  // 如果密码错误 3 次，显示提示并停止输入
  if (psw !== xx && testV === 3) {
    alert("您已多次输入错误密码，无法继续访问该页面！");
  }
  return " "; // 返回空字符串结束函数
}

// 执行密码验证
password();
</script>
</body>
</html>
