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

import { Settle } from "./betsu";
let oSettle = new Settle();
oSettle.createSharer(51,"Me",5.5);
oSettle.createSharer(50,"You",2.5);
oSettle.createSharer(0,"they");
oSettle.createSharer(0,"others",1);
oSettle.createSharer(0,"someone",1);