// eslint-disable-next-line
export default class Header extends Daisy {
    render() {
        return `<header class="header">
            <h1>{{title}} todos</h1>
            <template :include={{this.body}}></template>
        </header>`;
    }
}