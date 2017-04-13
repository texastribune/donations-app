import { debounce, getSupportedTransform } from './utils';

export default class FormHandler {
  constructor(opts) {
    this.originalOpts = opts;
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
    this.frequenciesLabels = opts.frequenciesLabels;
    this.frequenciesRadios = opts.frequenciesRadios;
    this.amountsRadios = $(opts.amountsRadios);
    this.indicators = opts.indicators;
    this.fadeEl = opts.fadeEl;
    this.defaultAmountsIndex = opts.defaultAmountsIndex;
    this.currSlide = opts.startSlide;
    this.currFrequency = opts.startFrequency;
    this.numSlides = this.carouselSlides.length;
    this.animationDelay = opts.animationDelay;
    this.animationLength = opts.animationLength;
    this.frequenciesToAmounts = opts.frequenciesToAmounts;
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

  // removes "loading" overlay
  // when all the widths have been set
  removeCarouselLoadingClass() {
    this.fadeEl
      .removeClass('unloaded')
      .addClass('loaded');
  }

  // takes a frequency radio as parameter
  // returns it's data-frequency attr value
  getFrequencyFromRadio($el) {
    return $el.attr('data-frequency');
  }

  // updates the currently selected frequency
  // to either once, monthly, yearly
  updateCurrFrequency(newFrequency) {
    this.currFrequency = newFrequency;
  }

  // returns new amounts values
  getFrequenciesToAmountsValues() {
    return this.frequenciesToAmounts[this.currFrequency];
  }

  // returned checked boolean if new radio button
  // should be checked by default when appended to DOM
  shouldBeChecked(iterIndex) {
    return iterIndex === this.defaultAmountsIndex;
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
    return '';
  }

  // Put commas in four-digit+ numbers
  putCommasInNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  // build new amounts markup
  buildAmountsMarkup(newAmountsValues) {
    return `
      ${newAmountsValues.map((val, index) => `
        <label class="carousel__label${this.shouldBeChecked(index) ? `--selected`: `--normal`} carousel__label--third" for="amount-${index+1}">
          <span class="carousel__dollars">$${this.putCommasInNumber(val)}</span> <span class="carousel__qualifier">${this.getFrequenciesLabelMarker()}</span>
          <input class="carousel__radio visually-hidden" type="radio" value="${val}" name="amount" id="amount-${index+1}" ${this.shouldBeChecked(index) ? `checked` : ``}>
        </label>
      `).join('\n')}
    `;
  }

  // append new amounts markup to DOM
  appendAmountsMarkupToDOM(markup) {
    this.amountsAttach
      .empty()
      .append(markup);
  }

  // update selected class on label parent of
  // currently seleted radios
  updateSelectedClass(which, selectedEl) {
    let radios;

    if (which === 'frequency') {
      radios = this.frequenciesRadios;
    } else if (which === 'amount') {
      radios = this.amountsRadios;
    }

    radios
      .parent('[class*=carousel__label]')
      .removeClass('carousel__label--selected')
      .addClass('carousel__label--normal');

    if (selectedEl.attr('id') !== 'amount-manual') {
      selectedEl
        .parent()
        .removeClass('carousel__label--normal')
        .addClass('carousel__label--selected');
    }
  }

  // receives a frequency label as a parameter
  // returns true if it contains the class indicating it
  // is the default selection
  isPreselectedDefault($el) {
    return $el.hasClass('carousel__label--preselected');
  }

  // gives the default frequency the actual selected class
  // aesthetically, this means that if clicked, the
  // checkmark becomes visible
  preselectionToSelection($el) {
    $el
      .removeClass('carousel__label--preselected')
      .addClass('carousel__label--selected');
  }

  // update the indicator dots
  updateIndicators(which) {
    const lastSlide = (which === 'prev' ? this.currSlide + 1 : this.currSlide - 1);

    this.indicators.eq(lastSlide).attr('class', 'carousel__dot--normal');
    this.indicators.eq(this.currSlide).attr('class', 'carousel__dot--selected');
  }

  // reduce slide index by one
  decrementSlide() {
    this.currSlide--;
  }

  // increase slide index by one
  incrementSlide() {
    this.currSlide++;
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
    this.carouselSlides
      .eq(this.currSlide)
      .removeAttr('aria-hidden');
  }

  // after clicking next, put aria-hidden on
  // the slide we're exiting from
  accessibleHideMovingNext() {
    this.carouselSlides
      .eq(this.currSlide - 1)
      .attr('aria-hidden', 'true');
  }

  // after clicking previous, put aria-hiden on
  // slide we're exiting from
  accessibleHideMovingPrev() {
    this.carouselSlides
      .eq(this.currSlide + 1)
      .attr('aria-hidden', 'true');
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
    const baseClass = 'carousel__manual-input';
    let borderClass;

    switch(which) {
      case 'normal':
        borderClass =  `${baseClass}--normal`;
        break;
      case 'invalid':
        borderClass = `${baseClass}--invalid`;
        break;
      case 'selected':
        borderClass = `${baseClass}--selected`;
        break;
    }

    this.manualInput.attr('class', borderClass);
  }

  // when the manual input field is active,
  // make sure corresponding radio is selected
  selectManualEntryRadio() {
    this.manualInput
      .prev('.carousel__radio')
      .prop('checked', true)
      .change();
  }

  manualInputIsSelected() {
    return this.manualInput.hasClass('carousel__manual-input--selected');
  }

  // when users enter a value in manual input
  // field, make that the value of corresponding radio
  updateManualEntryRadioVal() {
    this.manualInput
      .prev('.carousel__radio')
      .val(this.manualInput.val());
  }

  // returns true if amount value is numeric
  isValidAmountInput(amount) {
    if (amount === '') {
      return false;
    }
    return !isNaN(amount);
  }

  // converts serialized form
  // input into an object
  convertInputToObject(input) {
    const splitInput = input.split('&');
    let inputObject = {};

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
    this.amountsRadios = $(this.originalOpts.amountsRadios);
    this.bindAmountsEvents();
  }

  // bind events related to frequency radios
  bindFrequenciesEvents() {
    const self = this;

    this.frequenciesRadios.change(function() {
      self.updateCurrFrequency( self.getFrequencyFromRadio($(this)) );

      const newAmountsValues = self.getFrequenciesToAmountsValues();
      const newAmountsMarkup = self.buildAmountsMarkup(newAmountsValues);

      self.removeValidationError();
      self.setManualInputBorderClass('normal');
      self.updateSelectedClass('frequency', $(this));
      self.appendAmountsMarkupToDOM(newAmountsMarkup);
      self.reinitRadioEvents();
    });

    this.frequenciesLabels.click(function() {
      const $this = $(this);

      if (self.isPreselectedDefault($this)) {
        self.preselectionToSelection($this);
      }

      window.setTimeout(function() {
        self.nextButton.trigger('click');
      }, self.animationDelay);
    });
  }

  // bind events related to amounts radios
  // and manual input
  bindAmountsEvents() {
    const self = this;

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
        self.decrementSlide();
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
        self.incrementSlide();
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
      self.selectManualEntryRadio();
      self.removeValidationError();
      self.setManualInputBorderClass('selected');
    });

    this.form.submit(function(e) {
      e.preventDefault();

      if (self.manualInputIsSelected()) {
        self.updateManualEntryRadioVal();
      }

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
    this.bindFrequenciesEvents();
    this.bindAmountsEvents();
    this.bindCarouselEvents();
    this.bindFormEvents();
    this.bindWindowEvents();
  }
}
