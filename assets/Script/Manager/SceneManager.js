var SceneMgr = {
	onChangeScene: function(scene){
		// cc.director.loadScene(scene);
		cc.director.preloadScene(scene, function () {
		    // cc.log('Next scene preloaded');
		    cc.director.loadScene(scene);
		});
	}
}

module.exports = SceneMgr;