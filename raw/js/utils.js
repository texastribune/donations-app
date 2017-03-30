// https://davidwalsh.name/javascript-debounce-function
export function debounce(func, wait, immediate) {
  let timeout;

  return function() {
    const context = this;
    const args = arguments;
    const callNow = immediate && !timeout;

    clearTimeout(timeout);

    timeout = setTimeout(function() {
      timeout = null;

      if (!immediate) {
        func.apply(context, args);
      }
    }, wait);

    if (callNow) {
      func.apply(context, args);
    }
  };
}

export function getSupportedTransform() {
  const prefixes = 'transform -webkit-transform -moz-transform -o-transform -ms-transform'.split(' ');
  const div = document.createElement('div');

  for (let i = 0; i < prefixes.length; i++) {
    if (div && div.style[prefixes[i]] !== undefined) {
      return prefixes[i];
    }
  }

  return 'transform';
}
