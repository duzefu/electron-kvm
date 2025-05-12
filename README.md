# electron-kvm

[English](#english) | [中文](#chinese)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)


<a name="chinese"></a>
## 中文

尝试解决浏览器本身各种启动参数导致pikvm延迟表现不佳的软件,electron套壳软件

### 使用方法
#### 1.安装npm,wine
```bash
apt install npm wine
```
> wine用于在linux服务器上编译windows软件

> 最新支持快捷键拦截的版本似乎只能在windows上进行编译了,请自行查找安装`nodejs`和`Visual Studio Build Tools`的方法 https://visualstudio.microsoft.com/visual-cpp-build-tools/

#### 2.安装electron
```bash
npm install electron --save-dev
npm install electron-builder --save-dev
npm install electron-store@8.1.0
npm install -g node-gyp
npm install node-api
```

#### 3.编译EXE
```bash
npm run build
```

#### 4.获取
程序在`dist/KVM Viewer Setup 1.0.0.exe`

### 仅用于测试
> 我发现pikvm的延迟在electron应用中的延迟表现,会比chrome或者firefox上更好.

> 虽然不懂为什么,但是我写了这个app来方便展示和测试

<a name="english"></a>
## English

An Electron-based application attempting to resolve high latency issues in PiKVM caused by various browser launch parameters.

### Usage
#### 1. Install npm and wine
```bash
apt install npm wine
```
> Wine is used for compiling Windows software on Linux servers

> The latest version that supports shortcut key interception seems to be able to compile only on windows. Please look for the methods to install `nodejs` and` Visual Studio Build Tools` by yourself https://visualstudio.microsoft.com/visual-cpp-build-tools/

#### 2. Install electron
```bash
npm install electron --save-dev
npm install electron-builder --save-dev
npm install electron-store@8.1.0
npm install -g node-gyp
npm install node-api
```

#### 3. Build EXE
```bash
npm run build
```

#### 4. Get the Application
The program is located at `dist/KVM Viewer Setup 1.0.0.exe`

### For Testing Only
> I discovered that PiKVM's latency performance in the Electron application is better than in Chrome or Firefox.

> Although I don't understand why, I wrote this app for easy demonstration and testing purposes.

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=duzefu/electron-kvm&type=Date)](https://www.star-history.com/#duzefu/electron-kvm&Date)