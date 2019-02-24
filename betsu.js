"use strict";
var Betsu = /** @class */ (function () {
    function Betsu(totalSpend) {
        var _this = this;
        this.selfCheck = function () {
            console.log("Betsu: Total Spend:" +
                _this.totalSpend +
                ", Min Sharers:" +
                Betsu.minsharers);
        };
        this.totalSpend = totalSpend;
        this.sharers = Betsu.minsharers;
        this.selfCheck();
    }
    Betsu.prototype.updateMe = function (newSpend) {
        if (newSpend) {
            this.totalSpend = newSpend;
            this.selfCheck();
        }
    };
    Betsu.minsharers = 2;
    return Betsu;
}());
