var $sponsorJSON = 'http://membership.texastribune.org/sponsors.json';

$.ajax({
  url: $sponsorJSON,
  type: 'GET',
  dataType: 'json',
  success: buildTable
});

function slug(str) {
    var $slug = '';
    var trimmed = $.trim(str);
    $slug = trimmed.replace(/[^a-z0-9-]/gi, '-').
    replace(/-+/g, '-').
    replace(/^-|-$/g, '');
    return $slug.toLowerCase();
}

function buildTable(data){
  var tableRow = '';
  var year = '';
  var corporateNames = [];
  // initial each loop to grab years
  $.map(data, function(val, i) {
    var displayYear;

    if (i === 'all-time') {
      displayYear = 'All time';
    } else {
      displayYear = i;
    }

    yearOption = '<option class="year-option year-'+ i +'">'+ displayYear +'</option>';
    // only adds a year to the select box option list if it's a year
    // All time is hard-coded into the select box so it will always appear first
    if (displayYear != 'All time') {
      $('.year-select').append(yearOption);
    }

    year = '<table class="donor-table'+i+' table-year-'+i+' donor-table">' + 
              '<thead>' +
                '<tr class="labels">'+
                    '<th><div class="label">Sponsor</div><span class="fa-stack"><i class="sort-up fa fa-caret-up fa-stack-1x"></i><i class="sort-down fa fa-caret-down fa-stack-1x"></i></span></th>'+
                    '<th><div class="label">Digital revenue</div><span class="fa-stack"><i class="sort-up fa fa-caret-up fa-stack-1x"></i><i class="sort-down fa fa-caret-down fa-stack-1x"></i></span></th>'+
                    '<th><div class="label">Digital in-kind</div><span class="fa-stack"><i class="sort-up fa fa-caret-up fa-stack-1x"></i><i class="sort-down fa fa-caret-down fa-stack-1x"></i></span></th>'+
                    '<th><div class="label">Events revenue</div><span class="fa-stack"><i class="sort-up fa fa-caret-up fa-stack-1x"></i><i class="sort-down fa fa-caret-down fa-stack-1x"></i></span></th>'+
                    '<th><div class="label">Events in-kind</div><span class="fa-stack"><i class="sort-up fa fa-caret-up fa-stack-1x"></i><i class="sort-down fa fa-caret-down fa-stack-1x"></i></span></th>'+
                    '<th><div class="label">Total</div><span class="fa-stack"><i class="sort-up fa fa-caret-up fa-stack-1x"></i><i class="sort-down fa fa-caret-down fa-stack-1x"></i></span></th>'+
                  '</tr>'+
                '</thead>'+
              '<tbody></tbody>'+
            '</table>';

    $('.year').append(year);
    // loops through each donation for $(this) year
    $.map(val, function(donation, index) {
      var sponsor = donation.sponsor;
      var sponsorSlug = slug(sponsor);
      // only adds corporateNames to the list once
      if (i === 'all-time') {
        corporateNames.push(sponsor);
      }
      // if there's a NULL or 0 in the data- just display empty table cells
      if (sponsor == 'NULL') {
        sponsor = '';
      }
      var digitalRevenue = donation.digital_revenue;
      if (donation.digital_revenue == '$0'){
        digitalRevenue = '';
      }
      var digitalInKind = donation.digital_in_kind;
      if (donation.digital_in_kind == '$0'){
        digitalInKind = '';
      }
      var eventsRevenue = donation.events_revenue;
      if (donation.events_revenue == '$0'){
        eventsRevenue = '';
      }
      var eventsInKind = donation.events_in_kind;
      if (donation.events_in_kind == '$0'){
        eventsInKind = '';
      }
      var total = donation.total;

      // fill in each year's table with it's respective data
      tableRow = '<tr class="'+ sponsorSlug +'">'+
                    '<td class="sponsor"><a href="' + donation.url + '">' + sponsor + '</a></td>'+
                    '<td>' + digitalRevenue + '</td>'+
                    '<td>' + digitalInKind + '</td>'+
                    '<td>' + eventsRevenue + '</td>'+
                    '<td>' + eventsInKind + '</td>'+
                    '<td>' + total + '</td>'+
                  '</tr>';
      $('.donor-table'+i).append(tableRow);
    });
  });
  // display all time table on load as default
  $('.table-year-all-time').show();

  // year dropdown functionality
  $('.year-select').change(function() {
    var yearSelect = $(this).val();
    var yearClass = '.table-year-'+yearSelect;
    $('.donor-table').hide();
    if (yearSelect === 'All time') {
      yearClass = '.table-year-all-time';
    }
    $(yearClass).show();
  }); 

  new Awesomplete(Awesomplete.$("#corporate-search"),{ list: corporateNames });

  $('#go').click(function() {
    var value = $('#corporate-search').val();
    var slugValue = slug(value);
    $('tr').hide();
    $('.'+slugValue).show();
    $('.labels').show();
  });

  $('#reset').click(function() {
    $('tr').show();
  });
}
