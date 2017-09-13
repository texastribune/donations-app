export default class FormHandler {
  constructor(config) {
    this.amountsRadios = $(config.amountsRadioClass);
    this.frequenciesRadios = $(config.frequenciesRadioClass);
    this.amountsAttachEl = config.amountsAttachEl;
    this.monthlyAmounts = config.monthlyAmounts;
    this.yearlyAmounts = config.yearlyAmounts;
    this.defaultMonthlyAmountsIndex = config.defaultMonthlyAmountsIndex;
    this.defaultYearlyAmountsIndex = config.defaultYearlyAmountsIndex;

    this.amountsRadiosClass = '.checkout__amounts-radio';
    this.invalidClass = 'invalid';
    this.validClass = 'valid';
    this.formEl = $('#checkout-form');
    this.manualInputEl = $('#manual-input');
    this.manualRadioEl = $('#amount-manual');
    this.manualLabelEl = $('#manual-label');
    this.errorEl = $('#error');
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
    this.amountsAttachEl.empty().append(markup);
  }

  _updateManualInputBorder(valid) {
    let borderClass;

    if (valid) {
      this.manualInputEl
        .removeClass(this.invalidClass)
        .addClass(this.validClass);
    } else {
      this.manualInputEl
        .removeClass(this.validClass)
        .addClass(this.invalidClass);
    }
  }

  _clearManualInput() {
    this.manualInputEl.val('');
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

  _bindFrequenciesEvents() {
    const self = this;

    this.frequenciesRadios.change(function() {
      const frequency = $(this).val();

      self._clearValidationError();
      self._clearManualInput();
      self._buildAmounts(frequency);
    });
  }

  _bindManualEvents() {
    const self = this;

    this.manualInputEl.focus(function() {
      self._clearValidationError();
      self.manualRadioEl
        .prop('checked', true)
        .change();
    });
  }

  _bindSubmitEvents() {
    const self = this;

    this.formEl.submit(function(e) {
      self.manualRadioEl.val(
        self.manualInputEl.val()
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
