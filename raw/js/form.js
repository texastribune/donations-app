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
    this.indicators = opts.indicators;
    this.defaultRangesIndex = opts.defaultRangesIndex;
    this.defaultAmountsIndex = opts.defaultAmountsIndex;
    this.currSlide = opts.startSlide;
    this.currFrequency = opts.startFrequency;
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
    this.innerContainer.css(
      getSupportedTransform(),
      `translateX(-${this.getTransformValue()}px)`
    );
  }

  // initialize carousel
  initCarousel() {
    this.setInnerContainerWidth();
    this.setSlideWidth();
    this.setTransform();
  }

  // takes a frequency radio as parameter
  // returns it's data-frequency attr value
  getFrequencyFromRadio($el) {
    return $el.attr('data-frequency');
  }

  // get value of data-range
  // it's a non-negative integer
  getAmountIndexFromRadio($el) {
    return $el.attr('data-range');
  }

  // updates the currently selected frequency
  // to either once, monthly, yearly
  updateCurrFrequency(newFrequency) {
    this.currFrequency = newFrequency;
  }

  // returns new range values
  getFrequenciesToRangesValues() {
    return this.frequenciesToRanges[this.currFrequency];
  }

  // returns new amounts values
  getRangesToAmountsValues(newIndex) {
    return this.rangesToAmounts[this.currFrequency][newIndex];
  }

  // returned checked boolean if new radio button
  // should be checked by default when appended to DOM
  shouldBeChecked(which, iterIndex) {
    if (which === 'range') {
      return iterIndex === this.defaultRangesIndex;
    } else if (which === 'amount') {
      return iterIndex === this.defaultAmountsIndex;
    }
  }

  // if current frequency is yearly or
  // monthly, label the range legend that way
  // if once, don't label it at all
  getFrequenciesLegendMarker() {
    if (this.currFrequency === 'monthly' || this.currFrequency === 'yearly') {
      return `${this.currFrequency} `;
    }
    return '';
  }

  // if current frequency is yearly or
  // monthly, label the amounts buttons that way
  // if once, don't label at all
  getFrequenciesLabelMarker() {
    if (this.currFrequency === 'monthly') {
      return 'per month';
    } else if (this.currFrequency === 'yearly') {
      return 'per year';
    }

    // return this so the checkmark placement
    // stays consistent
    return '&nbsp;';
  }

  // TODO: Add test
  addStudentMembership() {
    if (this.currFrequency === 'yearly') {
      return `<p class="carousel__student"><a class="splash-link--teal" href="https://checkout.texastribune.org/memberform?&amount=10&installmentPeriod=yearly">Interested</a> <span class="bold">in a $10 student membership?</span></p>`;
    }
    return '';
  }

  // TODO: Add test
  putCommasInNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  // build new ranges markup
  buildRangesMarkup(newRangesValues) {
    return `
      <legend class="carousel__legend" id="range-legend">Choose a ${this.getFrequenciesLegendMarker()}range:</legend>
      <div class="carousel__radios">
        ${newRangesValues.map((val, index) => `
          <label class="carousel__label${this.shouldBeChecked('range', index) ? `--selected`: `--normal`}" for="range-${index+1}" aria-labelledby="range-legend">
            <span class="carousel__label-text">${val}</span>
            <i class="carousel__checkmark fa fa-check-square" aria-hidden="true"></i>
            <input class="carousel__radio visually-hidden" type="radio" name="range" data-range="${index}" id="range-${index+1}" ${this.shouldBeChecked('range', index) ? `checked` : ``}>
          </label>
        `).join('\n')}
        ${this.addStudentMembership()}
        <p class="carousel__circle"><span class="bold">Trying to donate more?</span> <a class="splash-link--teal" href="https://support.texastribune.org/circle.html">Learn how</a>.</p>
      </div>
    `;
  }

  // build new amounts markup
  buildAmountsMarkup(newAmountsValues) {
    return `
      ${newAmountsValues.map((val, index) => `
        <label class="carousel__label${this.shouldBeChecked('amount', index) ? `--selected`: `--normal`}" for="amount-${index+1}" aria-labelledby="amount-legend">
          <span class="carousel__label-text">
            <span class="carousel__label-main">$${this.putCommasInNumber(val)}</span>
            <span class="carousel__label-sub">${this.getFrequenciesLabelMarker()}</span>
          </span>
          <i class="carousel__checkmark fa fa-check-square" aria-hidden="true"></i>
          <input class="carousel__radio visually-hidden" type="radio" value="${val}" name="amount" id="amount-${index+1}" ${this.shouldBeChecked('amount', index) ? `checked` : ``}>
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
    let radios;

    if (which === 'frequency') {
      radios = this.frequenciesRadios;
    } else if (which === 'range') {
      radios = this.rangesRadios;
    } else if (which === 'amount') {
      radios = this.amountsRadios;
    }

    radios.parent('[class*=carousel__label]').attr('class', 'carousel__label--normal');

    if ( selectedEl.attr('id') !== 'amount-manual' ) {
      selectedEl.parent().attr('class', 'carousel__label--selected');
    }
  }

  // update the indicator dots
  updateIndicators(which) {
    const lastSlide = (which === 'prev' ? this.currSlide + 1 : this.currSlide - 1);

    this.indicators.eq(lastSlide).attr('class', 'carousel__dot--normal');
    this.indicators.eq(this.currSlide).attr('class', 'carousel__dot--selected');
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
    let $el;

    if (which === 'prev') {
      $el = this.prevButton;
    } else if (which === 'next') {
      $el = this.nextButton;
    }

    $el.addClass('disabled');
    $el.prop('disabled', true);
  }

  // enables prev button if not at first slide
  // or next button if not at last slide
  enableButton(which) {
    let $el;

    if (which === 'prev') {
      $el = this.prevButton;
    } else if (which === 'next') {
      $el = this.nextButton;
    }

    $el.removeClass('disabled');
    $el.prop('disabled', false);
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

  // TODO: Make this return a value so it's testable
  setManualInputBorderClass(which) {
    let borderClass;

    switch(which) {
      case 'normal':
        borderClass = 'carousel__manual-input--normal';
        break;
      case 'invalid':
        borderClass = 'carousel__manual-input--invalid';
        break;
      case 'selected':
        borderClass = 'carousel__manual-input--selected';
        break;
    }

    this.manualInput.attr('class', borderClass);
  }

  // when the manual input field is active,
  // make sure corresponding radio is selected
  selectManualEntryRadio(el) {
    el.prev('.carousel__radio').prop('checked', true).change();
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
      case 'yearly':
        fullURL = `${baseURL}/memberform?installmentPeriod=yearly&amount=${amount}`;
        break;
    }

    return fullURL;
  }

  // if amount is not numeric, show error message
  // and raise ARIA alert
  raiseValidationError() {
    this.errorMessage.removeClass('hidden');
    this.errorMessage.attr('role', 'alert');
    this.manualInput.attr('aria-invalid', 'true');
  }

  // hide error message and remove ARIA alert
  // invoked any time a radio button changes
  removeValidationError() {
    this.errorMessage.addClass('hidden');
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
    this.amountsRadios = $(this.originalOpts.amountsRadios);
    this.bindRadioEvents();
  }

  // bind radio button events
  bindRadioEvents() {
    const self = this;

    this.frequenciesRadios.change(function() {
      self.updateCurrFrequency( self.getFrequencyFromRadio($(this)) );

      const newRangesValues = self.getFrequenciesToRangesValues();
      const newRangesMarkup = self.buildRangesMarkup(newRangesValues);
      const newAmountsValues = self.getRangesToAmountsValues(self.defaultRangesIndex);
      const newAmountsMarkup = self.buildAmountsMarkup(newAmountsValues);

      self.removeValidationError();
      self.setManualInputBorderClass('normal');
      self.updateSelectedClass('frequency', $(this));
      self.appendMarkupToDOM('range', newRangesMarkup);
      self.appendMarkupToDOM('amount', newAmountsMarkup);
      self.reinitRadioEvents();
    });

    this.rangesRadios.change(function() {
      const eventIndex = self.getAmountIndexFromRadio($(this));
      const newAmountsValues = self.getRangesToAmountsValues(eventIndex);
      const newAmountsMarkup = self.buildAmountsMarkup(newAmountsValues);

      self.removeValidationError();
      self.setManualInputBorderClass('normal');
      self.updateSelectedClass('range', $(this));
      self.appendMarkupToDOM('amount', newAmountsMarkup);
      self.reinitRadioEvents();
    });

    this.amountsRadios.change(function() {
      self.removeValidationError();
      self.setManualInputBorderClass('normal');
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
        self.updateIndicators('prev');
        self.accessibleShowCurrent();
        self.accessibleHideMovingPrev();
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
        self.updateIndicators('next');
        self.accessibleShowCurrent();
        self.accessibleHideMovingNext();
        self.enableButton('prev');
        self.setTransform();
        self.tempAccessibleLive();

        if (self.isLastSlide()) {
          self.disableButton('next');
        }
      }
    });
  }

  // bind form-related events
  bindFormEvents() {
    const self = this;

    this.manualInput.focus(function() {
      self.selectManualEntryRadio($(this));
      self.removeValidationError();
      self.setManualInputBorderClass('selected');
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
        self.setManualInputBorderClass('invalid');
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
