import filter from './filter';

const list = (list, s) => list.filter(item => filter(item.status, s));

export default list;