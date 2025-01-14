import { currentUrl,getCookie,requestPost } from "../../../../../Frontend/static/base/js/CodeTutor_base.js";
import { setupClickListenerList,makeHistoring ,makeHistoringMessage} from "./MainPage_functions.js";

const mainCookie = getCookie('csrftoken')

setupClickListenerList("userHistory", "userHistory-popup")

const historyBox = document.querySelector("#historyList")

historyBox.addEventListener("click", (event) => {
    if (event.target.className === "historyButton") {
        const historyFileName = event.target.closest('div');
        const url = `${currentUrl}api/getdatas/codetutor/obedia/`;
        const datas = {'filename': historyFileName.id};

        const historyPromise = new Promise(async (resolve) => {
            const response = await requestPost(url, mainCookie, datas);
            resolve(response);
        }).then((response) => {
            const datas = response["output"];
            const aiChat = datas["message_box"]["ai"];
            const userChat = datas["message_box"]["user"];
            const date = datas["date"];
            const time = datas["time"];
            const roleDic = {"ai-chat":"assistant","user-chat":"user"}
            const makeChatBox = (who,num,values) => `<div id='${who}' class='chat ${who}' data-chat='${who}_${num}' data-content='${roleDic[who]}'>${values}</div>`;

            const chatContents = document.querySelector('#chatcontents');
            chatContents.innerHTML = "";
            chatContents.dataset.filename = "없음";

            const checkButton = document.querySelector(".start-btn")
            checkButton.id = "start"
            checkButton.innerHTML = "학습시작"
            

            const combinedChats = [];
            const masterNum = Math.max(aiChat.length, userChat.length);



            for (let i = 0; i < masterNum; i++) {
                if (aiChat[i]) {
                    combinedChats.push(makeChatBox("ai-chat", i, aiChat[i]));
                }
                if (userChat[i]) {
                    combinedChats.push(makeChatBox("user-chat", i, userChat[i]));
                }
            }

            chatContents.innerHTML = combinedChats.join("");
            chatContents.innerHTML += `<div class="lastDate">${date}- ${time}</div>`
        });
    }
    else if (event.target.className === "historing") {
        const url = `${currentUrl}api/historycheck/codetutor/obedia/`
        const dataDiv = event.target.closest('div')
        const datas = dataDiv.id

        const historingPromise = new Promise ((resolve,reject) => {
            resolve()
        }).then(async(pass) => {
            const output = await requestPost(url,mainCookie,{"filename":datas})
            return output
        }).then(output => {
            const classBtn = document.querySelector('.start-btn')
            makeHistoring(classBtn.id,"end",dataDiv.dataset.chapter,dataDiv.dataset.topic,"chatcontents",dataDiv.id)
            makeHistoringMessage(output)
            
        })

    }
});

const requestMiniPost = async (url,cookies,datas) => {
    try {
        const response = await fetch(url,{
            method :"post",
            headers : {
                "Content-Type" : "application/json",
                "X-CSRFToken" :cookies
            },
            body : JSON.stringify(datas)
        })
        if (!response.ok) {
            console.log('서버 문제입니다.')
        }
        const dated = await response.json()
        return dated
    }
    catch (err) {
        console.log(err)
    }
}


window.addEventListener("beforeunload", async (event) => {
    const url = `${currentUrl}api/savetime/codetutor/obedia/`
    const datas = document.querySelector("#timer")
    try {
        const response = await requestMiniPost(url,mainCookie,{"time":datas.innerHTML})
    }
    catch (err) {
        pass
    }

})