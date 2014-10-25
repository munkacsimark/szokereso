// CLASS TABLA
function Table(creator) {
	this.creator = creator;
}

Table.prototype = {
	draw : function() {
		this.creator.container.empty();
		var temp = '<table>';
		for (var i = 1; i <= this.creator.dimensions[0]; i++) {
			temp += '<tr>';
			for (var j = 1; j <= this.creator.dimensions[1]; j++) {
				temp += '<td data-row="' + i + '" data-column="' + j + '">'+ this.creator.getRandomElement(this.creator.abc) +'</td>';
			};
			temp += '</tr>';
		};
		temp += '</table>'
		this.creator.container.append(temp);
		console.log('Tábla legenerálva');
	},
	positionCenter : function() {
		var xPos = $(window).width() / 2 - this.creator.container.find('table').width() / 2;
		var yPos = $(window).height() / 2 - this.creator.container.find('table').height() / 2;
		this.creator.container.find('table').css({
			'left' : xPos + 'px',
			'top' : yPos + 'px'
		});
		console.log('Tábla középre igazítva');
	},
	putFindableWord : function() {
		this.creator.placedWord = this.creator.getRandomElement(this.creator.words);
		var findableWord = this.creator.placedWord.split('');
		var activePosition = [
			Math.floor((Math.random() * this.creator.dimensions[0]) + 1),
			Math.floor((Math.random() * this.creator.dimensions[1]) + 1)
		];
		for (var i = 0; i < findableWord.length; i++) {
			var currentCell = this.creator.container.find(
				'[data-row="' + activePosition[0] + '"][data-column="' + activePosition[1] + '"]'
			);
			currentCell.text(findableWord[i]);
			this.creator.placedWordHistory[i] = activePosition;
			activePosition = this.getRandomNeighbor(activePosition, this.creator.placedWordHistory);
			if (activePosition === false){
				console.error('A szó kiírása zsákutcába ért.');
				return false;
			}
			console.log(findableWord[i] + ' letéve: ' + this.creator.placedWordHistory[i] + ' - következő koordináta: ' + activePosition);
		}
		console.log('Keresendő szó elhelyezve');
		return true;
	},
	getRandomNeighbor : function(activePosition, history) {
		var upCoordinates = [activePosition[0] - 1, activePosition[1]];
		var downCoordinates = [activePosition[0] + 1, activePosition[1]];
		var rightCoordinates = [activePosition[0], activePosition[1] + 1];
		var leftCoordinates = [activePosition[0], activePosition[1] - 1];
		var newActivePosition = [];
		var antiStuckIterator = 0;
		do {
			newActivePosition = this.creator.getRandomElement([upCoordinates, downCoordinates, rightCoordinates, leftCoordinates]);
			antiStuckIterator++;
			if (antiStuckIterator > 10) {
				return false;
			}
		} while (
			(newActivePosition[0] < 1 || newActivePosition[0] > this.creator.dimensions[0]) ||
			(newActivePosition[1] < 1 || newActivePosition[1] > this.creator.dimensions[1]) ||
			this.creator.existInHistory(newActivePosition, this.creator.placedWordHistory)
		);
		return newActivePosition;
	}
}

// TIME CONTROLLER
function TimeController(creator) {
	this.creator = creator;
}

TimeController.prototype = {
	// init
	// start
	// stop
	// increase
	// decrease
	// status
}

// MOUSE EVENT HANDLER
function MouseEventHandler(creator) {
	this.creator = creator;
}

MouseEventHandler.prototype = {
	trackMouse : function() {
		var that = this;
		$(window).on('mousedown', function() {
			console.log('egér lenyomva');
			that.creator.wordSelectionHandler(true);
		})
		.on('mouseup', function() {
			console.log('egér felengedve');
			that.creator.compareSelection();
			that.creator.clearSelection();
			that.creator.wordSelectionHandler(false);
		});
	}
}

// GAME CONTROLLER
function GameController(container, abc, words, dimensions) {
	this.container = container;
	this.table = {};
	this.abc = abc;
	this.words = words;
	this.dimensions = dimensions;
	this.placedWordHistory = [];
	this.placedWord = '';
	this.selectedWord = '';
	this.selectedWordCoordinates = [];
	this.selectSwitch = true;
}

GameController.prototype = {
	start : function() {
		if (this.container.length != 0) {
			this.newTable();
			var mouseEventHandler = new MouseEventHandler(this);
			var timeController = new TimeController(this);
			mouseEventHandler.trackMouse();
		} else {
			console.error('Nincs "game" id-val rendelkező elem.');
			return;
		}

	},
	newTable : function() {
		console.log('--- Inicializálás ---');
		this.table = new Table(this);
		this.table.draw();
		this.table.positionCenter();
		while (!this.table.putFindableWord()) {
			this.table.draw();
		} ;
	},
	getRandomElement : function(array) {
		var selectedElement = array[Math.floor(Math.random()*array.length)];
		return selectedElement;
	},
	existInHistory : function(coordinate, historyArray) {
		for (var i = 0; i < historyArray.length; i++) {
			if (historyArray[i][0] == coordinate[0] && historyArray[i][1] == coordinate[1]) {
				return true;
			}
		}
		return false;
	},
	clearSelection : function() {
		this.container.find('td').removeClass('active');
		this.selectedWordCoordinates = [];
		this.selectedWord = [];
	},
	wordSelectionHandler : function(isMouseDown) {
		var that = this;
		if (isMouseDown) {
			this.container.find('td').bind('mouseover mouseleave', function() {
				if (!that.selectSwitch) {
					that.container.find('td').unbind('mouseleave');
				}
				var activeCoordinate = [$(this).data('row'), $(this).data('column')];
				that.selectedWordCoordinates.push(activeCoordinate);
				that.selectedWord += $(this).text();
				$(this).addClass('active');
				that.selectSwitch = false;
			});
		} else {
			this.container.find('td').unbind('mouseover mouseleave');
			this.selectSwitch = true;
		}
	},
	compareSelection : function() {
		console.log('Beteve: '+this.placedWord+' Kivalasztva: '+this.selectedWord);
		if (this.placedWord == this.selectedWord) {
			console.log('MEGVAN');
			this.newTable();
			// IDO+
		} else {
			console.log('NEMJO');
			// IDO -
		}
	}
}

// MAIN
var hunAbc = ['A', 'Á', 'B', 'C', 'D', 'E', 'É', 'F', 'G', 'H', 'I', 'Í', 'J', 'K', 'L', 'M', 'N', 'O', 'Ó', 'Ö', 'Ő', 'P', 'Q', 'R', 'S', 'T', 'U', 'Ú', 'Ü', 'Ű', 'V', 'W', 'X', 'Y', 'Z'];
var hunWords = ['EZEGYHOSSZUSZOBEFOGAKADNI', 'CICA', 'HELLO', 'SZIA'];

$(document).ready(function() {
	var game = new GameController($('#game'), hunAbc, hunWords, [10, 10]);
	game.start();
});