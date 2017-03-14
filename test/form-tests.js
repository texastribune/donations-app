import chai from 'chai';
import sinon from 'sinon';

const assert = chai.assert;
const expect = chai.expect;

import FormHandler from '../raw/js/form';

describe('Donation carousel form', () => {
  let DonationForm = new FormHandler();

  afterEach(() => {
    DonationForm = new FormHandler();
  });

  it('should be the width of its container times the number of slides', () => {
    const getOuterContainerWidth = sinon.stub(DonationForm, 'getOuterContainerWidth');

    DonationForm.carouselInner = $('<div/>');
    DonationForm.numSlides = 3;
    getOuterContainerWidth.returns(100);

    DonationForm.setInnerWidth();
    assert.equal(DonationForm.carouselInner.css('width'), '300px');
  });
});
