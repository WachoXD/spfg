function checkCookie() {
    document.getElementById('app').innerHTML = ''
    let user = getCookie("username");
    if (user != "") {
        alert("Welcome again " + user);
        dashboard(user)
    } else {
        login()
    }
}

function login(user){
    document.getElementById('limpiar').innerHTML = ''
}