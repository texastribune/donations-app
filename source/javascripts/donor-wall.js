var $donorJSON = 'http://membership.texastribune.org/donors.json';

// var ajax = new XMLHttpRequest();
// ajax.open("GET", 'http://membership.texastribune.org/donors.json', true);
// ajax.onload = function() {
// 	var list = JSON.parse(ajax.responseText).map(function(i) { 
// 		return i.name; 
// 	});
// 	new Awesomplete(Awesomplete.$("#ajax-example"),{ list: list });
// };
// ajax.send();

$.ajax({
  url: $donorJSON,
  type: 'GET',
  dataType: 'json',
  success: buildWall
});

var slug = function(str) {
    var $slug = '';
    var trimmed = $.trim(str);
    $slug = trimmed.replace(/[^a-z0-9-]/gi, '-').
    replace(/-+/g, '-').
    replace(/^-|-$/g, '');
    return $slug.toLowerCase();
};

function buildWall(data) {
	var nameList = [];
	// initial each loop to grab name
	var wall = '<table class="donor-wall-table">' +
					'<thead>' +
						'<tr>' +
							'<th><div class="label sponsor">Sponsor</div><span class="fa-stack"><i class="sort-up fa fa-caret-up fa-stack-1x"></i><i class="sort-down fa fa-caret-down fa-stack-1x"></i></span></th>' +
							'<th><div class="label">Amount</div><span class="fa-stack"><i class="sort-up fa fa-caret-up fa-stack-1x"></i><i class="sort-down fa fa-caret-down fa-stack-1x"></i></span></th>' +
						'</tr>' +
					'</thead>' +
					'<tbody class="donor-wall-tbody">' +
					'</tbody>' +
				'</table>';
	var $processWall = $(wall);
	$.map(data, function(val, i) {
		var sponsorName = val.name,
			slugName = slug(sponsorName),
			slugClass = '.' + slugName,
			$sponsorRow = '<tr>'+
							'<td>'+ sponsorName +'</td>' +
							'<td class="amount '+ slugName +'"></td>'+
						  '</tr>',
			$processSponsorRow = $($sponsorRow);
		$processWall.find('tbody').append($processSponsorRow);
		nameList.push(sponsorName);
		$.map(val.donations, function(amount, index) {
			if (amount.year == 'all-time') { 
				$processSponsorRow.find('.amount').append(amount.amount); 
			}
		});
	});
	new Awesomplete(Awesomplete.$("#ajax-example"),{ list: nameList });

	$('.donor-wall-table').html($processWall);
}