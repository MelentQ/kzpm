import { primaryInput } from 'detect-it';

export default function () {
  // Определение тач устройств

  function appendStyle(styles) {
    const css = document.createElement('style');
    css.type = 'text/css';

    if (css.styleSheet) css.styleSheet.cssText = styles;
    else css.appendChild(document.createTextNode(styles));

    document.getElementsByTagName('head')[0].appendChild(css);
  }

  if (primaryInput === 'touch') {
    document.body.classList.remove('no-touch');
    document.body.classList.add('touch');

    const styles = '* {cursor: pointer; }';

    window.onload = function () {
      appendStyle(styles);
    };
  }
}
