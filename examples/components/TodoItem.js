// eslint-disable-next-line
export default class TodoItem extends Daisy {
    render() {
        return `<p>
            <input 
                type="checkbox" 
                checked={{isChecked(status)}}
            > {{index(todoIndex)}} {{name}}
            <button 
                @on-click={{this.onDelete(e, todoIndex)}}
            >delete</button>
        </p>`;
    }

    onDelete(e, index) {
        this.emit('delete', index);
        e.stopPropagation();
    }
}
TodoItem.method('isChecked', (status) => {
    return !!status;
});

TodoItem.method('index', (index) => {
    return index + 1 + '.';
});