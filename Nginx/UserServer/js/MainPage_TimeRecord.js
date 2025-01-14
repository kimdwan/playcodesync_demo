import { requestGet,getCookie,currentUrl, requestPost } from "../../../../../Frontend/static/base/js/UserServer_base.js";
import { makeRecommandList,makeRecordBox,makeListDate,firstSubject,makeMinute,userGraph,makeMinuteName } from "./functions.js";


// 이게 대쉬보드 입니당 
window.addEventListener('DOMContentLoaded',(event) => {
    const url = `${currentUrl}api/get/point/userserver/obedia/`
    const mainCookie = getCookie('csrftoken')

    const getPromise1 =  new Promise ((resolve,reject) => {
        resolve()
    }).then( async (pass) => {
        const response = await requestGet(url,mainCookie)
        return response
    }).then(response => {
        // 유저의 일주일 데이터
        const datas = response["output"] 
        const responseLength = datas.length + 1
        const responseList = datas.slice(1,responseLength)
        const userTimeDic = {}

        responseList.forEach(element => {
            const month = element["month"]
            const timeList = element['time']
            const totalTime = makeRecordBox(timeList)
            userTimeDic[month] = totalTime
        });

        const dateList = Object.keys(userTimeDic).sort()
        const dateUl = document.querySelector("#recentTimeStudyDataId")
        const dateUlDatas = dateList.map(dates => makeMinute(userTimeDic[dates]))
        const dateUlDatasName = dateList.map(dates => makeMinuteName(userTimeDic[dates]))
        userGraph(dateList,dateUlDatas,dateUlDatasName)
        return 0
    })
    const getPromise2 = new Promise((resolve,reject) => {
        resolve()
    }).then(async(pass) => {
        const url = `${currentUrl}api/total/userserver/obedia/`
        const response = await requestGet(url,mainCookie)
        return response
    }).then(response => {
        const datas2 = response["output"]
        const totalDatas = datas2["total"]
        const userDatas = datas2["user"]
        const getTotalData = totalDatas.map(totals => ({"subject":totals["origin_subject"],"chapter":totals["chapter"],"topic":totals["topic"]}))
        const getSubject = getTotalData.map(total => total["subject"])
        const uniqueArray = [...new Set(getSubject)];
        const mainChaters = document.querySelector("#totalUserStudy")

        uniqueArray.forEach(arr => {
            const miniTotal = getTotalData.filter(get => get["subject"] === arr)
            const miniSub = userDatas.filter(get => get["subject"] === arr)
            const miniSubLength = miniSub.length
            if (miniSubLength > 0) {
                const divMini = `<li id='${arr}'>${arr} = ${miniSub.length}/${miniTotal.length}</li>`
                mainChaters.innerHTML += divMini
            }
            else {
                const divMini = `<li id='${arr}'>${arr} = 0/${miniTotal.length}</li>`
                mainChaters.innerHTML += divMini
            }
        })
    })

    const getPromise3 = new Promise((resolve,reject) => {
        resolve()
    }).then(async(pass) => {
        const url = `${currentUrl}api/recent/userserver/obedia/`
        const response = await requestGet(url,mainCookie)
        return response
    }).then(response => {
        const username = document.querySelector(".userIdBox").dataset.id
        const datas = response["output"]
        const wantDatas = username.length + 10
        const dated = datas.slice(wantDatas,datas.length+1)
        const dataList = dated.split("_")
        const recentStudyDic = document.querySelector('#recentStudy')
        if (dataList[1] !== " ") {
            recentStudyDic.innerHTML = `${dataList[0]} -> ${dataList[1]} -> ${dataList[2]}`
        }
        else if (dataList[1] === " ") {
            recentStudyDic.innerHTML = `${dataList[0]}`
        }
        return {"subject":dataList[0],"chapter":dataList[1],"topic":dataList[2]}
    }).then(async (dic) => {
        const checkurl =  `${currentUrl}api/recentcheckpoint/userserver/obedia/`
        const response = await requestPost(checkurl,mainCookie,dic)
        if (dic["subject"] === "첫시간 이군요 오늘부터 코드 입문해봐요.") {
            response["subject"] = firstSubject
            const recentBtns = document.querySelector("#recentBtn")
            recentBtns.innerHTML = "공부시작해보기"
        }
        else {
            response["subject"] = dic["subject"]
        }
        return response
    }).then(response => {
        const goUrl = `${currentUrl}${response["subject"]}/${response["chapter_number"]}/${response["topic_number"]}/`
        const recentBtnGo = document.querySelector("#recentBtn")
        recentBtnGo.addEventListener("click", (event) => {
            window.location.href = goUrl 
        })
    })
})



