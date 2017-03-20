import { debounce, getSupportedTransform } from './utils';

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
    this.manualInput = opts.manualInput;
    this.form = opts.form;
    this.errorMessage = opts.errorMessage;
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
    this.innerContainer.css(getSupportedTransform(), `translateX(-${this.getTransformValue()}px)`);
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
          <input class="carousel__radio" type="radio" value="${val}" name="amount" id="amount-${index+1}" ${this.shouldBeChecked('amount', index)}>
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

  // either increment or decrement curr slide index
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

  // when the manual input field is active,
  // make sure corresponding radio is selected
  selectManualEntryRadio(el) {
    el.prev('.carousel__radio').prop('checked', true);
  }

  // when users enter a value in manual input
  // field, make that the value of corresponding radio
  updateManualEntryRadioVal(el) {
    el.prev('.carousel__radio').val(el.val());
  }

  // returns true if amount value is numeric
  isValidAmountInput(amount) {
    return !isNaN(amount);
  }

  // removes range from input because
  // it's actually not part of what we send to checkout
  removeRangeFromInput(splitInput) {
    let indexWithRange;

    for (let i = 0; i < splitInput.length; i++) {
      if (splitInput[i].indexOf('range') !== -1) {
        indexWithRange = i;
        break;
      }
    }

    splitInput.splice(indexWithRange, 1);
  }

  // converts serialized form input to
  // an object
  convertInputToObject(input) {
    const splitInput = input.split('&');
    let inputObject = {};

    this.removeRangeFromInput(splitInput);

    for (let i = 0; i < splitInput.length; i++) {
      const curr = splitInput[i];
      const splitParam = curr.split('=');

      inputObject[splitParam[0]] = splitParam[1];
    }

    return inputObject;
  }

  // the final step
  // sends users to the proper checkout screen
  getCheckoutURL(inputObject) {
    const amount = inputObject.amount;
    const frequency = inputObject.frequency;
    const baseURL = 'https://checkout.texastribune.org';
    let fullURL;

    switch(frequency) {
      case 'once':
        fullURL = `${baseURL}/donateform?amount=${amount}`;
        break;
      case 'monthly':
        fullURL = `${baseURL}/memberform?installmentPeriod=monthly&amount=${amount}`;
        break;
      case 'annually':
        fullURL = `${baseURL}/memberform?installmentPeriod=yearly&amount=${amount}`;
        break;
    }

    return fullURL;
  }

  // if amount is not numeric, show error message
  // and raise ARIA alert
  raiseValidationError() {
    this.errorMessage.removeClass('carousel__manual-error--hidden');
    this.errorMessage.addClass('carousel__manual-error');
    this.errorMessage.attr('role', 'alert');
    this.manualInput.attr('aria-invalid', 'true');
  }

  // hide error message and remove ARIA alert
  // invoked any time a radio button changes
  removeValidationError() {
    this.errorMessage.addClass('carousel__manual-error--hidden');
    this.errorMessage.removeClass('carousel__manual-error');
    this.errorMessage.removeAttr('role');
    this.manualInput.removeAttr('aria-invalid');
  }

  // after radios have been dynamically added to the DOM
  // we need to rebind our events
  // would be nice to use delegation, but that makes
  // testing difficult because then we can't .trigger()
  reinitRadioEvents() {
    this.frequenciesRadios = $(this.originalOpts.frequenciesRadios);
    this.rangesRadios = $(this.originalOpts.rangesRadios);
    this.bindRadioEvents();
  }

  doInitialEvents() {
    this.manualInput.val('');
  }

  // bind radio button events
  bindRadioEvents() {
    const self = this;

    this.frequenciesRadios.change(function() {
      const eventIndex = self.getRadioIndex('frequency', $(this));
      const newRangesValues = self.getFrequenciesToRangesValues(eventIndex);
      const newRangesMarkup = self.buildRangesMarkup(newRangesValues);
      const newAmountsValues = self.getRangesToAmountsValues(self.defaultRangesIndex);
      const newAmountsMarkup = self.buildAmountsMarkup(newAmountsValues);

      self.removeValidationError();
      self.updateSelectedClass('frequency', $(this));
      self.appendMarkupToDOM('range', newRangesMarkup);
      self.appendMarkupToDOM('amount', newAmountsMarkup);
      self.reinitRadioEvents();
    });

    this.rangesRadios.change(function() {
      const eventIndex = self.getRadioIndex('range', $(this));
      const newAmountsValues = self.getRangesToAmountsValues(eventIndex);
      const newAmountsMarkup = self.buildAmountsMarkup(newAmountsValues);

      self.removeValidationError();
      self.updateSelectedClass('range', $(this));
      self.appendMarkupToDOM('amount', newAmountsMarkup);
      self.reinitRadioEvents();
    });

    this.amountsRadios.change(function() {
      self.removeValidationError();
      self.updateSelectedClass('amount', $(this));
    });
  }

  // bind carousel-related events
  bindCarouselEvents() {
    const self = this;

    this.prevButton.click(function(e) {
      e.preventDefault();

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

    this.nextButton.click(function(e) {
      e.preventDefault();

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
  }

  // bind form-related events
  bindFormEvents() {
    const self = this;

    this.manualInput.focus(function() {
      self.selectManualEntryRadio($(this));
    });

    this.manualInput.keyup(function(){
      self.updateManualEntryRadioVal($(this));
    });

    this.form.submit(function(e) {
      e.preventDefault();

      const rawInput = $(this).serialize();
      const inputObject = self.convertInputToObject(rawInput);

      if ( self.isValidAmountInput(inputObject.amount) ) {
        const checkoutURL = self.getCheckoutURL(inputObject);
        window.location.href = checkoutURL;
      } else {
        self.raiseValidationError();
      }
    });
  }

  // bind window-related events
  bindWindowEvents() {
    $(window).resize(debounce(function(){
      this.initCarousel();
    }.bind(this), 250, false));
  }

  // bind all events
  bindAllEvents() {
    this.bindRadioEvents();
    this.bindCarouselEvents();
    this.bindFormEvents();
    this.bindWindowEvents();
  }
}
