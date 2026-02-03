function launchBrowser(browserName){
//else if condition
if(browserName === "Chrome"){
    console.log("launch the chrome")
}else{

    console.log("launch other browser")
}
//switch condition
}
function runTest(testType){
switch(testType){
    case "smoke":
        console.log("running smoke test")
        break;
    case "sanity":
        console.log("running sanity test")
        break;
    case "regression":
        console.log("running regration")
        break;
    default:
        console.log("running default smoke test")
}

}
launchBrowser("chrome");
runTest("sanity");