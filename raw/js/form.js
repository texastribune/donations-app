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
    this.currFrequencyIndex = opts.startFrequencyIndex;
    this.currRangeIndex = opts.startRangeIndex;
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

  // returns true or false depending whether
  // existing frequency index or range index is
  // the same as the one found inside a newly
  // selected radio button
  isCurrentIndex(which, eventIndex) {
    const baseIndex = (which === 'frequency' ? this.currFrequencyIndex : this.currRangeIndex);
    return parseInt(eventIndex) === parseInt(baseIndex);
  }

  // sets new current index for
  // frequency and range
  setNewCurrentIndex(which, eventIndex) {
    if (which === 'frequency') {
      this.currFrequencyIndex = eventIndex;
    } else if (which === 'range') {
      this.currRangeIndex = eventIndex;
    }
  }

  // returns new range values
  getFrequenciesToRangesValues(newIndex) {
    return this.frequenciesToRanges[newIndex];
  }

  // returns new amounts values
  getRangesToAmountsValues(newIndex) {
    return this.rangesToAmounts[this.currFrequencyIndex][newIndex];
  }

  // build new ranges markup
  buildRangesMarkup(newRangesValues) {
    return `
      ${newRangesValues.map((val, index) => `
        <label class="carousel__label" for="range-${index+1}" aria-labelledby="range-legend">
          <span class="carousel__label-text">${val}</span>
          <input class="carousel__radio" type="radio" name="range" data-range="${index}" id="range-${index+1}">
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
          <input class="carousel__radio" type="radio" name="amount" id="amount-${index+1}">
        </label>
      `).join('\n')}
    `;
  }

  // append to range or amounts markup to DOM
  appendMarkupToDOM(which, markup) {
    const attacher = (which === 'frequency' ? this.rangesAttach : this.amountsAttach);
    attacher.empty().append(markup);
  }

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

      if (!self.isCurrentIndex('frequency', eventIndex)) {
        const newRangesValues = self.getFrequenciesToRangesValues(eventIndex);
        const newRangesMarkup = self.buildRangesMarkup(newRangesValues);

        self.appendMarkupToDOM('frequency', newRangesMarkup);
        self.setNewCurrentIndex('frequency', eventIndex);
        self.reinitEvents();
      }
    });

    this.rangesRadios.change(function() {
      const eventIndex = self.getRadioIndex('range', $(this));

      if (!self.isCurrentIndex('range', eventIndex)) {
        const newAmountsValues = self.getRangesToAmountsValues(eventIndex);
        const newAmountsMarkup = self.buildAmountsMarkup(newAmountsValues);

        self.appendMarkupToDOM('range', newAmountsMarkup);
        self.setNewCurrentIndex('range', eventIndex);
        self.reinitEvents();
      }
    });
  }

  // call add remove selected

  // reset amounts when frequency changes

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
