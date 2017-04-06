"use strict";
cc._RFpush(module, '501ebamHJpLZ477TBqUWeMg', 'SceneManager');
// Script/Manager/SceneManager.js

"use strict";

var SceneMgr = {
	onChangeScene: function onChangeScene(scene) {
		// cc.director.loadScene(scene);
		cc.director.preloadScene(scene, function () {
			// cc.log('Next scene preloaded');
			cc.director.loadScene(scene);
		});
	}
};

module.exports = SceneMgr;

cc._RFpop();