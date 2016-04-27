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
	var yearList = [];
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
	// allows wall to be a jquery callable object without placing it in the DOM
	var $processWall = $(wall);
	// loops through each name,donation object
	$.map(data, function(val, i) {
		var sponsorName = val.name,
			slugName = slug(sponsorName),
			// tablerow for each sponsor with their name and slot for ammount
			$sponsorRow = '<tr>'+
							'<td>'+ sponsorName +'</td>' +
							'<td class="amount '+ slugName +'"></td>'+
						  '</tr>',
			// allows $sponsorRow to be callable before getting placed on the DOM
			$processSponsorRow = $($sponsorRow);
		// finds wall and adds the new table row
		$processWall.find('tbody').append($processSponsorRow);
		// pushes sponsor name to list used by Awesomplete
		nameList.push(sponsorName);
		// loops through each donations object to access donation amounts and years
		$.map(val.donations, function(amount, index) {
			if ($.inArray(amount.year, yearList) === -1) {
				yearList.push(amount.year);
			}
			// appends all donations to table and adds a year class
			$processSponsorRow.find('.amount').append(amount.amount); 
			$processSponsorRow.find('.amount').addClass(amount.year);
		});
	});

	yearList.sort();
	// gets rid of the all-time collected from salesforce 
	// because it goes to the bottom of the list on sort
	// All time is hard-coded on the page so it's always at the top
	yearList.splice(-1);
	// builds year dropdown
	$.map(yearList, function(value, index) {
		$objectList = '<option class="'+ value +'-year">'+ value +'</option>';
		$('#year-select').append($objectList);
	});
	// creates Awesomplete instance
	new Awesomplete(Awesomplete.$("#donor-search"),{ list: nameList });
	// sticks table on the page once it's already been put together
	$('.donor-wall-table').html($processWall);
}

console.log($('.donor-wall-table'));			

$('.donor-wall-table').on('click', function() {
	alert('CLICK');
});

$('select').on('change',function() {
	alert('HEY');
});

