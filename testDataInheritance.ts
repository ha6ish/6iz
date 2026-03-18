// 1. Create a superclass as TestData
export class TestData {
    // Implement enterCredentials method
    enterCredentials(): void {
        console.log("TestData: Entering credentials to login...");
    }

    // Implement navigateToHomePage method
    navigateToHomePage(): void {
        console.log("TestData: Navigating to the home page...");
    }
}

// 2. Create a subclass LoginTestData that inherits from TestData
export class LoginTestData extends TestData {
    // Method specific to LoginTestData
    enterUsername(): void {
        console.log("LoginTestData: Entering username...");
    }

    // Method specific to LoginTestData
    enterPassword(): void {
        console.log("LoginTestData: Entering password...");
    }
}

// 3. Demonstrate the concept by creating objects and calling methods
const loginData = new LoginTestData();

loginData.enterCredentials();   // Inherited from TestData
loginData.navigateToHomePage(); // Inherited from TestData
loginData.enterUsername();      // Specific to LoginTestData
loginData.enterPassword();      // Specific to LoginTestData