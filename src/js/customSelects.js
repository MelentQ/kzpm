import Choices from 'choices.js';

export default function customSelects() {
  const containers = Array.from(document.querySelectorAll('.js-custom-select'));

  containers.forEach((select) => {
    const parentForm = select.closest('form');
    const instance = new Choices(select, {
      searchEnabled: false,
      itemSelectText: '',
      shouldSort: false,
    });

    instance.passedElement.element.addEventListener(
      'choice',
      () => {
        setTimeout(() => {
          $(instance.passedElement.element).parsley().validate();
        }, 100);
      },
      false,
    );

    if (parentForm) {
      parentForm.addEventListener('reset', () => {
        console.log('Parent form reset');

        instance.setChoiceByValue(defaultValue);
      });
    }
  });
}
