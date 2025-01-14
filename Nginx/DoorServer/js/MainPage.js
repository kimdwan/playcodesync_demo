// 로그인 버튼 클릭 시 모달을 엽니다
try {
    // 모달을 가져옵니다
  let loginModal = document.getElementById("loginModal");
  let signupModal = document.getElementById("signupModal");
  let guideModal = document.getElementById("guideModal")

  // 버튼을 가져옵니다
  let loginBtn = document.getElementById("loginButton");
  let signupBtn = document.getElementById("signupButton");
  let guideBtn = document.getElementById("guideButton");


  
  // 닫기 버튼을 가져옵니다(모달 내에 있는)
  let closeBtns = document.getElementsByClassName("close");
  let guidecloseBtns = document.getElementsByClassName("guideclose");

  loginBtn.addEventListener("click",(event) => {
    loginModal.style.display = "block";
  })
  guideBtn.addEventListener("click",(event) => {
    guideModal.style.display = "block";
  })


    // 닫기 버튼을 클릭하면 모달을 닫습니다
  for (var i = 0; i < closeBtns.length; i++) {
    closeBtns[i].onclick = function() {
      this.parentElement.parentElement.style.display = "none";
    }
  }
  for (var i = 0; i < guidecloseBtns.length; i++) {
    guidecloseBtns[i].onclick = function() {
      this.parentElement.parentElement.style.display = "none";
    }
  }

  // 모달 바깥 영역을 클릭하면 모달을 닫습니다
  window.onclick = function(event) {
    if (event.target == loginModal) {
      loginModal.style.display = "none";
    }
    if (event.target ==signupModal) {
      signupModal.style.display = "none";
      }
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
      if (loginModal.style.display === "block") {
      loginModal.style.display = "none";
      }
      if (signupModal.style.display === "block") {
      signupModal.style.display = "none";
      }
      if (guideModal.style.display === "block") {
        guideModal.style.display = "none";
        }
      }
      };
}
catch (TypeError) {
  let guideModal = document.getElementById("guideModal")
  let guideBtn = document.getElementById("guideButton");
  // 닫기 버튼을 가져옵니다(모달 내에 있는)
  let guidecloseBtns = document.getElementsByClassName("guideclose");


  guideBtn.addEventListener("click",(event) => {
    guideModal.style.display = "block";
  })

  for (var i = 0; i < guidecloseBtns.length; i++) {
    guidecloseBtns[i].onclick = function() {
      this.parentElement.parentElement.style.display = "none";
    }
  }

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

/*
// 회원가입 버튼 클릭 시 모달을 엽니다
signupBtn.onclick = function() {
  signupModal.style.display = "block";
}
*/