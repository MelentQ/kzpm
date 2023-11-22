import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';

export default function headerSlider() {
  const containers = document.querySelectorAll('.js-header-slider');
  containers.forEach((container) => {
    const $nextEl = container.querySelector('.page-header__top-slider-navigation-next');
    const $prevEl = container.querySelector('.page-header__top-slider-navigation-prev');
    const $pagination = container.querySelector('.page-header__top-slider-pagination');

    new Swiper(container, {
      modules: [Navigation, Pagination],
      navigation: {
        nextEl: $nextEl,
        prevEl: $prevEl,
      },
      pagination: {
        el: $pagination,
        type: 'fraction',
      },
    });
  });
}
