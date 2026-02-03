//split
let s = "hello world"
let word = s.split(" ")
console.log(word)

//find the last word of array
let words = ["hellow", "world"];
let lastword = words[words.length -1]
console.log(lastword)

//clcualte the length
let m = "hello world"
let len = m.length;
console.log("total length of character "+ len);

//trimming
let text = "   hello world   ";
let trimmedText = text.trim();
let clrLow = trimmedText.toUpperCase();//all in te same case
console.log("upper case",`"${clrLow}"`)

console.log("Before trim:", `"${text}"`);
console.log("After trim:", `"${trimmedText}"`);

//split the str word
let sentance = "welcome to jumanji"
let wordds = sentance.split(" ")
//let lword = wordds[sentance.length -1];//last word
console.log(wordds)
//console.log(lword)
//last word
let snet = " welcome to the jungle"
let jung = sentance.split(" ")
let cle = jung[words.length - 1];

console.log("Last word:", cle);
let lengthoflastword = lastword.length;//length of last word
console.log("Last word:", lastword);
console.log("Length of last word:", lengthoflastword);

//sorting
let sortt = "hello jarvis";
let chars = sortt.split("");
chars.sort();
let setSort = chars.join("")
console.log("before",chars)
console.log("after",setSort)
//sort and result

function compareSortedStrings(str1, str2) {
  //(trim spaces and lowercase)
  let s1 = str1.trim().toLowerCase().replace(/\s+/g, '');
  let s2 = str2.trim().toLowerCase().replace(/\s+/g, '');

  //Split into characters, sort, and join back
  s1 = s1.split("").sort().join("");
  s2 = s2.split("").sort().join("");

  //Compare the sorted strings
  if (s1 === s2) {
    return true; // strings have same characters
  } else {
    return false;
  }
}

console.log(compareSortedStrings("listen", "silent")); // true
console.log(compareSortedStrings("hello", "world"));   // false



