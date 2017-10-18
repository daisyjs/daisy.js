import Index from './components/Index';
const index = new Index({
    state: {}
}).mount(document.querySelector('#app'));

index.setState({
    'todoList.0': {
        status: 0,
        name: 'Hello world',
    },
});