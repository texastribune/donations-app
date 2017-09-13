import '../scss/all.scss';
import FormHandler from './formNoCarousel';

const form = new FormHandler({
  amountsRadioClass: '.checkout__amounts-radio',
  frequenciesRadioClass: '.checkout__frequencies-radio',
  amountsAttachEl: $('#amounts-attach'),
  monthlyAmounts: [5, 10, 15, 25, 55, 85],
  yearlyAmounts: [50, 75, 100, 250, 500, 1000],
  defaultMonthlyAmountsIndex: 2,
  defaultYearlyAmountsIndex: 2,
});

form.init();
