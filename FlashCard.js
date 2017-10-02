var inquirer = require("inquirer");
var fs = require("file-system");
var readline = require('readline');
var basicCardConstructor = require("./BasicCard.js");
var clozeCardConstructor = require("./ClozeCard.js");
var basicCounter = 0;
var clozeCounter = 0;

var saveCard = function(type, card) {
 
 	var fileNameBasic = "basic.txt";
 	var fileNameCloze = "cloze.txt";

 	if (type === "Basic") {
		fs.appendFile(fileNameBasic, card.front+"\n"+card.back+"\n\n", function(err) {    
	    if (err) {
	      return console.log(err);
	    };
	  });
	} else if (type === "Cloze") {
		fs.appendFile(fileNameCloze, card.fullText+"\n"+card.cloze+"\n"+card.partial+"\n\n", function(err) {    
	    if (err) {
	      return console.log(err);
	    };
	  });
	};
};

var constructBasicCard = function() {
	
	inquirer.prompt([
	  {
	  	name: "front",
	  	message: "Please enter the front of the basic card."
	  }, {
	  	name: "back",
	  	message: "Please enter the back of the basic card."
	  }
	]).then(function(answers) {
		var basicCard = new basicCardConstructor(answers.front, answers.back);
		saveCard("Basic", basicCard);
		console.log("Basic Card front: "+basicCard.front, "\nBasic Card back: "+basicCard.back);
		
		inquirer.prompt([
		  {
		    type: "list",
		    name: "userChoice",
		    message: "Would you like to make more cards?",
		    choices: ["Yes.", "No. Return to main menu.", "No. Exit the program."]
		  }
		]).then(function(answers) {

			if (answers.userChoice === "Yes.") {
				constructCards();
			} else if (answers.userChoice === "No. Return to main menu.") {
				showMainMenu();
			} else if (answers.userChoice === "No. Exit the program.") {
				process.exit(-1);
			}
		});
	
	});
};

var constructClozeCard = function() {

	inquirer.prompt([
	  {
	  	name: "fullText",
	  	message: "Please enter the full text of the cloze card."
	  },{
	  	name: "cloze",
	  	message: "Please enter the cloze deletion."
	  }
	]).then(function(answers) {

		var fullTextLowercase = answers.fullText.toLowerCase();
		var clozeLowerCase = answers.cloze.toLowerCase();

		var clozeCard = new clozeCardConstructor(answers.fullText, answers.cloze);
		
		if (clozeCard.getPartialText()[0] === "valid") {
			saveCard("Cloze", clozeCard);
			console.log("Cloze Card full text: "+clozeCard.fullText, "\nCloze Card cloze deletion: "+clozeCard.cloze, 
				"\nCloze Card partial text: "+clozeCard.partial);
			
			inquirer.prompt([
			  {
			    type: "list",
			    name: "userChoice",
			    message: "Would you like to make more cards?",
			    choices: ["Yes.", "No. Return to main menu.", "No. Exit the program."]
			  }
			]).then(function(answers) {

				if (answers.userChoice === "Yes.") {
					constructCards();
				} else if (answers.userChoice === "No. Return to main menu.") {
					showMainMenu();
				} else if (answers.userChoice === "No. Exit the program.") {
					process.exit(-1);
				}
			});
		} else if (clozeCard.getPartialText()[0] === "error") {
			console.log(clozeCard.getPartialText()[1]);
			constructClozeCard();
		};
	});
};

var constructCards = function() {

	inquirer.prompt([
	  {
	    type: "list",
	    name: "userChoice",
	    message: "Which type of card would you like to construct?",
	    choices: ["Basic Card", "Cloze Card"]
	  }
	]).then(function(answers) {

		if (answers.userChoice === "Basic Card") {
			constructBasicCard();			
		} else if (answers.userChoice === "Cloze Card") {
			constructClozeCard();
		};
	});
};

var reviewBasic = function(cardIndex, cardDeck) {

	if (basicCounter < cardDeck.length) {
		inquirer.prompt([
			{
				name: "userAnswer",
				message: cardDeck[basicCounter][0]
			}
		]).then(function(answers) {

			if (answers.userAnswer.toLowerCase().trim() === cardDeck[basicCounter][1].toLowerCase().trim()) {
				console.log("You got it! The answer was "+cardDeck[basicCounter][1]);
				basicCounter++;
				reviewBasic(basicCounter, cardDeck);
			} else {
				console.log("That is not the right answer! Please try again.");
				reviewBasic(basicCounter, cardDeck)
			};
		});	
	} else if (basicCounter === cardDeck.length) {
		console.log("No more basic cards to review! Give yourself a pat on the back!");
		showMainMenu();
	};
};

var reviewCloze = function(cardIndex, cardDeck) {

	if (clozeCounter < cardDeck.length) {
		inquirer.prompt([
			{
				name: "userAnswer",
				message: cardDeck[clozeCounter][2]
			}
		]).then(function(answers) {

			if (answers.userAnswer.toLowerCase().trim() === cardDeck[clozeCounter][1].toLowerCase().trim()) {
				console.log("You got it! "+cardDeck[clozeCounter][0]);
				clozeCounter++;
				reviewCloze(clozeCounter, cardDeck);
			} else {
				console.log("That is not the right answer! Please try again.");
				reviewCloze(clozeCounter, cardDeck)
			};
		});	
	} else if (clozeCounter === cardDeck.length) {
		console.log("No more cloze cards to review! Give yourself a pat on the back!");
		showMainMenu();
	};
};

var reviewCards = function() {

	inquirer.prompt([
	  {
	  	type: "list",
	  	name: "cardType",
	  	message: "What type of cards would you like to review?",
	  	choices: ["Basic cards only.", "Cloze cards only."]
	  }
	]).then(function(answers) {
		if (answers.cardType === "Basic cards only.") {
		  
		  var dataArray = fs.readFileSync("basic.txt").toString().split("\n\n");
  		dataArray.pop();
			for(var i = 0; i < (dataArray.length); i++) {
				dataArray[i] = dataArray[i].split("\n");
			};

			reviewBasic(basicCounter, dataArray);

		} else if (answers.cardType === "Cloze cards only.") {
			
			var dataArray = fs.readFileSync("cloze.txt").toString().split("\n\n");
  		dataArray.pop();
			for(var i = 0; i < (dataArray.length); i++) {
				dataArray[i] = dataArray[i].split("\n");
			};

			reviewCloze(clozeCounter, dataArray);

		};
	});
};

var showMainMenu = function() {

	basicCounter = 0;
	clozeCounter = 0;
	
	inquirer.prompt([
	  {
	  	type: "list",
	  	name: "initialSelection",
	  	message: "What would you like to do?",
	  	choices: ["Make new card.", "Review cards.", "Exit the program."]
	  }
	]).then(function(answers) {
		if(answers.initialSelection === "Make new card.") {
			constructCards();
		} else if (answers.initialSelection === "Review cards.") {
			reviewCards();
		} else if (answers.initialSelection === "Exit the program.") {
			process.exit(-1);
		}
	});
};

showMainMenu();
