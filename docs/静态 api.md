## 初始化

### 1. 继承

```js
class Componet extends Daisy {
    render() {

    }
}
```

### 2. 注册事件

```js
Component.event('touch', () => {});
```

### 3. 注册组件
```js
class Header extends Daisy {
    render() {
        return `<header>Header</header>`
    }
}

Component.component('Header', Header);
```


### 4. 注册方法
```js
Component.method('isArray', (item) => {
    return item.isArray(item);
})
```


### 5. 注册 computed

```js
Component.computed('hasList', () => {
    return this.getState().list && this.getState().list.length > 0;
})
```