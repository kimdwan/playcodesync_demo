// 입구 
import { getCookie,requestGet } from "../../../../../Frontend/static/base/js/CodeTutor_base.js"

const starTtext1 = "welcome bnvs"
const starTtext2 = "BNVS와 함께할 유능한 인재를 기다리고 있습니다."

console.log(starTtext1)
console.log(starTtext2)


// 타이머
let seconds = 0;
let minutes = 0;
let hours = 0;

const timerElement = document.getElementById('timer');

const updateTimer = () => {
    seconds++;
    if (seconds >= 60) {
        minutes++;
        seconds = 0;
    }
    if (minutes >= 60) {
        hours++;
        minutes = 0;
    }
    
    // 시간을 "00:00:00" 형식으로 표시
    const formattedTime = `${String(hours).padStart(2, '0')} : ${String(minutes).padStart(2, '0')} : ${String(seconds).padStart(2, '0')}`;
    timerElement.textContent = formattedTime;
}

// 1초마다 updateTimer 함수를 호출
setInterval(updateTimer, 1000);


//resizer
const resizable = function (resizer) {
    const direction = resizer.getAttribute("data-direction") || "horizontal";
    const prevSibling = resizer.previousElementSibling;
    const nextSibling = resizer.nextElementSibling;
  
    //  마우스의 위치값 저장을 위해 선언
    let x = 0;
    let y = 0;
    let prevSiblingHeight = 0;
    let prevSiblingWidth = 0;
  
    // resizer에 마우스 이벤트가 발생하면 실행하는 Handler
    const mouseDownHandler = function (e) {
      // 마우스 위치값을 가져와 x, y에 할당
      x = e.clientX;
      y = e.clientY;
      // 대상 Element에 위치 정보를 가져옴
      const rect = prevSibling.getBoundingClientRect();
      // 기존 높이와 너비를 각각 할당함
      prevSiblingHeight = rect.height;
      prevSiblingWidth = rect.width;
  
      // 마우스 이동과 해제 이벤트를 등록
      document.addEventListener("mousemove", mouseMoveHandler);
      document.addEventListener("mouseup", mouseUpHandler);
    };
  
    const mouseMoveHandler = function (e) {
      // 마우스가 움직이면 기존 초기 마우스 위치에서 현재 위치값과의 차이를 계산
      const dx = e.clientX - x;
      const dy = e.clientY - y;
  
      // 이동 방향에 따라서 별도 동작
      // 기본 동작은 동일하게 기존 크기에 마우스 드래그 거리를 더한 뒤 상위요소(container)를 이용해 퍼센티지를 구함
      // 계산 대상이 x 또는 y인지에 차이가 있음
      switch (direction) {
        case "vertical":
          const newHeight = prevSiblingHeight + dy;
  
          // 만약 새로 계산된 높이가 200px보다 작다면 200px로 설정
          if (newHeight < 0) {
            prevSibling.style.height = `0px`;
          } else {
            const h =
              (newHeight * 100) /
              resizer.parentNode.getBoundingClientRect().height;
            prevSibling.style.height = `${h}%`;
          }
          break;
        case "horizontal":
        default:
          const w =
            ((prevSiblingWidth + dx) * 100) /
            resizer.parentNode.getBoundingClientRect().width;
          prevSibling.style.width = `${w}%`;
          // tutor쪽 width에 따라 움직이도록
          const remainingWidth = 91.7 - w;
          document.getElementById('code-output-toggle').style.width = `${remainingWidth}%`;
          break;
      }
  
      // 크기 조절 중 마우스 커서를 변경함
      // class="resizer"에 적용하면 위치가 변경되면서 커서가 해제되기 때문에 body에 적용
      const cursor = direction === "horizontal" ? "col-resize" : "row-resize";
      resizer.style.cursor = cursor;
      document.body.style.cursor = cursor;
  
      prevSibling.style.userSelect = "none";
      prevSibling.style.pointerEvents = "none";
  
      nextSibling.style.userSelect = "none";
      nextSibling.style.pointerEvents = "none";
    };
  
    const mouseUpHandler = function () {
      // 모든 커서 관련 사항은 마우스 이동이 끝나면 제거됨
      resizer.style.removeProperty("cursor");
      document.body.style.removeProperty("cursor");
  
      prevSibling.style.removeProperty("user-select");
      prevSibling.style.removeProperty("pointer-events");
  
      nextSibling.style.removeProperty("user-select");
      nextSibling.style.removeProperty("pointer-events");
  
      // 등록한 마우스 이벤트를 제거
      document.removeEventListener("mousemove", mouseMoveHandler);
      document.removeEventListener("mouseup", mouseUpHandler);
    };
  
    // 마우스 down 이벤트를 등록
    resizer.addEventListener("mousedown", mouseDownHandler);
  };
  
  // 모든 resizer에 만들어진 resizable을 적용
  document.querySelectorAll(".resizer").forEach(function (ele) {
    resizable(ele);
  });

document.getElementById("toggleButton").addEventListener("click", toggleSidebar);
document.getElementById("closeButton").addEventListener("click", toggleSidebar);

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const currentLeft = window.getComputedStyle(sidebar).left;
  if (currentLeft === "-450px") {
    sidebar.style.left = "0px";
  } else {
    sidebar.style.left = "-450px";
  }
}
// ESC 키를 누를 때 사이드바를 숨깁니다.
document.addEventListener('keydown', function(event) {
  if (event.key === "Escape") { // ESC 키가 눌렸는지 확인
    closeSidebar(); // 사이드바를 닫는 함수 호출
  }
});

// 문서의 어느 곳이든 클릭 시 사이드바를 숨깁니다.
document.addEventListener('click', function(event) {
  const sidebar = document.getElementById('sidebar');
  const sidebarButton = document.getElementById('toggleButton');
  
  // 사이드바나 사이드바 토글 버튼을 클릭하지 않았을 때 사이드바를 닫습니다.
  if (!sidebar.contains(event.target) && !sidebarButton.contains(event.target)) {
    closeSidebar(); // 사이드바를 닫는 함수 호출
  }
});

// 사이드바를 닫는 함수
function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.style.left = "-450px";
}




document.getElementById("op-toggle").addEventListener("click", outputHide);

function outputHide() {
  const codeToggle = document.getElementById("code-output-toggle")
  const currentBottom = window.getComputedStyle(codeToggle).bottom;
  if (currentBottom >= "1px") {
    codeToggle.style.bottom = "-505px"
  }
}

// 사이드바 챕터 화살표 클릭시 펼쳐짐


// nav bar icon userinfo click시 popup--------------------------------------------------
function togglePopup(elementId, display) {
  var popup = document.getElementById(elementId);
  
  // display 인자에 따라 팝업 상태 설정
  if (display) {
      popup.style.display = "block";
      setTimeout(function() {
          popup.style.opacity = "1";
      }, 10);
  } else {
      popup.style.opacity = "0";
      setTimeout(function() {
          popup.style.display = "none";
      }, 500); // 트랜지션 시간과 일치해야 합니다.
  }
}

// 공통 팝업 위치 설정 함수
function positionPopup(buttonId, popupId) {
  var button = document.getElementById(buttonId);
  var popup = document.getElementById(popupId);

  popup.style.top = (button.offsetTop + button.offsetHeight + 18) + "px";
}

// 공통 클릭 이벤트 리스너 설정 함수
function setupClickListener(buttonId, popupId) {
  document.getElementById(buttonId).addEventListener("click", function(event) {
    positionPopup(buttonId, popupId);

    var computedStyle = window.getComputedStyle(document.getElementById(popupId));
    if (computedStyle.display === "none") {
        togglePopup(popupId, true);
        event.stopPropagation(); // 부모 요소로의 이벤트 전파를 막습니다.
    }
  });
}

// userInfo와 userHistory 버튼 클릭 이벤트
setupClickListener("userInfo", "userInfo-popup");
//setupClickListener("userHistory", "userHistory-popup");

// 윈도우 클릭 이벤트 - 팝업이 열려있으면 닫기
window.addEventListener("click", function() {
  ["userInfo-popup", "userHistory-popup"].forEach(function(popupId) {
    var popup = document.getElementById(popupId);
    if (window.getComputedStyle(popup).display !== "none") {
        togglePopup(popupId, false);
    }
  });
});

// ESC 키 이벤트 - 팝업이 열려있으면 닫기
window.addEventListener("keydown", function(event) {
  if (event.key === "Escape") {
    outputHide();
    ["userInfo-popup", "userHistory-popup"].forEach(function(popupId) {
      var popup = document.getElementById(popupId);
      if (window.getComputedStyle(popup).display !== "none") {
          togglePopup(popupId, false);
      }
    });
  }
});

// 팝업 내부 클릭 이벤트가 윈도우 클릭 이벤트를 트리거하지 않도록 방지
["userInfo-popup", "userHistory-popup"].forEach(function(popupId) {
  document.getElementById(popupId).addEventListener("click", function(event) {
    event.stopPropagation();
  });
});

const systemUrl = window.location.href
const cookies = getCookie("csrftoken")
const initialMakeList = (chapter,topic,contents,cuNum,toNum) => {
  const headSub = document.querySelector("#headSub")
  const headChapter = document.querySelector("#headChap")
  const headTopic = document.querySelector("#headTopic")
  const bookSection = document.querySelector("#book-section")
  const currentNum = document.querySelector("#topic-count-current")
  const totalNum = document.querySelector("#topic-count-total")

  headSub.innerHTML += " >"
  headChapter.innerHTML = `${chapter} >`
  headTopic.innerHTML = `${topic}`
  bookSection.innerHTML = `${contents}`
  currentNum.innerHTML = cuNum
  totalNum.innerHTML = toNum
}

document.addEventListener('DOMContentLoaded', async (event) => {
  const url = `${systemUrl}api/initial/codetutor/obedia/`
  const response = await requestGet(url,cookies)
  const contents = await response["contents"]
  const makeInitialDic = {
    "contents" : await contents["contents"],
    "chapter" : await contents["chapter"],
    "topic" : await contents["topic"],
    "cuNum" : await response["currentNumber"],
    "toNum" : await response['totalNumber']
  }
  initialMakeList(makeInitialDic["chapter"],makeInitialDic["topic"],makeInitialDic["contents"],makeInitialDic["cuNum"],makeInitialDic["toNum"])

  document.querySelector('#themeCh').addEventListener('click', ()=>{
    document.body.classList.toggle('dark-theme');
  });
});