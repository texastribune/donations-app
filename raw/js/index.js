import '../scss/all.scss';
import FormHandler from './form';

const DonationForm = new FormHandler({
  rangeAttach: $('.carousel__slide--range'),
  amountsAttach: $('.carousel__slide--amount'),
  outerContainer: $('#carousel-outer'),
  innerContainer: $('#carousel-inner'),
  carouselSlides: $('[class*=carousel__slide]'),
  prevButton: $('#prev'),
  nextButton: $('#next'),
  submitButton: $('#submit'),
  startFrequencyIndex: 1,
  startRangeIndex: 0,
  startSlide: 0,
  frequencyToRanges: [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12]
  ],
  rangesToAmounts: [
    [13, 14, 15, 16],
    [17, 18, 19, 20],
    [21, 22, 23, 24]
  ]
});

DonationForm
  .initCarousel();
