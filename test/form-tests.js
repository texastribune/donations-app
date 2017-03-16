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
      startFrequencyIndex: 1,
      startRangeIndex: 0,
      startSlide: 0,
      frequenciesToRanges: [
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12]
      ],
      rangesToAmounts: [
        [
          [13, 14, 15, 16],
          [17, 18, 19, 20],
          [21, 22, 23, 24],
          [25, 26, 27, 28]
        ],

        [
          [29, 30, 31, 32],
          [33, 34, 35, 36],
          [37, 38, 39, 40],
          [41, 42, 43, 44]
        ],

        [
          [45, 46, 47, 48],
          [49, 50, 51, 52],
          [53, 54, 55, 56],
          [57, 58, 59, 60]
        ]
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

  it('getRadioIndex should only be called with frequency and range', () => {
    const spy = sinon.spy(DonationForm, 'getRadioIndex');

    DonationForm.bindEvents();
    DonationForm.frequenciesRadios.trigger('change');
    DonationForm.rangesRadios.trigger('change');

    assert.isTrue(spy.calledWith('frequency'));
    assert.isTrue(spy.calledWith('range'));
    assert.isFalse(spy.calledWith('amount'));

    spy.reset();
  });

  it('should only do markup replacement sequence if not current index', () => {
    const spy = sinon.spy(DonationForm, 'getFrequenciesToRangesValues');

    DonationForm.currFrequencyIndex = 2;
    DonationForm.bindEvents();
    DonationForm.frequenciesRadios.trigger('change');
    assert.isFalse(spy.called);
    spy.reset();

    DonationForm.currFrequencyIndex = 1;
    DonationForm.frequenciesRadios.trigger('change');
    assert.isTrue(spy.called);
    spy.reset();
  });

  it('new ranges should be an array at index retrieved from frequency radio', () => {
    const index = DonationForm.frequenciesRadios.eq(0).attr('data-frequency');
    const newRangesValues = DonationForm.getFrequenciesToRangesValues(index);
    assert.deepEqual(newRangesValues, [9, 10, 11, 12]);
  });

  it('new amounts should be an array index[currFrequencyIndex][value retrieved from range radio]', () => {
    const index = DonationForm.rangesRadios.first().attr('data-range');
    const newAmountsValues = DonationForm.getRangesToAmountsValues(index);
    DonationForm.currFrequencyIndex = 1;
    assert.deepEqual(newAmountsValues, [37, 38, 39, 40]);
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

  it('current frequency or range index should only be updated if event index is different', () => {
    const spy = sinon.spy(DonationForm, 'setNewCurrentIndex');

    DonationForm.currFrequencyIndex = 2;
    DonationForm.bindEvents();
    DonationForm.frequenciesRadios.trigger('change');
    assert.isFalse(spy.called);
    spy.reset();

    DonationForm.currFrequencyIndex = 1;
    DonationForm.frequenciesRadios.trigger('change');
    assert.isTrue(spy.called);
    assert.equal(DonationForm.currFrequencyIndex, 2);
    spy.reset();
  });

  it('events should be reinitialized after a frequency radio and range radio change', () => {
    const spy = sinon.spy(DonationForm, 'reinitEvents');
    DonationForm.bindEvents();
    DonationForm.frequenciesRadios.trigger('change');
    DonationForm.rangesRadios.trigger('change');
    assert.isTrue(spy.calledTwice);
  });
});
