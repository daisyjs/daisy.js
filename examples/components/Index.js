import Header from './Header';
import TodoList from './TodoList';
import TodoItem from './TodoItem';
import NoTodoList from './NoTodoList';

// eslint-disable-next-line
export default class Component extends Daisy {
    get state() {
        return Object.assign(
            super.state, {
                history: [],
                todoList: [
                    {
                        name: 'ast -> virtual nodes 2017-10-3',
                        status: true
                    }, {
                        name: 'virtual dom 2017-10-4',
                        status: false
                    }, {
                        name: 'events 2017-10-5',
                        status: false
                    }, {
                        name: 'directive 2017-10-6',
                        status: false
                    }, {
                        name: 'component 2017-10-7',
                        status: false
                    }
                ]
            }
        );
    }
    render() {
        return `<Header
            length={{todoList.length}}
        ></Header>
        
        <block :if = "{{todoList.length > 0}}">
            <TodoList
                todoList={{todoList}}
                @on-delete={{this.onDelete(e)}}>
                <li 
                    :for={{todoList}} 
                    :for-item={{todo}} 
                    :for-index={{todoIndex}}
                    @on-click={{this.onButtonClick(todo, todoIndex)}}>
                    <Todo
                        status={{todo.status}}
                        name={{todo.name}}
                        @on-delete={{this.onDelete(todoIndex)}}
                        todoIndex={{todoIndex}}></Todo>
                </li>
            </TodoList>
        </block>
        <block :else>
            <NoTodoList></NoTodoList>
        </block>
        <div style="text-align: center; margin-top: 20px;">
            <input 
                type="text" 
                placeholder="input your plan"
                @ref="input"
            > 
            <button @on-click={{this.onAdd()}}>add</button>
            <button @on-click={{this.onReset()}}>reset</button>
        </div>`;
    }
    constructor(options) {
        super(options);
        this.on('deleted', function(msg) {
            // eslint-disable-next-line
            console.log('deleted: ' + msg.name);
        });
    }
    parsed() {
        // eslint-disable-next-line
        console.log('-- afterParsed --');
    }
    ready() {
        // eslint-disable-next-line
        console.log('-- afterInited --');
    }
    mounted(dom) {
        // eslint-disable-next-line
        console.log('-- afterMounted --');
        // eslint-disable-next-line
        console.log(dom);
    }
    patched(dom) {
        // eslint-disable-next-line
        console.log('-- afterPatched --');
        // eslint-disable-next-line
        console.log(dom);
    }
    onHeaderClick() {
        // eslint-disable-next-line
        console.log('-- onHeaderClick --');
    }

    onButtonClick(todo, index) {
        const todoList = this.getState().todoList;

        todoList[index].status = !todoList[index].status;
        this.setState({
            todoList: todoList
        });
    }

    onAdd() {
        const input = this.refs.input;
        const value = input.value;
        const todoList = this.getState().todoList;

        this.setState({
            todoList: [
                ...todoList,
                {
                    name: value,
                    status: false
                }
            ]
        });
    }
    onReset() {
        this.setState({
            todoList: this.state.todoList
        });
    }

    onDelete(index) {
        const todoList = this.getState().todoList;
        this.setState({
            todoList: [
                ...todoList.slice(0, index),
                ...todoList.slice(index + 1, todoList.length)
            ]
        });
    }
}

Component.component('Header', Header);
Component.component('TodoList', TodoList);
Component.component('Todo', TodoItem);
Component.component('NoTodoList', NoTodoList);
