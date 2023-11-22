import 'bootstrap-datepicker';
import 'bootstrap-datepicker/js/locales/bootstrap-datepicker.ru';

export default function datepicker() {
  const elements = Array.from(document.querySelectorAll('.js-datepicker'));

  elements.forEach((element) => {
    $(element)
      .datepicker({
        format: 'dd.mm.yyyy',
        container: element.hasAttribute('data-picker-container')
          ? element.getAttribute('data-picker-container')
          : '#picker-container',
        language: 'ru',
        autoclose: true,
      })
      .on('show', (e) => {
        element.classList.add('datepicker-shown');
      })
      .on('hide', (e) => {
        element.classList.remove('datepicker-shown');
      })
      .on('changeDate', (e) => {
        $(element).trigger('blur');
      });
  });
}
