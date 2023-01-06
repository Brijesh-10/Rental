var openPopupBtn=document.querySelector(".profiles");
var closePopupBtn=document.querySelector(".popup-close-btn");
openPopupBtn.addEventListener("click",function(){
    document.body.classList.add("profile-box-active");
})
closePopupBtn.addEventListener("click",function(){
    document.body.classList.remove("profile-box-active");
})