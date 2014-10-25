function Szokereso(abc, words, dimensions) {
	var mainThat = this;
	var container = $('#game');
	var dimensions = dimensions;

	var getRandomElement = function(array) {
		var selectedElement = array[Math.floor(Math.random()*array.length)];
		return selectedElement;
	}

	var existInHistory = function(coordinate, historyArray) {
		for (var i = 0; i < historyArray.length; i++) {
			if (historyArray[i][0] == coordinate[0] && historyArray[i][1] == coordinate[1]) {
				return true;
			}
		}
		return false;
	}

	// INITIALIZE GAME
	var init = function() {
		var that = this;
		this.placedWordHistory = [];

		var getFirstLetterPosition = function(rows, columns) {
			var randomPoint = [];
			randomPoint.push(Math.floor((Math.random() * rows) + 1));
			randomPoint.push(Math.floor((Math.random() * columns) + 1));
			return randomPoint;
		}

		var getRandomDirection = function(activePosition, history) {
			var upCoordinates = [activePosition[0] - 1, activePosition[1]];
			var downCoordinates = [activePosition[0] + 1, activePosition[1]];
			var rightCoordinates = [activePosition[0], activePosition[1] + 1];
			var leftCoordinates = [activePosition[0], activePosition[1] - 1];
			var newActivePosition = [];
			var antiStuckIterator = 0;
			do {
				newActivePosition = getRandomElement([upCoordinates, downCoordinates, rightCoordinates, leftCoordinates]);
				antiStuckIterator++;
				if (antiStuckIterator > 10) {
					return false;
				}
			} while (
				(newActivePosition[0] < 1 || newActivePosition[0] > dimensions[0]) ||
				(newActivePosition[1] < 1 || newActivePosition[1] > dimensions[1]) ||
				existInHistory(newActivePosition, that.placedWordHistory)
			);
			return newActivePosition;
		}

		this.drawTable = function(rows, columns) {
			container.empty();
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

		this.positionCenterTable = function() {
			var xPos = $(window).width() / 2 - container.find('table').width() / 2;
			var yPos = $(window).height() / 2 - container.find('table').height() / 2;
			container.find('table').css({
				'left' : xPos + 'px',
				'top' : yPos + 'px'
			});
			console.log('Tábla középre igazítva');
		}

		this.putFindableWord = function() {
			var findableWord = getRandomElement(words).split('');
			var activePosition = getFirstLetterPosition(dimensions[0], dimensions[1]);
			for (var i = 0; i < findableWord.length; i++) {
				var currentCell = container.find('[data-row="' + activePosition[0] + '"][data-column="' + activePosition[1] + '"]');
				currentCell.text(findableWord[i]);
				that.placedWordHistory[i] = activePosition;
				activePosition = getRandomDirection(activePosition,that.placedWordHistory);
				if (activePosition === false){
					console.error('A szó kiírása zsákutcába ért.');
					return false;
				}
				console.log(findableWord[i] + ' letéve: ' + that.placedWordHistory[i] + ' - következő koordináta: ' + activePosition);
			}
			console.log('Keresendő szó elhelyezve');
			return true;
		}

		this.startInit = function() {
			if (container.length != 0) {
				console.log('--- Inicializálás ---');
				drawTable(dimensions[0], dimensions[1]);
				while (!this.putFindableWord()) {
					drawTable(dimensions[0], dimensions[1]);
				} ;
				positionCenterTable();
			} else {
				console.error('Nincs "game" id-val rendelkező elem.');
				return;
			}
		}

		startInit();
	}

	// GAME HANDLER
	var gameHandler = function() {
		var that = this;
		var isMouseDown = false;
		this.selectedWordCoordinates = [];
		
		$(window).on('mousedown', function() {
			isMouseDown = true;
		})
		.on('mouseup', function() {
			isMouseDown = false;
			clearSelection();
		});

		this.clearSelection= function() {
			container.find('td').removeClass('active');
			this.selectedWordCoordinates = [];
		}

		container.find('td').bind('mouseover mouseleave', function() {
			if (isMouseDown) {
				var activeCoordinate = [$(this).data('row'), $(this).data('column')];
				that.selectedWordCoordinates.push(activeCoordinate);
				//TODO
				$(this).addClass('active');
			}
		});
	}

	init();
	gameHandler();
}

// MAIN
var hunAbc = ['A', 'Á', 'B', 'C', 'D', 'E', 'É', 'F', 'G', 'H', 'I', 'Í', 'J', 'K', 'L', 'M', 'N', 'O', 'Ó', 'Ö', 'Ő', 'P', 'Q', 'R', 'S', 'T', 'U', 'Ú', 'Ü', 'Ű', 'V', 'W', 'X', 'Y', 'Z'];
var hunWords = ['EZEGYHOSSZUSZOBEFOGAKADNI','CICA','HELLO','SZIA'];

$(document).ready(function() {

	var szokereso = new Szokereso(hunAbc, hunWords, [10, 10]);

});