// eslint-disable-next-line
export default class TodoItem extends Daisy.Component {
    render() {
        return `
            <li class="todo {{!!status ? 'completed': ''}}">
                <div class="view">
                    <input type="checkbox" 
                        class="toggle" 
                        checked={{!!status}} 
                        @onClick={{this.emit('click', name)}}
                    >
                    <label>{{name}}</label> <button class="destroy" @onClick={{this.emit('destroy')}}></button>    
                </div>
                <input type="text" class="edit">
            </li>`;
    }

    // eslint-disable-next-line
    parsed(ast) {
    }
}
