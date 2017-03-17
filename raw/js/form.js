export default class FormHandler {
  constructor(opts) {
    this.originalOpts = opts;
    this.rangesAttach = opts.rangesAttach;
    this.amountsAttach = opts.amountsAttach;
    this.outerContainer = opts.outerContainer;
    this.innerContainer = opts.innerContainer;
    this.carouselSlides = opts.carouselSlides;
    this.prevButton = opts.prevButton;
    this.nextButton = opts.nextButton;
    this.submitButton = opts.submitButton;
    this.frequenciesRadios = $(opts.frequenciesRadios);
    this.rangesRadios = $(opts.rangesRadios);
    this.currFrequenciesIndex = opts.defaultFrequenciesIndex;
    this.currRangesIndex = opts.defaultRangesIndex;
    this.defaultRangesIndex = opts.defaultRangesIndex;
    this.defaultAmountsIndex = opts.defaultAmountsIndex;
    this.currSlide = opts.startSlide;
    this.numSlides = this.carouselSlides.length;
    this.frequenciesToRanges = opts.frequenciesToRanges;
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

  // get value of either data-frequency or data-range
  // it should be a non-negative integer
  getRadioIndex(which, el) {
    const index = el.attr(`data-${which}`);

    if (isNaN(index)) {
      throw new Error();
    } else if ( index.indexOf('.') !== -1 ) {
      throw new Error();
    } else if ( parseInt(index) < 0 ) {
      throw new Error();
    }

    return parseInt(index);
  }

  // sets new current index for
  // frequency and range
  setNewCurrentIndex(which, eventIndex) {
    if (which === 'frequency') {
      this.currFrequenciesIndex = eventIndex;
    } else if (which === 'range') {
      this.currRangesIndex = eventIndex;
    }
  }

  // returns new range values
  getFrequenciesToRangesValues(newIndex) {
    return this.frequenciesToRanges[newIndex];
  }

  // returns new amounts values
  getRangesToAmountsValues(newIndex) {
    return this.rangesToAmounts[newIndex];
  }

  // returned checked boolean if new radio button
  // should be checked by default when appended to DOM
  shouldBeChecked(which, iterIndex) {
    if (which === 'range') {
      return (iterIndex === this.defaultRangesIndex ? `checked` : ``);
    } else if (which === 'amount') {
      return (iterIndex === this.defaultAmountsIndex ? `checked` : ``);
    }
  }

  // build new ranges markup
  buildRangesMarkup(newRangesValues) {
    return `
      ${newRangesValues.map((val, index) => `
        <label class="carousel__label" for="range-${index+1}" aria-labelledby="range-legend">
          <span class="carousel__label-text">${val}</span>
          <input class="carousel__radio" type="radio" name="range" data-range="${index}" id="range-${index+1}" ${this.shouldBeChecked('range', index)}>
        </label>
      `).join('\n')}
    `;
  }

  // build new amounts markup
  buildAmountsMarkup(newAmountsValues) {
    return `
      ${newAmountsValues.map((val, index) => `
        <label class="carousel__label" for="amount-${index+1}" aria-labelledby="amount-legend">
          <span class="carousel__label-text">${val}</span>
          <input class="carousel__radio" type="radio" name="amount" id="amount-${index+1}" ${this.shouldBeChecked('amount', index)}>
        </label>
      `).join('\n')}
    `;
  }

  // append to range or amounts markup to DOM
  appendMarkupToDOM(which, markup) {
    const attacher = (which === 'range' ? this.rangesAttach : this.amountsAttach);
    attacher.empty().append(markup);
  }

  /*updateSelectedClass(which) {
    if (which === 'frequency') {

    } else if (which === 'range') {

    } else if (which === 'amount') {

    }
  }*/

  // after radios have been dynamically added to the DOM
  // we need to rebind our events
  // would be nice to use delegation, but that makes
  // testing difficult because then we can't .trigger()
  reinitEvents() {
    this.frequenciesRadios = $(this.originalOpts.frequenciesRadios);
    this.rangesRadios = $(this.originalOpts.rangesRadios);
    this.bindEvents();
  }

  // bind DOM events
  bindEvents() {
    const self = this;

    this.frequenciesRadios.change(function() {
      const eventIndex = self.getRadioIndex('frequency', $(this));

      self.setNewCurrentIndex('frequency', eventIndex);
      self.setNewCurrentIndex('range', self.defaultRangesIndex);

      const newRangesValues = self.getFrequenciesToRangesValues(eventIndex);
      const newRangesMarkup = self.buildRangesMarkup(newRangesValues);
      const newAmountsValues = self.getRangesToAmountsValues(self.defaultRangesIndex);
      const newAmountsMarkup = self.buildAmountsMarkup(newAmountsValues);

      self.appendMarkupToDOM('range', newRangesMarkup);
      self.appendMarkupToDOM('amount', newAmountsMarkup);
      self.reinitEvents();
    });

    this.rangesRadios.change(function() {
      const eventIndex = self.getRadioIndex('range', $(this));

      self.setNewCurrentIndex('range', eventIndex);

      const newAmountsValues = self.getRangesToAmountsValues(eventIndex);
      const newAmountsMarkup = self.buildAmountsMarkup(newAmountsValues);

      self.appendMarkupToDOM('amount', newAmountsMarkup);
      self.reinitEvents();
    });
  }

  // call add remove selected

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
