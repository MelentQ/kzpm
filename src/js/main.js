import './lazyload';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import detectTouch from './detectTouch';
import setScrollbarWidth from './setScrollbarWidth';
import masks from './masks';
import validation from './validation';
import anchorLinks from './anchorLinks';
import accordions from './accordions';
import modals from './modals';
import tabs from './tabs';
import menu from './menu';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  detectTouch();
  setScrollbarWidth();
  masks();
  validation();
  anchorLinks();
  accordions();
  modals();
  tabs();
  menu();
});

document.addEventListener('lazyloaded', () => {
  ScrollTrigger.refresh();
});

window.addEventListener('load', () => {
  document.body.classList.add('loaded');
  ScrollTrigger.refresh();
  setTimeout(() => document.body.classList.add('animatable'), 300);
});
