import { currentUrl,requestGet,getCookie } from "../../../../../Frontend/static/base/js/CodeTutor_base.js" 

const mainCookies = getCookie('csrftoken')

export const makeUrl = (names) => `${currentUrl}api/${names}/codetutor/obedia/`

// 코드튜터에 웹소켓에 쓰임 
export const userText = () => editor.getValue()

function updateScroll(){
    let element = document.getElementById("chatcontents");
    element.scrollTop = element.scrollHeight;
}

export const makeChat = (who,num,values) => {
    const chatcontentsBox = document.querySelector('.chatcontents')
    const contentDic = {"ai-chat":"assistant","user-chat":"user"}
    const messageText = `<div id='${who}' class='chat ${who}' data-chat='${who}_${num}' data-content='${contentDic[who]}'>${values}</div>`
    
    chatcontentsBox.innerHTML += messageText
    updateScroll()
    
}

export const showInputField = () => {
    return new Promise((resolve) => {
        // 모달과 관련된 요소를 가져옵니다.
        const userInput = window.prompt("input값을 입력해주세요.")

        if (userInput !== null) {
            resolve(userInput)
        } else {
            resolve(null)
        }
    });
};

export const codeOutputs = () => {
    const codeToggle = document.getElementById("code-output-toggle")
    const currentBottom = window.getComputedStyle(codeToggle).bottom;
    if (currentBottom === "-505px") {
      codeToggle.style.bottom = "6.5%"
    }
  }

// book-section에 쓰임
export const bookSection = document.querySelector('#sidebar')

export const makeContents = (chap,dic) => {
    const contentsBox = document.querySelector("#book-section")
    const currentNum = document.querySelector("#topic-count-current")
    const currentHeadDic = {"chap":document.querySelector('#headChap'),'topic':document.querySelector('#headTopic')}
    const valueItemBox = [dic['origin_subject'],chap,dic['topic']]

    contentsBox.innerHTML = dic["contents"]
    currentNum.innerHTML = dic["numbers"]

    Object.keys(currentHeadDic).forEach((key,index) => {
        if (index === 0) {
            const text = valueItemBox[index] + " >"
            currentHeadDic[key].innerHTML = text
        }
        else {
            currentHeadDic[key].innerHTML = valueItemBox[index]
        }
    })
}

export const makeTopicContents = (topic,dic) => {
    const itemMain = [document.querySelector("#book-section"),document.querySelector("#topic-count-current"),document.querySelector('#headTopic')]
    const itemDic = [dic["contents"],dic["numbers"],topic]

    itemMain.forEach((item,index) => {
        item.innerHTML = itemDic[index]
    })
}

export const toggled = (topicList,upBtn) => {
    if (topicList.style.display === "none" || topicList.style.display === "") {
        topicList.style.display = "block";
        upBtn.classList.remove("fa-chevron-down");
        upBtn.classList.add("fa-chevron-up");
    } else {
        topicList.style.display = "none";
        upBtn.classList.remove("fa-chevron-up");
        upBtn.classList.add("fa-chevron-down");
    }
}

export function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    const currentLeft = window.getComputedStyle(sidebar).left;
    if (currentLeft === "-450px") {
      sidebar.style.left = "0px";
    } else {
      sidebar.style.left = "-450px";
    }
  }

// 폴더 자바스크립트 관련 함수들 

const makeList = (dics) => {
    const barnav = (index,filename,chapter,topic,boolean) => {
        let text = `<div id='${filename}' data-index='${index}' data-chapter='${chapter}' data-topic='${topic}'  class='historyNavBar'><div id='${chapter}' class='historyChapter'>${chapter}</div><div id='${topic}' class='historyTopic'>${topic}</div><div id='history_${boolean}' class='historyBool'>${boolean}</div>`

        if (boolean === "start") {
            text += `<button class='historing'>이어서 학습하기</button><hr>`
        }
        else {
            text += "<button class='historyButton'>기록보기</button><hr>"
        }

        return text
    }
    
    const historyListDiv = document.querySelector('#historyList')

    historyListDiv.innerHTML = ""

    dics.forEach((dic,index) => {
        const htmlItem = barnav(index,dic['filename'],dic['chapter'],dic['topic'],dic['time_bool'])
        historyListDiv.innerHTML += htmlItem
    })
}

const togglePopupList = async (elementId, display) => {
    let popup = document.getElementById(elementId);

    // display 인자에 따라 팝업 상태 설정
    if (display) {
        popup.style.display = "block";
        const url = `${currentUrl}api/getpoint/codetutor/obedia/`

        const popupPromise = new Promise((resolve,reject) => {
            resolve()
        }).then(async (pass) => {
            const response = await requestGet(url,mainCookies)
            return response["output"]
        }).then(response => {
            makeList(response)
            return 0
        }).then(  
            popup.style.opacity = "1"
        )
        
    } else {
        popup.style.opacity = "0";
        popup.style.display = "none";
        // 트랜지션 시간과 일치해야 합니다.
    }
  }

const positionPopupList = (buttonId, popupId) => {
let button = document.getElementById(buttonId);
let popup = document.getElementById(popupId);

popup.style.top = (button.offsetTop + button.offsetHeight + 18) + "px";
}
  

export const setupClickListenerList = (buttonId, popupId) => {
    document.getElementById(buttonId).addEventListener("click", function(event) {
        positionPopupList(buttonId, popupId);
  
      var computedStyle = window.getComputedStyle(document.getElementById(popupId));
      if (computedStyle.display === "none") {
          togglePopupList(popupId, true);
          event.stopPropagation(); // 부모 요소로의 이벤트 전파를 막습니다.
      }
    });
  }

// 데이터 폴더와 연관된 함수 
export const makeHistoring = (idName,idValue,dataChapter,dataTopic,containerClass,containerFilename) => {
    const idElement = document.querySelector(`#${idName}`)
    idElement.innerHTML ="학습종료"
    idElement.id = idValue
    idElement.dataset.chapter = `${dataChapter}     `
    idElement.dataset.topic = dataTopic
    const idContainer = document.querySelector(`#${containerClass}`)
    idContainer.dataset.filename = containerFilename
    
}

export const makeHistoringMessage = (messageBox) => {
    const messageHistoryBoxItem = {"ai-chat":"chat ai-chat","user-chat":"chat user-chat"}
    const roleBox = {"ai-chat":"assistant","user-chat":'user'}
    const messageHistoryBox = document.querySelector("#chatcontents")
    const chatBox = (idName,className,dataValue) => `<div id='${idName}' class='${className}' data-content='${roleBox[idName]}'>${dataValue}</div>`
    messageHistoryBox.innerHTML = ""
    const boxes = messageBox["output"]
    boxes.forEach(message => {
        const keyValue = Object.keys(message)
        const chatItem = chatBox(keyValue,messageHistoryBoxItem[keyValue],message[keyValue])
        messageHistoryBox.innerHTML += chatItem
    })
    const timeBox = `<div class="timeBox">${messageBox["date"]} ${messageBox["time"]}</div>`
    messageHistoryBox.innerHTML += timeBox

}
