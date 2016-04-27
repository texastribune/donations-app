var $sponsorJSON = 'http://membership.texastribune.org/sponsors.json';

$.ajax({
  url: $sponsorJSON,
  type: 'GET',
  dataType: 'json',
  success: buildTable
});

function buildTable(data){
  var tableRow = '';
  var year = '';
  var yearList = [];
  var corporateNames = [];
  // initial each loop to grab years
  $.map(data, function(val, i) {
    yearList.push(i);
    var displayYear;

    if (i === 'all-time') {
      displayYear = 'All time';
    } else {
      displayYear = i;
    }

    yearOption = '<option class="year-option year-'+ i +'">'+ displayYear +'</option>';
    $('.year-select').append(yearOption);

    year = '<table class="donor-table'+i+' table-year-'+i+' donor-table">' + 
              '<thead>' +
                '<tr>'+
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
    $.map(val, function(donation, index) {
      // if there's a NULL or 0 in the data- just display empty table cells
      var sponsor = donation.sponsor;
      corporateNames.push(donation.sponsor);
      if (donation.sponsor == 'NULL') {
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
      tableRow = '<tr>'+
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

  $('.year-select').change(function() {
    var yearSelect = $(this).val();
    var yearClass = '.table-year-'+yearSelect;
    $('.donor-table').hide();
    if (yearSelect === 'All time') {
      yearClass = '.table-year-all-time';
    }
    $(yearClass).show();
  }); 

  // on year button click, only show table for that year
  $('.year-btn').click(function() {
    var classes = this.classList;
    var yearClass = classes[1];
    $('.donor-table').hide();
    $('.table-'+yearClass).show();
  });
}
