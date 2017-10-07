
// eslint-disable-next-line
export default class TodoList extends Daisy {
    render() {
        return '<ul class="body"><block :include={{this.body}}></block></ul>';
    }

    onClick() {
        // eslint-disable-next-line
        console.log('共' + this.getState().length + '条');
    }
}