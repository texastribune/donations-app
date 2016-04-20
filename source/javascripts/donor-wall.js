var $donorJSON = 'http://membership.texastribune.org/donors.json';

$.ajax({
  url: $donorJSON,
  type: 'GET',
  dataType: 'json',
  success: buildWall
});

function buildWall(data) {
	var nameList = [];
	// initial each loop to grab name
	$.each(data, function (index, objects) {
		var sponsorName = objects.name;
		nameList.push(sponsorName);
		var sponsorRow = '<tr>'+
							'<td>'+ sponsorName +'</td>' +
							'<td class="year-2016"></td>'+
							'<td class="year-2015"></td>'+
							'<td class="year-2014"></td>'+
							'<td class="year-2013"></td>'+
							'<td class="year-2012"></td>'+
							'<td class="year-2011"></td>'+
							'<td class="year-2010"></td>'+
							'<td class="year-2009"></td>'+
							'<td class="year-all-time"></td>'+
							'</tr>';
		$('table').append(sponsorRow);
		// console.log(index);
		// second each loop to grab donations
		$.each(objects, function(type, i) {
			// $.each(i, function(o, k) {
			// 	console.log(k.amount);
			// 	console.log(k.year);
			// });
			// console.log(i[0].amount);
			// console.log(i);
		});
	});
	console.log(nameList);


	var substringMatcher = function(strs) {
	  return function findMatches(q, cb) {
	    var matches, substringRegex;

	    // an array that will be populated with substring matches
	    matches = [];

	    // regex used to determine if a string contains the substring `q`
	    substrRegex = new RegExp(q, 'i');

	    // iterate through the pool of strings and for any string that
	    // contains the substring `q`, add it to the `matches` array
	    $.each(strs, function(i, str) {
	      if (substrRegex.test(str)) {
	        matches.push(str);
	      }
	    });

	    cb(matches);
	  };
	};



	$('#the-basics .typeahead').typeahead({
	  hint: true,
	  highlight: true,
	  minLength: 1
	},
	{
	  name: 'nameList',
	  source: substringMatcher(nameList)
	});
}