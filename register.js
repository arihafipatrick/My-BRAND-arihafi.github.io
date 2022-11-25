function store(){

let username,password;
username=document.getElementById("username").value;
password=document.getElementById("password").value;

let user_records=new Array();
user_records=JSON.parse(localStorage.getItem("users"))?JSON.parse(localStorage.getItem("users")):[]
if(user_records.some((v)=>{return v.username==username}))
{
  alert("duplicate data");
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
    let username,password;
username=document.getElementById("userName").value;
password=document.getElementById("userPassword").value;

let user_records=new Array();
user_records=JSON.parse(localStorage.getItem("users"))?JSON.parse(localStorage.getItem("users")):[]
if(user_records.some((v)=>{return v.username==username && v.password==password}))
{
  alert("Login Successful!");
   window.location.href="admin.html";
  let current_user=user_records.filter((v)=>{return v.username==username && v.password==password})[0]
 localStorage.setItem('username',current_user.username);
 localStorage.setItem('password',current_user.password);
 
}
else
{
  alert('Login Failed');
}

}