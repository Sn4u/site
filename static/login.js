`use strict`
function login(){
    const user = document.getElementById("username")
    const pass = document.getElementById("password")
    const container = document.getElementById("container")
    
    if (!user.value.trim()){
        alert("'Username' is a required field.");
        return
    }
    else if (!pass.value){
        alert("'Password' is a required field.");
    }
    else {
        document.location.href = "./"
    }
}