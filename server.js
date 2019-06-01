"use strict";
/*
var sUser = require('./SampleUser.js');
console.log("ready!");
let user = new sUser.SampleUser();
console.log("User:" + user.tempStr);
*/
//var cBetsu = require('./betsu.js');
/*
var tmpBetsu = new cBetsu.Betsu({
  Spend: 51,
  sharer: [{ iN: "Me", iS: 51 }, { iN: "Sam"}]
});
*/
Object.defineProperty(exports, "__esModule", { value: true });
var betsu_1 = require("./betsu");
var oSettle = new betsu_1.Settle();
oSettle.createSharer(51, "Me", 5.5);
oSettle.createSharer(50, "You", 2.5);
oSettle.createSharer(0, "they", 1);
oSettle.createSharer(0, "others", 1);
oSettle.createSharer(0, "someone");
oSettle.removeSharer(2);
oSettle.updateSharer(2, 5, "o2");
//# sourceMappingURL=server.js.map
//sample