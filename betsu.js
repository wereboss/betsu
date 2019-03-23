"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Settlement = /** @class */ (function () {
    function Settlement(oF, oT, nP) {
        this.oFromSharer = oF;
        this.oToSharer = oT;
        this.nPayment = nP;
    }
    return Settlement;
}());
var Settle = /** @class */ (function () {
    function Settle() {
        this.arrSharers = new Array();
        this.arrSettlement = new Array();
        this.arrTo = new Array();
        this.arrFrom = new Array();
        //console.log("Settle:Constructor");
        this.arrSharers = new Array();
        this.arrSettlement = new Array();
    }
    Settle.prototype.addSharer = function (oSh) {
        //console.log("Settle:addSharer");
        this.arrSharers.push(oSh);
        this.genSettlement();
    };
    Settle.prototype.removeSharer = function (nId) {
        //console.log("Settle:removeSharer");
        var oRemoved = this.arrSharers.splice(nId, 1);
        this.genSettlement();
    };
    Settle.prototype.updateSharer = function (nId, nSp, sN, nSh) {
        //console.log("Settle:updateSharer");
        var arrSharer = this.arrSharers[nId];
        arrSharer.nSpend = nSp;
        if (nSh) {
            arrSharer.nShare = nSh;
            arrSharer.bPreShare = true;
        }
        if (sN) {
            arrSharer.sName = sN;
        }
        this.genSettlement();
    };
    Settle.prototype.createSharer = function (nSp, sN, nSh) {
        var oSharer = new Sharer(nSp, sN, nSh);
        this.addSharer(oSharer);
        return oSharer;
    };
    Settle.prototype.genSettlement = function () {
        var _this = this;
        //clean up
        this.arrSettlement = new Array();
        this.arrTo = new Array();
        this.arrFrom = new Array();
        //start anew
        if (this.arrSharers.length > 1) {
            console.log("Settle:genSettlement:Start -----");
            //console.log("Settle:genSettlement:Processing...");
            var totSp_1 = 0;
            var totSh_1 = this.arrSharers.length;
            //Calculate per person share
            this.arrSharers.forEach(function (eShCalc) {
                totSp_1 += eShCalc.nSpend;
                if (eShCalc.bPreShare) {
                    totSh_1--;
                    totSp_1 -= eShCalc.nShare;
                }
            });
            var perShare_1 = parseFloat((totSp_1 / totSh_1).toFixed(2));
            console.log(totSp_1);
            console.log(totSh_1);
            console.log(perShare_1);
            this.arrSharers.forEach(function (eShUpd) {
                if (!eShUpd.bPreShare) {
                    eShUpd.nShare = perShare_1;
                }
                eShUpd.nRecv = _this.toFixedNum(eShUpd.nSpend - eShUpd.nShare);
                if (eShUpd.nRecv < 0) {
                    _this.arrFrom.push(eShUpd);
                }
                else if (!(eShUpd.nRecv == 0)) {
                    _this.arrTo.push(eShUpd);
                }
            });
            this.arrFrom.sort(function (a, b) {
                return a.nRecv - b.nRecv;
            });
            this.arrTo.sort(function (a, b) {
                return a.nRecv - b.nRecv;
            });
            console.log(this.arrSharers);
            var currTo = 0;
            var currFrom = 0;
            //console.log("To List:" + JSON.stringify(this.arrTo, null, 4));
            //console.log("From List:" + JSON.stringify(this.arrFrom, null, 4));
            //To are buckets, From are fillers
            //for filling each To's bucket
            while (currTo < this.arrTo.length) {
                currFrom = this.fillBucket(currTo, currFrom);
                if (currFrom < 0) {
                    //All From's exhausted and bucket unfille. some problem with input
                    this.arrSettlement = new Array();
                    this.arrTo = new Array();
                    this.arrFrom = new Array();
                    console.log("Incorrect Input:ending genSettlement");
                    break;
                }
                currTo++;
            }
            //console.log(JSON.stringify(this.arrSharers, null, 4));
            console.log(this.arrSettlement);
            console.log("Settle:genSettlement:End -----");
        }
    };
    Settle.prototype.fillBucket = function (nToIndex, nFrIndex) {
        var newFrom = nFrIndex;
        var presentBucket = this.toFixedNum(this.arrTo[nToIndex].nRecv);
        while (presentBucket > 0 && newFrom < this.arrFrom.length) {
            var presentFiller = this.toFixedNum(Math.abs(this.arrFrom[newFrom].nRecv));
            if (presentFiller <= presentBucket) {
                //this From can Pay this Bucket
                if (presentFiller == presentBucket ||
                    presentBucket - presentFiller < 0.02) {
                    //this bucket can be fully paid with nothing left with From
                    var oSettle = new Settlement(this.arrFrom[newFrom], this.arrTo[nToIndex], presentBucket);
                    this.arrSettlement.push(oSettle);
                    presentBucket = 0;
                }
                else {
                    //this bucket is partially paid, without anything left with From
                    var oSettle = new Settlement(this.arrFrom[newFrom], this.arrTo[nToIndex], presentFiller);
                    this.arrSettlement.push(oSettle);
                    presentBucket = this.toFixedNum(presentBucket - presentFiller);
                }
                newFrom++;
            }
            else {
                //this From can  pay the Bucket and still left (no change to From).
                var oSettle = new Settlement(this.arrFrom[newFrom], this.arrTo[nToIndex], presentBucket);
                this.arrSettlement.push(oSettle);
                //console.log("Reuse From:" + this.arrFrom[newFrom].sName + ",Recv:" + this.arrFrom[newFrom].nRecv);
                this.arrFrom[newFrom].nRecv = (-1) * this.toFixedNum(presentFiller - presentBucket);
                //console.log("Reuse From:" + this.arrFrom[newFrom].sName + ", nRecv:" + this.arrFrom[newFrom].nRecv);
                presentBucket = 0;
            }
        }
        newFrom = presentBucket > 0 ? -1 : newFrom;
        return newFrom;
    };
    Settle.prototype.toFixedNum = function (nNum) {
        return parseFloat(nNum.toFixed(2));
    };
    return Settle;
}());
exports.Settle = Settle;
var Sharer = /** @class */ (function () {
    function Sharer(nSp, sN, nSh) {
        this.nSpend = 0;
        this.nShare = 0;
        this.bPreShare = false;
        this.nRecv = 0;
        this.sName = "";
        this.nSpend = nSp;
        if (nSh) {
            this.nShare = nSh;
            this.bPreShare = true;
        }
        if (sN) {
            this.sName = sN;
        }
    }
    Sharer.prototype.asString = function () {
        return "Sharer[" + JSON.stringify(this) + "]\n";
    };
    return Sharer;
}());
//# sourceMappingURL=betsu.js.map