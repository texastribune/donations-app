var $donorJSON = 'https://membership.texastribune.org/circle-members.json';

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
	$.map(data, function(val, i) {
		slugCircles = slug(i);
		circleId = '#'+slugCircles;
		$(circleId).append('<h3 class="circle-title">' + i + '</h3>');
		$.map(val, function(name, index) {
			if (index == val.length-1) {
				$(circleId).append('<span class="circle-list">&nbsp;' + name + ' </span> ');
			} else {
				$(circleId).append('<span class="circle-list">&nbsp;' + name + ' <span class="yellow-star fa fa-star"></span></span> ');
			}
			
		});
	});
}
