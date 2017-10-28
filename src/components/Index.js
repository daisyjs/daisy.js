import Header from './Header';
import Todo from './Todo';
import Footer from './Footer';
import Info from './Info';
import Main from './Main';
import filter from '../methods/filter';
import list from '../methods/list';
import size from '../methods/size';

const ALL = 2;		
const ACTIVE = 0;		
const COMPLETED = 1;

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
        let lastState = {};
        if (localStorage.getItem('todoState')) {
            lastState = JSON.parse(localStorage.getItem('todoState'));
        }
        return Object.assign({
            history: [],
            status: 2,
            todoList: [
            ],
            activeStatus: ACTIVE,
            statusList: [
                {
                    name: 'All',
                    type: ALL
                },
                {
                    name: 'Active',
                    type: ACTIVE
                },
                {
                    name: 'completed',
                    type: COMPLETED
                }
            ]
        }, props, lastState);
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
                    @onKeydown={{this.onKeyDown($event)}}
                    @ref="input"
                >
            </Header>
            <Main>
                <Todo
                    :for={{todoList}}
                    :if={{filter(item.status, status)}}
                    name={{item.name}}
                    status={{item.status}}
                    todo={{item}}
                    @onClick={{this.onTodoClick(item, $event)}}
                    @onDestroy={{this.onDestroy(index)}}
                ></Todo>
            </Main>
            <Footer
                :if={{todoList.length > 0}}
                size={{size(todoList, activeStatus)}}
                status={{status}}
                statusList={{statusList}}
                @onChange={{this.onStatusChange($event)}}
                @onClear={{this.onClear()}}
            ></Footer>
        </section>`;
    }
    
    onKeyDown({keyCode}) {
        if (keyCode === 13) {
            const value = this.refs.input.value;
            this.add(value);
            this.refs.input.value = '';
        }
    }

    onTodoClick(todo) {
        const todoList = this.getState().todoList;
        const index = todoList.indexOf(todo);
        
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
            [`todoList.${todoList.length}`]: {
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
        const todoList = this.getState().todoList.filter((item) => !item.status);
        this.setState({
            todoList
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
        localStorage.setItem('todoState', 
            JSON.stringify(
                this.getState()
            )
        );
    }

    onReset() {
        this.setState({
            todoList: this.state.todoList
        });
    }
}