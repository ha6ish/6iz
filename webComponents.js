"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextInput = exports.Button = exports.WebComponent = void 0;
// Step 1: Implement the WebComponent Base Class
var WebComponent = /** @class */ (function () {
    function WebComponent(selector) {
        this.selector = selector;
    }
    WebComponent.prototype.click = function () {
        console.log("Simulating click on component: ".concat(this.selector));
    };
    WebComponent.prototype.focus = function () {
        console.log("Simulating focus on component: ".concat(this.selector));
    };
    return WebComponent;
}());
exports.WebComponent = WebComponent;
// Step 2: Implement the Button Derived Class
var Button = /** @class */ (function (_super) {
    __extends(Button, _super);
    function Button() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // Overriding the click method
    Button.prototype.click = function () {
        console.log("Button specific message: The button is being clicked!");
        _super.prototype.click.call(this); // Using super to call the base class click() method
    };
    return Button;
}(WebComponent));
exports.Button = Button;
// Step 3: Implement the TextInput Derived Class
var TextInput = /** @class */ (function (_super) {
    __extends(TextInput, _super);
    function TextInput() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.value = "";
        return _this;
    }
    TextInput.prototype.enterText = function (text) {
        this.value = text;
        console.log("Simulating text entry: Entered \"".concat(this.value, "\" into ").concat(this.selector));
    };
    return TextInput;
}(WebComponent));
exports.TextInput = TextInput;
// Step 4: Testing the Components
function testComponents() {
    var submitBtn = new Button("button#submit");
    var emailInput = new TextInput("input[name='email']");
    submitBtn.click();
    emailInput.enterText("test@playwright.dev");
}
testComponents();
