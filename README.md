# 使用方法
## 1.安装npm,wine
```
apt install npm wine
```
> wine用于在linux服务器上编译windows软件

## 2.安装electron
```
npm install electron --save-dev
npm install electron-builder --save-dev
```

## 3.编译EXE
```
npm run build
```

## 4.获取
程序在`dist/KVM Viewer Setup 1.0.0.exe`


# 仅用于测试
> 我发现pikvm的延迟在electron应用中的延迟表现,会比chrome或者firefox上更好.

>虽然不懂为什么,但是我写了这个app来方便展示和测试