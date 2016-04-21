var $donorJSON = 'http://membership.texastribune.org/donors.json';

// $.ajax({
//   url: $donorJSON,
//   type: 'GET',
//   dataType: 'json',
//   success: buildWall
// });

// function buildWall(data) {
// 	var nameList = [];
// 	// initial each loop to grab name
// 	$.each(data, function (index, objects) {
// 		var sponsorName = objects.name;
// 		var sponsorRow = '<tr>'+
// 							'<td>'+ sponsorName +'</td>' +
// 							'<td class="amount"></td>'+
// 							'</tr>';
// 		$('table').append(sponsorRow);
// 		// console.log(index);
// 		// second each loop to grab donations
// 		// $.each(objects.donations, function(type, i) {
// 		// 	$.each(i, function(o, k) {
// 		// 		console.log(k.year);
// 		// 		if (k.year == "all-time") {
// 		// 			$('.amount').append(k.amount);
// 		// 		}
// 		// 		// 	console.log(k.year);
// 		// 	});
// 		// 	// console.log(i[0].amount);
// 		// 	// console.log(i);
// 		// });
// 	});
	
// }