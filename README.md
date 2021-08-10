# PC端项目

基于 https://github.com/maximegris/angular-electron 开发

前端框架：使用https://angular.io 12

UI框架：使用https://material.angular.io 12

布局框架：https://github.com/angular/flex-layout

## 安装

```shell
cd caomei-desktop-angular
yarn
```

## 运行
```shell
yarn start
```

## 打包，默认生产mac和win系统应用到release文件夹
```shell
yarn electron:build
```

## 项目结构

- assets：资源
- src
  - app
    - assets: 图片资源，只能import使用
    - client: H5SDK
    - common: 公共助手功能
    - config：配置文件
    - factorys：公共模块
      - empty-data：没内容时显示
      - message：展示不同消息类型， 入口 message-factory
      - title-bar：标题栏
      - upload：上传文件
    - forms：表单文件
    - libs: 替换为 client
    - models：数据模型
    - modules：功能模块
    - services：服务目录
    - shared/formly：表单字段类型定制
  - environments：环境变量配置
  - themes：主题scss文件
  

### 表单开发

简单表单推荐使用

https://material.angular.io/components/form-field/overview

复杂表单使用单独文件驱动，见forms目录

参考：https://github.com/ngx-formly/ngx-formly

