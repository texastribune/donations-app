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

    DonationForm = new FormHandler({
      rangesAttach: $('<div/>'),
      amountsAttach: $('<div/>'),
      outerContainer: $('<div/>'),
      innerContainer: $('<div/>'),
      carouselSlides: $('<div/><div/><div/>'),
      prevButton: $('<button/>'),
      nextButton: $('<button/>'),
      submitButton: $('<input type="submit"/>'),
      frequenciesRadios: '#frequency-radio',
      rangesRadios: '#range-radio',
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
    spy.reset();
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
    const callIndexWithChecked = DonationForm.defaultRangesIndex;
    DonationForm.buildRangesMarkup([9, 10, 11, 12]);
    assert.equal(spy.returnValues[callIndexWithChecked], 'checked');
  });

  it('new amounts markup should have default selection', () => {
    const spy = sinon.spy(DonationForm, 'shouldBeChecked');
    const callIndexWithChecked = DonationForm.defaultAmountsIndex;
    DonationForm.buildAmountsMarkup([29, 30, 31, 32]);
    assert.equal(spy.returnValues[callIndexWithChecked], 'checked');
  });

  it('events should be reinitialized after a radio change', () => {
    const spy = sinon.spy(DonationForm, 'reinitEvents');
    DonationForm.bindEvents();
    DonationForm.frequenciesRadios.trigger('change');
    DonationForm.rangesRadios.trigger('change');
    assert.isAtLeast(spy.callCount, 2);
  });
});
