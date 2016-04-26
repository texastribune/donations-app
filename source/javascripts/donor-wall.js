var $donorJSON = 'http://membership.texastribune.org/donors.json';

$.ajax({
  url: $donorJSON,
  type: 'GET',
  dataType: 'json',
  success: buildWall
});

//slugifies names for table row classes
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
	// all time is a space holder here, it gets added on the page
	var yearList = ['all-time'];
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
			// tablerow for each sponsor with their name and ammount
			$sponsorRow = '<tr>'+
							'<td>'+ sponsorName +'</td>' +
							'<td class="amount '+ slugName +'"></td>'+
						  '</tr>',
			// allows $sponsorRow to be callable before getting placed on the DOM
			$processSponsorRow = $($sponsorRow);
		// finds the wall and adds the new table row
		$processWall.find('tbody').append($processSponsorRow);
		// pushes sponsor name to list used by Awesomplete
		nameList.push(sponsorName);
		// loops through each person object to access their donations
		$.map(val.donations, function(amount, index) {
			if ($.inArray(amount.year, yearList) === -1) {
				yearList.push(amount.year);
			}
			// grabs all time amounts for load
			if (amount.year == 'all-time') { 
				$processSponsorRow.find('.amount').append(amount.amount); 
			}
		});
	});
	yearList.sort();
	$.map(yearList, function(value, index) {
		$objectList = '<option class="'+ value +'-year">'+ value +'</option>';
		$('.year-select').append($objectList);
	});
	console.log(yearList);
	// creates Awesomplete instance
	new Awesomplete(Awesomplete.$("#ajax-example"),{ list: nameList });
	// sticks table on the page once it's already been put together
	$('.donor-wall-table').html($processWall);
}