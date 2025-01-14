'use strict'
//여기는 editor만 가져오는 기능 
let editor = ace.edit("editor",{
    mode : "ace/mode/python",
    selectionStyle: "text",
    
})

// ----------------------------------
// 선 없애기
editor.setShowPrintMargin(false);
// ----------------------------------


editor.setOptions({
    //언어 설정 
    mode : "ace/mode/python",
    
    // 스크롤 관련 
    /*
    1. 내가 마지막으로 편집한 장소에 머물게 함
    2. 라인을 클릭하고 ctrl+c하면 저장되게 함 
    3. ctrl+z를 누르면 뒤로 가게 함 
    */
    selectionStyle: "text",
    autoScrollEditorIntoView: true,
    copyWithEmptySelection: true,
    mergeUndoDeltas: "always",

    // 꾸미기 관련 
    // 테마 확인 링크 
    //https://github.com/ajaxorg/ace/tree/master/src/theme
    
    fontSize:20,

    // theme: "ace/theme/twilight",
    theme: "ace/theme/iplastic",

    // 자동완성기능
    enableBasicAutocompletion:  true,
    enableLiveAutocompletion: true,
})
// ---------------------------------------------------------
// ace editor gutter color 변경
// editor.renderer.$gutter.style.backgroundColor = "black";
// ---------------------------------------------------------


// 초기 텍스트 설정
editor.setValue("#학습을 위한 코드와 답변을 이곳에 작성 하세요!\n\n"+"#줄 바꿈 Shift + Enter\n\n"+"#코드 실행 Ctrl + Enter\n\n"+"#채팅 실행 Enter");
editor.clearSelection();
// 에디터에 포커스가 생길 때의 동작을 정의
editor.on('focus', function() {
    if (editor.getValue() === "#학습을 위한 코드와 답변을 이곳에 작성 하세요!\n\n"+"#줄 바꿈 Shift + Enter\n\n"+"#코드 실행 Ctrl + Enter\n\n"+"#채팅 실행 Enter") {
        editor.setValue(""); // 텍스트 삭제
    }
});


editor.clearSelection();
// 에디터에서 포커스가 사라질 때의 동작을 정의

editor.on('blur', function() {
    if (editor.getValue().trim() === "") {
        editor.setValue("#학습을 위한 코드와 답변을 이곳에 작성 하세요!\n\n"+"#줄 바꿈 Shift + Enter\n\n"+"#코드 실행 Ctrl + Enter\n\n"+"#채팅 실행 Enter");
        editor.clearSelection();
    }
});

// 코드 실행시 줄바꿈 방지
editor.commands.addCommand({ 
    name: "insertNewlineAndIndent", 
    bindKey: { win: "Shift-Enter", mac: "Shift-Enter" }, 
    exec: function (editor) { 
        editor.insert("\n"); 
        }, 
        readOnly: false });




/* 고려해볼만한 기능 
1. 검색 기능 추가 
editor.execCommand("find");
2. 오류 부분 마커 추가 
let Range = ace.require('ace/range').Range;
editor.getSession().addMarker(new Range(0, 0, 5, 0), "myMarker", "fullLine");
*/

