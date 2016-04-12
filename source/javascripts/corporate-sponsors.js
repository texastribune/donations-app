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
  // initial each loop to grab years
  $.each(data, function (y, objects) {
    yearList.push(y);
    // create year button for each year
    var displayYear;
    // turn 'all-time' into 'All time' so editors are happy
    if(y === 'all-time') {
      displayYear = 'All time';
    } else {
      displayYear = y;
    }
    yearButton = '<button class="year-btn year-'+ y +'">'+ displayYear +'</button>';
    $('.year-button').append(yearButton);
    // write table for each year to plug data into
    year = '<table class="donor-table'+y+' table-year-'+y+' donor-table">' + 
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
    // each loop to break into the year object
    $.each(objects, function(index, v) {
      // if there's a NULL or 0 in the data- just display empty table cells
      var sponsor = v.sponsor;
      if (v.sponsor == 'NULL') {
        sponsor = '';
      }
      var digitalRevenue = v.digital_revenue;
      if (v.digital_revenue == '$0'){
        digitalRevenue = '';
      }
      var digitalInKind = v.digital_in_kind;
      if (v.digital_in_kind == '$0'){
        digitalInKind = '';
      }
      var eventsRevenue = v.events_revenue;
      if (v.events_revenue == '$0'){
        eventsRevenue = '';
      }
      var eventsInKind = v.events_in_kind;
      if (v.events_in_kind == '$0'){
        eventsInKind = '';
      }
      var total = v.total;
      // fill in each year's table with it's respective data
      tableRow = '<tr>'+
                    '<td class="sponsor"><a href="' + v.url + '">' + sponsor + '</a></td>'+
                    '<td>' + digitalRevenue + '</td>'+
                    '<td>' + digitalInKind + '</td>'+
                    '<td>' + eventsRevenue + '</td>'+
                    '<td>' + eventsInKind + '</td>'+
                    '<td>' + total + '</td>'+
                  '</tr>';
      $('.donor-table'+y).append(tableRow);
    });
  });
  // display all time table on load as default
  $('.table-year-all-time').show();

  $('.year-btn').click(function() {
    var classes = this.classList;
    var yearClass = classes[1];
    $('.donor-table').hide();
    $('.table-'+yearClass).show();
  });
}

function searchTable() {
    var options = {
    valueNames: [ 'sponsor' ]
  };

  var userList = new List('sponsor', options);
}


// $.when(buildTable()).done(
//   console.log('done!'),
//   searchTable()
// );
