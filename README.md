# 东软政务云基础平台|管理控制台UI

## 一、准备开发环境

1. **安装Node Version Manager(nvm)**

> Windows下安装请参考[Node Version Manager (nvm) for Windows](https://github.com/coreybutler/nvm-windows)
> 
> 其他安装请参考[Node Version Manager](https://github.com/creationix/nvm)

2. **安装NodeJS**

```bash
# 安装nodejs
$ nvm install

# 激活所安装的版本
$ nvm use

# 确认node被安装
$ node --version

# 确认npm被安装
$ npm --version
```

> 本工程使用nodejs 5.10.1，和npm 3.8.3作为开发环境

3. **安装开发工具**

```bash
$ npm install babel babel-cli webpack webpack-dev-server -g
```

4. **初始化工程**

```bash
# 从git上下载工程代码
$ git clone http://192.168.131.211:7777/ngcp/ngcp-console-ui.git

# 初始化工程环境，在工程的根目录下执行
$ npm install
```

至此，开发环境准备完毕。

## 二、代码目录结构

```bash
├─build	         # 运行环境
│  └─public      # 生成的目标文件
├─docs           # 项目文档
├─src            # 源代码
│  ├─components  # React组件
│  ├─decorators  # React Higher-Order组件
│  ├─pages       # 页面源文件
│  ├─public      # 图片等其他所需文件
│  └─styles      # 样式文件
└─tools          # 开发脚本
```

## 三、开发脚本

```bash
# 启动webpack-dev-server，默认访问路径http://localhost:8080
$ npm start

# build源代码，目标文件位于./build/public下，可以带两个参数
$ npm run build [--release] [--verbose]

# 将目标代码release到git库中
$ npm run deploy [--production]
```
