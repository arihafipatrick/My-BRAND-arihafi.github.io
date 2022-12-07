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
const IDB = (function init() {
  let db = null;
  let objectStore = null;
  let DBOpenReq = indexedDB.open('MessageDB', 8);
DBOpenReq.addEventListener('error', (err) => {
  //error occured while trying to open DB
  console.warn(err);
});

DBOpenReq.addEventListener('success', (ev) => {
  //DB has been opened... after upgradeneeded
  db = ev.target.result;
  console.log('success', db);
  
});

DBOpenReq.addEventListener('upgradeneeded', (ev) => {
  //first time opening this DB 
  //OR  a new version was passed into open()
  db = ev.target.result;
  let oldVersion = ev.oldVersion;
  let newVersion = ev.newVersion;
  console.log('DB updated from Version',oldVersion, 'to', 'newVersion');
  console.log('upgrade', db);
  if(! db.objectStoreNames.contains('MessageStore')){
  objectStore = db.createObjectStore('MessageStore',{keyPath: 'messageId'});}

});

document.contactForm.addEventListener('submit', (ev) =>{
  ev.preventDefault();
  //one of the form  buttons was clicked 
fname=document.getElementById("fname").value;
lname=document.getElementById("lname").value;
email=document.getElementById("email").value;
message=document.getElementById("message").value;
  let post={
    messageId: uid(),
    messageTime:ct(),
    fname,
    lname,
    email,
    message,
  };

  let tx = makeTX('MessageStore', 'readwrite');
  tx.oncomplete = (ev) =>{
    console.log(ev);
    clearForm();

  };


  let store = tx.objectStore('MessageStore');
  let request = store.add(post);
  request.onsuccess = (ev) =>{
    console.log('Sucessfully added Object');
    alert("Message Sent!");
   window.location.href="index.html";
  };
  request.onerror = (err) =>{
    console.log('Error in Request to Add');
  };
});

 

function makeTX(storeName, mode){
  let tx = db.transaction(storeName, mode);
    tx.onerror = (err) =>{
    console.warn(err);
  };
  return tx; 
}

function clearForm(ev) {
  if (ev) ev.preventDefault();
  document.contactForm.reset();
}
})();
