// this gives us the order of the buttons, which we can use to step through the buttons in various directions
// since we know the layout, + 1 moves to the next item, -1 previous, +4 is one row down, -4 is one row up
buttonOrder = ["#button7","#button8","#button9","#buttonDivide","#button4","#button5","#button6","#buttonMultiply","#button1","#button2","#button3","#buttonAdd","#button0","#buttonClear","#buttonEquals","#buttonSubtract"];

// add the selected class to an item. you can pass this any jquery selector, such as #id or .class
// calling this will de-select anything currently selected
function selectItem(name) {
	$("button").removeClass("cursor");
	$(name).addClass("cursor")
}

// gets the currently selected item, and returns its #id
// returns null if no item is selected
// note that if multiple items are selected, this will only return the first
// but you could rewrite this to return a list of items if you wanted to track multiple selections
function getSelectedItem() {
	selected = $(".cursor"); // this returns an array
	if (selected.length == 0) {
		return null;
	}
	else {
		return "#" + selected.first().attr('id')
	} 
}

var wrapAround = false;
var resetDown = false;

// the next four functions move the selected UI control
// this uses the array buttonOrder to know the order of the buttons. so you could change buttonOrder
// to change the order that controls are highlighted/
// if no button is currently selected, such as when the page loads, this will select the first
// item in buttonOrder (which is the 7 button)
// selectNext: go to the right, wrapping around to the next row
// selectPrevious: go to the left, wrapping around to the previous row
// selectUp: select the item above
// selectDown: select the item below

function selectNext() {
	selected = getSelectedItem()
	if (selected == null) {
		selectItem(buttonOrder[0]);
	} else {
		if (!wrapAround){
			index = buttonOrder.indexOf(selected);
			index = (index + 1) % buttonOrder.length;
		}
		//Modify functionality for 3 and 1-button control
		if (wrapAround){
			index = buttonOrder.indexOf(selected) + 1;
			//Make it so that next does not go onto the next row, but go back to the beginning of the row.
			if (index % 4 == 0){
				index = index - 4
			}
		}
		selectItem(buttonOrder[index])
	}
}

function selectPrevious() {
	selected = getSelectedItem()
	if (selected == null) {
		selectItem(buttonOrder[0]);
	} else {
		index = buttonOrder.indexOf(selected);
		index = (index - 1);
		if (index < 0) index = buttonOrder.length + index
		selectItem(buttonOrder[index])
	}	
}

function selectUp() {
	selected = getSelectedItem()
	if (selected == null) {
		selectItem(buttonOrder[0]);
	} else {
		index = buttonOrder.indexOf(selected);
		index = (index - 4);
		if (index < 0) index = buttonOrder.length + index
		selectItem(buttonOrder[index])
	}
}

function selectDown() {
	selected = getSelectedItem()
	if (selected == null) {
		selectItem(buttonOrder[0]);
	} else {
		if(!resetDown){
			index = buttonOrder.indexOf(selected);
			index = (index + 4) % buttonOrder.length;
		}
		else{
			index = (buttonOrder.indexOf(selected) + 4)%buttonOrder.length;
			//When row scanning, always start at the far left column
			while (index%4 != 0){
				index = index - 1;
			}
		}
		selectItem(buttonOrder[index])
	}
}

// actuate the currently selected item
// if no item is selected, this does nothing
// if multiple items are selected, this selects the first
function clickSelectedItem() {
	whichButton = getSelectedItem();
	if (whichButton != null) {
		$(whichButton).click();
	}
}

// https://stackoverflow.com/questions/22559830/html-prevent-space-bar-from-scrolling-page
function key5(e){
	if (e.key == "w" ) {
		selectUp();
	} else if (e.key == "s") {
		selectDown();
	}
	else if (e.key == "a"){
		selectPrevious();
	}
	else if(e.key == "d"){
		selectNext();
	}
	else if (e.key == " "){
		e.preventDefault();
		clickSelectedItem();
	}
}

function key3(e){
	if (e.key == "s") {
		selectDown();
	}
	else if(e.key == "d"){
		selectNext();
	}
	else if (e.key == " "){
		e.preventDefault();
		clickSelectedItem();
	}
}

// https://www.sitepoint.com/delay-sleep-pause-wait/
function waiting(){
    //Allow column scanning to go back through the row 2 times so that you can all the keys you need from that row. 
    return new Promise(resolve => setTimeout(resolve, 20000));
}

var select = 0;

function key1(e){
	console.log("User input");
	if (e.key == " "){
        if (select == 0){
			select = 1;
			document.getElementById("scanMode").innerHTML = "Column Scanning";
        }
        else if (select == 1){
            clickSelectedItem();
		}
		e.preventDefault();
    }
}

var colSearch = false;

function rowRestart(){
	if (!colSearch){
		colSearch = true;
		waiting().then(() => { 
			console.log("Timeout done");
			select = 0; 
			document.getElementById("scanMode").innerHTML = "Row Scanning";
			colSearch = false;
		});
	}
}

// https://gist.github.com/brenopolanski/f326b53954769664f21f
function key1Timing(start){
	if (start){
		wrapAround = true;
		resetDown = true;
		timing = setInterval(function(){
			if (select == 0){
				document.getElementById("scanMode").innerHTML = "Row Scanning";
				selectDown();
			}
			else if (select == 1){
				document.getElementById("scanMode").innerHTML = "Column Scanning";
				selectNext();
				rowRestart();
				console.log("Column scanning");
				console.log("Done");
			}
		}, 3000);
	}
	else{
		wrapAround = false;
		resetDown = false;
		document.getElementById("scanMode").innerHTML = "";
		if (typeof(timing) !== 'undefined'){
			clearInterval(timing);
		}
	}
}

function inputType(keys){
	if (keys == 1){
		document.removeEventListener("keypress",key3);
		document.removeEventListener("keypress", key5);
		document.addEventListener("keypress", key1, false);
		key1Timing(true);
		document.getElementById("inputMethod").innerHTML = "1-Button Input";
	}
	else if (keys == 5){
		key1Timing(false);
		document.removeEventListener("keypress",key3);
		document.addEventListener("keypress", key5, false);
		document.getElementById("inputMethod").innerHTML = "5-Button Input";
	}
	else if (keys == 3){
		key1Timing(false);
		document.removeEventListener("keypress", key5, false);
		document.addEventListener("keypress", key3, false);
		document.getElementById("inputMethod").innerHTML = "3-Button Input";
		wrapAround = true;
	}

}

// this function responds to user key presses
// you'll rewrite this to control your interface using some number of keys
// $(document).keypress(function(event) {
// 	if (event.key == "w" ) {
// 		selectUp();
// 	} else if (event.key == "s") {
// 		selectDown();
//     }
//     else if (event.key == "a"){
//         selectPrevious();
//     }
//     else if(event.key == "d"){
//         selectNext();
//     }
//     else if (event.key == " "){
//         clickSelectedItem();
//     }
// })


/* calculator stuff below here */
// for operations, we'll save + - / *
firstValue = null;
operation = null;
addingNumber = false;

digits = "0123456789"
operators = "+-*/"

// handle calculator functions. all buttons with class calcButton will be handled here
$(".calcButton").click(function(event) {
	buttonLabel = $(this).text();
	
	// if it's a number, add it to our display
	if (digits.indexOf(buttonLabel) != -1) {
		// if we weren't just adding a number, clear our screen
		if (!addingNumber) {
			$("#number_input").val("")
		}
		$("#number_input").val($("#number_input").val() + buttonLabel);
		addingNumber = true;
	// if it's an operator, push the current value onto the stack
	} else if (operators.indexOf(buttonLabel) != -1) {
		// have we added a number? if so, check our stack
		if (addingNumber) {
			// is this the first number on the stack?
			// if so, save it
			if (firstValue == null) {
				firstValue = $("#number_input").val();
				addingNumber = false;
			// do we have a number on the stack already? if so, this is the same as equals
			} else if (firstValue != null) {
				secondValue = $("#number_input").val();
				evaluateExpression(firstValue,operation,secondValue)
				// in this case, keep the operation
				firstValue = $("#number_input").val();
				addingNumber = false;
			}
		}
		// either way, save this as the most recent operation
		operation = buttonLabel;
	} else if (buttonLabel == "C") {
		$("#number_input").val("");
		firstValue = null;
		operation = null;
		addingNumber = false;
	} else if (buttonLabel == "=") {
		if (firstValue != null && operation != null && addingNumber) {
			secondValue = $("#number_input").val();
			evaluateExpression(firstValue,operation,secondValue);
			// clear our state
			firstValue = null;
			operation = null;
			addingNumber = true
		}
	}
})

// do the math for our calculator
function evaluateExpression(first,op,second) {
	output = 0;
	if (op == "+") {
		output = parseInt(first) + parseInt(second);
	} else if (op == "-") {
		output = parseInt(first) - parseInt(second);
	} else if (op == "*") {
		output = parseInt(first) * parseInt(second);
	} else if (op == "/") {
		output = parseInt(first) / parseInt(second);
	}
	
	// now, handle it
	$("#number_input").val(output.toString());
	// deal with state elsewhere
}

