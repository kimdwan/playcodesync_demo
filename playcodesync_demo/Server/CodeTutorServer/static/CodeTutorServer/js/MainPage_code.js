import { currentUrl,requestPost,getCookie  } from "../../../../../Frontend/static/base/js/CodeTutor_base.js";
import {showInputField , codeOutputs} from "./MainPage_functions.js"

const getCodeFunc = () => editor.getValue();
const runButton = document.querySelector('#run');
const mainCookie = getCookie('csrftoken');
const codeOutput = document.querySelector('#output');

document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key === 'Enter') {
        event.preventDefault();
        runButton.click();
    }
});

runButton.addEventListener('click', async (event) => {
    let getValue = getCodeFunc(); // 코드 에디터에서 코드를 가져옵니다.
    let userInput = null;

    // 코드에 input() 함수가 포함되어 있는지 확인
    if (getValue.includes('input(')) {
        userInput = await showInputField(); 
    }

    const url = `${currentUrl}backend/code/codetutor/caceres/`;
    const datas = { "code": getValue, "input": userInput };

    const response = await requestPost(url, mainCookie, datas);
    codeOutput.innerHTML = response["output"];
    codeOutputs()
});