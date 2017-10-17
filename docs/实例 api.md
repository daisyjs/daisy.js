## 生命周期

### 1. constructor
* compose - 组合 options 中的 state
* createRender - 初始化 render 函数
* render() - 生成虚拟 dom


### 2. mount
* createElements - 生成真实 dom
* 插入页面


### 3. setState
* render - 生成 virtual dom
* diff - diff virtual dom
* patch