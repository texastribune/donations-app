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
    $('body').append( $('<input id="frequency-radio" type="radio" data-frequency="2"/>') );
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
      manualInput: $('<input type="text">'),
      form: $('<form/>'),
      frequenciesRadios: '#frequency-radio',
      rangesRadios: '#range-radio',
      amountsRadios: '#amount-radio',
      defaultFrequenciesIndex: 1,
      defaultRangesIndex: 1,
      defaultAmountsIndex: 1,
      startSlide: 0,
      frequenciesToRanges: [
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12]
      ],
      rangesToAmounts: [
        [17, 18, 19, 20],
        [21, 22, 23, 24],
        [25, 26, 27, 28],
        [29, 30, 31, 32]
      ]
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

  it('transform amount should never be negative', () => {
    sinon.stub(DonationForm, 'getOuterContainerWidth').returns(100);

    DonationForm.currSlide = 0;
    assert.isAtLeast(DonationForm.getTransformValue(), 0);

    DonationForm.currSlide = 2;
    assert.isAtLeast(DonationForm.getTransformValue(), 0);
  });

  it('getRadioIndex should return non-negative number or throw error', () => {
    const spy = sinon.spy(DonationForm, 'getRadioIndex');
    let rangeEl = $('<input type="radio" data-range="0"/>');

    expect(DonationForm.getRadioIndex.bind(null, 'range', rangeEl)).to.not.throw(Error);
    assert.isFalse(spy.threw());
    spy.reset();

    rangeEl = $('<input type="radio" data-range="foo"/>');
    expect(DonationForm.getRadioIndex.bind(null, 'range', rangeEl)).to.throw(Error);
    assert.isTrue(spy.threw());
    spy.reset();

    rangeEl = $('<input type="radio" data-range="-1"/>');
    expect(DonationForm.getRadioIndex.bind(null, 'range', rangeEl)).to.throw(Error);
    assert.isTrue(spy.threw());
    spy.reset();

    rangeEl = $('<input type="radio" data-range="2.4"/>');
    expect(DonationForm.getRadioIndex.bind(null, 'range', rangeEl)).to.throw(Error);
    assert.isTrue(spy.threw());
  });

  it('new ranges should be array at index retrieved from frequency radio', () => {
    const index = DonationForm.frequenciesRadios.first().attr('data-frequency');
    const newRangesValues = DonationForm.getFrequenciesToRangesValues(index);
    assert.deepEqual(newRangesValues, [9, 10, 11, 12]);
  });

  it('new amounts should be array at index retrieved from range radio', () => {
    const index = DonationForm.rangesRadios.first().attr('data-range');
    const newRangesValues = DonationForm.getRangesToAmountsValues(index);
    assert.deepEqual(newRangesValues, [25, 26, 27, 28]);
  });

  it('frequency changes should reset amounts to default', () => {
    const spy = sinon.spy(DonationForm, 'getRangesToAmountsValues');
    const defaultRangesToAmounts = DonationForm.rangesToAmounts[DonationForm.defaultRangesIndex];
    DonationForm.bindEvents();
    DonationForm.frequenciesRadios.trigger('change');
    assert.isTrue(spy.called);
    assert.equal(spy.returnValues[0], defaultRangesToAmounts);
  });

  it('ranges markup should contain certain values', () => {
    const markup = DonationForm.buildRangesMarkup([9, 10, 11, 12]);
    assert.include(markup, 'aria-labelledby="range-legend"');
    assert.include(markup, 'for="range-');
    assert.include(markup, 'id="range-');
    assert.include(markup, '<span class="carousel__label-text">11</span>');
  });

  it('amounts markup should contain certain values', () => {
    const markup = DonationForm.buildAmountsMarkup([29, 30, 31, 32]);
    assert.include(markup, 'aria-labelledby="amount-legend"');
    assert.include(markup, 'for="amount-');
    assert.include(markup, 'id="amount-');
    assert.include(markup, '<span class="carousel__label-text">32</span>');
  });

  it('new ranges markup should have default selection', () => {
    const spy = sinon.spy(DonationForm, 'shouldBeChecked');
    const callIndexReturningChecked = DonationForm.defaultRangesIndex;
    DonationForm.buildRangesMarkup([9, 10, 11, 12]);
    assert.equal(spy.returnValues[callIndexReturningChecked], 'checked');
  });

  it('new amounts markup should have default selection', () => {
    const spy = sinon.spy(DonationForm, 'shouldBeChecked');
    const callIndexReturningChecked = DonationForm.defaultAmountsIndex;
    DonationForm.buildAmountsMarkup([29, 30, 31, 32]);
    assert.equal(spy.returnValues[callIndexReturningChecked], 'checked');
  });

  it('events should be reinitialized after a radio change', () => {
    const spy = sinon.spy(DonationForm, 'reinitEvents');
    DonationForm.bindEvents();
    DonationForm.frequenciesRadios.trigger('change');
    DonationForm.rangesRadios.trigger('change');
    assert.isAtLeast(spy.callCount, 2);
  });

  it('changing a radio should update the selected class', () => {
    const spy = sinon.spy(DonationForm, 'updateSelectedClass');
    DonationForm.bindEvents();
    DonationForm.amountsRadios.trigger('change');
    assert.isTrue(spy.calledWith('amount'));
  });

  it('clicking next does nothing when at last slide', () => {
    const spy = sinon.spy(DonationForm, 'updateCurrSlide');
    DonationForm.bindEvents();
    DonationForm.currSlide = DonationForm.numSlides-1;
    DonationForm.nextButton.trigger('click');
    assert.isFalse(spy.called);
  });

  it('clicking previous does nothing when at first slide', () => {
    const spy = sinon.spy(DonationForm, 'updateCurrSlide');
    DonationForm.bindEvents();
    DonationForm.currSlide = 0;
    DonationForm.prevButton.trigger('click');
    assert.isFalse(spy.called);
  });

  it('clicking previous decrements current slide when not at first already', () => {
    DonationForm.currSlide = 2;
    DonationForm.bindEvents();
    DonationForm.prevButton.trigger('click');
    assert.equal(1, DonationForm.currSlide);
  });

  it('clicking next increments current slide when not at last already', () => {
    DonationForm.currSlide = 0;
    DonationForm.bindEvents();
    DonationForm.nextButton.trigger('click');
    assert.equal(1, DonationForm.currSlide);
  });

  it('any time you are allowed to click previous, it should enable next', () => {
    const spy = sinon.spy(DonationForm, 'enableButton');
    DonationForm.currSlide = 1;
    DonationForm.bindEvents();
    DonationForm.prevButton.trigger('click');
    assert.isTrue(spy.calledWith('next'));
  });

  it('any time you are allowed to click next, it should enable previous', () => {
    const spy = sinon.spy(DonationForm, 'enableButton');
    DonationForm.currSlide = 1;
    DonationForm.bindEvents();
    DonationForm.nextButton.trigger('click');
    assert.isTrue(spy.calledWith('prev'));
  });

  it('if clicking previous results in moving to first slide, disable previous', () => {
    const spy = sinon.spy(DonationForm, 'disableButton');
    DonationForm.currSlide = 1;
    DonationForm.bindEvents();
    DonationForm.prevButton.trigger('click');
    assert.isTrue(spy.calledWith('prev'));
  });

  it('if clicking next results in moving to last slide, disable next', () => {
    const spy = sinon.spy(DonationForm, 'disableButton');
    DonationForm.currSlide = 1;
    DonationForm.bindEvents();
    DonationForm.nextButton.trigger('click');
    assert.isTrue(spy.calledWith('next'));
  });

  it('the submit button should appear on the last slide', () => {
    const spy = sinon.spy(DonationForm, 'showSubmitButton');
    DonationForm.currSlide = 1;
    DonationForm.bindEvents();
    DonationForm.nextButton.trigger('click');
    assert.isTrue(spy.calledOnce);
  });

  it('the submit button should always get hidden when clicking previous button', () => {
    const spy = sinon.spy(DonationForm, 'hideSubmitButton');
    DonationForm.currSlide = 2;
    DonationForm.bindEvents();
    DonationForm.prevButton.trigger('click');
    DonationForm.prevButton.trigger('click');
    assert.isTrue(spy.calledTwice);
  });

  it('all slides but current should have aria-hidden', () => {
    DonationForm.currSlide = 1;
    DonationForm.carouselSlides = $('<div aria-hidden="true"/><div/><div aria-hidden="true"/>');
    DonationForm.bindEvents();
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
    DonationForm.bindEvents();
    DonationForm.nextButton.trigger('click');
    assert.isTrue(spy.called);
  });

  it('focusing on manual input should select its accompanying radio', () => {
    const spy = sinon.spy(DonationForm, 'selectManualEntryRadio');
    DonationForm.bindEvents();
    DonationForm.manualInput.trigger('focus');
    assert.isTrue(spy.calledOnce);
  });

  it('entering a value in the manual field should update value of accompanying radio', () => {
    const spy = sinon.spy(DonationForm, 'updateManualEntryRadioVal');
    DonationForm.bindEvents();
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
    const annualOpts = { frequency: 'annually', amount: '109' };
    const monthlyURL = DonationForm.getCheckoutURL(monthlyOpts);
    const onceURL = DonationForm.getCheckoutURL(onceOpts);
    const annualURL = DonationForm.getCheckoutURL(annualOpts);

    assert.equal('https://checkout.texastribune.org/memberform?installmentPeriod=monthly&amount=22', monthlyURL);
    assert.equal('https://checkout.texastribune.org/donateform?amount=50', onceURL);
    assert.equal('https://checkout.texastribune.org/memberform?installmentPeriod=yearly&amount=109', annualURL);
  });
});
