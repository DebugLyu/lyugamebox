"use strict";
cc._RFpush(module, 'c3e7dTVYa5FHqy4ZY0c47vb', 'PlayerManager');
// Script/Role/PlayerManager.js

// PlayerManager.js
var pMgr = (function () {

    var instance = null;
    function getInstance() {
        if (instance === null) {
            instance = new PlayerManager();
        }
        return instance;
    }
    function PlayerManager() {
        this.role_list = {};
        this.main_role = null;
    }
    return {
        getInstance: getInstance
    };
})();

module.exports = pMgr;

cc._RFpop();