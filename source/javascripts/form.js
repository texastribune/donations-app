export default class FormHandler {
  constructor() {
    this.monthlyAmounts = [5, 10, 15];
    this.yearlyAmounts = [50, 75, 100];
    this.defaultMonthlyAmountsIndex = 1;
    this.defaultYearlyAmountsIndex = 1;
    this.amountsAttach = $('#amounts-attach');
    this.frequenciesRadiosClass = '.checkout__frequencies-radio';
    this.frequenciesRadios = $('.checkout__frequencies-radio');
    this.amountsRadiosClass = '.checkout__amounts-radio';
    this.amountsRadios = $('.checkout__amounts-radio');
    this.resetFrequencyEl = $('#frequency-monthly');
    this.resetAmountEl = $('#amount-2');
    this.invalidClass = 'invalid';
    this.validClass = 'valid';
    this.form = $('#checkout-form');
    this.manualInput = $('#manual-input');
    this.manualRadioId = 'amount-manual'
    this.manualRadio = $('#amount-manual');
    this.manualLabel = $('#manual-label');
    this.errorEl = $('#error');
    this.submitEl = $('#checkout-submit');
    this.campaignIdEl = $('#campaign-id');
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

  static getCampaignId() {
    let campaignID = null;
    let params = window.location.search;

    if (params) {
      params = params.replace(/\?/g, '').split('&');

      params.forEach((param) => {
        const splitParam = param.split('=');

        if (splitParam[0].toLowerCase() === 'campaignid') {
          campaignID = splitParam[1];
        }
      });
    }

    return campaignID;
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

  _getSelectedFrequency() {
    return $(`${this.frequenciesRadiosClass}:checked`).val();
  }

  _getSelectedAmount() {
    return $(`${this.amountsRadiosClass}:checked`).val();
  }

  _setSubmitText(frequency, amount = null) {
    let text;

    if (amount) {
      text = `Give $${amount} ${frequency}`;
    } else {
      text = `Give ${frequency}`;
    }

    this.submitEl.val(text);
  }

  _setSubmitTextWithAmount() {
    const currFrequency = this._getSelectedFrequency();
    const currAmount = this._getSelectedAmount();

    this._setSubmitText(currFrequency, currAmount);
  }

  _setSubmitTextWithoutAmount() {
    const currFrequency = this._getSelectedFrequency();
    this._setSubmitText(currFrequency);
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

  _addCampaignIdFieldToForm(campaignId) {
    const el = $('<input />');
    el.attr('type', 'hidden');
    el.addClass('hidden');
    el.attr('name', 'campaignId');
    el.val(campaignId);

    this.form.append(el);
  }

  _bindAmountsEvents() {
    const self = this;

    this.amountsRadios.change(function() {
      self._clearManualInput();
      self._clearValidationError();
      self._setSubmitTextWithAmount();
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
      self._setSubmitTextWithAmount();
    });
  }

  _bindManualEvents() {
    const self = this;

    this.manualInput.focus(function() {
      self._clearValidationError();
      self.manualRadio.prop('checked', true).change();
      self._setSubmitTextWithoutAmount();
    });
  }

  _bindSubmitEvents() {
    const self = this;

    this.form.submit(function(e) {
      self.manualRadio.val(
        self.manualInput.val()
      );

      const amount = self._getSelectedAmount();

      if (!FormHandler.isValidAmount(amount)) {
        e.preventDefault();
        self._raiseValidationError();
        self.manualInput.blur();
      } else {
        if (self.campaignIdEl.length === 0) {
          const campaignId = FormHandler.getCampaignId();

          if (campaignId) {
            self._addCampaignIdFieldToForm(campaignId);
          }
        }
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
