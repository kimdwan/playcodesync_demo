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
            console.log(response.status)
        }

        const data = await response.json()
        return data
    }
    catch (error) {
        alert("뭔가 오류가 있습니다.")
        console.log(error.error)
    }}

export const requestPost = async (url,cookies,datas) => {
    try {
        const response = await fetch(url, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken":cookies
            },
            body: JSON.stringify(datas)
        })
        if (!response.ok) {
            alert('서버오류가 있습니다.')
            console.log(response.status)
        }
        const data = await response.json()
        return data
    }

    catch (error) {
        alert("무슨 문제가 있습니다.")
        console.log(error.error)
    }

}

export const requestUpdate = async (url,cookies,datas) => {
    try {
        const response = await fetch(url, {
            method: "put",
            headers : {
                "Content-Type" : "application/json",
                "X-CSRFToken" : cookies
            },
            body : JSON.stringify(datas)
        })
        if (!response.ok) {
            alert('서버 문제가 있습니다.',response.status)
        }
        const dated = await response.json()
        return dated
    }
    catch (error) {
        alert("무슨 문제가 있습니다.",error.message)
    }
} 