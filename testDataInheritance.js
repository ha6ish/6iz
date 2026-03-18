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
exports.LoginTestData = exports.TestData = void 0;
// 1. Create a superclass as TestData
var TestData = /** @class */ (function () {
    function TestData() {
    }
    // Implement enterCredentials method
    TestData.prototype.enterCredentials = function () {
        console.log("TestData: Entering credentials to login...");
    };
    // Implement navigateToHomePage method
    TestData.prototype.navigateToHomePage = function () {
        console.log("TestData: Navigating to the home page...");
    };
    return TestData;
}());
exports.TestData = TestData;
// 2. Create a subclass LoginTestData that inherits from TestData
var LoginTestData = /** @class */ (function (_super) {
    __extends(LoginTestData, _super);
    function LoginTestData() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // Method specific to LoginTestData
    LoginTestData.prototype.enterUsername = function () {
        console.log("LoginTestData: Entering username...");
    };
    // Method specific to LoginTestData
    LoginTestData.prototype.enterPassword = function () {
        console.log("LoginTestData: Entering password...");
    };
    return LoginTestData;
}(TestData));
exports.LoginTestData = LoginTestData;
// 3. Demonstrate the concept by creating objects and calling methods
var loginData = new LoginTestData();
loginData.enterCredentials(); // Inherited from TestData
loginData.navigateToHomePage(); // Inherited from TestData
loginData.enterUsername(); // Specific to LoginTestData
loginData.enterPassword(); // Specific to LoginTestData
