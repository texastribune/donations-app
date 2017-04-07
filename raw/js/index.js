import '../scss/all.scss';
import FormHandler from './form';

(function resetForm() {
  document.forms[0].reset();
})();

const DonationForm = new FormHandler({
  amountsAttach: $('.carousel__slide--amount .carousel__radios'),
  outerContainer: $('#carousel-outer'),
  innerContainer: $('#carousel-inner'),
  carouselSlides: $('[class*=carousel__slide]'),
  prevButton: $('#prev'),
  nextButton: $('#next'),
  submitButton: $('#submit'),
  manualInput: $('#manual-input'),
  form: $('.carousel__form'),
  errorMessage: $('#error-message'),
  frequenciesRadios: '.carousel__slide--frequency .carousel__radio',
  amountsRadios: '.carousel__slide--amount .carousel__radio',
  indicators: $('[class*=carousel__dot]'),
  fadeEl: $('.donate__inner'),
  defaultFrequenciesIndex: 1,
  defaultAmountsIndex: 1,
  startSlide: 0,
  startFrequency: 'monthly',
  animationLength: 400,
  frequenciesToAmounts: {
    once: [40, 65, 150, 250, 400, 550],
    monthly: [5, 15, 25, 35, 55, 85],
    yearly: [40, 65, 150, 250, 400, 550]
  }
});

DonationForm.initCarousel();
DonationForm.removeCarouselLoadingClass();
DonationForm.bindAllEvents();
