"use strict";
var PageComponent = /** @class */ (function () {
    function PageComponent(elename, type) {
        var _this = this;
        this.elementName = elename;
        this.eletype = type;
        this.element = document.getElementById(this.elementName);
        switch (type) {
            case "input":
                this.addEL("click", function (event) {
                    console.log(_this.elementName + " Clicked");
                });
                this.addEL("keyup", function (event) {
                    event.preventDefault();
                    if (event.keyCode === 13) {
                        _this.element.click();
                    }
                });
                break;
            case "button":
                this.addEL("click", function (event) {
                    console.log(_this.elementName + " Clicked");
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
        //RESTART HERE
    };
    return PageComponent;
}());
var Page = /** @class */ (function () {
    function Page() {
        var _this = this;
        this.editSpend = new Betsu(0);
        this.amtSpend = new PageComponent("amt1", "input");
        this.startButton = new PageComponent("butstart", "button");
        this.selfTracker = 0;
        this.amtSpend.addEL("click", function () {
            console.log("Start Clicked !!");
            _this.editSpend.updateMe(parseFloat(_this.amtSpend.val()));
            //console.log(parseFloat(amt1.value));
        });
        this.maininit();
    }
    Page.prototype.maininit = function () {
        var amt1, butstart, amt2, amt3, amt4, butplus, butminus;
        console.log("maininit function");
    };
    return Page;
}());
document.addEventListener("DOMContentLoaded", function () {
    console.log("ready!");
    var thispage = new Page();
});
