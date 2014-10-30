// CLASS TABLA
function Table(creator) {
	this.creator = creator;
}

Table.prototype = {
	draw : function() {
		this.creator.container.empty();
		var temp = '<table>';
		temp += '<thead><tr><th class="the-word" colspan="'+this.creator.dimensions[0]+'"></th></tr>'+
						   '<tr><th class="life-bar" colspan="'+this.creator.dimensions[0]+'"><span><span style="width:'+this.creator.lifeController.life+'"></span></span></th></tr></thead><tbody>';
		for (var i = 1; i <= this.creator.dimensions[0]; i++) {
			temp += '<tr>';
			for (var j = 1; j <= this.creator.dimensions[1]; j++) {
				temp += '<td data-row="' + i + '" data-column="' + j + '">'+ this.creator.getRandomElement(this.creator.abc) +'</td>';
			};
			temp += '</tr>';
		};
		temp += '</tbody></table>'
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
		this.creator.container.find('.the-word').text('Keresendő szó: ' + findableWord.join().replace(/,/g ,''));
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

// LIFE CONTROLLER
function LifeController(creator) {
	var that = this;
	this.creator = creator;
	this.life = 100;
	this.timer = setInterval(function(){
		that.decrease(1 + (that.creator.foundWords / 3));
		console.log(that.life);
	}, 1000);
}

LifeController.prototype = {
	restart : function() {
		this.life = 100;
	},
	stop : function() {
		clearInterval(this.timer);
	},
	decrease : function(value) {
		this.life -= value;
		this.lifeChecker();
	},
	increase : function(value) {
		this.life += value;
		if (this.life > 100) {
			this.life = 100;
		}
	},
	lifeChecker : function() {
		this.creator.container.find('.life-bar span span').css({
			'width' : this.life + '%'
		});
		if (this.life <= 0) {
			this.creator.gameOver();
			this.stop();
		}
	}
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
	},
	dropTrack : function() {
		$(window).unbind('mousedown mouseup');
	}
}

// DIALOG CONTROLLER
function DialogController(creator) {
	this.creator = creator;
	this.fader;
	this.dialogBox;
}

DialogController.prototype = {
	init : function() {
		this.creator.container.append('<div class="fader"></div>' +
										'<div class="dialog-box">' +
											'<h1></h1>' +
											'<div class="dialog-content"></div>' +
											'<div class="dialog-buttons"></div>' +
										'</div>');
		this.fader = $(this.creator.container).find('.fader');
		this.dialogBox = $(this.creator.container).find('.dialog-box');
		console.log('Dialog box inicializalva');
	},
	positionCenter : function() {
		var xPos = $(window).width() / 2 - this.creator.container.find('.dialog-box').width() / 2;
		var yPos = $(window).height() / 2 - this.creator.container.find('.dialog-box').height() / 2;
		this.creator.container.find('.dialog-box').css({
			'left' : xPos + 'px',
			'top' : yPos + 'px'
		});
		console.log('Dialog box középre igazítva');
	},
	openDialog : function(text, content ,buttons) {
		this.dialogBox.find('h1').append(text);
		this.dialogBox.find('.dialog-content').append(content);
		this.dialogBox.find('.dialog-buttons').append(buttons);
		this.positionCenter();
		this.fader.show();
		this.dialogBox.show();
		this.creator.buttonController.trackButtons();
	}
}

//BUTTON CONTROLLER
function ButtonController(creator) {
	this.creator = creator;
}

ButtonController.prototype = {
	trackButtons : function() {
		var that = this;
		$('button').on('click', function(){
			if ($(this).attr('class') == 'restart-button') {
				that.creator.start();
			}
		});
	}
}

// GAME CONTROLLER
function GameController(container, abc, words, dimensions) {
	this.container = container;
	this.abc = abc;
	this.words = words;
	this.dimensions = dimensions;
	this.placedWord = '';
	this.selectedWord = '';
	this.placedWordHistory = [];
	this.selectedWordCoordinates = [];
}

GameController.prototype = {
	start : function() {
		if (this.container.length != 0) {
			this.mouseEventHandler = new MouseEventHandler(this);
			this.lifeController = new LifeController(this);
			this.dialogController = new DialogController(this);
			this.buttonController = new ButtonController(this);
			this.table = new Table(this);
			this.newTable();
			this.mouseEventHandler.trackMouse();
			this.foundWords = 0;
			this.selectSwitch = true;
		} else {
			console.error('Nincs "game" id-val rendelkező elem.');
			return;
		}

	},
	newTable : function() {
		console.log('--- Inicializálás ---');
		this.table.draw();
		this.table.positionCenter();
		this.dialogController.init();
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
		this.selectedWord = '';
	},
	wordSelectionHandler : function(isMouseDown) {
		var that = this;
		var activeCoordinate = [];
		if (isMouseDown) {
			this.container.find('td').bind('mouseover mouseleave', function() {
				if (!that.selectSwitch) {
					that.container.find('td').unbind('mouseleave');
				}
				activeCoordinate = [$(this).data('row'), $(this).data('column')];
				that.checkBackspace(activeCoordinate);
				that.selectedWordCoordinates.push(activeCoordinate);
				console.log('Active: '+activeCoordinate+' elozo: '+that.selectedWordCoordinates[that.selectedWordCoordinates.length -2]);
				that.selectedWord += $(this).text();
				$(this).addClass('active');
				that.selectSwitch = false;
			});
		} else {
			this.container.find('td').unbind('mouseover mouseleave');
			this.selectedWordCoordinates.push(activeCoordinate);
			this.selectSwitch = true;
		}
	},
	compareSelection : function() {
		console.log('Beteve: '+this.placedWord+' Kivalasztva: '+this.selectedWord);
		if (this.placedWord == this.selectedWord) {
			console.log('MEGVAN');
			this.foundWords++;
			this.newTable();
			this.lifeController.increase(10);
		} else {
			console.log('NEMJO');
			this.lifeController.decrease(5);
		}
	},
	checkBackspace : function(activeCoordinate) {
		if (this.selectedWordCoordinates.length >= 2) {
			if (
				activeCoordinate[0] == this.selectedWordCoordinates[this.selectedWordCoordinates.length -2][0] &&
				activeCoordinate[1] == this.selectedWordCoordinates[this.selectedWordCoordinates.length -2][1]
			) {
				this.container.find(
					'[data-row="' + this.selectedWordCoordinates[this.selectedWordCoordinates.length -1][0] +'"]'+
					'[data-column="' + this.selectedWordCoordinates[this.selectedWordCoordinates.length -1][1] + '"]'
				).removeClass('active');
				this.selectedWordCoordinates = this.selectedWordCoordinates.slice(0, -2);
				this.selectedWord = this.selectedWord.slice(0, -2);
				console.log('visszatorles');
			}
		}
	},
	gameOver : function() {
		this.dialogController.openDialog('Game Over', '<p>Újra akarod kezdeni a játékot?</p>', '<button class="restart-button">Újrakezdés</button>');
		this.mouseEventHandler.dropTrack();
		console.log('===GAME OVER===');
	}
}

// MAIN
var hunAbc = ['A', 'Á', 'B', 'C', 'D', 'E', 'É', 'F', 'G', 'H', 'I', 'Í', 'J', 'K', 'L', 'M', 'N', 'O', 'Ó', 'Ö', 'Ő', 'P', 'Q', 'R', 'S', 'T', 'U', 'Ú', 'Ü', 'Ű', 'V', 'W', 'X', 'Y', 'Z'];
var hunWords = ['EZEGYHOSSZUSZOBEFOGAKADNI', 'CICA', 'HELLO', 'SZIA'];

$(document).ready(function() {
	var game = new GameController($('#game'), hunAbc, hunWords, [10, 10]);
	game.start();
});