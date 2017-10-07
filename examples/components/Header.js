import Title from './Title';

// eslint-disable-next-line
export default class Header extends Daisy {
    get state() {
        return {
            title: 'Daisy'
        };
    }
    render() {
        return `<header class="header" @on-click={{this.onClick()}}>
            <Title>{{title}}</Title>
            <h2>共 {{length}} 条 TodoList！</h2>
        </header>`;
    }

    onClick() {
        // eslint-disable-next-line
        console.log('共' + this.getState().length + '条');
        this.setState({
            title: this.getState().title === 'Daisy' ? 'Hello, Guy' : 'Daisy'
        });
    }
}

Header.component('Title', Title);
