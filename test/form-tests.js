const assert = chai.assert;
const expect = chai.expect;

import FormHandler from '../raw/js/form';

describe('Donation form', () => {
  it('testing testing', function() {
    const Handler = new FormHandler();
    const obj = {};

    Handler.funFun(obj);

    expect(obj).to.have.all.keys('sunSun');
  });
});
