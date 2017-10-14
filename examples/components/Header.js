// eslint-disable-next-line
export default class Header extends Daisy {
    render() {
        return `<header class="header">
            <h1>{{todos}}</h1>
            <template :include={{this.body}}></template>
        </header>`;
    }
}