//---------------------
class PageComponent {
  element: any;
  elementName: string;
  eletype: string;

  constructor(elename: string, type: string) {
    this.elementName = elename;
    this.eletype = type;
    this.element = document.getElementById(this.elementName);
    switch (type) {
      case "input":
        /*
        this.addEL(
          "click",
          (event: any): void => {
            console.log(this.elementName + " input Clicked");
          }
        );
        */
        this.addEL(
          "keyup",
          (event: any): void => {
            event.preventDefault();
            if (event.keyCode === 13) {
              this.element.click();
            }
          }
        );
        break;
      case "button":
        this.addEL(
          "click",
          (event: any): void => {
            console.log(this.elementName + " Button Clicked");
          }
        );
        break;

      default:
        break;
    }
  }
  addEL(event: string, eventListener: void): void {
    this.element.addEventListener(event, eventListener);
  }
  val(): any {
    switch (this.eletype) {
      case "input":
        return this.element.value;
        break;
      case "button":
        break;

      default:
        break;
    }
  }
}
interface PageConfig {
  spendAmountElement: string;
  sharerBlockNode: string;
}

class Page {
  selfTracker: number;
  editSpend: Betsu = new Betsu(0);
  amtSpend: PageComponent;
  sharersArr: PageComponent[];
  //startButton: PageComponent = new PageComponent("butstart", "button");

  constructor(pgconfig?: PageConfig) {
    this.selfTracker = 0;
    if (pgconfig) {
      this.amtSpend = new PageComponent(pgconfig.spendAmountElement, "input");
      this.amtSpend.addEL(
        "click",
        (): void => {
          console.log(pgconfig.spendAmountElement + " custom clicked !!");
          this.editSpend.updateMe(parseFloat(this.amtSpend.val()));
          //console.log(parseFloat(amt1.value));
        }
      );
      //this.amtSpend = new PageComponent(pgconfig.sharerBlockNode, "input");
    } else {
      this.amtSpend = new PageComponent("dummynode", "input");
    }
    //this.maininit();
  }
}
//-------------------------

document.addEventListener("DOMContentLoaded", function() {
  console.log("ready!");
  /*
  var thispage = new Page({
    spendAmountElement: "amt1",
    sharerBlockNode: "sharers"
  });
  */
  var tmpBetsu = new Betsu({
    Spend: 61,
    sharer: [
      { iN: "Me",iS:61, iU: 10 },
      { iN: "Sam"},
      { iN: "Tom"}
    ]
  });
});
