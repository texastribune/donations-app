import '../scss/all.scss';
import FormHandler from './form';

(function resetForm() {
  document.forms[0].reset();
})();

const DonationForm = new FormHandler({
  rangesAttach: $('.carousel__slide--range .carousel__fieldset'),
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
  defaultFrequenciesIndex: 1,
  defaultRangesIndex: 1,
  defaultAmountsIndex: 1,
  startSlide: 0,
  startFrequency: 'monthly',
  animationLength: 400,
  frequenciesToRanges: {
    once: ['$35 - $100', '$101 - $500', '$501 - $999', '$1,000 - $5,000'],
    monthly: ['$5 - $34', '$35 - $64', '$65 - $83', '$84 - $417'],
    yearly: ['$35 - $100', '$101 - $500', '$501 - $999', '$1,000 - $5,000']
  },

  rangesToAmounts: {
    once: [
      [35, 55, 75, 100],
      [101, 150, 300, 500],
      [501, 650, 850, 999],
      [1000, 2500, 4500, 5000]
    ],

    monthly: [
      [5, 15, 25, 34],
      [35, 45, 55, 64],
      [65, 75, 80, 83],
      [84, 146, 209, 417]
    ],

    yearly: [
      [35, 55, 75, 100],
      [101, 150, 300, 500],
      [501, 650, 850, 999],
      [1000, 2500, 4500, 5000]
    ]
  }
});

DonationForm.initCarousel();
DonationForm.bindAllEvents();
