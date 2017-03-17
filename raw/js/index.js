import '../scss/all.scss';
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
  frequenciesRadios: '.carousel__slide--frequency .carousel__radio',
  rangesRadios: '.carousel__slide--range .carousel__radio',
  defaultFrequenciesIndex: 1,
  defaultRangesIndex: 1,
  defaultAmountsIndex: 1,
  startSlide: 0,
  frequenciesToRanges: [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12]
  ],
  rangesToAmounts: [
    [
      [13, 14, 15, 16],
      [17, 18, 19, 20],
      [21, 22, 23, 24],
      [25, 26, 27, 28]
    ],

    [
      [29, 30, 31, 32],
      [33, 34, 35, 36],
      [37, 38, 39, 40],
      [41, 42, 43, 44]
    ],

    [
      [45, 46, 47, 48],
      [49, 50, 51, 52],
      [53, 54, 55, 56],
      [57, 58, 59, 60]
    ]
  ]
});

DonationForm.initCarousel();
DonationForm.bindEvents();
