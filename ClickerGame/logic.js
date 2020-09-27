//https://developer.mozilla.org/en-US/docs/Web/API/Document/keydown_event
// https://stackoverflow.com/questions/12953928/immediate-play-sound-on-button-click-in-html-page
// http://www.iandevlin.com/blog/2014/01/javascript/using-the-web-speech-api-to-control-a-html5-video/
//https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition

//Sound effect to play
var sfx =  document.getElementById("myAudio");
var bgm = document.getElementById("bgm");
var startListen = document.getElementById('startListen');
var startListenMob = document.getElementById('startListenMob');
var playingBGM = false;

//Keyboard input (using spacebar)
document.onkeydown = function (e) {
    if (e.code == "Space"){
	if (playingBGM == false){
	    bgm.play();
	    bgm.loop = true;
	    playingBGM = true;
	}
        document.getElementById("target").style.display = "inline";
        sfx.play();
        sfx.currentTime=0;
    }
};
document.onkeyup = function (e) {
    if (e.code == "Space"){
        document.getElementById("target").style.display = "none";
	var count = document.getElementById("counter").innerHTML;
        count++;
        document.getElementById("counter").innerHTML = count; 
    }
};

function poke(){
    if (playingBGM == false){
        bgm.play();
        bgm.loop = true;
        playingBGM = true;
    }
    document.getElementById("target").style.display = "inline";
    var count = document.getElementById("counter").innerHTML;
    sfx.play();
    sfx.currentTime=0;
    count++;
    document.getElementById("counter").innerHTML = count; 
    
}

function nope(){
    document.getElementById("target").style.display = "none";
}

(function() {
	
    rec = new webkitSpeechRecognition();
    rec.continuous = true;
    rec.interimResults = false;
    rec.lang = 'en';

    
    var checkPoke = function(voice, expect) {
        //Check if poke is said by the user
        //Note: when I had it check if it was == 0, it would only work the first time. Appears to be index 1 after the first voice command.
        return (voice.indexOf(expect) == 0 || voice.indexOf(expect) ==1);
    }

    rec.onresult = function(event) {
        // Check the newest voice command
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                var voice = event.results[i][0].transcript;
                if (checkPoke(voice, 'poke')) {
                    poke();
                    setTimeout(() => { nope(); }, 250);
                }
            }
        }
    };
	
    rec.onaudioend = function(){
    	document.getElementById("listeningMob").innerHTML = 'Not currently poking with voice.';
    };

    // Start speech recognition, for some reason if I put start in the function above the sound effect doesn't play.
    var startPoke= function() {
        rec.start();
        document.getElementById("listening").innerHTML = 'Now poking with voice!';
    }
    
    var startPokeMob= function() {
        rec.start();
        document.getElementById("listeningMob").innerHTML = 'Now poking with voice!';
    }

    // Listens to when user enables voice recognition 
    startListen.addEventListener('click', startPoke, false);
    startListenMob.addEventListener('click', startPokeMob, false);

	
})();
