var $donorJSON = 'http://membership.texastribune.org/sponsors.json';

$.ajax({
  url: $donorJSON,
  type: 'GET',
  dataType: 'json',
  success: buildTable
});

function buildTable(data){
  var tableRow = '';
  var year = '';
  $.each(data, function (y, objects) {
    year = '<table class="donor-table'+y+' table-year'+y+' donor-table"><thead><tr><th><div class="label">Sponsor</div><span class="fa-stack"><i class="sort-up fa fa-caret-up fa-stack-1x"></i><i class="sort-down fa fa-caret-down fa-stack-1x"></i></span></th><th><div class="label">Digital revenue</div><span class="fa-stack"><i class="sort-up fa fa-caret-up fa-stack-1x"></i><i class="sort-down fa fa-caret-down fa-stack-1x"></i></span></th><th><div class="label">Digital in-kind</div><span class="fa-stack"><i class="sort-up fa fa-caret-up fa-stack-1x"></i><i class="sort-down fa fa-caret-down fa-stack-1x"></i></span></th><th><div class="label">Events revenue</div><span class="fa-stack"><i class="sort-up fa fa-caret-up fa-stack-1x"></i><i class="sort-down fa fa-caret-down fa-stack-1x"></i></span></th><th><div class="label">Events in-kind</div><span class="fa-stack"><i class="sort-up fa fa-caret-up fa-stack-1x"></i><i class="sort-down fa fa-caret-down fa-stack-1x"></i></span></th><th><div class="label">Total</div><span class="fa-stack"><i class="sort-up fa fa-caret-up fa-stack-1x"></i><i class="sort-down fa fa-caret-down fa-stack-1x"></i></span></th></tr></thead><tbody></tbody></table>';
    $('.year').append(year);
    $.each(objects, function(index, v) {
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
      tableRow = '<tr><td><a href="' + v.url + '">' + sponsor + '</a></td><td>' + digitalRevenue + '</td><td>' + digitalInKind + '</td><td>' + eventsRevenue + '</td><td>' + eventsInKind + '</td><td>' + total + '</td></tr>';
      $('.donor-table'+y).append(tableRow);
    });
  });
  $('.table-yearall-time').show();
}
