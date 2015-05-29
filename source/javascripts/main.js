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
    if (is_monthly) {
      // detemine level and update text based on monthly frequency
      if (input_amount > 3 && input_amount <= 5) {
        level_label.text('Enthusiast');
      } else if (input_amount > 5 && input_amount <= 12) {
        level_label.text('Activist');
      } else if (input_amount > 12 && input_amount <= 21) {
        level_label.text('Advocate');
      } else if (input_amount > 21 && input_amount <= 42) {
        level_label.text('Diplomat');
      } else if (input_amount > 42 && input_amount <= 83) {
        level_label.text('Benefactor');
      } else if (input_amount > 83 && input_amount <= 208) {
        level_label.text("Editor's Circle");
      } else if (input_amount > 208 && input_amount <= 416) {
        level_label.text('Leadership Circle');
      } else if (input_amount > 416) {
        level_label.text("Chairman's Circle");
      }
    } else {
      // detemine level and update text based on yearly frequency
      if (input_amount > 35 && input_amount <= 59) {
        level_label.text('Enthusiast');
      } else if (input_amount > 59 && input_amount <= 149) {
        level_label.text('Activist');
      } else if (input_amount > 149 && input_amount <= 249) {
        level_label.text('Advocate');
      } else if (input_amount > 249 && input_amount <= 499) {
        level_label.text('Diplomat');
      } else if (input_amount > 499 && input_amount <= 999) {
        level_label.text('Benefactor');
      } else if (input_amount > 999 && input_amount <= 2499) {
        level_label.text("Editor's Circle");
      } else if (input_amount > 2499 && input_amount <= 4999) {
        level_label.text('Leadership Circle');
      } else if (input_amount > 4999) {
        level_label.text("Chairman's Circle");
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
 // Pass appropriate querystring params to Givalike
 $('#top-contribute').submit(function(e) {

    // Don't submit the form as is
    e.preventDefault();

    // Base Givalike url
    var url = "https://givalike.org/public/quickgive.aspx?cid=";

    var form_cid = 227;

    // Grab contribution amount
    var amount = $('#spinner').val();

    // Get frequency and set if monthly or not
    get_frequency();
    if (is_monthly) {
      monthly = 1;
    } else {
      monthly = 0;
    }

    // if circle, send to different form
    if (is_monthly && amount > 83) {
      form_cid = 231;
    } else if (!is_monthly && amount > 999) {
      form_cid = 231;
    }

    // Add cid and params to url
    url += form_cid;

    url += '&amount=';
    url += amount;

    url += '&monthly=';
    url += monthly;

    $('#top-contribute').get(0).setAttribute('action', url);

    // Go to Givalike
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
 // Pass appropriate querystring params to Givalike
 $('#contribution-form-bottom').submit(function(e) {

    // Don't submit the form as is
    e.preventDefault();

    // Base Givalike url
    var url = "https://givalike.org/public/quickgive.aspx?cid=";

    var form_cid = 227;

    // Grab contribution amount
    var amount = $('#spinner-bottom').val();

    // Get frequency and set if monthly or not
    get_frequency_bottom();
    if (is_monthly) {
      monthly = 1;
    } else {
      monthly = 0;
    }

    // if circle, send to different form
    if (is_monthly && amount > 83) {
      form_cid = 231;
    } else if (!is_monthly && amount > 999) {
      form_cid = 231;
    }

    // Add cid and params to url
    url += form_cid;

    // Add params to url
    url += '&amount=';
    url += amount;

    url += '&monthly=';
    url += monthly;

    $('#contribution-form-bottom').get(0).setAttribute('action', url);

    // Go to Givalike
    $(location).attr('href',url);
  });

});
