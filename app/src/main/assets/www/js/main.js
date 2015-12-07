var flipmemo_data;

// totalCards = Total of cards for the level
// intervalTime = time for memorizing - (value * 100) miliseconds
// animation = type of animation

function profile(json){
	
}

var flipmemo = function(){
	return {
		// Available levels
		fm_levels: {
			1: {"totalCards": 4, "intervalTime": 40, animation: "all"},
			2: {"totalCards": 4, "intervalTime": 30, animation: "all"},
			3: {"totalCards": 4, "intervalTime": 40, animation: "sides"},
			4: {"totalCards": 6, "intervalTime": 60, animation: "all"},
			5: {"totalCards": 6, "intervalTime": 40, animation: "all"},
			6: {"totalCards": 6, "intervalTime": 60, animation: "sides"},
			7: {"totalCards": 6, "intervalTime": 100, animation: "rotate"},
			8: {"totalCards": 8, "intervalTime": 80, animation: "all"},
			9: {"totalCards": 8, "intervalTime": 80, animation: "sides"},
			10: {"totalCards": 8, "intervalTime": 120, animation: "rotate"}
		},

		// HTML of each block
		fm_blockHTML: '<div class="block-item"><div class="block hover" data-card-number="{card-number}"><figure class="front"><span>{number}</span></figure><figure class="back"><span>Flip Memo</span></figure></div></div>',

		// It says what is the next expected number to be clicked
		fm_nextToBeClicked: 1,

		// Current level playing
		fm_currentLevel: 1,

		// False = is not inspecting time; True = is inspecting time
		fm_isInspecting: false,

		// Selected difficulty
		fm_difficulty: "",

		// Checks if level has been completed
		fm_levelCleared: false,

		// Level failed
		fm_levelFailed: false,

		// Shuffles an array
		fm_shuffle: function(o){
			for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
			return o;
		},

		// Initialization config
		fm_init: function(){
			this.fm_nextToBeClicked = 1;
			this.fm_currentLevel = 1;
			this.fm_isInspecting = false;
			this.fm_difficulty = "";
			this.fm_levelCleared = false;
			this.fm_levelFailed = false;
			document.querySelector("#level span").innerHTML = this.fm_currentLevel;
			document.querySelector(".gameScreen .progressbar .bar").className = "bar inspectingTime";
		},

		// Creates a level HTML structure based on level and difficulty
		fm_createLevel: function(level, difficulty){
			this.fm_levelCleared = false;
			this.fm_currentLevel = level;
			this.fm_difficulty = difficulty;

			var numbers = [];
			for(var i = 1; i <= this.fm_levels[level].totalCards; i++){
				numbers.push(i);
			}
			numbers = this.fm_shuffle(numbers);

			var html_final = '';
			for(var k = 0; k < numbers.length; k++){
				html_final += this.fm_blockHTML.replace('{number}', numbers[k]).replace("{card-number}", numbers[k]);
			}

			var progressVar = document.querySelector(".gameScreen .progressbar .bar");
			progressVar.className = "bar inspectingTime";
			progressVar.style.width = 100 + "%";
			document.querySelector(".gameScreen .block-container").innerHTML = html_final;
			setTimeout(function(){
				game.fm_inspectingTime();
			}, 1000);
		},

		// Inspecting time progress bar and animation
		fm_inspectingTime: function(){
			var barWidth = 100;
			this.fm_isInspecting = true;

			function loadingBar(){
				barWidth--;
				var bar = document.querySelector(".gameScreen .progressbar .bar");
				bar.style.width = barWidth + '%';
				if (barWidth == 0) {
					clearInterval(decreaseBar);
					game.fm_isInspecting = false;
					bar.className = "bar";
					bar.style.width = 100 + "%";
					setTimeout(function(){
						game.fm_playTime();
					}, 500);
				};
			}

			var intervalTime = this.fm_levels[this.fm_currentLevel].intervalTime;
			if (this.fm_difficulty == "hard") {
				intervalTime = intervalTime / 2;
			};
			var decreaseBar = setInterval(loadingBar, intervalTime);
			this.fm_animateCards();
		},

		// Playing time 
		fm_playTime: function(){
			var barWidth = 100;

			function loadingBar(){
				barWidth--;
				var bar = document.querySelector(".gameScreen .progressbar .bar");
				bar.style.width = barWidth + '%';
				if (game.fm_levelCleared || game.fm_levelFailed) {
					clearInterval(decreaseBar);
				};
				if (barWidth == 0) {
					clearInterval(decreaseBar);
					document.querySelector(".gameScreen").className = "gameScreen blur";
					document.querySelector(".gameOverContainer").className = "gameOverContainer show";
					game.fm_init();
				}
			}

			var intervalTime = this.fm_levels[this.fm_currentLevel].intervalTime;
			if (this.fm_difficulty == "hard") {
				intervalTime = intervalTime / 2;
			};
			var decreaseBar = setInterval(loadingBar, intervalTime);
		},

		// Animates the cards
		fm_animateCards: function(){
			var animation = this.fm_levels[this.fm_currentLevel].animation;

			if (animation == "all") {
				var allAnimation = setInterval(function(){
					var blocks = document.querySelectorAll(".block");
					for (i = 0; i < blocks.length; i++) {
						if(blocks[i].className == "block"){
							blocks[i].className = blocks[i].className + " hover";
						}else{
							blocks[i].className = "block";
						}
					}
					if (!game.fm_isInspecting) {
						clearInterval(allAnimation);
						for (i = 0; i < blocks.length; i++) {
							blocks[i].className = "block";
						}
						// Add the event click
						game.fm_blockEventListener();
						game.fm_nextToBeClicked = 1;
					};
				}, 600);
			}else if (animation == "rotate"){
				var allAnimation = setInterval(function(){
					var blocks = document.querySelectorAll(".block");
					for (i = 0; i < blocks.length; i++) {
						if(blocks[i].className == "block"){
							blocks[i].className = blocks[i].className + " hover";
						}else if (blocks[i].className == "block hover"){
							blocks[i].className = blocks[i].className + " rotated";
						}else{
							blocks[i].className = "block";
						}
					}
					if (!game.fm_isInspecting) {
						clearInterval(allAnimation);
						for (i = 0; i < blocks.length; i++) {
							blocks[i].className = "block";
						}
						// Add the event click
						game.fm_blockEventListener();
						game.fm_nextToBeClicked = 1;
					};
				}, 600);
			}else if (animation == "sides"){
				var allAnimation = setInterval(function(){
					var blocks = document.querySelectorAll(".block");
					for (i = 0; i < blocks.length; i = i + 2) {
						if(blocks[i].className == "block"){
							blocks[i].className = blocks[i].className + " hover";
						}else{
							blocks[i].className = "block";
						}
					}
					setTimeout(function(){
						for (i = 1; i < blocks.length; i = i + 2) {
							if(blocks[i].className == "block"){
								blocks[i].className = blocks[i].className + " hover";
							}else{
								blocks[i].className = "block";
							}
						}
					}, 600);
					if (!game.fm_isInspecting) {
						clearInterval(allAnimation);
						for (i = 0; i < blocks.length; i++) {
							blocks[i].className = "block";
						}
						// Add the event click
						game.fm_blockEventListener();
						game.fm_nextToBeClicked = 1;
					};
				}, 600);
			};
		},

		// Creates an event listener for each new block
		fm_blockEventListener: function(){
			var blocks = document.querySelectorAll(".block");

			for (i = 0; i < blocks.length; i++) {
				blocks[i].addEventListener("click", function(){
					// Detects click and checks its card number
					this.className = "block hover";
					this.getAttribute("data-card-number");
					if (this.getAttribute("data-card-number") == game.fm_nextToBeClicked) {
						if (game.fm_levels[game.fm_currentLevel].totalCards == game.fm_nextToBeClicked) {
							// Won level
							game.fm_levelCleared = true;
							document.querySelector(".gameScreen").className = "gameScreen blur";
							document.querySelector(".nextLevelContainer").className = "nextLevelContainer show";
						}
						game.fm_nextToBeClicked++;
					}else{
						// Lost level
						game.fm_levelFailed = true;
						document.querySelector(".gameScreen").className = "gameScreen blur";
						document.querySelector(".gameOverContainer").className = "gameOverContainer show";
						setTimeout(function(){
							game.fm_init();
						}, 100);
						// Updates local storage
						if(game.fm_difficulty == "normal"){
							if(game.fm_currentLevel > flipmemo_data.normal){
								flipmemo_data.normal = flipmemo_data.normal + 1;
								updateLocalStorage(flipmemo_data);
							}
						}else{
							if(game.fm_currentLevel > flipmemo_data.normal){
								flipmemo_data.hard = flipmemo_data.hard + 1;
								updateLocalStorage(flipmemo_data);
							}
						}
					};
				});
			}
		}
	}
};

var game = new flipmemo();

//Listeners for each button
var btns = document.getElementsByTagName("button");
for (i = 0; i < btns.length; i++) {
	btns[i].addEventListener("click", function() {
		var menuVal = this.getAttribute("data-value");

		if (menuVal == "next"){
			document.querySelector(".gameScreen").className = "gameScreen";
			document.querySelector(".nextLevelContainer").className = "nextLevelContainer";

			var gameScreenBlocks = document.querySelector(".gameScreen .block-container");
			gameScreenBlocks.className = "block-container out";

			game.fm_currentLevel = game.fm_currentLevel  + 1;
			setTimeout(function(){
				game.fm_createLevel(game.fm_currentLevel, game.fm_difficulty);
				gameScreenBlocks.className = "block-container";
				document.querySelector("#level span").innerHTML = game.fm_currentLevel;
			}, 600);
		}else if (menuVal != "back") {
			//Isn't going back
			var mainTop = document.querySelector(".mainTop");
			mainTop.className = mainTop.className + " out";
			var mainBottom = document.querySelector(".mainBottom");
			mainBottom.className = mainBottom.className + " out";

			//Isn't going Scores screen
			if (menuVal != "scores") {
				document.getElementById("level-value").innerHTML = menuVal;
				
				//Creating a new array of numbers
				game.fm_createLevel(1, menuVal);

				setTimeout(function(){
					var gameScreen = document.querySelector(".gameScreen");
					gameScreen.className = "gameScreen";

					var gameScreenNav = document.querySelector(".gameScreen nav");
					gameScreenNav.className = "";

					var gameScreenBlocks = document.querySelector(".gameScreen .block-container");
					gameScreenBlocks.className = "block-container";

					var gameScreenBar = document.querySelector(".gameScreen .progressbar");
					gameScreenBar.className = "progressbar";
				}, 300);
			}else{
				document.querySelector(".scoresScreen").className = "scoresScreen";
			};
		}else{
			readLocalStorage();
			
			setTimeout(function(){
				game.fm_init();
			}, 600);

			document.querySelector(".scoresScreen").className = "scoresScreen out";

			document.querySelector(".gameScreen").className = "gameScreen";
			document.querySelector(".gameOverContainer").className = "gameOverContainer";

			//Is going back to manu
			var gameScreenNav = document.querySelector(".gameScreen nav");
			gameScreenNav.className = "out";

			var gameScreenBlocks = document.querySelector(".gameScreen .block-container");
			gameScreenBlocks.className = "block-container out";

			var gameScreenBar = document.querySelector(".gameScreen .progressbar");
			gameScreenBar.className = "progressbar out";

			setTimeout(function(){
				var mainTop = document.querySelector(".mainTop");
				mainTop.className = "mainTop";
				var mainBottom = document.querySelector(".mainBottom");
				mainBottom.className = "mainBottom";

				var gameScreen = document.querySelector(".gameScreen");
				gameScreen.className = "gameScreen out";

				//This is forceing the menu to redraw. Avoiding rendering issues
				var forceRedraw = function(element){
					if (!element) { return; }
					var n = document.createTextNode(' ');
					var disp = element.style.display;

					element.appendChild(n);
					element.style.display = 'none';

					setTimeout(function(){
						element.style.display = disp;
						n.parentNode.removeChild(n);
					},20);
				}
				forceRedraw(document.querySelector(".toRedraw"));
			}, 500);
		};
	});
}

// Gets data from Local Storage about user's best scores
function readLocalStorage(){
	flipmemo_data = JSON.parse(localStorage.getItem("flipmemo"));
	if (flipmemo_data == null) {
		flipmemo_data = {"normal": 0, "hard": 0};
	}
	document.getElementById('bestNormal').innerHTML = flipmemo_data.normal;
	document.getElementById('bestHard').innerHTML = flipmemo_data.hard;
}

function updateLocalStorage(flipmemo_data){
	localStorage.setItem("flipmemo", JSON.stringify(flipmemo_data));
}

readLocalStorage();
