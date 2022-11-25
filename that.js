function store(){

let title,author,body;
title=document.getElementById("title").value;
author=document.getElementById("author").value;
body=document.getElementById("body").value;

let posts=new Array();
posts=JSON.parse(localStorage.getItem("post"))?JSON.parse(localStorage.getItem("post")):[]
if(posts.some((v)=>{return v.title==title}))
{
  alert("duplicate data");
}
else
{
  posts.push({
  "title":title,
  "author":author,
  "body":body,
})
localStorage.setItem("posts",JSON.stringify(posts));
}

}

