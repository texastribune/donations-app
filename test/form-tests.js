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
    $('body').append( $('<input id="amount-radio" type="radio"/>') );

    DonationForm = new FormHandler({
      amountsAttach: $('<div/>'),
      outerContainer: $('<div/>'),
      innerContainer: $('<div/>'),
      carouselSlides: $('<div aria-hidden="true"/><div/>'),
      prevButton: $('<button/>'),
      nextButton: $('<button/>'),
      submitButton: $('<input type="submit"/>'),
      manualInput: $('<input type="text"/>'),
      form: $('<form/>'),
      errorMessage: $('<p/>'),
      frequenciesLabels: $('<label/><label/>'),
      frequenciesRadios: $('#frequency-radio'),
      amountsRadios: '#amount-radio',
      indicators: $('<div/><div/><div/>'),
      fadeEl: $('<div/>'),
      defaultAmountsIndex: 2,
      startSlide: 0,
      startFrequency: 'monthly',
      animationDelay: 200,
      animationLength: 400,
      frequenciesToAmounts: {
        once: [50, 75, 100, 200, 500, 1000],
        monthly: [5, 10, 15, 25, 55, 85],
        yearly: [50, 75, 100, 200, 500, 1000]
      }
    });
  });

  it('inner container should be outer container width times number of slides', () => {
    sinon.stub(DonationForm, 'getOuterContainerWidth').returns(100);
    DonationForm.setInnerContainerWidth();
    assert.equal(DonationForm.innerContainer.css('width'), '200px');
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

  it('new amounts should be array based on current frequency', () => {
    DonationForm.currFrequency = 'yearly';
    const newRangesValues = DonationForm.getFrequenciesToAmountsValues();
    assert.deepEqual(newRangesValues, [50, 75, 100, 200, 500, 1000]);
  });

  it('amounts markup should contain certain values', () => {
    const markup = DonationForm.buildAmountsMarkup([5, 10, 15, 25, 55, 85]);
    assert.include(markup, 'for="amount-');
    assert.include(markup, 'id="amount-');
    assert.include(markup, '$55');
  });

  it('amounts markup should have frequency marker if not one-time', () => {
    DonationForm.currFrequency = 'monthly';
    let markup = DonationForm.buildAmountsMarkup(['bar', 'baz', 'foo', 'lorem']);
    assert.include(markup.trim(), 'per month');

    DonationForm.currFrequency = 'once';
    markup = DonationForm.buildAmountsMarkup(['bar', 'baz', 'foo', 'lorem']);
    assert.notInclude(markup.trim(), 'one time');
  });

  it('new amounts markup should have default selection', () => {
    DonationForm.defaultAmountsIndex = 2;
    const checked = DonationForm.shouldBeChecked(2);
    const unchecked = DonationForm.shouldBeChecked(1);
    assert.isTrue(checked);
    assert.isFalse(unchecked);
  });

  it('events should be reinitialized after a frequency radio change', () => {
    const spy = sinon.spy(DonationForm, 'reinitRadioEvents');
    DonationForm.bindFrequenciesEvents();
    DonationForm.frequenciesRadios.trigger('change');
    assert.isAtLeast(spy.callCount, 1);
  });

  it('changing a radio should update the selected class', () => {
    const spy = sinon.spy(DonationForm, 'updateSelectedClass');
    DonationForm.bindAmountsEvents();
    DonationForm.amountsRadios.trigger('change');
    assert.isTrue(spy.calledWith('amount'));
  });

  it('clicking next does nothing when at last slide', () => {
    const spy = sinon.spy(DonationForm, 'incrementSlide');
    DonationForm.currSlide = DonationForm.numSlides - 1;
    DonationForm.bindCarouselEvents();
    DonationForm.nextButton.trigger('click');
    assert.isFalse(spy.called);
  });

  it('clicking previous does nothing when at first slide', () => {
    const spy = sinon.spy(DonationForm, 'decrementSlide');
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
    DonationForm.currSlide = 0;
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
    DonationForm.currSlide = 0;
    DonationForm.bindCarouselEvents();
    DonationForm.nextButton.trigger('click');
    assert.isTrue(spy.calledWith('next'));
  });

  it('clicking a frequency label should move carousel to amounts slide', () => {
    const spy = sinon.spy(DonationForm, 'setTransform');
    sinon.stub(DonationForm, 'getOuterContainerWidth').returns(100);
    DonationForm.currSlide = 0;
    DonationForm.bindCarouselEvents();
    DonationForm.bindFrequenciesEvents();
    DonationForm.frequenciesLabels.trigger('click');
    setTimeout(function(){
      assert.isTrue(spy.called);
      assert.equal(DonationForm.innerContainer.css('transform'), 'translateX(-100px)');
    }, DonationForm.animationDelay);
  });

  it('dots should indicate current slide', () => {
    DonationForm.currSlide = 0;
    DonationForm.bindCarouselEvents();
    DonationForm.nextButton.trigger('click');
    assert.isTrue( DonationForm.indicators.eq(DonationForm.currSlide).hasClass('carousel__dot--selected') );
    assert.isTrue( DonationForm.indicators.eq(DonationForm.currSlide-1).hasClass('carousel__dot--normal') );
  });

  it('all slides but current should have aria-hidden', () => {
    DonationForm.currSlide = 1;
    DonationForm.bindCarouselEvents();

    DonationForm.prevButton.trigger('click');
    assert.equal('true', DonationForm.carouselSlides.eq(1).attr('aria-hidden'));
    assert.notEqual('true', DonationForm.carouselSlides.eq(0).attr('aria-hidden'));

    DonationForm.nextButton.trigger('click');
    assert.equal('true', DonationForm.carouselSlides.eq(0).attr('aria-hidden'));
    assert.notEqual('true', DonationForm.carouselSlides.eq(1).attr('aria-hidden'));
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

  it('should convert the input string to an object', () => {
    const input = 'frequency=monthly&amount=bar';
    const inputAsObject = DonationForm.convertInputToObject(input);
    assert.deepEqual({ frequency: 'monthly', amount: 'bar' }, inputAsObject);
  });

  it('the form should validate input as numeric', () => {
    assert.isTrue(DonationForm.isValidAmountInput('1234'));
    assert.isTrue(DonationForm.isValidAmountInput(1234));
    assert.isFalse(DonationForm.isValidAmountInput('$1234'));
    assert.isFalse(DonationForm.isValidAmountInput('1,234'));
    assert.isFalse(DonationForm.isValidAmountInput('1234a'));
    assert.isFalse(DonationForm.isValidAmountInput(''));
  });

  it('four-digit numbers should have commas', () => {
    assert.equal('5,000', DonationForm.putCommasInNumber(5000));
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
