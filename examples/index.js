import Index from './components/Index';
const index = new Index({
    props: {
        todoList: [{
            status: 0,
            name: 'default todo',
        }]   
    }
}).mount(document.querySelector('#app'));

index.setState({
    'todoList.0.name': 'sample todo'
});