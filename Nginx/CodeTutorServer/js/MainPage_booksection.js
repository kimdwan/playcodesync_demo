import { getCookie,requestGet,requestPost,currentUrl } from "../../../../../Frontend/static/base/js/CodeTutor_base.js";
import { makeUrl,bookSection, makeContents, makeTopicContents, toggled,toggleSidebar } from "./MainPage_functions.js";

const mainCookies = getCookie('csrftoken')
const contentsSection = document.querySelector("#book-section")

bookSection.addEventListener('click', (event) => {
    if (event.target.id === "chapterName" || event.target.id === "chapterToggleId") {
        const chapterName = event.target.closest('div').getAttribute('data-chapter')
        const datas = {"chapter":chapterName}
        const url = `${currentUrl}api/contents/codetutor/obedia/`

        const booksectionPromise = new Promise ((resolve,reject) => {
            resolve()
        }).then(async (pass) => {
            const response = await requestPost(url,mainCookies,datas)
            return response['output']
        }).then(response => {
            const totalNumBox = document.querySelector("#topic-count-total")
            const totalNum = response.length
            const currentContents = response[0]
            makeContents(chapterName,currentContents)
            totalNumBox.innerHTML = totalNum
            return 0
        }).then(pass => {
            if (event.target.id === "chapterName") {
                toggleSidebar()
            }
        })
    }
    else if (event.target.id === 'topicItem') {
        const topicName = event.target.closest('li').getAttribute('data-name')
        const url = `${currentUrl}api/contents/topic/codetutor/obedia/`

        const topicPromise = new Promise ((resolve,reject) => {
            resolve()
        }).then(async (pass) => {
            const response = await requestPost(url,mainCookies,{'topic':topicName})
            return response["datas"]
        }).then(response => {
            makeTopicContents(topicName,response)
            return 0
        }).then(pass => {
            toggleSidebar()
        })
    }
    else if (event.target.id === "upBtn") {
        const chapterName = event.target.closest("div")
        const chapterna = chapterName.dataset.chapter
        const url = `${currentUrl}api/topic/codetutor/obedia/`
        const headChap = document.querySelector("#headChap")
        const subChap = document.querySelector('#headSub')
        const headTopic = document.querySelector("#headTopic")

        subChap.innerHTML = `${subChap.dataset.subject} >`
        headChap.innerHTML = chapterna + ` >` 


        const chapterPromise = new Promise((resolve,reject) => {
            resolve()
        }).then( async(pass) => {
            const response = await requestPost(url,mainCookies,{"chapter":chapterna})
            return response["output"]
        }).then(response => {
            const topicCountNumber = document.querySelector('#topic-count-total')
            const topicCountCurrent = document.querySelector("#topic-count-current")
            headTopic.innerHTML = response[0]["topic"]
            topicCountCurrent.innerHTML = 1
            topicCountNumber.innerHTML = response.length
            return 0
        }).then(pass => {
            const allChapter = Array.from(document.querySelectorAll("#topicList"));
            const choiceChapter = allChapter.filter(chap => chap.dataset.chapter === chapterna);
            const topicList = choiceChapter[0]; // 배열에서 첫 번째 요소를 선택
            const upbtn = event.target.closest("i");
            toggled(topicList,upbtn )
        })
    }
})

const footers = document.querySelector('.footer-mid')

footers.addEventListener("click", async (event) => {
    if (event.target.id === "footerRightButtonIbutton" || event.target.id === "footerRightButton") {
        const currentChap = document.querySelector('#headChap');
        if (currentChap.length !== 0){
            const totalNum = +document.querySelector('#topic-count-total').innerHTML;
            const currentNum = document.querySelector('#topic-count-current');
            const url = `${currentUrl}api/contents/chapter/codetutor/obedia/`
            let currentNumInt = parseInt(currentNum.innerHTML);
            const dataDic = {"chapter":currentChap.innerHTML,"numbers":currentNum.innerHTML}
            

            if (currentNumInt < totalNum) {
                currentNumInt += 1;
                currentNum.innerHTML = currentNumInt;

                const miniTopicPromise = new Promise ((resolve,reject) => {
                    resolve()
                }).then(async (pass) => {
                    const response = await requestPost(url,mainCookies,dataDic);
                    return response
                }).then(response => {
                    const miniData = response["datas"];
                    makeTopicContents(miniData["topic"],miniData);
                    return 0
                })
            }

        }

    } else if (event.target.id === "footerLeftButtonIbutton" || event.target.id === "footerLeftButton") {
        const currentChap = document.querySelector('#headChap');
        if (currentChap.length !== 0){
            const currentNum = document.querySelector('#topic-count-current');
            const url = `${currentUrl}api/contents/chapter/codetutor/obedia/`
            let currentNumInt = parseInt(currentNum.innerHTML);
            const dataDic = {"chapter":currentChap.innerHTML,"numbers":currentNum.innerHTML-2}
        

            if (currentNumInt > 1) {
                currentNumInt -= 1;
                currentNum.innerHTML = currentNumInt;
                
                const miniTopicPromise = new Promise ((resolve,reject) => {
                    resolve()
                }).then(async (pass) => {
                    const response = await requestPost(url,mainCookies,dataDic);
                    return response
                }).then(response => {
                    const miniData = response["datas"];
                    makeTopicContents(miniData["topic"],miniData);
                    return 0;
                })
                
            }
        }
    }
});
