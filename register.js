function store(){
let username,password;
username=document.getElementById("username").value;
password=document.getElementById("password").value;
var status=false;  
let user_records=new Array();
user_records=JSON.parse(localStorage.getItem("users"))?JSON.parse(localStorage.getItem("users")):[]
if(username =="")
{
document.getElementById("usernamevar").innerHTML=  
"Please enter your username";   
}else if (password.length<6) {
  document.getElementById("passwordvar").innerHTML=  
"Password must be at least 6 char long"; 
status=false;
}
else if (user_records.some((v)=>{return v.username==username})){
document.getElementById("taken").innerHTML=  
"Username alredy taken😔";  
status=false;  
}
else
{
  user_records.push({
  "username":username,
  "password":password,
})
localStorage.setItem("users",JSON.stringify(user_records));
 alert("Account Registered!");
   window.location.href="login.html";
}

}


//checking
function check(){
  let adminpass,adminuser;
let username,password;
username=document.getElementById("userName").value;
password=document.getElementById("userPassword").value;
adminuser="arihafi";
adminpass="arihafipatrick";

let user_records=new Array();
user_records=JSON.parse(localStorage.getItem("users"))?JSON.parse(localStorage.getItem("users")):[]
if (username =="")
{
document.getElementById("usernamevar").innerHTML=  
"Please enter your username";   
}else if (password.length<6) {
  document.getElementById("passwordvar").innerHTML=  
"Password must be at least 6 char long"; 
status=false;
} else if(username == adminuser && password == adminpass) {
  alert("Admin Login Successful!");
  window.location.href="admin.html";
  let current_user=user_records.filter((v)=>{return v.username==username && v.password==password})[0]
 localStorage.setItem('username',current_user.username);
 localStorage.setItem('password',current_user.password);
}
else if(user_records.some((v)=>{return v.username==username && v.password==password}))
{
  alert("Login Successful!");
   window.location.href="blog.html";
  let current_user=user_records.filter((v)=>{return v.username==username && v.password==password})[0]
 localStorage.setItem('username',current_user.username);
 localStorage.setItem('password',current_user.password);
 
}
else
{
  document.getElementById("invalid").innerHTML=  
"Invalid Username or Password...😔";  
status=false;  
}

}


