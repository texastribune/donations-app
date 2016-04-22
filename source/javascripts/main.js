$(document).ready(function() {
  // remove class if javascript is enabled
  $("body").removeClass("no-js");

  // to pop out videos so they play in the browser for users with js
  $('.video').magnificPopup({
    type: 'iframe',
    iframe: {
      markup: '<div class="mfp-iframe-scaler">'+
                  '<div class="mfp-close"></div>'+
                  '<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>'+
                '</div>',
      patterns: {
        youtube: {
          index: 'youtube.com/',
          id: 'v=',
          src: '//www.youtube.com/embed/%id%?autoplay=1&controls=2&enablejsapi=1&modestbranding=1&rel=0&showinfo=0'
        }
      },
      srcAction: 'iframe_src'
    }
  });


  // For top express checkout

  // Initialize top number input spinner for express checkout
  // Uses jquery ui to make it look pretty
  $("#spinner").spinner();

  // Initialize top radio buttonset for monthly/annually
  // Uses jquery ui to make it look pretty
  $("#contribute-buttons-top").buttonset();

  // Determine if contribution frequency is monthly
  var get_frequency = function() {
    if ($("label[for='monthly']").hasClass('ui-state-active')) {
      is_monthly = true;
    } else {
      is_monthly = false;
    }
  };

  // Determine level to display and update text if needed
  var displayLevel = function() {
    get_frequency();
    var input_amount = $('#spinner').val();
    var level_label = $('#level-display');
    var next_level_label = $('#level-next');
    var previous_level_label = $('#level-previous');
    var give_more = $('#give-more');

    if (is_monthly) {
      // detemine level and update text based on monthly frequency
      if (input_amount > 3 && input_amount <= 5) {
        previous_level_label.text('Student');
        level_label.text('Enthusiast');
        next_level_label.text('Activist');
        give_more.text(6 - input_amount);
      } else if (input_amount > 5 && input_amount <= 12) {
        previous_level_label.text('Enthusiast');
        level_label.text('Activist');
        next_level_label.text('Advocate');
        give_more.text(13 - input_amount);
      } else if (input_amount > 12 && input_amount <= 21) {
        previous_level_label.text('Activist');
        level_label.text('Advocate');
        next_level_label.text('Diplomat');
        give_more.text(22 - input_amount);
      } else if (input_amount > 21 && input_amount <= 42) {
        previous_level_label.text('Advocate');
        level_label.text('Diplomat');
        next_level_label.text('Benefactor');
        give_more.text(43 - input_amount);
      } else if (input_amount > 42 && input_amount <= 83) {
        previous_level_label.text('Diplomat');
        level_label.text('Benefactor');
        next_level_label.text("Editor's Circle");
        give_more.text(84 - input_amount);
      } else if (input_amount > 83 && input_amount <= 208) {
        previous_level_label.text('Benefactor');
        level_label.text("Editor's Circle");
        next_level_label.text("Leadership Circle");
        give_more.text(209 - input_amount);
      } else if (input_amount > 208 && input_amount <= 416) {
        previous_level_label.text("Editor's Circle");
        level_label.text('Leadership Circle');
        next_level_label.text("Chairman's Circle");
        give_more.text(417 - input_amount);
      } else if (input_amount > 416) {
        previous_level_label.text("Leadership Circle");
        level_label.text("Chairman's Circle");
        next_level_label.text("No higher level!");
        give_more.text('0');
      }
    } else {
      // detemine level and update text based on yearly frequency
      if (input_amount > 35 && input_amount <= 59) {
        previous_level_label.text('Student');
        level_label.text('Enthusiast');
        next_level_label.text('Activist');
      } else if (input_amount > 59 && input_amount <= 149) {
        previous_level_label.text('Enthusiast');
        level_label.text('Activist');
        next_level_label.text('Advocate');
      } else if (input_amount > 149 && input_amount <= 249) {
        previous_level_label.text('Activist');
        level_label.text('Advocate');
        next_level_label.text('Diplomat');
      } else if (input_amount > 249 && input_amount <= 499) {
        previous_level_label.text('Advocate');
        level_label.text('Diplomat');
        next_level_label.text('Benefactor');
      } else if (input_amount > 499 && input_amount <= 999) {
        previous_level_label.text('Diplomat');
        level_label.text('Benefactor');
        next_level_label.text("Editor's Circle");
      } else if (input_amount > 999 && input_amount <= 2499) {
        previous_level_label.text('Benefactor');
        level_label.text("Editor's Circle");
        next_level_label.text("Leadership Circle");
      } else if (input_amount > 2499 && input_amount <= 4999) {
        previous_level_label.text("Editor's Circle");
        level_label.text('Leadership Circle');
        next_level_label.text("Chairman's Circle");
      } else if (input_amount > 4999) {
        previous_level_label.text("Leadership Circle");
        level_label.text("Chairman's Circle");
        next_level_label.text("No higher level!");
      }
    }
  };

  $('.ui-spinner').bind('keyup mouseup', function() {
    $('#spinner').css("color", "#000000");
    $('#spinner-bottom').css("color", "#000000");
    var input_amount = $('#spinner').val();

    // Check if last val is equal val on event
    if ($('#spinner').data('lastVal') != input_amount) {
      // determine and display correct level for new val
      displayLevel();
    }
  });

  // if 'Annually' is clicked, multiply val by 12
  $("label[for='yearly']").on('click', function() {
    var currentVal, newVal;
    currentVal = parseInt($('#spinner').val());
    currentVal *= 12;
    newVal = currentVal;
    $('#spinner').attr('value', newVal);
  });

  // if 'Monthly' is clicked, divide val by 12
  $("label[for='monthly']").on('click', function() {
    var currentVal, newVal;
    currentVal = parseInt($('#spinner').val());
    newVal = Math.ceil(currentVal / 12);
    $('#spinner').attr('value', newVal);
  });

 // When user submits a contribution
 // Pass appropriate querystring params to Stripe form
 $('#top-contribute').submit(function(e) {

    // Don't submit the form as is
    e.preventDefault();

    var installmentPeriod, installments;

    // Base url for form
    var url = "https://checkout.texastribune.org/";

    var form = 'memberform?';

    // Grab contribution amount
    var amount = $('#spinner').val();

    // Get frequency and set if monthly or yearly
    get_frequency();
    if (is_monthly) {
      installmentPeriod = 'monthly';
    } else {
      installmentPeriod = 'yearly';
    }

    // Set up installments if circle
    if (is_monthly && amount > 83) {
      installments = 36;
      form = 'circleform?';
    } else if (!is_monthly && amount > 999) {
      installments = 3;
      form = 'circleform?';
    }

    url += form;

    url += '&amount=';
    url += amount;

    // Add installments if circle
    if (installments) {
      url += '&installments=';
      url += installments;
    }

    url += '&installmentPeriod=';
    url += installmentPeriod;

    $('#top-contribute').get(0).setAttribute('action', url);

    // Go to Stripe form
    $(location).attr('href',url);
  });


  // For bottom express checkout

  // Initialize bottom number input spinner for express checkout
  $("#spinner-bottom").spinner();

  // Initialize bottom radio buttonset for monthly/annually
  $("#contribute-buttons-bottom").buttonset();

  // Determine if contribution frequency is monthly
  var get_frequency_bottom = function() {
    if ($("label[for='monthly-bottom']").hasClass('ui-state-active')) {
      is_monthly = true;
    } else {
      is_monthly = false;
    }
  };

  // if 'Annually' is clicked, multiply val by 12
  $("label[for='yearly-bottom']").on('click', function() {
    var currentVal, newVal;
    currentVal = parseInt($('#spinner-bottom').val());
    currentVal *= 12;
    newVal = currentVal;
    $('#spinner-bottom').attr('value', newVal);
  });

  // if 'Monthly' is clicked, divide val by 12
  $("label[for='monthly-bottom']").on('click', function() {
    var currentVal, newVal;
    currentVal = parseInt($('#spinner-bottom').val());
    newVal = Math.ceil(currentVal / 12);
    $('#spinner-bottom').attr('value', newVal);
  });

  // When user submits a contribution
 // Pass appropriate querystring params to Stripe form
 $('#contribution-form-bottom').submit(function(e) {

    // Don't submit the form as is
    e.preventDefault();

    var installmentPeriod, installments;

    // Base url for form
    var url = "https://checkout.texastribune.org/";

    var form = 'memberform?';

    // Grab contribution amount
    var amount = $('#spinner-bottom').val();

     // Get frequency and set if monthly or yearly
    get_frequency_bottom();
    if (is_monthly) {
      installmentPeriod = 'monthly';
    } else {
      installmentPeriod = 'yearly';
    }

    // Set up installments if circle
    if (is_monthly && amount > 83) {
      installments = 36;
      form = 'circleform?';
    } else if (!is_monthly && amount > 999) {
      installments = 3;
      form = 'circleform?';
    }

    url += form;

    url += '&amount=';
    url += amount;

    // Add installments if circle
    if (installments) {
      url += '&installments=';
      url += installments;
    }

    url += '&installmentPeriod=';
    url += installmentPeriod;

    $('#contribution-form-bottom').get(0).setAttribute('action', url);

    // Go to Stripe form
    $(location).attr('href',url);
  });

});
