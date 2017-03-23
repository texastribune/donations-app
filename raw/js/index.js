import '../scss/all.scss';
import FormHandler from './form';

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
  defaultFrequenciesIndex: 1,
  defaultRangesIndex: 2,
  defaultAmountsIndex: 2,
  startSlide: 0,
  startFrequency: 'monthly',
  animationLength: 400,
  frequenciesToRanges: {
    once: ['$1-$34', '$35-$100', '$101-$500', '$501-$999'],
    monthly: ['$5-$20', '$21-$40', '$41-$60', '$61-$82'],
    yearly: ['$1-$34', '$35-$100', '$101-$500', '$501-$999']
  },

  rangesToAmounts: {
    once: [
      [5, 15, 25, 34],
      [35, 65, 85, 100],
      [120, 240, 360, 500],
      [520, 640, 760, 880]
    ],

    monthly: [
      [5, 11, 16, 20],
      [21, 29, 34, 40],
      [41, 49, 54, 60],
      [61, 69, 78, 82]
    ],

    yearly: [
      [5, 15, 25, 34],
      [35, 65, 85, 100],
      [120, 240, 360, 500],
      [520, 640, 760, 880]
    ]
  }
});

DonationForm.doInitialEvents();
DonationForm.initCarousel();
DonationForm.bindAllEvents();
