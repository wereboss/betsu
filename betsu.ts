interface GenElement {
  getNumValue?(): number;
  getStrValue?(): string;
  setNumValue?(): number;
  setStrValue?(): string;
}
interface SharerData {
  iN: string;
  iS: number;
  iO: number;
  iU: number;
}
interface BetsuData {
  Spend: number;
  sharer: SharerData[];
}
class Sharer {
  sharerName: string;
  sharerSpend: number; // the amount shelled out
  sharerOwes: number; // the amount finally owed
  sharerUses: number; // the amount consumed / share
  isPayer: boolean = false;
  constructor(sOwes?: number) {
    this.sharerName = "";
    this.sharerSpend = 0;
    this.sharerUses = 0;
    if (sOwes) {
      this.sharerOwes = sOwes;
    } else {
      this.sharerOwes = 0;
    }
    this.isPayer = false;
  }

  copyFrom(copySharer: Sharer): Sharer {
    this.sharerName = copySharer.sharerName;
    this.sharerSpend = copySharer.sharerSpend;
    this.sharerOwes = copySharer.sharerOwes;
    this.sharerUses = copySharer.sharerUses;
    return this;
  }
  copyFrom(iN: string, iS: number, iO: number, iU: number): Sharer {
    console.log("in copy:" + iN);
    this.sharerName = iN;
    this.sharerSpend = iS;
    this.sharerOwes = iO;
    this.sharerUses = iU;
    return this;
  }
}

class Settle {
  fromSharer: number;
  toSharer: number;
  settleAmt: number;
  constructor() {
    this.fromSharer = 0;
    this.toSharer = 0;
    this.settleAmt = 0;
  }
}

class Betsu {
  totalSpend: number = 0;
  sharers: Sharer[] = new Array();
  settling: Settle[] = new Array();
  static minsharers: number = 2;

  constructor(iniConfig: BetsuData) {
    if (this.checkData(iniConfig)) {
      this.totalSpend = iniConfig.Spend;
      if (!iniConfig.sharer) {
        this.sharers.push(new Sharer(this.totalSpend / 2));
        this.sharers.push(new Sharer(this.totalSpend / 2));
        this.sharers[0].sharerName = "Me";
        this.sharers[0].sharerSpend = iniConfig.Spend;
      } else {
        console.log("inside else, len:" + iniConfig.sharer.length);
        for (let iSh = 0; iSh < iniConfig.sharer.length; iSh++) {
          console.log("iniConfig shaere:" + JSON.stringify(iniConfig.sharer[iSh]));
          this.sharers.push(
            new Sharer(0).copyFrom(
              !iniConfig.sharer[iSh].iN ? "" : iniConfig.sharer[iSh].iN,
              !iniConfig.sharer[iSh].iS ? 0 : iniConfig.sharer[iSh].iS,
              !iniConfig.sharer[iSh].iO ? 0 : iniConfig.sharer[iSh].iO,
              !iniConfig.sharer[iSh].iU ? 0 : iniConfig.sharer[iSh].iU
            )
          );
          console.log("len:" + this.sharers.length);
        }
      }
      this.selfCheck();
      this.calculate();
    } else {
      console.log("Data incorrect!!");
    }
  }
  calculate(): void {
    var pendingAmt: number = this.totalSpend;
    var pendingUsed: number = this.totalSpend;
    var unPreUsed: number = this.sharers.length;
    for (let iSp = 0; iSp < this.sharers.length; iSp++) {
      if (this.sharers[iSp].sharerUses > 0) {
        pendingUsed -= this.sharers[iSp].sharerUses;
        unPreUsed--;
      }
    }
    for (let iSp = 0; iSp < this.sharers.length; iSp++) {
      if (this.sharers[iSp].sharerUses <= 0) {
        this.sharers[iSp].sharerUses = pendingUsed / unPreUsed;
      }
    }
    for (let iSp = 0; iSp < this.sharers.length; iSp++) {
      this.sharers[iSp].sharerOwes =
        this.sharers[iSp].sharerUses - this.sharers[iSp].sharerSpend;
      if (this.sharers[iSp].sharerOwes > 0) {
        this.sharers[iSp].isPayer = true;
      }
    }

    for (let iSp = 0; iSp < this.sharers.length; iSp++) {
      if (this.sharers[iSp].isPayer) {
        var returnAmt: number = this.sharers[iSp].sharerOwes;
        var iP: number = 0;
        while (returnAmt > 0 && iP < this.sharers.length) {
          var tmpAmt: number = 0;
          if (!this.sharers[iP].isPayer) {
            if (this.sharers[iP].sharerOwes + returnAmt <= 0) {
              tmpAmt = returnAmt + this.sharers[iP].sharerOwes;
              var tmpSettle: Settle = new Settle();
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
  }
  checkData(cfg: BetsuData): boolean {
    if (cfg) {
      if (cfg.Spend && cfg.Spend > 0) {
        if (cfg.sharer && cfg.sharer.length > 0) {
          var calcAmt: number = 0;
          for (let iAmt = 0; iAmt < cfg.sharer.length; iAmt++) {
            calcAmt += cfg.sharer[iAmt].iS ? cfg.sharer[iAmt].iS : 0;
          }
          if (calcAmt != cfg.Spend) {
            console.log(
              "Eventual Spend Amt " +
                calcAmt +
                " not matching with passed Spend value " +
                cfg.Spend
            );
            return false;
          } else {
            console.log("BetsuData Checked OK");
            return true;
          }
        }
        return true;
      } else {
        console.log("Spend Amt missing!!");
        return false;
      }
    } else {
      console.log("BetsuData missing!!");
      return false;
    }
  }
  updateBetsu(newInit: BetsuData): Betsu {
    if (newInit) {
      if (newInit.Spend) {
        this.totalSpend = newInit.Spend;
      }
      if (newInit.sharer && newInit.sharer.length > 0) {
        for (let iSu = 0; iSu < newInit.sharer.length; iSu++) {
          this.updateSharer(newInit.sharer[iSu]);
        }
      }
      this.calculate();
      this.selfCheck();
    }
    return this;
  }
  updateSharer(sharerInit: SharerData, shIndex?: number): void {
    if (!sharerInit) {
      if (!shIndex) {
        for (let iSu = 0; iSu < this.sharers.length; iSu++) {
          if (this.sharers[iSu].sharerName == sharerInit.iN) {
            this.sharers[iSu].sharerSpend = sharerInit.iS;
            this.sharers[iSu].sharerOwes = sharerInit.iO;
            this.sharers[iSu].sharerUses = sharerInit.iU;
            break;
          }
        }
      } else {
        this.sharers[shIndex].sharerName = sharerInit.iN;
        this.sharers[shIndex].sharerSpend = sharerInit.iS;
        this.sharers[shIndex].sharerOwes = sharerInit.iO;
        this.sharers[shIndex].sharerUses = sharerInit.iU;
      }

      this.calculate();
      this.selfCheck();
    }
  }
  updateSpend(newSpend: number): void {
    if (newSpend) {
      this.totalSpend = newSpend;
      this.calculate();
      this.selfCheck();
    }
  }
  selfCheck = (): void => {
    var sharertext: string = "";
    console.log(
      "Betsu: Total Spend:" +
        this.totalSpend +
        ",Sharers:" +
        this.sharers.length
    );
    console.log("Betsu Object:" + JSON.stringify(this, null, 4));
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
}
