"use strict";
var Sharer = /** @class */ (function () {
    function Sharer(sOwes) {
        this.isPayer = false;
        this.sharerName = "";
        this.sharerSpend = 0;
        this.sharerUses = 0;
        if (sOwes) {
            this.sharerOwes = sOwes;
        }
        else {
            this.sharerOwes = 0;
        }
        this.isPayer = false;
    }
    Sharer.prototype.copyFrom = function (copySharer) {
        this.sharerName = copySharer.sharerName;
        this.sharerSpend = copySharer.sharerSpend;
        this.sharerOwes = copySharer.sharerOwes;
        this.sharerUses = copySharer.sharerUses;
        return this;
    };
    Sharer.prototype.copyFrom = function (iN, iS, iO, iU) {
        console.log("in copy:" + iN);
        this.sharerName = iN;
        this.sharerSpend = iS;
        this.sharerOwes = iO;
        this.sharerUses = iU;
        return this;
    };
    return Sharer;
}());
var Settle = /** @class */ (function () {
    function Settle() {
        this.fromSharer = 0;
        this.toSharer = 0;
        this.settleAmt = 0;
    }
    return Settle;
}());
var Betsu = /** @class */ (function () {
    function Betsu(iniConfig) {
        var _this = this;
        this.totalSpend = 0;
        this.sharers = new Array();
        this.settling = new Array();
        this.selfCheck = function () {
            var sharertext = "";
            console.log("Betsu: Total Spend:" +
                _this.totalSpend +
                ",Sharers:" +
                _this.sharers.length);
            console.log("Betsu Object:" + JSON.stringify(_this, null, 4));
            /*
            for (let inx = 0; inx < this.sharers.length; inx++) {
              sharertext +=
                "[" +
                this.sharers[inx].sharerName +
                ":" +
                this.sharers[inx].sharerSpend +
                ":" +
                this.sharers[inx].sharerOwes +
                ":" +
                this.sharers[inx].sharerUses +
                ":" +
                this.sharers[inx].isPayer +
                "],";
            }
            
            console.log("Sharer Arr:" + sharertext);
            */
        };
        if (this.checkData(iniConfig)) {
            this.totalSpend = iniConfig.Spend;
            if (!iniConfig.sharer) {
                this.sharers.push(new Sharer(this.totalSpend / 2));
                this.sharers.push(new Sharer(this.totalSpend / 2));
                this.sharers[0].sharerName = "Me";
                this.sharers[0].sharerSpend = iniConfig.Spend;
            }
            else {
                console.log("inside else, len:" + iniConfig.sharer.length);
                for (var iSh = 0; iSh < iniConfig.sharer.length; iSh++) {
                    console.log("iniConfig shaere:" + JSON.stringify(iniConfig.sharer[iSh]));
                    this.sharers.push(new Sharer(0).copyFrom(!iniConfig.sharer[iSh].iN ? "" : iniConfig.sharer[iSh].iN, !iniConfig.sharer[iSh].iS ? 0 : iniConfig.sharer[iSh].iS, !iniConfig.sharer[iSh].iO ? 0 : iniConfig.sharer[iSh].iO, !iniConfig.sharer[iSh].iU ? 0 : iniConfig.sharer[iSh].iU));
                    console.log("len:" + this.sharers.length);
                }
            }
            this.selfCheck();
            this.calculate();
        }
        else {
            console.log("Data incorrect!!");
        }
    }
    Betsu.prototype.calculate = function () {
        var pendingAmt = this.totalSpend;
        var pendingUsed = this.totalSpend;
        var unPreUsed = this.sharers.length;
        for (var iSp = 0; iSp < this.sharers.length; iSp++) {
            if (this.sharers[iSp].sharerUses > 0) {
                pendingUsed -= this.sharers[iSp].sharerUses;
                unPreUsed--;
            }
        }
        for (var iSp = 0; iSp < this.sharers.length; iSp++) {
            if (this.sharers[iSp].sharerUses <= 0) {
                this.sharers[iSp].sharerUses = pendingUsed / unPreUsed;
            }
        }
        for (var iSp = 0; iSp < this.sharers.length; iSp++) {
            this.sharers[iSp].sharerOwes =
                this.sharers[iSp].sharerUses - this.sharers[iSp].sharerSpend;
            if (this.sharers[iSp].sharerOwes > 0) {
                this.sharers[iSp].isPayer = true;
            }
        }
        for (var iSp = 0; iSp < this.sharers.length; iSp++) {
            if (this.sharers[iSp].isPayer) {
                var returnAmt = this.sharers[iSp].sharerOwes;
                var iP = 0;
                while (returnAmt > 0 && iP < this.sharers.length) {
                    var tmpAmt = 0;
                    if (!this.sharers[iP].isPayer) {
                        if (this.sharers[iP].sharerOwes + returnAmt <= 0) {
                            tmpAmt = returnAmt + this.sharers[iP].sharerOwes;
                            var tmpSettle = new Settle();
                            tmpSettle.fromSharer = iSp;
                            tmpSettle.toSharer = iP;
                            tmpSettle.settleAmt =
                                tmpAmt <= 0 ? returnAmt : this.sharers[iP].sharerOwes * -1;
                            this.settling.push(tmpSettle);
                            returnAmt -= tmpSettle.settleAmt;
                            this.sharers[iP].sharerOwes += tmpSettle.settleAmt;
                        }
                    }
                    iP++;
                }
            }
        }
        this.selfCheck();
    };
    Betsu.prototype.checkData = function (cfg) {
        if (cfg) {
            if (cfg.Spend && cfg.Spend > 0) {
                if (cfg.sharer && cfg.sharer.length > 0) {
                    var calcAmt = 0;
                    for (var iAmt = 0; iAmt < cfg.sharer.length; iAmt++) {
                        calcAmt += cfg.sharer[iAmt].iS ? cfg.sharer[iAmt].iS : 0;
                    }
                    if (calcAmt != cfg.Spend) {
                        console.log("Eventual Spend Amt " +
                            calcAmt +
                            " not matching with passed Spend value " +
                            cfg.Spend);
                        return false;
                    }
                    else {
                        console.log("BetsuData Checked OK");
                        return true;
                    }
                }
                return true;
            }
            else {
                console.log("Spend Amt missing!!");
                return false;
            }
        }
        else {
            console.log("BetsuData missing!!");
            return false;
        }
    };
    Betsu.prototype.updateBetsu = function (newInit) {
        if (newInit) {
            if (newInit.Spend) {
                this.totalSpend = newInit.Spend;
            }
            if (newInit.sharer && newInit.sharer.length > 0) {
                for (var iSu = 0; iSu < newInit.sharer.length; iSu++) {
                    this.updateSharer(newInit.sharer[iSu]);
                }
            }
            this.calculate();
            this.selfCheck();
        }
        return this;
    };
    Betsu.prototype.updateSharer = function (sharerInit, shIndex) {
        if (!sharerInit) {
            if (!shIndex) {
                for (var iSu = 0; iSu < this.sharers.length; iSu++) {
                    if (this.sharers[iSu].sharerName == sharerInit.iN) {
                        this.sharers[iSu].sharerSpend = sharerInit.iS;
                        this.sharers[iSu].sharerOwes = sharerInit.iO;
                        this.sharers[iSu].sharerUses = sharerInit.iU;
                        break;
                    }
                }
            }
            else {
                this.sharers[shIndex].sharerName = sharerInit.iN;
                this.sharers[shIndex].sharerSpend = sharerInit.iS;
                this.sharers[shIndex].sharerOwes = sharerInit.iO;
                this.sharers[shIndex].sharerUses = sharerInit.iU;
            }
            this.calculate();
            this.selfCheck();
        }
    };
    Betsu.prototype.updateSpend = function (newSpend) {
        if (newSpend) {
            this.totalSpend = newSpend;
            this.calculate();
            this.selfCheck();
        }
    };
    Betsu.minsharers = 2;
    return Betsu;
}());
