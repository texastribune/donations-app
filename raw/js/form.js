export default class FormHandler {
  constructor() {
    this.rangeAttach = $('.carousel__fieldset--range');
    this.amountsAttach = $('.carousel__fieldset--amount');
    this.carouselOuter = $('#carousel-outer');
    this.carouselInner = $('#carousel-inner');
    this.carouselSlides = $('.carousel-slide');
    this.prevButton = $('#prev');
    this.nextButton = $('#prev');
    this.submitButton = $('#submit');

    this.currFrequencyIndex = 1;
    this.currRangeIndex = 1;
    this.transformValue = 0;
    this.currSlide = 0;
    this.numSlides = this.carouselSlides.length;

    this.frequencyToRanges = [
      [1, 2, 3, 4],
      [5, 6, 7, 8],
      [9, 10, 11, 12]
    ];

    this.rangesToAmounts = [
      [13, 14, 15, 16],
      [17, 18, 19, 20],
      [21, 22, 23, 24]
    ];
  }

  // is existing range/frequency
  // takes which and returns a boolean

  // set new frequency range
  // takes which, value and then sets the value

  // get attr
  // takes element, attr name
  // returns attr value

  // get frequencyToRange value
  // takes index and returns array of values

  // get rangeToAmounts value
  // takes index and returns array of values

  // build range markup
  // takes array of values, returns markup

  // build amounts markup
  // takes array of values, returns markup

  // append to DOM
  // takes markup, attacher, returns nothing

  // insertAfter
  // takes markup, attacher, returns nothing

  // get outer container width
  // returns width of outer container

  // get width of outer container
  // takes nothing, returns width

  // set width of inner container
  // takes nothing, returns nothing
  // sets width of inner container to num slides * outer container width

  // add remove selected
  // takes nothing
  // if has selected class, return false
  // otherwise set selected, unselect others

  // isLastSlide
  // returns boolean

  // isFirstSlide
  // returns boolean

  // moveCarousel
  // takes forward or back
  // calls get width of outer container
  // transforms carousel by that amount

  // disablePrevNext
  // takes forward or back
  // disables button if meets condition

  // show submit button

  // *bind events
  // frequency click event
  // get index attribute
  // check if is existing range/frequency
  // if not, get frequencyToRange value
  // call set new range or frequency
  // call build range markup
  // append to DOM
  // range click event
  // get index attribute
  // check if existing
  // if not, get rangeToAmounts value
  // call build amounts markup
  // insertAfter
  // radio click event
  // call add remove selected
  // prev click event
  // check if is first slide
  // if not, decrement slideIndex
  // call disable with back
  // call move carousel w/ back
  // next click event
  // check if is last slide
  // if not, increment slideIndex
  // call disable with next
  // call move carousel w/ forward
  // if is last slide, show submit button

  // *inititialize carousel
  // get width of outer container
  // set width of inner container
}
