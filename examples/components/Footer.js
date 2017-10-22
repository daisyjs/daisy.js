// eslint-disable-next-line
export default class Footer extends Daisy.Component{
    render() {
        return `
        <footer class="footer">
            <span class="todo-count"><strong>{{size}}</strong> items left</span>
            <ul class="filters">
                <li :for={{statusList}}>
                    <a href="#/all" class="{{item.type === status? 'selected': ''}}" @onClick={{this.onFilterClick(item.type)}}>{{item.name}}</a>
                </li>
            </ul>
            <button class="clear-completed" @onClick={{this.emit('clear')}}>Clear completed</button>
        </footer>`;
    }

    onFilterClick(type) {
        this.emit('change', type);
    }
}