var SoundPool = {
	pool : {},
	add : function(id, soundSrc){
		this.pool[id] = function(){
			var sound = new Audio();
			sound.src = soundSrc;
			sound.autoplay = false;
			sound.loop = false;
			sound.preload = true;
			return sound;
		}();
	},
	getSound : function(id){
		return this.pool[id];
	},
	isLoadCompleted : function(){
		var loadCompleted = 0;
		for (var i in this.pool){
			// console.log(pool[i]);
			if (this.pool[i].readyState == 4) {
				loadCompleted++;
			}
		}
		var poolSize = Object.keys(this.pool).length;
		if (poolSize === loadCompleted) {
			return true;
		} else{
			return false;
		}
	}
};
function initSoundPool(){
	var tempF = function(str){
		SoundPool.add(str, "sound/"+str+".mp3");
	};

	tempF("3A");
	tempF("3As");
	tempF("3B");
	tempF("3C");
	tempF("3Cs");
	tempF("3D");
	tempF("3Ds");
	tempF("3E");
	tempF("3F");
	tempF("3Fs");
	tempF("3G");
	tempF("3Gs");
	tempF("4A");
	tempF("4As");
	tempF("4B");
	tempF("4C");
	tempF("4Cs");
	tempF("4D");
	tempF("4Ds");
	tempF("4E");
	tempF("4F");
	tempF("4Fs");
	tempF("4G");
	tempF("4Gs");
	tempF("5C");

	// SoundPool.add("3C", "sound/3C.wav");
	// SoundPool.add("3C#", "sound/3C#.wav");
}

var canScroll = false;
var isSustain = false;

function changeKeyColor(key, pressed){
	if (pressed === true) {
		key.style.backgroundColor = "gray";
	}
	else{
		if (key.id.length === 2) {
			key.style.backgroundColor = "white";
		}
		else if (key.id.length === 3){
			key.style.backgroundColor = "black";
		}
	} 
}

window.addEventListener("load", function(){
	var keyBoardWidth = 0;
	var allWhiteKey = document.querySelectorAll("#whiteKeys div");

	for (var i = 0; i < allWhiteKey.length; i++) {
		keyBoardWidth += allWhiteKey[i].offsetWidth;
	}

	keyBoardWidth += allWhiteKey.length * 4;

	var keyboard = document.querySelectorAll("div.keyboard");
	for (var i = 0; i < keyboard.length; i++) {
		keyboard[i].style.width = keyBoardWidth + "px";
	}

	for (var i = 0; i < 5; i++) {
		var fBlackKey = document.getElementById(i + "Fs");
		if (fBlackKey !== null) {
			fBlackKey.style.marginLeft = "55px";
		}
		if (i !== 3) {
			var	cBlackKey = document.getElementById(i + "Cs");
		}
		if (cBlackKey !== null && cBlackKey !== undefined) {
			cBlackKey.style.marginLeft = "55px";
		}
	}
	
	initSoundPool();
	t = setInterval(function(){
		console.log("Load sound resources...");
		if (SoundPool.isLoadCompleted()) {
			console.log("Complete.");
			clearInterval(t);
			var oldKey;
			var newKey;

			document.body.addEventListener("touchstart", function(){
				// console.log("x : " + event.targetTouches[0].screenX + ", y : " + event.targetTouches[0].screenY);
				oldKey = document.elementFromPoint(event.targetTouches[0].clientX, event.targetTouches[0].pageY);
				// oldKey = event.targetTouches[0].target;
				if (oldKey.className === "key") {
					SoundPool.getSound(oldKey.id).play();
					changeKeyColor(oldKey, true);
				}
			}, false);

			document.body.addEventListener("touchmove", function(){
				newKey = document.elementFromPoint(event.changedTouches[0].clientX, event.changedTouches[0].pageY);
				if (canScroll === false) {
					event.preventDefault();
					if (newKey !== null && oldKey.className === "key" && newKey.className === "key" && oldKey.id !== newKey.id) {
						console.log("key changed.");
						SoundPool.getSound(oldKey.id).pause();
						SoundPool.getSound(oldKey.id).currentTime = 0;						
						changeKeyColor(oldKey, false);
						changeKeyColor(newKey, true);
						SoundPool.getSound(newKey.id).play();
						oldKey = newKey;
					}
				}
				if ((newKey === null || oldKey !== newKey) && oldKey.className === "key") {
					SoundPool.getSound(oldKey.id).pause();
					SoundPool.getSound(oldKey.id).currentTime = 0;						
					changeKeyColor(oldKey, false);
				}

			}, false);

			document.body.addEventListener("touchend", function(){
				var key = document.elementFromPoint(event.changedTouches[0].clientX, event.changedTouches[0].pageY);
				// console.log(key.id);
				if (key !== null && key.className === "key") {
					changeKeyColor(key, false);
					SoundPool.getSound(key.id).pause();
					SoundPool.getSound(key.id).currentTime = 0;
				}
			}, false);

			document.body.addEventListener("contextmenu", function(e){
				e.preventDefault();
			}, false);

			var scrollLock = document.getElementById("scrollLock");
			scrollLock.addEventListener("touchstart", function(){
				canScroll = !canScroll;
				if (canScroll === true) {
					scrollLock.children[0].style.zIndex = 3;
				} else if (canScroll === false){
					scrollLock.children[0].style.zIndex = 0;
				}
			}, false);

			var sustain = document.getElementById("sustain");
			sustain.addEventListener("touchstart", function(){
				isSustain = !isSustain;
				if (isSustain === true) {
					sustain.children[0].style.zIndex = 3;
				} else if (isSustain === false){
					console.log(sustain.children);
					sustain.children[0].style.zIndex = 0;
				}
			}, false);

			var loadingMessage = document.querySelector("#LoadingMessage");
			document.body.removeChild(loadingMessage);
		}
	}, 10);
}, false);
