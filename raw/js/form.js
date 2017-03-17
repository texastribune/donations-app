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
    this.amountsRadios = $(opts.amountsRadios);
    this.defaultRangesIndex = opts.defaultRangesIndex;
    this.defaultAmountsIndex = opts.defaultAmountsIndex;
    this.currSlide = opts.startSlide;
    this.numSlides = this.carouselSlides.length;
    this.animationLength = opts.animationLength;
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

  // update selected class on label parent of
  // currently seleted radios
  updateSelectedClass(which, selectedEl) {
    let whichRadios;

    if (which === 'frequency') {
      whichRadios = this.frequenciesRadios;
    } else if (which === 'range') {
      whichRadios = this.rangesRadios;
    } else if (which === 'amount') {
      whichRadios = this.amountsRadios;
    }

    whichRadios.parent().removeClass('radio__label--selected');
    whichRadios.parent().addClass('radio__label');
    selectedEl.parent().addClass('radio__label--selected');
  }

  updateCurrSlide(dir) {
    if (dir === 'prev') {
      this.currSlide--;
    } else if (dir === 'next') {
      this.currSlide++;
    }
  }

  // returns true if the last slide is showing
  isLastSlide() {
    return this.currSlide === (this.numSlides - 1);
  }

  // returns true if the first slide is showing
  isFirstSlide() {
    return this.currSlide === 0;
  }

  // disables prev button if at first slide
  // or next button if at last slide
  disableButton(which) {
    if (which === 'prev') {
      this.prevButton.addClass('carousel__button--disabled');
    } else if (which === 'next') {
      this.nextButton.addClass('carousel__button--disabled');
    }
  }

  // enables prev button if not at first slide
  // or next button if not at last slide
  enableButton(which) {
    if (which === 'prev') {
      this.prevButton.removeClass('carousel__button--disabled');
    } else if (which === 'next') {
      this.nextButton.removeClass('carousel__button--disabled');
    }
  }

  // shows submit button on last slide
  showSubmitButton() {
    this.submitButton.removeClass('carousel__button--hidden');
  }

  // hides submit button on all but last slide
  hideSubmitButton() {
    this.submitButton.addClass('carousel__button--hidden');
  }

  // remove aria-hidden from current slide
  accessibleShowCurrent() {
    this.carouselSlides.eq(this.currSlide).removeAttr('aria-hidden');
  }

  // after clicking next, put aria-hidden on
  // the slide we're exiting from
  accessibleHideMovingNext() {
    this.carouselSlides.eq(this.currSlide - 1).attr('aria-hidden', 'true');
  }

  // after clicking previous, put aria-hiden on
  // slide we're exiting from
  accessibleHideMovingPrev() {
    this.carouselSlides.eq(this.currSlide + 1).attr('aria-hidden', 'true');
  }

  // indicate to screen readers that
  // new current slide is animating into view
  tempAccessibleLive() {
    this.carouselSlides.eq(this.currSlide).attr('aria-live', 'polite');

    setTimeout(function() {
      this.carouselSlides.eq(this.currSlide).removeAttr('aria-live');
    }.bind(this), this.animationLength);
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
      const newRangesValues = self.getFrequenciesToRangesValues(eventIndex);
      const newRangesMarkup = self.buildRangesMarkup(newRangesValues);
      const newAmountsValues = self.getRangesToAmountsValues(self.defaultRangesIndex);
      const newAmountsMarkup = self.buildAmountsMarkup(newAmountsValues);

      self.updateSelectedClass('frequency', $(this));
      self.appendMarkupToDOM('range', newRangesMarkup);
      self.appendMarkupToDOM('amount', newAmountsMarkup);
      self.reinitEvents();
    });

    this.rangesRadios.change(function() {
      const eventIndex = self.getRadioIndex('range', $(this));
      const newAmountsValues = self.getRangesToAmountsValues(eventIndex);
      const newAmountsMarkup = self.buildAmountsMarkup(newAmountsValues);

      self.updateSelectedClass('range', $(this));
      self.appendMarkupToDOM('amount', newAmountsMarkup);
      self.reinitEvents();
    });

    this.amountsRadios.change(function() {
      self.updateSelectedClass('amount', $(this));
    });

    this.prevButton.click(function() {
      if (!self.isFirstSlide()) {
        self.updateCurrSlide('prev');
        self.accessibleShowCurrent();
        self.accessibleHideMovingPrev();
        self.hideSubmitButton();
        self.enableButton('next');
        self.setTransform();
        self.tempAccessibleLive();

        if (self.isFirstSlide()) {
          self.disableButton('prev');
        }
      }
    });

    this.nextButton.click(function() {
      if (!self.isLastSlide()) {
        self.updateCurrSlide('next');
        self.accessibleShowCurrent();
        self.accessibleHideMovingNext();
        self.enableButton('prev');
        self.setTransform();
        self.tempAccessibleLive();

        if (self.isLastSlide()) {
          self.disableButton('next');
          self.showSubmitButton();
        }
      }
    });

    $('form').submit(function(e) {
      e.preventDefault();
    });
  }

  // manual input is selected

  // validate manual input
  // ARIA invalid attribute should be set

  // create string and redirect



  // SUBMIT EVENT
  // check if manual input is selected
  // if so, check if input is numeric
  // if so, create string and redirect
}
