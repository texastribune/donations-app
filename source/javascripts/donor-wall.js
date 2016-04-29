var $donorJSON = 'https://membership.texastribune.org/all_time.json';

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
	var wall = '<table class="donor-wall-table">' +
					'<thead>' +
						'<tr class="labels">' +
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
			sponsorAmount = val.amt,
			// tablerow for each sponsor with their name and slot for ammount
			$sponsorRow = '<tr class="'+ slugName +'">'+
							'<td>'+ sponsorName +'</td>' +
							'<td class="amount '+ slugName +'">'+sponsorAmount+'</td>'+
						  '</tr>',
			// allows $sponsorRow to be callable before getting placed on the DOM
			$processSponsorRow = $($sponsorRow);
		// finds wall and adds the new table row
		$processWall.find('tbody').append($processSponsorRow);
		// pushes sponsor name to list used by Awesomplete
		nameList.push(sponsorName);
		// loops through each donations object to access donation amounts and years
	});
	// creates Awesomplete instance
	new Awesomplete(Awesomplete.$("#donor-search"),{ list: nameList });
	// sticks table on the page once it's already been put together
	$('.donor-wall-table').html($processWall);

	$('#go').click(function() {
		console.log('click');
		var value = $('#donor-search').val();
		var slugValue = slug(value);
		$('tr').hide();
		$('.'+slugValue).show();
		$('.labels').show();
	});

	$('#reset').click(function() {
	  $('tr').show();
	});
}

