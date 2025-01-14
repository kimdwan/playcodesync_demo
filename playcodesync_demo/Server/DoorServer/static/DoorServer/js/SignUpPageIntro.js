'use strict';
import { currentUrl,getCookie,requestPost } from "../../../../../Frontend/static/base/js/DoorServer_base.js";

const mainCookie = getCookie('csrftoken')

// 수정
const arrayindex = [1,2,3]

arrayindex.forEach(index => {
    const checkBox = document.querySelector(`.checkedBox${index}`)
    checkBox.addEventListener("change", (event) => {
        if (checkBox.checked) {
            checkBox.dataset.value = 'yes'
        } else {
            checkBox.dataset.value = "no"
        }
    })

    const labelBox = document.querySelector(`#checkLabel${index}`)
    labelBox.addEventListener('click',(event) => {
        if (checkBox.checked) {
            checkBox.dataset.value = 'yes'
        } else {
            checkBox.dataset.value = "no"
        }
    })

})

//submit를 클릭했을때
const submitButton = document.querySelector('#submitButton')

submitButton.addEventListener('click', (event) => {
    const listArray = [1,2,3]
    const checkdatas = listArray.map(li => document.querySelector(`.checkedBox${li}`))
    const dataList = checkdatas.map(dataDiv => dataDiv.dataset.value)
    if (dataList[0] === "no" ||  dataList[1] === "no" ) {
        alert('필수 부분을 체크해주셔야 합니다.')
    }
    else {
        const url = `${currentUrl}api/check/doorserver/obedia/`
        const newUrlPromise = new Promise((reslove,reject) => {
            reslove()
        }).then(async(pass) => {    
            const response = await requestPost(url,mainCookie,{"output":dataList})
            return response["output"]
        }).then(response => {
            const newUrl = `${currentUrl}${response}/`
            window.location.href = newUrl;
        })
    }
})