import '../scss/all.scss';
import FormHandler from './form';

(function resetForm() {
  document.forms[0].reset();
})();

const DonationForm = new FormHandler({
  rangesAttach: $('.carousel__slide--range .carousel__radios'),
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
  rangesRadios: '.carousel__slide--range .carousel__radio',
  amountsRadios: '.carousel__slide--amount .carousel__radio',
  indicators: $('[class*=carousel__dot]'),
  fadeEl: $('.donate__inner'),
  defaultFrequenciesIndex: 1,
  defaultRangesIndex: 1,
  defaultAmountsIndex: 1,
  startSlide: 0,
  startFrequency: 'monthly',
  animationLength: 400,
  frequenciesToRanges: {
    once: ['Up to $35', 'Up to $100', 'More than $100'],
    monthly: ['Up to $35', 'Up to $100', 'More than $100'],
    yearly: ['Up to $35', 'Up to $100', 'More than $100']
  },

  rangesToAmounts: {
    once: [
      [12, 25, 35],
      [45, 65, 100],
      [250, 500, 850]
    ],

    monthly: [
      [12, 25, 35],
      [45, 65, 100],
      [250, 500, 850]
    ],

    yearly: [
      [12, 25, 35],
      [45, 65, 100],
      [250, 500, 850]
    ]
  }
});

DonationForm.initCarousel();
DonationForm.removeCarouselLoadingClass();
DonationForm.bindAllEvents();
