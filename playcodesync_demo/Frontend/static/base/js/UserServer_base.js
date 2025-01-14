const starTtext1 = "welcome bnvs"
const starTtext2 = "BNVS와 함께할 유능한 인재를 기다리고 있습니다."

console.log(starTtext1)
console.log(starTtext2)

//**현재 url을 담음 */
export const currentUrl = window.location.href

//**쿠키를 얻음 name에 csrftoken을 준다. */
export const getCookie = (name) => {
    let value = "; " + document.cookie;
    let parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
}

//**fetch 함수 url */
export const requestGet = async (url,cookies) => {
    try {
        const response = await fetch(url,{
            method: "get",
            headers: {
                "Content-Type":"application/json",
                "X-CSRFToken" : cookies,
            }
        })
        if (!response.ok) {
            alert("서버 오류가 발생했습니다.")
        }

        const data = await response.json()
        return data
    }
    catch (error) {
        alert("뭔가 오류가 있습니다.")
    }}

export const requestPost = async (url,cookiess,datas) => {
    try {
        const response = await fetch(url, {
            method : "post",
            headers : {
                "Content-Type" : "application/json",
                "X-CSRFToken" : cookiess
            },
            body : JSON.stringify(datas)
        })
        if (!response.ok) {
            alert("서버에 오류가 있습니다.")
        }
        const dated = await response.json()
        return dated
    }
    catch (err) {
        alert("뭔가 오류가 있습니다.")
    }
}

export const requestUpdate = async(url,cookies,datas) => {
    try {
        const response = await fetch(url,{
            method:"put",
            headers: {
                "Content-Type" : "application/json",
                "X-CSRFToken" : cookies
            },
            body : JSON.stringify(datas)
        })
        if(!response.ok) {
            alert("서버에 문제가 있습니다.")
        }

        const dated = await response.json()
        return dated
    }
    catch (err) {
        alert("뭔가 문제가 있습니다.",err.error)
    }
}


// 기본 설정 함수들 
// nav bar icon userinfo click시 popup--------------------------------------------------
function togglePopup(display) {
    var userInfoPopup = document.getElementById("userInfo-popup-dash");

    // display 인자에 따라 팝업 상태 설정
    if (display) {
        userInfoPopup.style.display = "block";
        setTimeout(function () {
            userInfoPopup.style.opacity = "1";
        }, 10);
    } else {
        userInfoPopup.style.opacity = "0";
        setTimeout(function () {
            userInfoPopup.style.display = "none";
        }, 500); // 트랜지션 시간과 일치해야 합니다.
    }
}

// userInfo 버튼 클릭 이벤트
document.getElementById("userInfo-dash").addEventListener("click", function(event) {
    var userInfoBtn = this;
    var userInfoPopup = document.getElementById("userInfo-popup-dash");

    // 팝업창의 top 위치 설정
    userInfoPopup.style.top = (userInfoBtn.offsetTop + userInfoBtn.offsetHeight + 15) + "px";

    // 팝업창의 right 위치 설정
    // 전체 창 너비에서 버튼의 오른쪽 위치까지의 거리를 계산
    var distanceFromRight = window.innerWidth - (userInfoBtn.offsetLeft + userInfoBtn.offsetWidth);
    
    userInfoPopup.style.right = distanceFromRight + "px";

    var computedStyle = window.getComputedStyle(userInfoPopup);
    if (computedStyle.display === "none") {
        togglePopup(true);
        event.stopPropagation();
    }
});

// 윈도우 클릭 이벤트 - 팝업이 열려있으면 닫기
window.addEventListener("click", function () {
    var userInfoPopup = document.getElementById("userInfo-popup-dash");
    if (window.getComputedStyle(userInfoPopup).display !== "none") {
        togglePopup(false);
    }
});

// ESC 키 이벤트 - 팝업이 열려있으면 닫기
window.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        var userInfoPopup = document.getElementById("userInfo-popup-dash");
        if (window.getComputedStyle(userInfoPopup).display !== "none") {
            togglePopup(false);
        }
    }
});