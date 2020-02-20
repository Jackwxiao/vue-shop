# vue商城后台管理系统

**功能：**

用于管理用户账号，商品分类，商品信息，订单，数据统计等业务功能；

**开发模式：**


电商后台管理系统整体采用前后端分离的开发模式,其中前端项目是基于Vue技术栈的SPA项目；

**涉及前端技术栈：**

* Vue 全家桶
* Element - UI
* Axios
* Less
* JavaScript
* Eslint
* Babel
* ...
  
**涉及后端的技术栈**

* Node.js
* Express
* Mysql
* ...

### 项目上线

#### 通过 Node 创建 Web 服务器
新创建node项目,并安装express,通过express快速创建web服务器,将vue打包生成的dist文件夹,托管为静态资源即可,关键代码如下： 

```
// 1. npm init -y
// 2. npm i express -S
// 3. 将打包后的dist放入node项目中
// 4. 
const express = require('express')
const app = express()

app.use(express.static('./dist'))
app.listen(80, () => {
    console.log('server runing at http://127.0.0.1')
})
// 5. node app.js启动项目
```

#### 使用pm2管理应用

```
1. npm i pm2 -g //全局安装
2. pm2 start 脚本(如./app.js) --name 自定义名称 // 启动项目
3. pm2 ls //查看服务器运行的项目
4. pm2 restart 自定义名称 //重启项目
5. pm2 stop 自定义名称 //停止项目
6. pm2 delete 自定义名称 //删除项目
```

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Run your tests
```
yarn run test
```

### Lints and fixes files
```
yarn run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
