// eslint-disable-next-line
export default class Main extends Daisy {
    render() {
        return `<section class="main"><input type="checkbox" class="toggle-all"> 
            <ul class="todo-list">
                <template :include={{this.body}}/>
            </ul>
        </section>`;
    }
}