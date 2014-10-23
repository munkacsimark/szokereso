function Szokereso(abc, words) {
	var container = $('#game');
	var dimensions = [10, 10];

	var getRandomElement = function(array) {
		var selectedLetter = array[Math.floor(Math.random()*array.length)];
		return selectedLetter;
	}

	var getStartPoint = function(rows, columns) {
		var randomPoint = [];
		randomPoint.push(Math.floor((Math.random() * rows) + 1));
		randomPoint.push(Math.floor((Math.random() * columns) + 1));
		return randomPoint;
	}

	var exsistInHistory = function(coordinate, historyArray) {
		for (var i = 0; i < historyArray.length; i++) {
			if (historyArray[i][0] == coordinate[0] && historyArray[i][1] == coordinate[1]) {
				return true;
			}
		}
		return false;
	}

	var getRandomDirection = function(activePosition, history) {
		var upCoordinates = [activePosition[0] - 1, activePosition[1]];
		var downCoordinates = [activePosition[0] + 1, activePosition[1]];
		var rightCoordinates = [activePosition[0], activePosition[1] + 1];
		var leftCoordinates = [activePosition[0], activePosition[1] - 1];
		var newActivePosition = [];
		do {
			newActivePosition = getRandomElement([upCoordinates, downCoordinates, rightCoordinates, leftCoordinates]);
		} while (
			(newActivePosition[0] < 1 || newActivePosition[0] > dimensions[0]) ||
			(newActivePosition[1] < 1 || newActivePosition[1] > dimensions[1]) ||
			exsistInHistory(newActivePosition, history)
		);
		return newActivePosition;
	}

	var positionCenterTable = function() {
		var xPos = $(window).width() / 2 - $(container).find('table').width() / 2;
		var yPos = $(window).height() / 2 - $(container).find('table').height() / 2;
		$(container).find('table').css({
			'left' : xPos + 'px',
			'top' : yPos + 'px'
		});
		console.log('Tábla középre igazítva');
	}

	var drawTable = function(rows, columns) {
		var temp = '<table>';
		for (var i = 1; i <= rows; i++) {
			temp += '<tr>';
			for (var j = 1; j <= columns; j++) {
				temp += '<td data-row="' + i + '" data-column="' + j + '">'+ getRandomElement(abc) +'</td>';
			};
			temp += '</tr>';
		};
		temp += '</table>'
		container.append(temp);
		console.log('Tábla legenerálva');
	}

	var putFindableWord = function() {
		var history = [];
		var findableWord = getRandomElement(words).split('');
		var activePosition = getStartPoint(dimensions[0], dimensions[1]);
		for (var i = 0; i < findableWord.length; i++) {
			var currentCell = container.find('[data-row="' + activePosition[0] + '"][data-column="' + activePosition[1] + '"]');
			currentCell.text(findableWord[i]);
			history[i] = activePosition;
			activePosition = getRandomDirection(activePosition,history);
			console.log(findableWord[i] + ' letéve: ' + history[i] + ' - következő koordináta: ' + activePosition);
		}
		console.log('Keresendő szó elhelyezve');
	}

	if (container.length != 0) {
		console.log('--- Inicializálás ---');
		drawTable(dimensions[0], dimensions[1]);
		positionCenterTable();
		putFindableWord();
	} else {
		console.error('Nincs "game" id-val rendelkező elem.');
		return;
	}

	
}

var hunAbc = ['A', 'Á', 'B', 'C', 'D', 'E', 'É', 'F', 'G', 'H', 'I', 'Í', 'J', 'K', 'L', 'M', 'N', 'O', 'Ó', 'Ö', 'Ő', 'P', 'Q', 'R', 'S', 'T', 'U', 'Ú', 'Ü', 'Ű', 'V', 'W', 'X', 'Y', 'Z'];
var hunWords = ['12345678','MIJAU'];

$(document).ready(function() {

	var szokereso = new Szokereso(hunAbc, hunWords);

});