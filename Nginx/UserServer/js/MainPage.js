import { getCookie,currentUrl,requestGet} from "../../../../../Frontend/static/base/js/UserServer_base.js"; 
import {makeUl,putData} from "./functions.js"


const maincookie = getCookie('csrftoken')

// 로그인 버튼 클릭 시 모달을 엽니다
try {
    // 모달을 가져옵니다
  let guideModal = document.getElementById("guideModal")

  // 버튼을 가져옵니다
  let guideBtn = document.getElementById("guideButton");


  
  // 닫기 버튼을 가져옵니다(모달 내에 있는)

  let guidecloseBtns = document.getElementsByClassName("guideclose");

  guideBtn.addEventListener("click",(event) => {
    guideModal.style.display = "block";
  })


    // 닫기 버튼을 클릭하면 모달을 닫습니다
  for (var i = 0; i < guidecloseBtns.length; i++) {
    guidecloseBtns[i].onclick = function() {
      this.parentElement.parentElement.style.display = "none";
    }
  }

  // 모달 바깥 영역을 클릭하면 모달을 닫습니다
  window.onclick = function(event) {

    if (event.target ==guideModal) {
      guideModal.style.display = "none";
      }
      }
      
      // 키보드에서 ESC를 눌렀을 때 모달을 닫는 기능을 추가합니다.
      document.onkeydown = function(evt) {
      evt = evt || window.event;
      var isEscape = false;
      if ("key" in evt) {
      isEscape = (evt.key === "Escape" || evt.key === "Esc");
      } else {
      isEscape = (evt.keyCode === 27);
      }
      if (isEscape) {

      if (guideModal.style.display === "block") {
        guideModal.style.display = "none";
        }
      }
      };
}
catch (TypeError) {
  
}
