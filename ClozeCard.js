// Create a new file named ClozeCard.js:

// This file should define a Node module that exports a constructor for creating cloze-deletion flashcards, e.g.:
// module.exports = ClozeCard;

// The constructor should accept two arguments: text and cloze.
// The constructed object should have a cloze property that contains only the cloze-deleted portion of the text.
// The constructed object should have a partial property that contains only the partial text.
// The constructed object should have a fullText property that contains only the full text.
// The constructor should throw or log an error when the cloze deletion does not appear in the input text.
// Use prototypes to attach these methods, wherever possible.

function ClozeCard(text, cloze) {
	this.cloze = cloze,
	this.fullText = text,

	this.getPartialText = function() {	
		
		var textLowerCase = text.toLowerCase();
		var clozeLowerCase = cloze.toLowerCase()
		var resultsArray = [];

		if (textLowerCase.includes(clozeLowerCase)) {
			partialText = textLowerCase.replace(clozeLowerCase, "... ");
			resultsArray = ["valid", partialText]
		} else {
			resultsArray = ["error", "That word is not in the sentence you wrote!"];
		};
		return resultsArray;
	};

	if (this.getPartialText()[0] === "valid") {
		this.partial = '"'+this.getPartialText()[1]+'"';
	};
};

module.exports = ClozeCard;