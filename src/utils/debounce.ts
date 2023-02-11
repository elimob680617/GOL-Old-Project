import _debounce from 'lodash/debounce';

const debounceFn = _debounce((callback) => {
  callback();
}, 500);

export default debounceFn;
