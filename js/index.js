const user = document.getElementById("btn")
user.addEventListener("click", ()=>{
    const userName = document.getElementById("username")
    const nameData =  userName.value
    const password = document.getElementById("password")
    const passwordData = password.value
    // console.log("name", nameData, "pass", passwordData)
    if (nameData === "admin" && passwordData === "admin123") {
        alert("login successfully")
        window.location.assign("./home.html")
    }
    else {
        alert("try again")
        return
    }
})