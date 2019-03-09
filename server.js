/*
var sUser = require('./SampleUser.js');
console.log("ready!");
let user = new sUser.SampleUser();
console.log("User:" + user.tempStr);
*/
var cBetsu = require('./betsu.js');
var tmpBetsu = new cBetsu.Betsu({
  Spend: 51,
  sharer: [{ iN: "Me", iS: 51 }, { iN: "Sam"}]
});
