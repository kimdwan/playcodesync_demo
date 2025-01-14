import { currentUrl,requestPost,getCookie,requestUpdate } from "../../../../../Frontend/static/base/js/CodeTutor_base.js" 
import { makeChat,userText } from "./MainPage_functions.js";


// 웹소켓 연결 설정 
const urlList = currentUrl.split('/')
const websocketUrl = "ws://" + urlList[2] + "/ws/" + urlList.slice(3,5).join('/') +"/" ;
const socket = new WebSocket(websocketUrl);

const footerItme = document.querySelector('.footer-right')
const mainCookie = getCookie('csrftoken')
let countNum = 0

const websocketEvent = (textName,countNum,text,message) => {
    makeChat(textName,countNum,text)    
    socket.send(JSON.stringify({'message':message}))
}


window.addEventListener('keypress',(event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        const textAll = Array.from(document.querySelectorAll(".chat")).map(chat => ({"role":chat.dataset.content,"content":chat.innerHTML}))
        const text = userText()
        editor.setValue("")
        countNum += 1
        const filename = document.querySelector('#chatcontents').dataset.filename
        const title =  document.querySelector("#headSub").innerHTML.split(" ")[0]
        websocketEvent('user-chat',countNum,text,{"num":1,"message":text,"start":"no","filename":filename,"name":"user-chat","allText":textAll,"sub":title})
    }
})

footerItme.addEventListener('click', (event) => {
    if (event.target.id === "start") {
        // 여기서 말해줘
        const title =  document.querySelector("#headSub").innerHTML.split(" ")[0]
        const text = document.querySelector('#headTopic')
        // `파이썬 ${text.innerHTML} 수업을 시작해주세요.` 고딩 
        //"안녕하세요." - 중딩 
        const textValue =  title === "파이썬일반" ? `파이썬 ${text.innerHTML} 수업을 시작해주세요.` : "안녕하세요"
        socket.send(JSON.stringify({'message':{"num":1,"message":textValue,"start":"yes","name":"start","filename":"없음","sub":title}}))
        const itemDic = {'chapter':document.querySelector('#headChap'),"topic":document.querySelector('#headTopic')}
        const textDic = {"chapter":itemDic["chapter"].innerHTML,"topic":itemDic['topic'].innerHTML,"boolean":"start"}
        const url = `${currentUrl}api/checkpoint/codetutor/obedia/`
        const chatPage = document.querySelector(".chatcontents")
        chatPage.innerHTML = ""

        const startPromise = new Promise ((resolve,reject) => {
            resolve()
        }).then(async(pass) => {
            const outputs = await requestPost(url,mainCookie,textDic)
            return 0
        }).then(pass => {
            const startButton = document.querySelector('#start')
            startButton.innerHTML = "학습종료"
            startButton.id = "end"
            startButton.dataset.chapter = textDic["chapter"];
            startButton.dataset.topic = textDic["topic"];
            return 0
        }).then(async(pass) => {
            textDic["message_box"] = document.querySelector("#ai-chat").innerHTML
            const url2 = `${currentUrl}api/historydata/codetutor/obedia/`
            const outputs = await requestPost(url2,mainCookie,textDic)
            return outputs
        }).then(output => {
            const outputData = output['output']
            chatPage.dataset.filename = outputData
        })
    }
    else if (event.target.id === "end") {
        alert('학습이 종료되었습니다.')
        const url = `${currentUrl}api/checkpoint/codetutor/obedia/`
        const url2 = `${currentUrl}api/checkdatas/codetutor/obedia/`
        const endButton = document.querySelector('#end')
        const datas = {'chapter':endButton.getAttribute('data-chapter'),'topic':endButton.getAttribute('data-topic'),"boolean":'end'}
        const messageDataUser = Array.from(document.querySelectorAll("#user-chat"))
        const messageDataAi = Array.from(document.querySelectorAll("#ai-chat"))
        const messageDataUserBox = messageDataUser.map(datas => datas.innerHTML)
        const messageDataAiBox = messageDataAi.map(datas => datas.innerHTML)
        const datas2 = {"chapter":datas["chapter"],"topic":datas["topic"],"message_box":{"ai":messageDataAiBox,"user":messageDataUserBox}}

        const endPromise = new Promise ((reslove,reject) => {
            reslove()
        }).then(async (pass) => {
            const response = await requestPost(url,mainCookie,datas)
            const response2 = await requestPost(url2,mainCookie,datas2)
            console.log(response)
            return 0
        }).then(pass => {
            const chatcontents = document.querySelector(".chatcontents")
            const filename = document.querySelector('#chatcontents')
            filename.dataset.filename = "없음"
            chatcontents.innerHTML = ""
            endButton.innerHTML = "학습시작"
            endButton.id = "start"
        })
    }
    else if (event.target.id === "check") {
        event.preventDefault();
        const title =  document.querySelector("#headSub").innerHTML.split(" ")[0]
        const textAll = Array.from(document.querySelectorAll(".chat")).map(chat => ({"role":chat.dataset.content,"content":chat.innerHTML}))
        const text = userText()
        editor.setValue("")
        countNum += 1
        const filename = document.querySelector('#chatcontents').dataset.filename
        websocketEvent('user-chat',countNum,text,{"num":1,"message":text,"start":"no","filename":filename,"name":"user-chat","allText":textAll,"sub":title})
    }
})

socket.onmessage = async (event) => {

    try {
        const data = await JSON.parse(event.data);
        makeChat(data["name"],countNum,data['message']["output"]) 

        //console.log('Parsed data:', data);
    } catch (error) {
        //console.error('Error parsing data:', error);

    }
};


