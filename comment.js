//Function that is  generation postIds
const uid = () => {
  let randy = parseInt(Math.random() * Number.MAX_SAFE_INTEGER);
  return randy;
};
const ct = () =>{
    let iyi;
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];;
    var date = new Date();
    iyi = months[date.getMonth()] + ' ' + date.getDate()+ ', ' + date.getFullYear();
return iyi;
};

const owner = () =>{
     let iyo = localStorage.getItem('username');
     return iyo;
};


const IDB = (function init() {
  let db = null;
  let objectStore = null;
  let DBOpenReq = indexedDB.open('CommentDB', 8);
DBOpenReq.addEventListener('error', (err) => {
  //error occured while trying to open DB
  console.warn(err);
});

DBOpenReq.addEventListener('success', (ev) => {
  //DB has been opened... after upgradeneeded
  db = ev.target.result;
  console.log('success', db);
  buildList();
});

DBOpenReq.addEventListener('upgradeneeded', (ev) => {
  //first time opening this DB 
  //OR  a new version was passed into open()
  db = ev.target.result;
  let oldVersion = ev.oldVersion;
  let newVersion = ev.newVersion;
  console.log('DB updated from Version',oldVersion, 'to', 'newVersion');
  console.log('upgrade', db);
  if(! db.objectStoreNames.contains('CommentStore')){
  objectStore = db.createObjectStore('CommentStore',{keyPath: 'commentId'});}

});

document.commentForm.addEventListener('submit', (ev) =>{
  ev.preventDefault();
  //one of the form  buttons was clicked 
let comment = document.getElementById('comment').value.trim();
  let post={
    commentId: uid(),
    comment_time: ct(),
    comentator: owner(),
    comment,
  };

  let tx = makeTX('CommentStore', 'readwrite');
  tx.oncomplete = (ev) =>{
    console.log(ev);
    buildList();
    clearForm();

  };


  let store = tx.objectStore('CommentStore');
  let request = store.add(post);
  request.onsuccess = (ev) =>{
    console.log('Sucessfully added Object');
  };
  request.onerror = (err) =>{
    console.log('Error in Request to Add');
  };
});

function buildList(){
  let li = document.querySelector('.postList');
  li.innerHTML = `<p>Post Loading...</p>`;
  let tx = makeTX('CommentStore', 'readonly');
  tx.oncomplete = (ev)=>{

  }
  let store = tx.objectStore('CommentStore');
  let getReq = store.getAll();
  // returns an array
  getReq.onsuccess = (ev)=>{
    let request = ev.target;
    console.log({request});                                                                        
    li.innerHTML = request.result.map(comment =>{
      return`<p data-key=${comment.commentId}><span>${comment.comment}</span></p><hr><em><span>${comment.comment_time}</span></em></br><em><span>${comment.comentator}</span></em></br></br>`
    }).join('\n');
  };
   getReq.onerror = (ev)=>{
    console.warn(err);
  };
};

function makeTX(storeName, mode){
  let tx = db.transaction(storeName, mode);
    tx.onerror = (err) =>{
    console.warn(err);
  };
  return tx; 
}

function clearForm(ev) {
  if (ev) ev.preventDefault();
  document.commentForm.reset();
}
})(); 