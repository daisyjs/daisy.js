import Header from './Header';
import Todo from './Todo';
import Footer from './Footer';
import Info from './Info';
import Main from './Main';


// eslint-disable-next-line
export default class Component extends Daisy {
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
Component.component('Todo', Todo);
Component.component('Footer', Footer);
Component.component('Info', Info);
Component.component('Main', Main);
