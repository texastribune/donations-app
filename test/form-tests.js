const sinon = require('sinon');
const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;

import FormHandler from '../raw/js/form';

describe('Donation carousel form', () => {
  let DonationForm;

  beforeEach(function(){
    this.jsdom = require('jsdom-global')();
    window.jQuery = window.$ = global.$ = require('jquery');
    $('body').append( $('<input id="frequency-radio" type="radio" data-frequency="monthly"/>') );
    $('body').append( $('<input id="range-radio" type="radio" data-range="2"/>') );
    $('body').append( $('<input id="amount-radio" type="radio"/>') );

    DonationForm = new FormHandler({
      rangesAttach: $('<div/>'),
      amountsAttach: $('<div/>'),
      outerContainer: $('<div/>'),
      innerContainer: $('<div/>'),
      carouselSlides: $('<div/><div/><div/>'),
      prevButton: $('<button/>'),
      nextButton: $('<button/>'),
      submitButton: $('<input type="submit"/>'),
      manualInput: $('<input type="text"/>'),
      form: $('<form/>'),
      errorMessage: $('<p/>'),
      frequenciesRadios: '#frequency-radio',
      rangesRadios: '#range-radio',
      amountsRadios: '#amount-radio',
      indicators: $('<div/><div/><div/>'),
      defaultFrequenciesIndex: 1,
      defaultRangesIndex: 1,
      defaultAmountsIndex: 1,
      startSlide: 0,
      startFrequency: 'monthly',
      frequenciesToRanges: {
        once: ['$1-$34', '$35-$100', '$101-$500', '$501-$999'],
        monthly: ['$5-$20', '$21-$40', '$41-$60', '$61-$82'],
        yearly: ['$1-$34', '$35-$100', '$101-$500', '$501-$999']
      },

      rangesToAmounts: {
        once: [
          [5, 15, 25, 34],
          [35, 65, 85, 100],
          [120, 240, 360, 500],
          [520, 640, 760, 880]
        ],

        monthly: [
          [5, 11, 16, 20],
          [21, 29, 34, 40],
          [41, 49, 54, 60],
          [61, 69, 78, 82]
        ],

        yearly: [
          [5, 15, 25, 34],
          [35, 65, 85, 100],
          [120, 240, 360, 500],
          [520, 640, 760, 880]
        ]
      }
    });
  });

  it('inner container should be outer container width times number of slides', () => {
    sinon.stub(DonationForm, 'getOuterContainerWidth').returns(100);
    DonationForm.setInnerContainerWidth();
    assert.equal(DonationForm.innerContainer.css('width'), '300px');
  });

  it('slide width should be equal to outer container width', () => {
    sinon.stub(DonationForm, 'getOuterContainerWidth').returns(100);
    DonationForm.setSlideWidth();
    assert.equal(DonationForm.carouselSlides.css('width'), '100px');
  });

  it('transform amount should be equal to current slide index times outer container width', () => {
    sinon.stub(DonationForm, 'getOuterContainerWidth').returns(100);
    DonationForm.currSlide = 2;
    DonationForm.setTransform();
    assert.equal(DonationForm.innerContainer.css('transform'), 'translateX(-200px)');
  });

  it('new ranges should be array at index retrieved from frequency radio', () => {
    const newRangesValues = DonationForm.getFrequenciesToRangesValues();
    DonationForm.currFrequency = 'monthly';
    assert.deepEqual(newRangesValues, ['$5-$20', '$21-$40', '$41-$60', '$61-$82']);
  });

  it('new amounts should be array at index retrieved from range radio', () => {
    const newRangesValues = DonationForm.getRangesToAmountsValues(2);
    DonationForm.currFrequency = 'monthly';
    assert.deepEqual(newRangesValues, [41, 49, 54, 60]);
  });

  it('frequency changes should reset amounts to default', () => {
    DonationForm.currFrequency = 'monthly';
    DonationForm.defaultRangesIndex = 1;
    const defaultRangesToAmounts = DonationForm.rangesToAmounts[DonationForm.currFrequency][DonationForm.defaultRangesIndex];
    const spy = sinon.spy(DonationForm, 'getRangesToAmountsValues');
    DonationForm.bindRadioEvents();
    DonationForm.frequenciesRadios.trigger('change');
    // our fake frequency radio has data-frequency="monthly"
    assert.equal(spy.returnValues[0], defaultRangesToAmounts);
  });

  it('ranges markup should contain certain values', () => {
    const markup = DonationForm.buildRangesMarkup(['$1-$34', '$35-$100', '$101-$500', '$501-$999']);
    assert.include(markup, 'aria-labelledby="range-legend"');
    assert.include(markup, 'for="range-');
    assert.include(markup, 'id="range-');
    assert.include(markup, '<span class="carousel__label-text">$35-$100</span>');
  });

  it('amounts markup should contain certain values', () => {
    const markup = DonationForm.buildAmountsMarkup([5, 15, 25, 34]);
    assert.include(markup, 'aria-labelledby="amount-legend"');
    assert.include(markup, 'for="amount-');
    assert.include(markup, 'id="amount-');
    assert.include(markup, '<span class="carousel__label-text">$25');
  });

  it('dynamic markup should only have frequency marker if not one-time', () => {
    DonationForm.currFrequency = 'yearly';
    let markup = DonationForm.buildRangesMarkup(['bar', 'baz', 'foo', 'lorem']);
    assert.include(markup.trim(), 'Choose a yearly range');

    markup = DonationForm.buildAmountsMarkup(['bar', 'baz', 'foo', 'lorem']);
    assert.include(markup.trim(), 'per year');

    DonationForm.currFrequency = 'once';
    markup = DonationForm.buildRangesMarkup(['bar', 'baz', 'foo', 'lorem']);
    assert.include(markup.trim(), 'Choose a range');
  });

  it('new ranges markup should have default selection', () => {
    DonationForm.defaultRangesIndex = 1;
    const checked = DonationForm.shouldBeChecked('range', 1);
    const unchecked = DonationForm.shouldBeChecked('range', 2);
    assert.isTrue(checked);
    assert.isFalse(unchecked);
  });

  it('new amounts markup should have default selection', () => {
    DonationForm.defaultAmountsIndex = 2;
    const checked = DonationForm.shouldBeChecked('amount', 2);
    const unchecked = DonationForm.shouldBeChecked('amount', 1);
    assert.isTrue(checked);
    assert.isFalse(unchecked);
  });

  it('events should be reinitialized after a radio change', () => {
    const spy = sinon.spy(DonationForm, 'reinitRadioEvents');
    DonationForm.bindRadioEvents();
    DonationForm.frequenciesRadios.trigger('change');
    DonationForm.rangesRadios.trigger('change');
    assert.isAtLeast(spy.callCount, 2);
  });

  it('changing a radio should update the selected class', () => {
    const spy = sinon.spy(DonationForm, 'updateSelectedClass');
    DonationForm.bindRadioEvents();
    DonationForm.amountsRadios.trigger('change');
    assert.isTrue(spy.calledWith('amount'));
  });

  it('clicking next does nothing when at last slide', () => {
    const spy = sinon.spy(DonationForm, 'updateCurrSlide');
    DonationForm.bindCarouselEvents();
    DonationForm.currSlide = DonationForm.numSlides-1;
    DonationForm.nextButton.trigger('click');
    assert.isFalse(spy.called);
  });

  it('clicking previous does nothing when at first slide', () => {
    const spy = sinon.spy(DonationForm, 'updateCurrSlide');
    DonationForm.bindCarouselEvents();
    DonationForm.currSlide = 0;
    DonationForm.prevButton.trigger('click');
    assert.isFalse(spy.called);
  });

  it('clicking previous decrements current slide when not at first already', () => {
    DonationForm.currSlide = 2;
    DonationForm.bindCarouselEvents();
    DonationForm.prevButton.trigger('click');
    assert.equal(1, DonationForm.currSlide);
  });

  it('clicking next increments current slide when not at last already', () => {
    DonationForm.currSlide = 0;
    DonationForm.bindCarouselEvents();
    DonationForm.nextButton.trigger('click');
    assert.equal(1, DonationForm.currSlide);
  });

  it('any time you are allowed to click previous, it should enable next', () => {
    const spy = sinon.spy(DonationForm, 'enableButton');
    DonationForm.currSlide = 1;
    DonationForm.bindCarouselEvents();
    DonationForm.prevButton.trigger('click');
    assert.isTrue(spy.calledWith('next'));
  });

  it('any time you are allowed to click next, it should enable previous', () => {
    const spy = sinon.spy(DonationForm, 'enableButton');
    DonationForm.currSlide = 1;
    DonationForm.bindCarouselEvents();
    DonationForm.nextButton.trigger('click');
    assert.isTrue(spy.calledWith('prev'));
  });

  it('if clicking previous means moving to first slide, disable previous', () => {
    const spy = sinon.spy(DonationForm, 'disableButton');
    DonationForm.currSlide = 1;
    DonationForm.bindCarouselEvents();
    DonationForm.prevButton.trigger('click');
    assert.isTrue(spy.calledWith('prev'));
  });

  it('if clicking next means moving to last slide, disable next', () => {
    const spy = sinon.spy(DonationForm, 'disableButton');
    DonationForm.currSlide = 1;
    DonationForm.bindCarouselEvents();
    DonationForm.nextButton.trigger('click');
    assert.isTrue(spy.calledWith('next'));
  });

  it('dots should indicate current slide', () => {
    DonationForm.currSlide = 1;
    DonationForm.bindCarouselEvents();
    DonationForm.nextButton.trigger('click');
    assert.isTrue( DonationForm.indicators.eq(DonationForm.currSlide).hasClass('carousel__dot--selected') );
    assert.isTrue( DonationForm.indicators.eq(DonationForm.currSlide-1).hasClass('carousel__dot--normal') );
  });

  it('all slides but current should have aria-hidden', () => {
    DonationForm.currSlide = 1;
    DonationForm.carouselSlides = $('<div aria-hidden="true"/><div/><div aria-hidden="true"/>');
    DonationForm.bindCarouselEvents();

    DonationForm.prevButton.trigger('click');
    assert.equal('true', DonationForm.carouselSlides.eq(1).attr('aria-hidden'));
    assert.equal('true', DonationForm.carouselSlides.eq(2).attr('aria-hidden'));
    assert.notEqual('true', DonationForm.carouselSlides.eq(0).attr('aria-hidden'));

    DonationForm.nextButton.trigger('click');
    DonationForm.nextButton.trigger('click');
    assert.equal('true', DonationForm.carouselSlides.eq(0).attr('aria-hidden'));
    assert.equal('true', DonationForm.carouselSlides.eq(1).attr('aria-hidden'));
    assert.notEqual('true', DonationForm.carouselSlides.eq(2).attr('aria-hidden'));
  });

  it('during animation, new current slide should get aria-live', () => {
    const spy = sinon.spy(DonationForm, 'tempAccessibleLive');
    DonationForm.currSlide = 0;
    DonationForm.bindCarouselEvents();
    DonationForm.nextButton.trigger('click');
    assert.isTrue(spy.called);
  });

  it('focusing on manual input should select its accompanying radio', () => {
    const spy = sinon.spy(DonationForm, 'selectManualEntryRadio');
    DonationForm.bindFormEvents();
    DonationForm.manualInput.trigger('focus');
    assert.isTrue(spy.calledOnce);
  });

  it('entering a value in the manual field should update value of accompanying radio', () => {
    const spy = sinon.spy(DonationForm, 'updateManualEntryRadioVal');
    DonationForm.bindFormEvents();
    DonationForm.manualInput.trigger('keyup');
    assert.isTrue(spy.called);
  });

  it('should remove range from serialized input', () => {
    const input = ['frequency=monthly', 'range=foo', 'amount=bar'];
    DonationForm.removeRangeFromInput(input);
    assert.deepEqual(['frequency=monthly', 'amount=bar'], input);
  });

  it('should convert the input string to an object', () => {
    const input = 'frequency=monthly&range=foo&amount=bar';
    const inputAsObject = DonationForm.convertInputToObject(input);
    assert.deepEqual({ frequency: 'monthly', amount: 'bar' }, inputAsObject);
  });

  it('the form should validate input as numeric', () => {
    assert.isTrue(DonationForm.isValidAmountInput('1234'));
    assert.isTrue(DonationForm.isValidAmountInput(1234));
    assert.isFalse(DonationForm.isValidAmountInput('$1234'));
    assert.isFalse(DonationForm.isValidAmountInput('1,234'));
    assert.isFalse(DonationForm.isValidAmountInput('1234a'));
  });

  it('should send users to proper checkout form based on frequency and amount', () => {
    const monthlyOpts = { frequency: 'monthly', amount: '22' };
    const onceOpts = { frequency: 'once', amount: '50' };
    const annualOpts = { frequency: 'yearly', amount: '109' };
    const monthlyURL = DonationForm.getCheckoutURL(monthlyOpts);
    const onceURL = DonationForm.getCheckoutURL(onceOpts);
    const annualURL = DonationForm.getCheckoutURL(annualOpts);
    assert.equal('https://checkout.texastribune.org/memberform?installmentPeriod=monthly&amount=22', monthlyURL);
    assert.equal('https://checkout.texastribune.org/donateform?amount=50', onceURL);
    assert.equal('https://checkout.texastribune.org/memberform?installmentPeriod=yearly&amount=109', annualURL);
  });

  it('resizing the window should reset the carousel', () => {
    const spy = sinon.spy(DonationForm, 'initCarousel');
    DonationForm.bindWindowEvents();
    $(window).trigger('resize');
    // delay assertion because of debounce
    setTimeout(function(){
      assert.isTrue(spy.called);
    }, 250);
  });
});
