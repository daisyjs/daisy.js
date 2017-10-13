// eslint-disable-next-line
export default class Footer extends Daisy{
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