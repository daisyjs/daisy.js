import Header from './Header';
import Todo from './Todo';
import Footer from './Footer';
import Info from './Info';
import Main from './Main';
import filter from '../methods/filter';
import list from '../methods/list';
import size from '../methods/size';

// eslint-disable-next-line
const {component, method, directive, event, computed} = Daisy.annotations;

@component({Todo, Header, Footer, Info, Main})
@method({filter, size, list})
@directive()
@event()
@computed({ 
    todos() {
        return 'todos';
    }
})

// eslint-disable-next-line
export default class Component extends Daisy.Component {
    state(props = {}) {
        return Object.assign({
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
        }, props);
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
                    @on-click={{this.onTodoClick(item, $event)}}
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
            this.refs.input.value = '';
        }
    }

    onTodoClick(todo) {
        let todoList = this.getState().todoList;
        const index = todoList.indexOf(todoList.filter(({name}) => name === todo.name )[0]);
        
        this.setState({
            [`todoList.${index}.status`]: Number(!todo.status)
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
            [`todoList.${todoList.length + 1}`]: {
                name: value,
                status: 0
            }
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
            todoList: todoList.map((item) => Object.assign(item, {
                status: 0
            }))
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