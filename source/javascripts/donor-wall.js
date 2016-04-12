var $donorJSON = 'http://membership.texastribune.org/donors.json';

$.ajax({
  url: $donorJSON,
  type: 'GET',
  dataType: 'json',
  success: buildWall
});

function buildWall(data) {
	var yearList = [];
	// initial each loop to grab name
	$.each(data, function (index, objects) {
		// console.log(objects.name);
		// console.log(index);
		$('.donor-wall-wrapper').append('<p class="thing">'+ objects.name +'</p>');
		// second each loop to grab donations
		$.each(objects, function(type, i) {
			// console.log(i[0].amount);
			console.log(i);
		});
	});
}

// $( 'div#lazyjson' ).lazyjson({
//     api: {
//         uri: 'http://membership.texastribune.org/donors.json',
//         httpMethod: 'GET',
//     }
// });