1. 这是个什么
   这是一个 webpack plugin (CreateLockCode 本质是一个返回类的函数)
2. 有什么用
   可以在代码打包之前，检测你指定的文件是否被篡改过
3. 可以说一些具体的使用场景吗
   1. 实习生开发过程中可能为了方便把某些权限判断和路由跳转给修改了
      1. 提交代码的时候一次提交多个文件，导致code review的时候难以发现
      2. 打包的之后，测试不可能说每次都把所有的权限都测试一遍
   2. 开发过程中临时使用fake假数据，打包上线的时候可以自动重置相关代码。
4. 我如何使用这套插件
    [demo.js](https://github.com/mczhaozl/LockCode/demo)<br />
5. 插件集有哪些，是否还有其它的插件<br />
   1. [版本记录器](https://github.com/mczhaozl/VersionRecord)<br />
   2. [代码片段校验器](https://github.com/mczhaozl/CreateCheckFragment)<br />
   3. [代码防篡改](https://github.com/mczhaozl/LockCode)<br />