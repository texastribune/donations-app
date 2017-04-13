import FormHandler from './form-old';

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
  frequenciesLabels: $('.carousel__slide--frequency [class*=carousel__label]'),
  frequenciesRadios: $('.carousel__slide--frequency .carousel__radio'),
  amountsRadios: '.carousel__slide--amount .carousel__radio',
  indicators: $('[class*=carousel__dot]'),
  fadeEl: $('.donate__inner'),
  defaultAmountsIndex: 2,
  startSlide: 0,
  startFrequency: 'monthly',
  animationDelay: 300,
  animationLength: 400,
  frequenciesToAmounts: {
    once: [50, 75, 100, 250, 500, 1000],
    monthly: [5, 10, 15, 25, 55, 85],
    yearly: [50, 75, 100, 250, 500, 1000]
  }
});

DonationForm.initCarousel();
DonationForm.removeCarouselLoadingClass();
DonationForm.bindAllEvents();
