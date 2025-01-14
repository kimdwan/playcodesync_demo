'use strict';
import { requestUpdate,getCookie,currentUrl, requestPost } from "../../../../../Frontend/static/base/js/UserServer_base.js";

const updateBtn = document.querySelector(".selfUpdate")
const mainCookie = getCookie('csrftoken')

updateBtn.addEventListener("click", (event) => {
    // 이름 관련 
    const firstName = document.querySelector("#firstName")
    const lastName = document.querySelector("#lastName")
    
    // 성별 관련 
    const gender = document.querySelector('.sex')


    // 그룹 관련
    const society = document.querySelector(".group")

    // 전화번호 관련
    const firstNumber = document.querySelector(".firstNumber")
    const middleNumber = document.querySelector('.middleNumber')
    const lastNumber = document.querySelector(".lastNumber")
    const phoneNumber = firstNumber.value + middleNumber.value + lastNumber.value

    // 자기소개 관련
    const selfIntroduce = document.querySelector(".introduce")

    //데이터 정리
    const updateData = {"first_name":firstName.value,"last_name":lastName.value,"gender":gender.value,"society":society.value,"phone_number":phoneNumber,'introduc':selfIntroduce.value }

    const updatePromise = new Promise ((resolve,reject) => {
        resolve()
    }).then(async(pass) => {
        const updateUrl = currentUrl.split("/").slice(0,4)
        const url = `${updateUrl.join("/")}/api/update/userserver/obedia/`
        const response = await requestPost(url,mainCookie,updateData)
        return response
    }).then(response => {
        alert('수정 완료')
    })

})