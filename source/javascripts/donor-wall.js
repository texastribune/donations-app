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
	$.each(data, function (index, objects) {
		var sponsorName = objects.name;
		var slugName = slug(sponsorName);
		var sponsorRow = '<tr>'+
							'<td>'+ sponsorName +'</td>' +
							'<td class="amount '+ slugName +'"></td>'+
							'</tr>';
		$('table').append(sponsorRow);
		// console.log(objects.donations);
		// console.log(index);
		// second each loop to grab donations
		$.each(objects.donations, function(type, i) {
			$('.' + slugName).append(i.amount);
			// console.log('hi');
		});
	});

}