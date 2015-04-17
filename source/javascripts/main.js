$(document).ready(function() {
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

  // Initialize top number input spinner for express checkout
  $("#spinner").spinner();

  // Initialize top radio buttonset for monthly/annually
  $("#contribute-buttons-top").buttonset();


  // For top express checkout

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
      }
    } else {
      // detemine level and update text based on yearly frequency
      if (input_amount > 35 && input_amount <= 59) {
        level_label.text('Enthusiast');
      } else if (input_amount > 60 && input_amount <= 149) {
        level_label.text('Activist');
      } else if (input_amount > 150 && input_amount <= 249) {
        level_label.text('Advocate');
      } else if (input_amount > 250 && input_amount <= 499) {
        level_label.text('Diplomat');
      } else if (input_amount > 500 && input_amount <= 1000) {
        level_label.text('Benefactor');
      }
    }
  };

  $('.ui-spinner').bind('keyup mouseup', function() {
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
    var url = "https://givalike.org/public/quickgive.aspx?cid=227";

    // Grab contribution amount
    var amount = $('#spinner').val();

    // Get frequency and set if monthly or not
    get_frequency();
    if (is_monthly) {
      monthly = 1;
    } else {
      monthly = 0;
    }

    // Add params to url
    url += '&amount=';
    url += amount;

    url += '&monthly=';
    url += monthly;

    $('#top-contribute').get(0).setAttribute('action', url);

    // Go to Givalike
    $(location).attr('href',url);
  });

});
