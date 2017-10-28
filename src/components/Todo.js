// eslint-disable-next-line
export default class TodoItem extends Daisy.Component {
    state(state) {
        return Object.assign(state, {
            checkedClass: 'checked',
            uncheckedClass: 'unchecked',
        });
    }

    render() {
        return `
            <li class="todo {{!!status ? 'completed': ''}}">
                <div class="view"
                    @onClick={{this.emit('click', name)}}
                >
                    <input type="checkbox" 
                        class="toggle" 
                        checked={{!!status}} 
                    >
                    <label
                        class={{status ? checkedClass : uncheckedClass}}
                    >{{name}}</label> <button class="destroy" @onClick={{this.emit('destroy')}}></button>    
                </div>
                <input type="text" class="edit">
            </li>`;
    }

    // eslint-disable-next-line
    parsed(ast) {
    }
}
