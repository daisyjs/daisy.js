import filter from './filter';

const list = (list, s) => list.filter(item => item.status === s);

export default list;