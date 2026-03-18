// Step 1: Implement the WebComponent Base Class
export class WebComponent {
    selector: string;

    constructor(selector: string) {
        this.selector = selector;
    }

    click(): void {
        console.log(`Simulating click on component: ${this.selector}`);
    }

    focus(): void {
        console.log(`Simulating focus on component: ${this.selector}`);
    }
}

// Step 2: Implement the Button Derived Class
export class Button extends WebComponent {
    
    // Overriding the click method
    click(): void {
        console.log("Button specific message: The button is being clicked!");
        super.click(); // Using super to call the base class click() method
    }
}

// Step 3: Implement the TextInput Derived Class
export class TextInput extends WebComponent {
    value: string = "";

    enterText(text: string): void {
        this.value = text;
        console.log(`Simulating text entry: Entered "${this.value}" into ${this.selector}`);
    }
}

// Step 4: Testing the Components
function testComponents(): void {
    const submitBtn = new Button("button#submit");
    const emailInput = new TextInput("input[name='email']");

    submitBtn.click();
    emailInput.enterText("test@playwright.dev");
}

testComponents();