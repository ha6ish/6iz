// Function to reverse a string
function reverseString(str) {
  //Convert string to array of characters
  let chars = str.split("");

  // Loop in reverse and concatenate
  let reversed = "";
  for (let i = chars.length - 1; i >= 0; i--) {
    reversed += chars[i];
  }

  //Return the reversed string
  return reversed;
}

// Function to check if a string is a palindrome
function isPalindrome(str) {
  // Clean the string (optional: ignore spaces and case)
  let cleaned = str.replace(/\s+/g, "").toLowerCase();

  // reversed string
  let reversed = reverseString(cleaned);

  // Step 3: Compare original and reversed
  if (cleaned === reversed) {
    return true; // It's a palindrome
  } else {
    return false; // Not a palindrome
  }
}

let str1 = "madam";
let str2 = "hello";

console.log("Reversed str1:", reverseString(str1)); // "madam"
console.log("Is str1 palindrome?", isPalindrome(str1)); // true

console.log("Reversed str2:", reverseString(str2)); // "olleh"
console.log("Is str2 palindrome?", isPalindrome(str2)); // false
