/*
All the global variables are assigned for it
to work within different 
functions and loops. 
*/


const NONE = 0; 
const PL_X = 1;
const PL_O = 2;
var xscore = 0;
var oscore = 0;
var draw = 0;
var scoreTextX;
var scoreTextO;
var drawscore;


/*
Setting up phaser canvas and 
scenes involved when working on the program. 
There are four child classes 
assigned to Phaser.Scenes which complete up the game architecture.
*/
window.onload = function() {
	var config = {
		type: Phaser.AUTO,
		width: 880,          //width, height,background color of the canvas along with scenes involved.
		height: 980,
		backgroundColor: 0x0000,
		scene: [MainMenu,StartScene,InGameScene,Instructions],
	};
	game = new Phaser.Game(config);

}

/*
MainMenu class displays 
main menu of the game along with 
two interactive responses which are 'play multiplayer' and 
'How to play'
*/


class MainMenu extends Phaser.Scene {
	constructor() {
		super('MainMenu');    
	}
	preload() {
        this.load.image('menu', 'assets/gamemenu.jpg'); // the background asset of main menu is preloaded.
		

	}
	create() {
		this.add.image(500, 480, 'menu'); //displays the menu background

		let gameName = this.add.text(440, 150, 'Tic- Tac-Toe', { font: "bold 80px Arial", fill: '#FFF' }); // adds text 'Tic Tac Toe', includes font and font color white
		gameName.setOrigin(0.5, 0.5);

		let playoption = this.add.text(450, 350, 'Play (Multiplayer)', { font: "bold 80px Arial", fill: '#FF0' }); // adds text 'Play (Multiplayer)',includes font and font color yellow
		playoption.setOrigin(0.5,0.5);
		playoption.setInteractive();   //setting up interactivity

		playoption.on('pointerover', () => {playoption.setStyle({ fill: '#0f0'});} );  // when cursor is on the text, it changes color to green
		playoption.on('pointerout', () => {playoption.setStyle({ fill: '#ff0'});} );  // when cursor is not on the text, it changes color to yellow again

		playoption.on('pointerdown', () => { this.scene.start('StartScene'); }); // when cursor is clicked, it loads another scene class 'StartScene'

		let playinstructions = this.add.text(450, 650, 'How to Play', { font: "bold 80px Arial", fill: '#FF0' });  // Navigation for How to Play is set up
		playinstructions.setOrigin(0.5,0.5);
		playinstructions.setInteractive();

		playinstructions.on('pointerover', () => {playinstructions.setStyle({ fill: '#0f0'});} );
		playinstructions.on('pointerout', () => {playinstructions.setStyle({ fill: '#ff0'});} );
		playinstructions.on('pointerdown', () => { this.scene.start('Instructions'); });            // Loads Scene Class 'Instructions'



		

	}




}

/*
Instruction class displays 
rules of the game 
*/

class Instructions extends Phaser.Scene {
	constructor() {
		super('Instructions');
	}
	preload() {
        this.load.image('background', 'assets/gamemenu.jpg'); //preloads the background asset
		this.load.image('arrow', 'assets/arrow.png');  // preloads back arrow asset

	}

	create() {
		this.add.image(500, 480, 'background'); 
		let goBack = this.add.image(60, 80, 'arrow');
		goBack.setScale(0.2);
		goBack.setInteractive();
		goBack.on('pointerdown', () => { this.scene.start('MainMenu'); }); // when cursor is clicked it loads back to MainMenu class 

/*
Adding all the instructions
of the game 

*/
		let gameInstruction = this.add.text(440, 150, 'How to Play', { font: "bold 80px Arial", fill: '#FFF' });
		gameInstruction.setOrigin(0.5, 0.5);

		let stepOne = this.add.text(450, 350, '1. The game requires two players. Make sure there are two', { font: "bold 30px Arial", fill: '#FFFFFF' });
		stepOne.setOrigin(0.5, 0.5);

		let stepOneContinue = this.add.text(450, 450, 'players in order to play this game', { font: "bold 30px Arial", fill: '#FFFFFF' });
		stepOneContinue.setOrigin(0.5, 0.5);

		let stepTwo = this.add.text(450, 600, '2. Game starts with X chance first then O is given the chance to play.', { font: "bold 25px Arial", fill: '#FFFFFF' });
		stepTwo.setOrigin(0.5,0.5);

		let stepTwoContinue = this.add.text(450, 700, 'User needs to tap on square tile to make moves', { font: "bold 25px Arial", fill: '#FFFFFF' });
		stepTwoContinue.setOrigin(0.5,0.5);

		let stepThree = this.add.text(450, 800, '3. The first player to get three marks in a row (up, down, across, or diagonally) is the winner.', { font: "bold 19px Arial", fill: '#FFFFFF' });
		stepThree.setOrigin(0.5,0.5);

		let stepThreeContinue = this.add.text(450, 900, 'If there are no marks in a row, game is a draw', { font: "bold 23px Arial", fill: '#FFFFFF' });
		stepThreeContinue.setOrigin(0.5,0.5);
	}

}




/*
StartScene class preloads assets of the tiles 
and markers 'x' and 'o'
then it loads a different scene class named 'InGameScene'
*/


class StartScene extends Phaser.Scene {
	constructor() {
		super('StartScene');
	}
	preload() {
        this.load.image('tile', 'assets/squaretile.jpg');  //tile asset preloaded
        this.load.spritesheet('xo', 'assets/xo.png',    //x and o markers asset preloaded 
			{frameWidth: 200, frameHeight: 200});

	}
	create() {
        this.scene.start('InGameScene');      //InGameScene class is loaded
	}
}

/*
'InGameScene' contains complex game logic 
inside the game, focuses on tile allocation,
player interaction and win probabilities. 

*/

class InGameScene extends Phaser.Scene {
	constructor() {
		super('InGameScene');
	}
	create() {

        			
        
		this.playerTurn = PL_X;  //assigning global constructor 'PL_X' to playerTurn

        this.tileArray = []; //represents the array inside of an array

        this.gameOver = false;  //gameOver assigned to false would be true when game finishes

        let tileOriginalSize = 280;      // tile size is 280 x 280      
        let tileNextSize = 150;          // each tile position is moved down to 150 px

        let positiontile = 0;        //initial position starts from 0

		//score tracker

		scoreTextX = this.add.text(10, 900, 'X Points: ' + xscore, { fontSize: '32px', fill: '#FFF' });  //display points of player X and the variable increments through different conditions
		scoreTextO = this.add.text(650, 900, 'O Points: ' + oscore , { fontSize: '32px', fill: '#FFF' }); //displays points of player O and the variable increments through different conditions
		drawscore = this.add.text(360, 900, 'Draws: ' + draw, { fontSize: '32px', fill: '#FFF' }); // displays draws and the variable increments through different conditions

		/*

		the loop translates to 3 iterations which are 

		First iteration 150 + (280 * 0) + (0 * 10) = 150
		Second Iteration 150 + (280 * 1) + (1 * 10) = 440
		Third Iteration 150 + (280 * 2) + (2 * 10) = 730


		These are then implemented into x and y coordinates for tile allocation


		*/

        for (let row = 0; row < 3; row++) {           // since tic tac toe is a 3 x 3 game the loop is assigned for 3 rows and coulumns
            let y = tileNextSize + (tileOriginalSize * row) + (row * 10);   
            for (let col = 0; col < 3; col++) {
                let x = tileNextSize + (tileOriginalSize * col) + (col * 10);
                let squaretile = this.add.sprite(x, y, 'tile'); 
                squaretile.position = positiontile++;      // increments value of squaretile
                squaretile.takenBy = NONE;
                squaretile.setInteractive();    //when user clicks on the tile
                squaretile.on('pointerdown', this.handleClick);  // calls the function handleClick
                
                this.tileArray.push({
					takenBy: NONE,
					xoSprite: null,
				});
            }
        }



		this.whoisPlaying(); // calls whoisPlaying function

	}

    handleClick(event) {

        let xoSprite;
        let o = this.position;  //offset assigned to position
		let user = this.scene;  // user assigned to scene

        if (user.gameOver) {
			return true;            //if game overs stop the game by changing it to true
		}
        let takenBy = user.tileArray[o].takenBy; // which user is currently taken X or O ?


		if (takenBy == NONE) { // if taken by nobody which is first what is displayed
			if (user.playerTurn == PL_X) {    //if x is playing
				xoSprite = user.add.sprite(this.x, this.y, 
					'xo', 0);   // show 0th frame of spritesheet

				takenBy = PL_X;  // change taken by to player X (PL_X)
			} else {
				xoSprite = user.add.sprite(this.x, this.y, //else 'o' is playing
					'xo', 4);                       // show 4th frame of spritesheet    

				takenBy = PL_O;          // change taken by to player O (PL_O)
			}


            user.tileArray[o].takenBy = takenBy;

			user.tileArray[o].xoSprite = xoSprite;
			user.checkWinner(user.playerTurn);          // calling checkWinner function


			/*
			When the game is played 
			between X and O turns need to be changed for
			this we assign if and else conditions
			*/
			if (user.playerTurn == PL_X) {
				user.playerTurn = PL_O;     // after player X plays player O is assigned
			} else {
				user.playerTurn = PL_X;     // after player O plays player X is assigned
			}
		}

		user.whoisPlaying();  //calling whoisPlaying function
	}

	whoisPlaying() {   /* adding tweens to labels notifying 
		                  user on whose turn is it */

		let x = this.game.config.width / 2;
		let y = this.game.config.height / 2;
		let t;

        if (this.playerTurn == PL_X) {
			t = "PLAYER X TURN";          // if it switches to player X display "PLAYER X TURN"
		} else {
			t = "PLAYER O TURN";          // if it switches to player O display "PLAYER O TURN"
		}
		
		let label = this.add.text(x, y, t, 
			{ fontSize: '72px Arial', fill: '#74CE3C' });
		label.setOrigin(0.5, 0.5);                                    // labels are assigned to variables x y and t

		this.tweens.add({
			targets: label,    //tween is assigned to label variable
			alpha: 0,                  
			duration: 1500,    //duration of the text assigned
		});
	}

    checkWinner(playerXO) {
		let winPrediction = [
			[0, 1, 2],  // horizontal row 1 win possibility
			[3, 4, 5],  // horizontal row 2 win possibility
			[6, 7, 8],  // horizontal row 3 win possibility   
			[0, 4, 8],  // diagonal 1 win possibility
			[2, 4, 6],  // diagonal 2 win possibility
			[0, 3, 6],  // vertical 1 win possibility
			[1, 4, 7],  // vertical 2 win possibility
			[2, 5, 8]   // vertical 3 win possibility
		];

		for (let line = 0; line < winPrediction.length; line++) {
			let win = winPrediction[line];

			/* 
			If all the win possibilities match based on the 
			values it would show the winner
			*/

			if ((this.tileArray[win[0]].takenBy == playerXO) &&
				(this.tileArray[win[1]].takenBy == playerXO) &&
				(this.tileArray[win[2]].takenBy == playerXO)) {
					this.showWinner(playerXO, win);  // calls showWinner function
					return true;
			}
		}
/*

Limiting number of moves if nobody has taken the tile 
and moves are still need to be made it will allow user to play until 
match is found if nobody is a winner and its a draw,
it would not show the winner 


*/
        let movesLeft = false;
		for (let n = 0; n < this.tileArray.length; n++) {
			if (this.tileArray[n].takenBy == NONE) {
				movesLeft = true;
			}
		}

		if (!movesLeft) {
			this.showWinner(NONE);
		}

		return false;
	}

    showWinner(playerXO, win) {          //assigning to variables to the function 'playerXO' and 'win'
		this.gameOver = true;           //when game is over
		this.tweens.killAll();          // kills all the tweens

		let x = this.game.config.width / 2;
		let y = this.game.config.height / 2;

		let t;

		if (playerXO == PL_X) {
			t = "X IS THE WINNER! TAP TO RESET";         //if player x is winner it will display this text
			xscore += 1;  // increments player x score by 1
			scoreTextX.setText('X Points: ' + xscore);
		} else if (playerXO == PL_O) {
			t = "O IS THE WINNER! TAP TO RESET";         //if player o is winner it will display this text
			oscore += 1; // increments player o score by 1
			scoreTextO.setText('O Points: ' + oscore);
		} else {
			t = "IT'S A DRAW! TAP TO RESET";             //if moves are made and nobody is winner it will display this text
			draw += 1; //increments draw by 1
			drawscore.setText('Draws: ' + draw);
		}

		let label = this.add.text(x, y, t,
			{ fontSize: '50px Arial', fill: '#00F', backgroundColor: '#00F' });
		label.setOrigin(0.5, 0.5);

		label.setInteractive();      // setting up text

		label.on('pointerdown', function() {
			this.scene.start('InGameScene');  // when pointer is clicked it loads InGameScene class 
		}, this);

		label = this.add.text(x, y, t,
			{ fontSize: '50px Arial', fill: '#0F0' });
		label.setOrigin(0.5, 0.5);                     

		this.tweens.add({
			targets: label,
			
			duration: 1000,       // adding tweens

			repeat: -1
		});

		if (playerXO != NONE) {
			for (let n = 0; n < win.length; n++) {
				let sprite = this.tileArray[win[n]].xoSprite;

				this.tweens.add({
					targets: sprite,
					duration: 1000,
					repeat: -1
				});

            }
		}
	}













}