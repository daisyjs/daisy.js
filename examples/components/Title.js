// eslint-disable-next-line
export default class Title extends Daisy {
    render() {
        return '<h1><block :include={{this.body}}></block></h1>';
    }
}