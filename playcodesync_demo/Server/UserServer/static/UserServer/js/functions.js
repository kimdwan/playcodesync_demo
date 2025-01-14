import { currentUrl,getCookie } from "../../../../../Frontend/static/base/js/UserServer_base.js";

export const makeUl = (grades,subjects) => {
    const gradesUl = (grade) => `<ul id='${grade}' class='gradeUl' data-grade='${grade}_data'>${grade}</ul>`
    const subjectUl = (origin_subject,subject) => `<li id='${origin_subject}' class='subjectList' data-subject='${subject}_data'>${subject}<a href='${currentUrl}${origin_subject}/' ><button>버튼</button></a></li>`
    const itemUl = grades.map(graded => {
        const grade = graded["grade"]
        const subject = subjects.filter(subject => subject["grade"]===grade)
        
        const gu = gradesUl(grade)
        const subjectList = subject.map(subed => {
            const sub = subed["subject"]
            const originSub = subed["origin_subject"]
            const subs = subjectUl(originSub,sub)
            return subs
        })

        return {"gradeData":grade,"grade":gu,"subject":subjectList}
    });

    return itemUl
}

export const putData = (pos, dics) => {
    dics.forEach(dic => {
        const grade = dic['grade'];
        
        pos.innerHTML += grade;

        const gradeData = dic['gradeData'];
        const subjectList = dic['subject'];

        const gradeHtml = document.querySelector(`#${gradeData}`);
        if (gradeHtml) {
            subjectList.forEach(sub => {
                gradeHtml.innerHTML += sub;
            });
        }
    });
};

// 타임 기록 자바스립트
export const makeRecommandList = (mon,time) => `<li class='recList' data-mon = '${mon}' data-time='${time}'>${mon}요일: ${time}</li>`

export const makeRecordBox = (Lists) => {
    let sec = 0 ; let min = 0; let hour =0;
    const changeInt = (str) => parseInt(str)
    const sendTime = (ti) => Math.floor(ti / 60)
    const lowTime = (ti) => ti % 60

    Lists.forEach(List => {
        let sec_str = changeInt(List.slice(10,12)) ; let min_str = changeInt(List.slice(5,7)) ; let hour_str = changeInt(List.slice(0,2));
        sec += sec_str ; min += min_str; hour += hour_str;  
    })

    const sendSec = sendTime(sec)
    min += sendSec
    const allowMin = lowTime(min)
    const sendMin = sendTime(min)
    hour += sendMin

    return {"hour":hour,"min":allowMin}
} 

export const makeListDate = (date,dic) => `<li id='${date}' class='timeDic'>${date}= ${dic["hour"]}시${dic["min"]}분</li>`

// 첫번째 요소 
export const firstSubject = "파이썬일반"

// 유저 시간 업데이트 
export const userGraph = (dataNames, dataValues, dateUlDatasName,typeName="line") => {
    let dom = document.getElementById('studyTime-graph');
    let myChart = echarts.init(dom, null, {
        renderer: 'canvas',
        useDirtyRect: false
    });

    let option = {
        xAxis: {
            type: 'category',
            data: dataNames
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: dataValues.map((value, index) => ({
                value: value,
                name: dateUlDatasName[index] // 각 데이터 포인트에 이름 설정
            })),
            type: typeName,
            smooth: true,
            label: {
                show: true, // 데이터 포인트의 레이블을 표시하도록 설정
                position: 'top', // 레이블 위치 설정
                formatter: (params) => params.data.name // 레이블에 표시할 텍스트 설정
            }
        }]
    };

    if (option && typeof option === 'object') {
        myChart.setOption(option);
    }
    myChart.resize();
}


export const makeMinute = (timeDic) => {
    return timeDic["hour"] * 60 + timeDic["min"]
}

export const makeMinuteName = (timeDic) => {
    const hour = timeDic["hour"]; const minute = timeDic["min"]
    if (hour != 0) {
        return `${hour}시간 ${minute}분`
    }
    else {
        return `${minute}분`
    }
}

// 유저 정보 업데이트 관련 요소들 
const mainCookies = getCookie("csrftoken")

class normalClass {
    constructor (url,cookies) {
        this.url = url
        this.cookies = cookies
    }

    async getFetchData () {
        {
            try {
                const response = await fetch(this.url, {
                    method: "get",
                    headers:{
                        "Content-Type" : "application/json",
                        "X-CSRFToken" : this.cookies
                    }
                })
                if(!response.ok) {
                    alert("서버에 문제가 생겼습니다.")
                }
                const datas = await response.json()
                return datas 
            }
            catch (err) {
                alert("무슨 문제가 있습니다.")
                console.log(err.error)
            }
        }        
    }

    promiseFunc (func) {
        const newPromiseFunc = new Promise((resolve,reject) => {
            resolve()
        }).then(async (pass) => {
            const response = await this.getFetchData()
            return response 
        }).then(response => {
            func(response)
        })
    }
}

// 일주일을 눌렀을때 나오는 것 
const makeTime = (timeStrList) => {
    const hourList = timeStrList.map(timeStr => timeStr.slice(0,2))
    const minuteList = timeStrList.map(timeStr => timeStr.slice(5,7))
    const secondList = timeStrList.map(timeStr => timeStr.slice(10,12))

    const sumTime = (timeList) => timeList.reduce((prev, curr) => prev + parseInt(curr, 10), 0);

    let totalHour = sumTime(hourList);
    let totalMinute = sumTime(minuteList);
    let totalSecond = sumTime(secondList);

    if (totalSecond >= 60) {
        totalMinute += Math.floor(totalSecond / 60);
        totalSecond %= 60;
    }

    if (totalMinute >= 60) {
        totalHour += Math.floor(totalMinute / 60);
        totalMinute %= 60;
    }

    return { "hour": totalHour, "min": totalMinute };
}

const makeTotalMinute = (dic) => {
    const hour = dic["hour"]
    const minute = dic["min"]
    return minute + (hour * 60)
}

const makeTimeName = (dic) => {
    let hour = parseInt(dic["hour"])
    let minute = parseInt(dic["minute"])
    if (minute >= 60) {
        hour += Math.floor(minute / 60)
        minute %= 60
    }
    
    return `${hour}시간 ${minute}분`
}

const radioFunc1 = (response) => {
    const datas = response["output"]
    const datasNum = datas.length
    const wantWeekDatas = datas.slice(1,datasNum)
    const dateDicOriginal = wantWeekDatas.reduce((acc, week) => {
        acc[week["month"]] = week["time"];
        return acc;
    }, {});
    const dateList = wantWeekDatas.map(data => data["month"]).sort()
    if (dateList.length > 0) {
    // 우리가 본격적으로 사용할 데이터
        const dateDic = dateList.map(date => ({[date]:makeTime(dateDicOriginal[date])}))
        // 원래라면 이런식으로 만들어야 할 듯 ㅋ 
        /*
        const dateDicList = dateDic.reduce((prev,curr) => {
            const date = Object.keys(curr)[0]
            const dateDatas = makeTotalMinute(curr[date])
            prev[date] = dateDatas
            return prev
        },{})*/
        const dateDicDatas = dateDic.map(dates => {
            const date = Object.keys(dates)[0]
            const dateDatas = makeTotalMinute(dates[date])
            return dateDatas
        })

        const dateDicDatasName = dateDic.map(dates => {
            const date = Object.keys(dates)[0]
            return makeMinuteName(dates[date])
        })
        userGraph(dateList,dateDicDatas,dateDicDatasName)
    }
    else {
        userGraph([],[],[])
    }
    const timeInfo = document.querySelector(".chapterInfo-n")
    timeInfo.innerHTML = "최근 일주일 학습시간"
    return 0
}

const radioFunc2 = (response) => {
    const datas = response["output"]
    const current_month = datas["last_day"].slice(0,8)
    const last_days =  parseInt(datas["last_day"].slice(8,10))
    const monthBox = []

    const user_datas = datas["userDatas"]

    let dateStr = ""

    for(let i =0;i<last_days;i++) {
        if (i<9) {
            dateStr = `${current_month}0${i+1}`
        }
        else {
            dateStr = `${current_month}${i+1}`
        }
        monthBox.push(dateStr)
    }

    const userDics = user_datas.reduce((prev,curr) => {
        const month = curr["timeMonth"]
        const time = curr["appendTime"]
        prev[month] = time
        return prev
    },{})

    const dateDics = monthBox.reduce((prev,curr) => {
        if (userDics[curr]) {
            prev[curr] = makeTime(userDics[curr])
        }
        else {
            prev[curr] = {"hour":0,"min":0}
        }
        return prev

    },{})

    const monthDataDIc = monthBox.map(month => makeTotalMinute(dateDics[month]))
    
    const timeInfo = document.querySelector(".chapterInfo-n")
    timeInfo.innerHTML = "이번달 공부 추이(분)"
    userGraph(monthBox,monthDataDIc,monthDataDIc)
    return 0
}

const radioFunc3 = (response) => {
    const datas = response
    const mean_data = datas["min"]
    const user = datas["user"]
    let username = Object.keys(user)
    let userTimeDataHour = 0
    let userTimeDataMin = 0

    if (username.length > 0) {
        userTimeDataHour = user[username]["hour"]
        userTimeDataMin = user[username]["min"]
        username = document.querySelector(".userIdBox").dataset.id
    }
    else {
        username = document.querySelector(".userIdBox").dataset.id
    }
    const totalTimeName = {'hour':0,"minute":mean_data}
    const userTumeName = {"hour":userTimeDataHour,"minute":userTimeDataMin}
    const timeInfo = document.querySelector(".chapterInfo-n")
    timeInfo.innerHTML = "당신의 학습도는 얼마나 되는가?"
    userGraph([username,"반평균"],[userTimeDataMin,mean_data],[makeTimeName(userTumeName),makeTimeName(totalTimeName)],"bar")
    return 0
}


export const btnRadioFunc1 = () => {
    const url = `${currentUrl}api/get/point/userserver/obedia/`
    const classRadio1  = new normalClass(url,mainCookies)
    classRadio1.promiseFunc(radioFunc1)
}

export const btnRadioFunc2 = () => {
    const url = `${currentUrl}api/monthcheckpoint/userserver/obedia/`
    const classRadio1  = new normalClass(url,mainCookies)
    classRadio1.promiseFunc(radioFunc2)
}

export const btnRadioFunc3 = () => {
    const url = `${currentUrl}api/groupuser/userserver/obedia/`
    const classRadio1  = new normalClass(url,mainCookies)
    classRadio1.promiseFunc(radioFunc3)
}
  