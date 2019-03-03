"use strict";
//---------------------
var PageComponent = /** @class */ (function () {
    function PageComponent(elename, type) {
        var _this = this;
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
                this.addEL("keyup", function (event) {
                    event.preventDefault();
                    if (event.keyCode === 13) {
                        _this.element.click();
                    }
                });
                break;
            case "button":
                this.addEL("click", function (event) {
                    console.log(_this.elementName + " Button Clicked");
                });
                break;
            default:
                break;
        }
    }
    PageComponent.prototype.addEL = function (event, eventListener) {
        this.element.addEventListener(event, eventListener);
    };
    PageComponent.prototype.val = function () {
        switch (this.eletype) {
            case "input":
                return this.element.value;
                break;
            case "button":
                break;
            default:
                break;
        }
    };
    return PageComponent;
}());
var Page = /** @class */ (function () {
    //startButton: PageComponent = new PageComponent("butstart", "button");
    function Page(pgconfig) {
        var _this = this;
        this.editSpend = new Betsu(0);
        this.selfTracker = 0;
        if (pgconfig) {
            this.amtSpend = new PageComponent(pgconfig.spendAmountElement, "input");
            this.amtSpend.addEL("click", function () {
                console.log(pgconfig.spendAmountElement + " custom clicked !!");
                _this.editSpend.updateMe(parseFloat(_this.amtSpend.val()));
                //console.log(parseFloat(amt1.value));
            });
            //this.amtSpend = new PageComponent(pgconfig.sharerBlockNode, "input");
        }
        else {
            this.amtSpend = new PageComponent("dummynode", "input");
        }
        //this.maininit();
    }
    return Page;
}());
//-------------------------
document.addEventListener("DOMContentLoaded", function () {
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
            { iN: "Me", iS: 61, iU: 10 },
            { iN: "Sam" },
            { iN: "Tom" }
        ]
    });
});
