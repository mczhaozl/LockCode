# LockCode

> 一个用于代码防篡改检测的 Webpack 插件

## 这是什么？

`CreateLockCode` 是一个 Webpack 插件（本质是一个返回类的工厂函数），用于在代码打包前自动检测指定文件是否被意外修改。

## 解决什么问题？

在团队协作开发中，某些核心文件（如权限控制、路由守卫、安全配置等）不应被随意修改。该插件可以：

- 在打包阶段自动校验文件完整性
- 发现篡改时阻止构建并给出明确提示
- 保护关键业务逻辑不被意外更改

## 使用场景

### 场景一：防止权限逻辑被误改

实习生或新成员在开发过程中，可能为了调试方便而修改权限判断或路由跳转逻辑：

- 一次提交包含多个文件，Code Review 时容易遗漏
- 测试阶段不可能每次都覆盖所有权限场景
- 问题往往在上线后才被发现

### 场景二：自动清理调试代码

开发过程中经常使用 Mock 数据或临时配置：

- 打包时自动检测并重置相关代码
- 避免调试代码被带到生产环境

## 快速开始

查看示例代码：[demo.js](https://github.com/mczhaozl/LockCode/blob/main/demo.js)

```javascript
// webpack.config.js
const CreateLockCode = require('lock-code');

module.exports = {
  plugins: [
    CreateLockCode({
      files: ['src/auth/permission.js', 'src/router/guard.js'],
      // 其他配置...
    })
  ]
};
```

## 相关插件

| 插件 | 说明 |
|------|------|
| [VersionRecord](https://github.com/mczhaozl/VersionRecord) | 版本记录器 - 自动记录构建版本信息 |
| [CreateCheckFragment](https://github.com/mczhaozl/CreateCheckFragment) | 代码片段校验器 - 校验特定代码片段 |
| [LockCode](https://github.com/mczhaozl/LockCode) | 代码防篡改 - 检测文件是否被修改 |
