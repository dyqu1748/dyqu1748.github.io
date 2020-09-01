$(document).ready(function() { // do this when the document is loaded
	$("#content_dial").show(); // show the element with ID "element"
	$("#content_contact").hide();	// hide other element
    $("#content_addCont").hide();
    $("#dialer").css("background-color","white");
    $("#content_dial").css("background-color","white");
});

$("#dialer").click(function() { // when "button_id" is clicked
	$("#content_dial").show(); // show element
    $("#content_contact").hide();	// hide other element
    $("#content_addCont").hide();
    $("#dialer").css("background-color","white");
    $("#addCont").css("background-color","lightgrey");
    $("#contact").css("background-color","lightgrey");
});

$("#contact").click(function() { // when "button_id" is clicked
	$("#content_contact").show(); // show element
    $("#content_dial").hide();	// hide other element
    $("#content_addCont").hide();
    $("#contact").css("background-color","white");
    $("#dialer").css("background-color","lightgrey");
    $("#addCont").css("background-color","lightgrey");
});

$("#addCont").click(function() { // when "button_id" is clicked
	$("#content_addCont").show(); // show element
    $("#content_contact").hide();	// hide other element
    $("#content_dial").hide();
    $("#addCont").css("background-color","white");
    $("#dialer").css("background-color","lightgrey");
    $("#contact").css("background-color","lightgrey");
});

function show(num){
    document.getElementById("disp").value+=num
}

function solve(){
    var eq = document.getElementById("disp").value;
    if (!eq.includes('#')){
        var ans = eval(eq)
        document.getElementById("disp").value = ans;
    }
    else{
        alert("Invalid character detected!");
        document.getElementById("disp").value = "";
    }
}
