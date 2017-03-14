const chai = require('chai');
const sinon = require('sinon');
const assert = chai.assert;
const expect = chai.expect;

import FormHandler from '../raw/js/form';

describe('Donation carousel form', () => {
  let DonationForm;

  beforeEach(function(){
    this.jsdom = require('jsdom-global')();
    window.jQuery = window.$ = global.$ = require('jquery');

    DonationForm = new FormHandler({
      rangeAttach: $('<div/>'),
      amountsAttach: $('<div/>'),
      outerContainer: $('<div/>'),
      innerContainer: $('<div/>'),
      carouselSlides: $('<div/><div/><div/>'),
      prevButton: $('<button/>'),
      nextButton: $('<button/>'),
      submitButton: $('<input type="submit">'),
      startFrequencyIndex: 1,
      startRangeIndex: 1,
      startSlide: 0,
      frequencyToRanges: [
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12]
      ],
      rangesToAmounts: [
        [13, 14, 15, 16],
        [17, 18, 19, 20],
        [21, 22, 23, 24]
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
});
