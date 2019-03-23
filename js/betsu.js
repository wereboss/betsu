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
        console.log("Settle:Constructor");
        this.arrSharers = new Array();
        this.arrSettlement = new Array();
    }
    Settle.prototype.addSharer = function (oSh) {
        console.log("Settle:addSharer");
        this.arrSharers.push(oSh);
        this.genSettlement();
    };
    Settle.prototype.removeSharer = function (nId) {
        console.log("Settle:removeSharer");
        var oRemoved = this.arrSharers.splice(nId, 1);
        this.genSettlement();
    };
    Settle.prototype.updateSharer = function (nId, oSh) {
        console.log("Settle:updateSharer");
        var arrSharer = this.arrSharers[nId];
        arrSharer.nSpend = oSh.nSpend;
        arrSharer.nShare = oSh.nShare;
        this.genSettlement();
    };
    Settle.prototype.genSettlement = function () {
        console.log("Settle:genSettlement:Start");
        console.log("Settle:genSettlement:Sharers:" + this.arrSharers.length);
        console.log("Settle:genSettlement:Settlements:" + this.arrSettlement.length);
    };
    return Settle;
}());
exports.Settle = Settle;
var Sharer = /** @class */ (function () {
    function Sharer(nSp, nSh) {
        this.nSpend = 0;
        this.nShare = 0;
        this.nSpend = nSp;
        if (nSh) {
            this.nShare = nSh;
        }
    }
    return Sharer;
}());
//# sourceMappingURL=betsu.js.map