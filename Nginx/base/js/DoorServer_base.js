const starTtext1 = "welcome bnvs"
const starTtext2 = "BNVS와 함께할 유능한 인재를 기다리고 있습니다."

console.log(starTtext1)
console.log(starTtext2)

export const currentUrl = window.location.href;

export const getCookie = (name) => {
    let value = "; " + document.cookie;
    let parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
}

export const requestPost = async (url,cookie,datas) => {
    try {
        const response = await fetch(url, {
            method : "post",
            headers: {
                "Content-Type" : "application/json",
                "X-CSRFToken" : cookie
            },
            body : JSON.stringify(datas)
        })
        if (!response.ok) {
            alert('서버에 문제가 있습니다.',response.status)
        }

        const data = await response.json()
        return data
    }
    catch (err) {
        alert("뭔가 문제가 있소")

    }
}