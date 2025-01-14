import {btnRadioFunc1,btnRadioFunc2,btnRadioFunc3} from "./functions.js" 

// btn 모음집
const bttnRadio = document.querySelectorAll('input[name="btnradio"]')

// 순서대로 일주일, 한달, 챕터
const bttnRadioGroup = {
"btnradio1": btnRadioFunc1,
"btnradio2": btnRadioFunc2,
"btnradio3" : btnRadioFunc3 }


bttnRadio.forEach(btn => {
  btn.addEventListener("change", (event) => {
    const eventId = btn.id
    const funcEvent = bttnRadioGroup[eventId]
    funcEvent()
  })
})