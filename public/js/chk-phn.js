function chkphn(){
    var x=document.getElementById("mobile_no").value;
    if(x.length!=10){
        location.href="../html/sign_up-er.html"
    }
}