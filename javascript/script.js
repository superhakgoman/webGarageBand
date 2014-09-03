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

// function SoundPool(){
// 	var instance; 
// 	SoundPool = function SoundPool(){
// 		return instance;
// 	};
// 	SoundPool.prototype = this;

// 	instance = new SoundPool();
// 	instance.constructor = SoundPool;

// 	var pool = {};
// 	instance.add = function(id, soundSrc){
// 		pool[id] = function(){
// 			var sound = new Audio();
// 			sound.src = soundSrc;
// 			sound.autoplay = false;
// 			sound.loop = false;
// 			sound.preload = true;
// 			return sound;
// 		}();
// 	};
// 	instance.getSound = function(id){
// 		return pool[id];
// 	};
// 	instance.isLoadCompleted = function(){
// 		var loadCompleted = 0;
// 		for (var i in pool){
// 			// console.log(pool[i]);
// 			if (pool[i].readyState == 4) {
// 				loadCompleted++;
// 			}
// 		}
// 		var poolSize = Object.keys(pool).length;
// 		if (poolSize === loadCompleted) {
// 			return true;
// 		} else{
// 			return false;
// 		}
// 	};
// 	instance.getPool = function(){
// 		return pool;
// 	};

// 	return instance;
// }

function initSoundPool(){
	SoundPool.add("do", "sounds/piano_simple/2c.wav");
	SoundPool.add("re", "sounds/piano_simple/2d.wav");
	SoundPool.add("mi", "sounds/piano_simple/2e.wav");
	SoundPool.add("fa", "sounds/piano_simple/2f.wav");
	SoundPool.add("sol", "sounds/piano_simple/2g.wav");
	SoundPool.add("la", "sounds/piano_simple/2a.wav");
	SoundPool.add("ti", "sounds/piano_simple/2b.wav");
	SoundPool.add("do2", "sounds/piano_simple/3c.wav");
}

window.addEventListener("load", function(){
	initSoundPool();
	var t = setInterval(function(){
		console.log("Load sound resources...");
		if (SoundPool.isLoadCompleted()) {
			console.log("Complete.");
			clearInterval(t);
			var _keys = document.querySelectorAll("div.key");
			var oldKey;
			for (var i = 0; i < _keys.length; i++) {
				var keyId = _keys[i].id;
				console.log(SoundPool.getSound(keyId));

				_keys[i].addEventListener("touchstart", function(id){
					// console.log(this);
					console.log("touchStart : " + id);
					SoundPool.getSound(id).play();
					oldKey = document.elementFromPoint(event.targetTouches[0].pageX, event.targetTouches[0].pageY).id;
					console.log(oldKey);
				}.bind(this, keyId), false);

				_keys[i].addEventListener("touchmove", function(){
					event.preventDefault();
					var newKey = document.elementFromPoint(event.targetTouches[0].pageX, event.targetTouches[0].pageY).id;
					if (oldKey !== newKey) {
						console.log("key changed.");
						console.log("oldKey : " + oldKey + ", newKey : " + newKey);
						SoundPool.getSound(oldKey).pause();
						SoundPool.getSound(oldKey).currentTime = 0;
						SoundPool.getSound(newKey).play();
						oldKey = newKey;
					}
					console.log("oldKey : " + oldKey + ", newKey : " + newKey);
					// console.log(document.elementFromPoint(event.targetTouches[0].pageX, event.targetTouches[0].pageY).id);
					// SoundPool.getSound(event.targetTouches[0].target.id).play();
				}, false);

				_keys[i].addEventListener("touchend", function(id){
					console.log("touchEnd : " + id);
					SoundPool.getSound(id).pause();
					SoundPool.getSound(id).currentTime = 0;
				}.bind(this, keyId), false);
			}
			var loadMessage = document.querySelector("section p");
			document.getElementById("keyboard").removeChild(loadMessage);
		}
	}, 10);
}, false);
