export default class FormHandler {
  constructor(opts) {
    this.rangeAttach = opts.rangeAttach;
    this.amountsAttach = opts.amountsAttach;
    this.outerContainer = opts.outerContainer;
    this.innerContainer = opts.innerContainer;
    this.carouselSlides = opts.carouselSlides;
    this.prevButton = opts.prevButton;
    this.nextButton = opts.nextButton;
    this.submitButton = opts.submitButton;
    this.currFrequencyIndex = opts.startFrequencyIndex;
    this.currRangeIndex = opts.startRangeIndex;
    this.currSlide = opts.startSlide;
    this.numSlides = this.carouselSlides.length;
    this.frequencyToRanges = opts.frequencyToRanges;
    this.rangesToAmounts = opts.rangesToAmounts;
  }

  // returns integer of current carousel transform value
  getTransformValue() {
    return this.getOuterContainerWidth() * this.currSlide;
  }

  // returns integer width of outer container
  getOuterContainerWidth() {
    return this.outerContainer.width();
  }

  // sets width of inner container as
  // number of slides * width of outer container
  setInnerContainerWidth() {
    const innerContainerWidth = this.numSlides * this.getOuterContainerWidth();
    this.innerContainer.css('width', `${innerContainerWidth}px`);
  }

  // returns integer width of inner container
  getInnerContainerWidth() {
    return this.innerContainer.width();
  }

  // sets each slide to width of the outer container
  setSlideWidth() {
    const slideWidth = this.getOuterContainerWidth();

    this.carouselSlides.each(function(){
      $(this).css('width', `${slideWidth}px`);
    });
  }

  // shifts carousel forward or backward
  setTransform() {
    this.innerContainer.css('transform', `translateX(-${this.getTransformValue()}px)`);
  }

  // initialize carousel
  initCarousel() {
    this.setInnerContainerWidth();
    this.setSlideWidth();
    this.setTransform();
  }

  bindEvents() {

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
  // after interval, removes ARIA live

  // disablePrevNext
  // takes forward or back
  // disables button if meets condition

  // accessible hide
  // add ARIA hidden attribute

  // show submit button

  // add/remove ARIA live

  // manual input is selected

  // validate manual input
  // ARIA invalid attribute should be set

  // create string and redirect

  // *bind events
  // FREQUENCY CLICK EVENT
  // get index attribute
  // check if is existing range/frequency
  // if not, get frequencyToRange value
  // call set new range or frequency
  // call build range markup
  // append to DOM
  // RANGE CLICK EVENT
  // get index attribute
  // check if existing
  // if not, get rangeToAmounts value
  // call build amounts markup
  // insertAfter
  // radio click event
  // call add remove selected
  // PREV CLICK EVENT
  // check if is first slide
  // if so, return false
  // if not call accessible hide on current
  // decrement slideIndex
  // call aria live on new current
  // call disable with back
  // call move carousel w/ back
  // NEXT CLICK EVENT
  // check if is last slide
  // if so, return false
  // if not, increment slideIndex
  // call disable with next
  // call move carousel w/ forward
  // if is last slide, show submit button
  // SUBMIT EVENT
  // check if manual input is selected
  // if so, check if input is numeric
  // if so, create string and redirect
}
