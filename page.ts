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
        this.addEL(
          "click",
          (event: any):void => {
            console.log(this.elementName + " Clicked");
          }
        );
        this.addEL(
          "keyup",
          (event: any):void => {
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
            console.log(this.elementName + " Clicked");
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
    //RESTART HERE
  }
}

class Page {
  selfTracker: number;
  editSpend: Betsu = new Betsu(0);
  amtSpend: PageComponent = new PageComponent("amt1", "input");
  startButton: PageComponent = new PageComponent("butstart", "button");

  constructor() {
    this.selfTracker = 0;
    this.amtSpend.addEL(
      "click",
      (): void => {
        console.log("Start Clicked !!");
        this.editSpend.updateMe(parseFloat(this.amtSpend.val()));
        //console.log(parseFloat(amt1.value));
      }
    );
    this.maininit();
  }
  maininit(): void {
    var amt1: any,
      butstart: any,
      amt2: any,
      amt3: any,
      amt4,
      butplus: any,
      butminus: any;

    console.log("maininit function");
  }
}

document.addEventListener("DOMContentLoaded", function() {
  console.log("ready!");
  var thispage = new Page();
});
