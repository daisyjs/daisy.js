(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

// eslint-disable-next-line
class Header extends Daisy {
    render() {
        return `<header class="header">
            <h1>{{todos}}</h1>
            <template :include={{this.body}}></template>
        </header>`;
    }
}

// eslint-disable-next-line
class TodoItem extends Daisy {
    render() {
        return `
            <li class="todo {{!!status ? 'completed': ''}}">
                <div class="view">
                    <input type="checkbox" 
                        class="toggle" 
                        checked={{!!status}} 
                        @on-click={{this.emit('click')}}
                    >
                    <label>{{name}}</label> <button class="destroy" @on-click={{this.emit('destroy')}}></button>    
                </div>
                <input type="text" class="edit">
            </li>`;
    }

    // eslint-disable-next-line
    parsed(ast) {
    }
}

// eslint-disable-next-line
class Footer extends Daisy{
    render() {
        return `
        <footer class="footer">
            <span class="todo-count"><strong>{{size}}</strong> items left</span>
            <ul class="filters">
                <li :for={{statusList}}>
                    <a href="#/all" class="{{item.type === status? 'selected': ''}}" @on-click={{this.emit('change', item.type)}}>{{item.name}}</a>
                </li>
            </ul>
            <button class="clear-completed" @on-click={{this.emit('clear')}}>Clear completed</button>
        </footer>`;
    }
}

// eslint-disable-next-line
class Info extends Daisy {
    render() {
        return `<footer class="info">
			<p>Double-click to edit a todo</p>
			<p>Written by <a href="http://evanyou.me">Evan You</a></p>
			<p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
		</footer>`;
    }
}

// eslint-disable-next-line
class Main extends Daisy {
    render() {
        return `<section class="main"><input type="checkbox" class="toggle-all"> 
            <ul class="todo-list">
                <template :include={{this.body}}/>
            </ul>
        </section>`;
    }
}

// eslint-disable-next-line
class Component extends Daisy {
    state() {
        return Object.assign(
            super.state, {
                history: [],
                status: 2,
                todoList: [
                ],
                statusList: [
                    {
                        name: 'All',
                        type: 2
                    },
                    {
                        name: 'Active',
                        type: 0
                    },
                    {
                        name: 'completed',
                        type: 1
                    }
                ]
            }
        );
    }
    render() {
        return `<section class="todoapp">
            <Header
                title={{todos}}
            >
                <input
                    autofocus="autofocus"
                    autocomplete="off"
                    placeholder="What needs to be done?"
                    class="new-todo"
                    @on-keydown={{this.onKeyDown($event)}}
                    @ref="input"
                >
            </Header>
            <Main>
                <Todo
                    :for={{todoList}}
                    :if={{filter(item.status, status)}}
                    name={{item.name}}
                    status={{item.status}}
                    @on-click={{this.onTodoClick(item)}}
                    @on-destroy={{this.onDestroy(index)}}
                ></Todo>
            </Main>
            <Footer
                :if={{todoList.length > 0}}
                size={{size(todoList, status)}}
                status={{status}}
                statusList={{statusList}}
                @on-change={{this.onStatusChange($event)}}
                @on-clear={{this.onClear()}}
            ></Footer>
        </section>`;
    }
    constructor(options) {
        super(options);
        this.on('deleted', function(msg) {
            // eslint-disable-next-line
            console.log('deleted: ' + msg.name);
        });
    }
    onKeyDown({keyCode}) {
        if (keyCode === 13) {
            const value = this.refs.input.value;
            this.add(value);
        }
    }

    onTodoClick(todo) {
        let todoList = this.getState().todoList;
        const index = todoList.indexOf(todoList.filter(({name}) => name === todo.name )[0]);

        this.setState({
            todoList: [
                ...todoList.slice(0, index),
                Object.assign({}, todo, {
                    status: Number(!todo.status)
                }),
                ...todoList.slice(index+1)
            ]
        });
    }

    onDestroy(index) {
        let todoList = this.getState().todoList;
        this.setState({
            todoList: [
                ...todoList.slice(0, index),
                ...todoList.slice(index+1)
            ]
        });
    }

    add(value) {
        const todoList = this.getState().todoList;
        this.setState({
            todoList: [
                ...todoList,
                {
                    name: value,
                    status: 0
                }
            ]
        });
    }

    onStatusChange(status) {
        this.setState({
            status
        });
    }

    onClear() {
        const todoList = this.getState().todoList;

        this.setState({
            todoList: todoList.map((item) => Object.assign({}, item, {status: 0}))
        });
    }

    // eslint-disable-next-line
    parsed() {
    }

    // eslint-disable-next-line
    ready() {
    }

    // eslint-disable-next-line
    mounted(dom) {
    }

    // eslint-disable-next-line
    patched(dom) {
    }

    onReset() {
        this.setState({
            todoList: this.state.todoList
        });
    }
}
const filter = (status, s) => (s === 2 ? true : (status === s));
const list = (list, s) => list.filter(item => filter(item.status, s));

Component.method('filter', filter);
Component.method('size', (li, s) => list(li, s).length);
Component.computed('todos', () => 'todos');

Component.component('Header', Header);
Component.component('Todo', TodoItem);
Component.component('Footer', Footer);
Component.component('Info', Info);
Component.component('Main', Main);

new Component({
    state: {}
}).mount(document.querySelector('#app'));

})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlzdC5qcyIsInNvdXJjZXMiOlsiY29tcG9uZW50cy9IZWFkZXIuanMiLCJjb21wb25lbnRzL1RvZG8uanMiLCJjb21wb25lbnRzL0Zvb3Rlci5qcyIsImNvbXBvbmVudHMvSW5mby5qcyIsImNvbXBvbmVudHMvTWFpbi5qcyIsImNvbXBvbmVudHMvSW5kZXguanMiLCJpbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEhlYWRlciBleHRlbmRzIERhaXN5IHtcbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybiBgPGhlYWRlciBjbGFzcz1cImhlYWRlclwiPlxuICAgICAgICAgICAgPGgxPnt7dG9kb3N9fTwvaDE+XG4gICAgICAgICAgICA8dGVtcGxhdGUgOmluY2x1ZGU9e3t0aGlzLmJvZHl9fT48L3RlbXBsYXRlPlxuICAgICAgICA8L2hlYWRlcj5gO1xuICAgIH1cbn0iLCIvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRvZG9JdGVtIGV4dGVuZHMgRGFpc3kge1xuICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIGBcbiAgICAgICAgICAgIDxsaSBjbGFzcz1cInRvZG8ge3shIXN0YXR1cyA/ICdjb21wbGV0ZWQnOiAnJ319XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInZpZXdcIj5cbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIFxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJ0b2dnbGVcIiBcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrZWQ9e3shIXN0YXR1c319IFxuICAgICAgICAgICAgICAgICAgICAgICAgQG9uLWNsaWNrPXt7dGhpcy5lbWl0KCdjbGljaycpfX1cbiAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICA8bGFiZWw+e3tuYW1lfX08L2xhYmVsPiA8YnV0dG9uIGNsYXNzPVwiZGVzdHJveVwiIEBvbi1jbGljaz17e3RoaXMuZW1pdCgnZGVzdHJveScpfX0+PC9idXR0b24+ICAgIFxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZWRpdFwiPlxuICAgICAgICAgICAgPC9saT5gO1xuICAgIH1cblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuICAgIHBhcnNlZChhc3QpIHtcbiAgICB9XG59XG4iLCIvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZvb3RlciBleHRlbmRzIERhaXN5e1xuICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIGBcbiAgICAgICAgPGZvb3RlciBjbGFzcz1cImZvb3RlclwiPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ0b2RvLWNvdW50XCI+PHN0cm9uZz57e3NpemV9fTwvc3Ryb25nPiBpdGVtcyBsZWZ0PC9zcGFuPlxuICAgICAgICAgICAgPHVsIGNsYXNzPVwiZmlsdGVyc1wiPlxuICAgICAgICAgICAgICAgIDxsaSA6Zm9yPXt7c3RhdHVzTGlzdH19PlxuICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiIy9hbGxcIiBjbGFzcz1cInt7aXRlbS50eXBlID09PSBzdGF0dXM/ICdzZWxlY3RlZCc6ICcnfX1cIiBAb24tY2xpY2s9e3t0aGlzLmVtaXQoJ2NoYW5nZScsIGl0ZW0udHlwZSl9fT57e2l0ZW0ubmFtZX19PC9hPlxuICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImNsZWFyLWNvbXBsZXRlZFwiIEBvbi1jbGljaz17e3RoaXMuZW1pdCgnY2xlYXInKX19PkNsZWFyIGNvbXBsZXRlZDwvYnV0dG9uPlxuICAgICAgICA8L2Zvb3Rlcj5gO1xuICAgIH1cbn0iLCIvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEluZm8gZXh0ZW5kcyBEYWlzeSB7XG4gICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gYDxmb290ZXIgY2xhc3M9XCJpbmZvXCI+XG5cdFx0XHQ8cD5Eb3VibGUtY2xpY2sgdG8gZWRpdCBhIHRvZG88L3A+XG5cdFx0XHQ8cD5Xcml0dGVuIGJ5IDxhIGhyZWY9XCJodHRwOi8vZXZhbnlvdS5tZVwiPkV2YW4gWW91PC9hPjwvcD5cblx0XHRcdDxwPlBhcnQgb2YgPGEgaHJlZj1cImh0dHA6Ly90b2RvbXZjLmNvbVwiPlRvZG9NVkM8L2E+PC9wPlxuXHRcdDwvZm9vdGVyPmA7XG4gICAgfVxufSIsIi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWFpbiBleHRlbmRzIERhaXN5IHtcbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybiBgPHNlY3Rpb24gY2xhc3M9XCJtYWluXCI+PGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGNsYXNzPVwidG9nZ2xlLWFsbFwiPiBcbiAgICAgICAgICAgIDx1bCBjbGFzcz1cInRvZG8tbGlzdFwiPlxuICAgICAgICAgICAgICAgIDx0ZW1wbGF0ZSA6aW5jbHVkZT17e3RoaXMuYm9keX19Lz5cbiAgICAgICAgICAgIDwvdWw+XG4gICAgICAgIDwvc2VjdGlvbj5gO1xuICAgIH1cbn0iLCJpbXBvcnQgSGVhZGVyIGZyb20gJy4vSGVhZGVyJztcbmltcG9ydCBUb2RvIGZyb20gJy4vVG9kbyc7XG5pbXBvcnQgRm9vdGVyIGZyb20gJy4vRm9vdGVyJztcbmltcG9ydCBJbmZvIGZyb20gJy4vSW5mbyc7XG5pbXBvcnQgTWFpbiBmcm9tICcuL01haW4nO1xuXG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29tcG9uZW50IGV4dGVuZHMgRGFpc3kge1xuICAgIHN0YXRlKCkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihcbiAgICAgICAgICAgIHN1cGVyLnN0YXRlLCB7XG4gICAgICAgICAgICAgICAgaGlzdG9yeTogW10sXG4gICAgICAgICAgICAgICAgc3RhdHVzOiAyLFxuICAgICAgICAgICAgICAgIHRvZG9MaXN0OiBbXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBzdGF0dXNMaXN0OiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdBbGwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogMlxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnQWN0aXZlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IDBcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2NvbXBsZXRlZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAxXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfVxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIGA8c2VjdGlvbiBjbGFzcz1cInRvZG9hcHBcIj5cbiAgICAgICAgICAgIDxIZWFkZXJcbiAgICAgICAgICAgICAgICB0aXRsZT17e3RvZG9zfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgYXV0b2ZvY3VzPVwiYXV0b2ZvY3VzXCJcbiAgICAgICAgICAgICAgICAgICAgYXV0b2NvbXBsZXRlPVwib2ZmXCJcbiAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJXaGF0IG5lZWRzIHRvIGJlIGRvbmU/XCJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJuZXctdG9kb1wiXG4gICAgICAgICAgICAgICAgICAgIEBvbi1rZXlkb3duPXt7dGhpcy5vbktleURvd24oJGV2ZW50KX19XG4gICAgICAgICAgICAgICAgICAgIEByZWY9XCJpbnB1dFwiXG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgPC9IZWFkZXI+XG4gICAgICAgICAgICA8TWFpbj5cbiAgICAgICAgICAgICAgICA8VG9kb1xuICAgICAgICAgICAgICAgICAgICA6Zm9yPXt7dG9kb0xpc3R9fVxuICAgICAgICAgICAgICAgICAgICA6aWY9e3tmaWx0ZXIoaXRlbS5zdGF0dXMsIHN0YXR1cyl9fVxuICAgICAgICAgICAgICAgICAgICBuYW1lPXt7aXRlbS5uYW1lfX1cbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzPXt7aXRlbS5zdGF0dXN9fVxuICAgICAgICAgICAgICAgICAgICBAb24tY2xpY2s9e3t0aGlzLm9uVG9kb0NsaWNrKGl0ZW0pfX1cbiAgICAgICAgICAgICAgICAgICAgQG9uLWRlc3Ryb3k9e3t0aGlzLm9uRGVzdHJveShpbmRleCl9fVxuICAgICAgICAgICAgICAgID48L1RvZG8+XG4gICAgICAgICAgICA8L01haW4+XG4gICAgICAgICAgICA8Rm9vdGVyXG4gICAgICAgICAgICAgICAgOmlmPXt7dG9kb0xpc3QubGVuZ3RoID4gMH19XG4gICAgICAgICAgICAgICAgc2l6ZT17e3NpemUodG9kb0xpc3QsIHN0YXR1cyl9fVxuICAgICAgICAgICAgICAgIHN0YXR1cz17e3N0YXR1c319XG4gICAgICAgICAgICAgICAgc3RhdHVzTGlzdD17e3N0YXR1c0xpc3R9fVxuICAgICAgICAgICAgICAgIEBvbi1jaGFuZ2U9e3t0aGlzLm9uU3RhdHVzQ2hhbmdlKCRldmVudCl9fVxuICAgICAgICAgICAgICAgIEBvbi1jbGVhcj17e3RoaXMub25DbGVhcigpfX1cbiAgICAgICAgICAgID48L0Zvb3Rlcj5cbiAgICAgICAgPC9zZWN0aW9uPmA7XG4gICAgfVxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICAgICAgc3VwZXIob3B0aW9ucyk7XG4gICAgICAgIHRoaXMub24oJ2RlbGV0ZWQnLCBmdW5jdGlvbihtc2cpIHtcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuICAgICAgICAgICAgY29uc29sZS5sb2coJ2RlbGV0ZWQ6ICcgKyBtc2cubmFtZSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBvbktleURvd24oe2tleUNvZGV9KSB7XG4gICAgICAgIGlmIChrZXlDb2RlID09PSAxMykge1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLnJlZnMuaW5wdXQudmFsdWU7XG4gICAgICAgICAgICB0aGlzLmFkZCh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvblRvZG9DbGljayh0b2RvKSB7XG4gICAgICAgIGxldCB0b2RvTGlzdCA9IHRoaXMuZ2V0U3RhdGUoKS50b2RvTGlzdDtcbiAgICAgICAgY29uc3QgaW5kZXggPSB0b2RvTGlzdC5pbmRleE9mKHRvZG9MaXN0LmZpbHRlcigoe25hbWV9KSA9PiBuYW1lID09PSB0b2RvLm5hbWUgKVswXSk7XG5cbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICB0b2RvTGlzdDogW1xuICAgICAgICAgICAgICAgIC4uLnRvZG9MaXN0LnNsaWNlKDAsIGluZGV4KSxcbiAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKHt9LCB0b2RvLCB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogTnVtYmVyKCF0b2RvLnN0YXR1cylcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAuLi50b2RvTGlzdC5zbGljZShpbmRleCsxKVxuICAgICAgICAgICAgXVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBvbkRlc3Ryb3koaW5kZXgpIHtcbiAgICAgICAgbGV0IHRvZG9MaXN0ID0gdGhpcy5nZXRTdGF0ZSgpLnRvZG9MaXN0O1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIHRvZG9MaXN0OiBbXG4gICAgICAgICAgICAgICAgLi4udG9kb0xpc3Quc2xpY2UoMCwgaW5kZXgpLFxuICAgICAgICAgICAgICAgIC4uLnRvZG9MaXN0LnNsaWNlKGluZGV4KzEpXG4gICAgICAgICAgICBdXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFkZCh2YWx1ZSkge1xuICAgICAgICBjb25zdCB0b2RvTGlzdCA9IHRoaXMuZ2V0U3RhdGUoKS50b2RvTGlzdDtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICB0b2RvTGlzdDogW1xuICAgICAgICAgICAgICAgIC4uLnRvZG9MaXN0LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogdmFsdWUsXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogMFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgb25TdGF0dXNDaGFuZ2Uoc3RhdHVzKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgc3RhdHVzXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG9uQ2xlYXIoKSB7XG4gICAgICAgIGNvbnN0IHRvZG9MaXN0ID0gdGhpcy5nZXRTdGF0ZSgpLnRvZG9MaXN0O1xuXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgdG9kb0xpc3Q6IHRvZG9MaXN0Lm1hcCgoaXRlbSkgPT4gT2JqZWN0LmFzc2lnbih7fSwgaXRlbSwge3N0YXR1czogMH0pKVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbiAgICBwYXJzZWQoKSB7XG4gICAgfVxuXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG4gICAgcmVhZHkoKSB7XG4gICAgfVxuXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG4gICAgbW91bnRlZChkb20pIHtcbiAgICB9XG5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbiAgICBwYXRjaGVkKGRvbSkge1xuICAgIH1cblxuICAgIG9uUmVzZXQoKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgdG9kb0xpc3Q6IHRoaXMuc3RhdGUudG9kb0xpc3RcbiAgICAgICAgfSk7XG4gICAgfVxufVxuY29uc3QgZmlsdGVyID0gKHN0YXR1cywgcykgPT4gKHMgPT09IDIgPyB0cnVlIDogKHN0YXR1cyA9PT0gcykpO1xuY29uc3QgbGlzdCA9IChsaXN0LCBzKSA9PiBsaXN0LmZpbHRlcihpdGVtID0+IGZpbHRlcihpdGVtLnN0YXR1cywgcykpO1xuXG5Db21wb25lbnQubWV0aG9kKCdmaWx0ZXInLCBmaWx0ZXIpO1xuQ29tcG9uZW50Lm1ldGhvZCgnc2l6ZScsIChsaSwgcykgPT4gbGlzdChsaSwgcykubGVuZ3RoKTtcbkNvbXBvbmVudC5jb21wdXRlZCgndG9kb3MnLCAoKSA9PiAndG9kb3MnKTtcblxuQ29tcG9uZW50LmNvbXBvbmVudCgnSGVhZGVyJywgSGVhZGVyKTtcbkNvbXBvbmVudC5jb21wb25lbnQoJ1RvZG8nLCBUb2RvKTtcbkNvbXBvbmVudC5jb21wb25lbnQoJ0Zvb3RlcicsIEZvb3Rlcik7XG5Db21wb25lbnQuY29tcG9uZW50KCdJbmZvJywgSW5mbyk7XG5Db21wb25lbnQuY29tcG9uZW50KCdNYWluJywgTWFpbik7XG4iLCJpbXBvcnQgSW5kZXggZnJvbSAnLi9jb21wb25lbnRzL0luZGV4Jztcbm5ldyBJbmRleCh7XG4gICAgc3RhdGU6IHt9XG59KS5tb3VudChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYXBwJykpOyJdLCJuYW1lcyI6WyJUb2RvIiwiSW5kZXgiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBO0FBQ0EsQUFB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
