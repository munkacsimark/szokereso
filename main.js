function Szokereso(abc, words) {
	var container = $('#game');

	var writeRandomLetter = function(abc) {
		var selectedLetter = abc[Math.floor(Math.random()*abc.length)];
		return selectedLetter;
	}

	var positionCenterTable = function() {
		var xPos = $(window).width() / 2 - $(container).find('table').width() / 2;
		var yPos = $(window).height() / 2 - $(container).find('table').height() / 2;
		$(container).find('table').css({
			'left' : xPos + 'px',
			'top' : yPos + 'px'
		});
	}

	var drawTable = function(rows, columns) {
		var temp = '<table>';
		for(var i = 0; i <= rows; i++) {
			temp += '<tr>';
			for(var j = 0; j <= columns; j++) {
				temp += '<td data-row="' + i + '" data-column="' + j + '">'+ writeRandomLetter(abc) +'</td>';
			};
			temp += '</tr>';
		};
		temp += '</table>'
		container.append(temp);
	}

	if (container.length != 0) {
		drawTable(10, 10);
		positionCenterTable();
	} else {
		return;
	}
}

var hunAbc = ['A', 'Á', 'B', 'C', 'D', 'E', 'É', 'F', 'G', 'H', 'I', 'Í', 'J', 'K', 'L', 'M', 'N', 'O', 'Ó', 'Ö', 'Ő', 'P', 'Q', 'R', 'S', 'T', 'U', 'Ú', 'Ü', 'Ű', 'V', 'W', 'X', 'Y', 'Z'];
var hunWords = ['KAKA', 'PISI', 'VALAMI'];

$(document).ready(function() {

	var szokereso = new Szokereso(hunAbc, hunWords);

});