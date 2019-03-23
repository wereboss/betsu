class Settlement {
  oFromSharer: Sharer;
  oToSharer: Sharer;
  nPayment: number;

  constructor(oF: Sharer, oT: Sharer, nP: number) {
    this.oFromSharer = oF;
    this.oToSharer = oT;
    this.nPayment = nP;
  }
}
class Settle {
  arrSharers: Sharer[] = new Array();
  arrSettlement: Settlement[] = new Array();
  private arrTo: Sharer[] = new Array();
  private arrFrom: Sharer[] = new Array();

  constructor() {
    //console.log("Settle:Constructor");
    this.arrSharers = new Array();
    this.arrSettlement = new Array();
  }
  addSharer(oSh: Sharer) {
    //console.log("Settle:addSharer");
    this.arrSharers.push(oSh);
    this.genSettlement();
  }
  removeSharer(nId: number): void {
    //console.log("Settle:removeSharer");
    let oRemoved = this.arrSharers.splice(nId, 1);
    this.genSettlement();
  }
  updateSharer(nId: number, nSp: number, sN?: string, nSh?: number) {
    //console.log("Settle:updateSharer");
    let arrSharer = this.arrSharers[nId];
    arrSharer.nSpend = nSp;
    if(nSh){arrSharer.nShare = nSh;arrSharer.bPreShare=true;}
    if(sN){arrSharer.sName = sN;}
    this.genSettlement();
  }
  createSharer(nSp: number, sN?: string, nSh?: number): Sharer {
    let oSharer = new Sharer(nSp, sN, nSh);
    this.addSharer(oSharer);
    return oSharer;
  }
  genSettlement() {
    //clean up
    this.arrSettlement = new Array();
    this.arrTo = new Array();
    this.arrFrom = new Array();
    //start anew
    if (this.arrSharers.length > 1) {
      console.log("Settle:genSettlement:Start -----");
      //console.log("Settle:genSettlement:Processing...");
      let totSp: number = 0;
      let totSh: number = this.arrSharers.length;

      //Calculate per person share
      this.arrSharers.forEach(eShCalc => {
        totSp += eShCalc.nSpend;
        if (eShCalc.bPreShare) {
          totSh--;
          totSp -= eShCalc.nShare;
        }
      });

      let perShare: number = parseFloat((totSp / totSh).toFixed(2));
      console.log(totSp);
      console.log(totSh);
      console.log(perShare);
      this.arrSharers.forEach(eShUpd => {
        if (!eShUpd.bPreShare) {
          eShUpd.nShare = perShare;
        }
        eShUpd.nRecv = this.toFixedNum(eShUpd.nSpend - eShUpd.nShare);
        if (eShUpd.nRecv < 0) {
          this.arrFrom.push(eShUpd);
        } else if (!(eShUpd.nRecv == 0)) {
          this.arrTo.push(eShUpd);
        }
      });
      this.arrFrom.sort(
        (a, b): number => {
          return a.nRecv - b.nRecv;
        }
      );
      this.arrTo.sort(
        (a, b): number => {
          return a.nRecv - b.nRecv;
        }
      );

      console.log(this.arrSharers);
      let currTo: number = 0;
      let currFrom: number = 0;

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
  }
  fillBucket(nToIndex: number, nFrIndex: number): number {
    let newFrom = nFrIndex;
    let presentBucket: number = this.toFixedNum(this.arrTo[nToIndex].nRecv);
    while (presentBucket > 0 && newFrom < this.arrFrom.length) {
      let presentFiller: number = this.toFixedNum(
        Math.abs(this.arrFrom[newFrom].nRecv)
      );
      if (presentFiller <= presentBucket) {
        //this From can Pay this Bucket
        if (
          presentFiller == presentBucket ||
          presentBucket - presentFiller < 0.02
        ) {
          //this bucket can be fully paid with nothing left with From
          let oSettle = new Settlement(
            this.arrFrom[newFrom],
            this.arrTo[nToIndex],
            presentBucket
          );
          this.arrSettlement.push(oSettle);
          presentBucket = 0;
        } else {
          //this bucket is partially paid, without anything left with From
          let oSettle = new Settlement(
            this.arrFrom[newFrom],
            this.arrTo[nToIndex],
            presentFiller
          );
          this.arrSettlement.push(oSettle);
          presentBucket = this.toFixedNum(presentBucket - presentFiller);
        }
        newFrom++;
      } else {
        //this From can  pay the Bucket and still left (no change to From).
        let oSettle = new Settlement(
          this.arrFrom[newFrom],
          this.arrTo[nToIndex],
          presentBucket
        );
        this.arrSettlement.push(oSettle);
        //console.log("Reuse From:" + this.arrFrom[newFrom].sName + ",Recv:" + this.arrFrom[newFrom].nRecv);
        this.arrFrom[newFrom].nRecv = (-1) * this.toFixedNum(
          presentFiller - presentBucket
        );
        //console.log("Reuse From:" + this.arrFrom[newFrom].sName + ", nRecv:" + this.arrFrom[newFrom].nRecv);
        presentBucket = 0;
      }
    }
    newFrom = presentBucket > 0 ? -1 : newFrom;
    return newFrom;
  }
  toFixedNum(nNum: number): number {
    return parseFloat(nNum.toFixed(2));
  }
}
class Sharer {
  nSpend: number = 0;
  nShare: number = 0;
  bPreShare: boolean = false;
  nRecv: number = 0;
  sName: string = "";
  constructor(nSp: number, sN?: string, nSh?: number) {
    this.nSpend = nSp;
    if (nSh) {
      this.nShare = nSh;
      this.bPreShare = true;
    }
    if (sN) {
      this.sName = sN;
    }
  }
  asString(): string {
    return "Sharer[" + JSON.stringify(this) + "]\n";
  }
}

export { Settle };
