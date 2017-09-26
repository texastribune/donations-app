export default class FormHandler {
  constructor() {
    this.monthlyAmounts = [5, 10, 15, 25, 55, 85];
    this.yearlyAmounts = [50, 75, 100, 250, 500, 1000];
    this.defaultMonthlyAmountsIndex = 2;
    this.defaultYearlyAmountsIndex = 2;
    this.amountsAttach = $('#amounts-attach');
    this.frequenciesRadios = $('.checkout__frequencies-radio');
    this.amountsRadiosClass = '.checkout__amounts-radio';
    this.amountsRadios = $('.checkout__amounts-radio');
    this.invalidClass = 'invalid';
    this.validClass = 'valid';
    this.form = $('#checkout-form');
    this.manualInput = $('#manual-input');
    this.manualRadio = $('#amount-manual');
    this.manualLabel = $('#manual-label');
    this.errorEl = $('#error');
  }

  static getCampaignId() {
    let campaignId = null;
    let params = window.location.search;

    if (params) {
      params = params.replace(/\?/g, '').split('&');

      params.forEach((param) => {
        const splitParam = param.split('=');

        if (splitParam[0].toLowerCase() === 'campaignid') {
          campaignId = splitParam[1];
        }
      });
    }

    return campaignId;
  }

  static isValidAmount(amount) {
    if (amount === '') {
      return false;
    }
    return !isNaN(amount);
  }

  static shouldBeChecked(currIndex, shouldBeCheckedIndex) {
    return currIndex === shouldBeCheckedIndex;
  }

  static getAmountsMarkup(amounts, checkedIndex) {
    return `
      ${amounts.map((val, index) => `
        <li class="checkout__amounts-item">
          <input id="amount-${index}" class="checkout__amounts-radio visually-hidden" type="radio" value="${val}" name="amount" ${FormHandler.shouldBeChecked(index, checkedIndex) ? 'checked' : ''}>
          <label for="amount-${index}" class="checkout__amounts-label">$${val}</label>
        </li>
      `).join('\n')}
    `;
  }

  _buildAmounts(frequency) {
    let amounts;
    let checkedIndex;

    if (frequency === 'monthly') {
      amounts = this.monthlyAmounts;
      checkedIndex = this.defaultMonthlyAmountsIndex;
    } else if (frequency === 'yearly') {
      amounts = this.yearlyAmounts;
      checkedIndex = this.defaultYearlyAmountsIndex;
    }

    const markup = FormHandler.getAmountsMarkup(amounts, checkedIndex);
    this.amountsAttach.empty().append(markup);
  }

  _updateManualInputBorder(valid) {
    let borderClass;

    if (valid) {
      this.manualInput
        .removeClass(this.invalidClass)
        .addClass(this.validClass);
    } else {
      this.manualInput
        .removeClass(this.validClass)
        .addClass(this.invalidClass);
    }
  }

  _clearManualInput() {
    this.manualInput.val('');
  }

  _clearValidationError() {
    this.errorEl.addClass('hidden');
    this._updateManualInputBorder(true);
  }

  _raiseValidationError() {
    this.errorEl.removeClass('hidden');
    this._updateManualInputBorder(false);
  }

  _bindAmountsEvents() {
    const self = this;

    this.amountsRadios.change(function() {
      self._clearValidationError();
    });
  }

  _rebindAmountsEvents() {
    this.amountsRadios = $(this.amountsRadiosClass);
    this._bindAmountsEvents();
  }

  _bindFrequenciesEvents() {
    const self = this;

    this.frequenciesRadios.change(function() {
      const frequency = $(this).val();

      self._clearValidationError();
      self._clearManualInput();
      self._buildAmounts(frequency);
      self._rebindAmountsEvents();
    });
  }

  _bindManualEvents() {
    const self = this;

    this.manualInput.focus(function() {
      self._clearValidationError();
      self.manualRadio
        .prop('checked', true)
        .change();
    });
  }

  _bindSubmitEvents() {
    const self = this;

    this.form.submit(function(e) {
      self.manualRadio.val(
        self.manualInput.val()
      );

      const amount = $(`${self.amountsRadiosClass}:checked`).val();

      if (!FormHandler.isValidAmount(amount)) {
        e.preventDefault();
        self._raiseValidationError();
      }
    });
  }

  init() {
    this._bindAmountsEvents();
    this._bindFrequenciesEvents();
    this._bindManualEvents();
    this._bindSubmitEvents();
  }
}
