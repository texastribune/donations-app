import FormHandler from './form';

const DonationForm = new FormHandler({
  rangesAttach: $('.carousel__slide--range .carousel__radios'),
  amountsAttach: $('.carousel__slide--amount .carousel__radios'),
  outerContainer: $('#carousel-outer'),
  innerContainer: $('#carousel-inner'),
  carouselSlides: $('[class*=carousel__slide]'),
  prevButton: $('#prev'),
  nextButton: $('#next'),
  submitButton: $('#submit'),
  manualInput: $('#amount-input'),
  form: $('.carousel__form'),
  errorMessage: $('#error-message'),
  frequenciesRadios: '.carousel__slide--frequency .carousel__radio',
  rangesRadios: '.carousel__slide--range .carousel__radio',
  amountsRadios: '.carousel__slide--amount .carousel__radio',
  defaultFrequenciesIndex: 1,
  defaultRangesIndex: 1,
  defaultAmountsIndex: 1,
  startSlide: 0,
  animationLength: 400,
  frequenciesToRanges: [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, 16]
  ],
  rangesToAmounts: [
    [17, 18, 19, 20],
    [21, 22, 23, 24],
    [25, 26, 27, 28],
    [29, 30, 31, 32]
  ]
});

DonationForm.initCarousel();
DonationForm.bindAllEvents();
