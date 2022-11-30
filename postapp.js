//Function that is  generation postIds
const uid = () => {
  let randy = parseInt(Math.random() * Number.MAX_SAFE_INTEGER);
  return randy;
};
const IDB = (function init() {
  let db = null;
  let objectStore = null;
  let DBOpenReq = indexedDB.open('PostDB', 8);
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
	if(! db.objectStoreNames.contains('PostStore')){
	objectStore = db.createObjectStore('PostStore',{keyPath: 'postId', autoIncrement: true});}

});

document.postForm.addEventListener('submit', (ev) =>{
	ev.preventDefault();
	//one of the form  buttons was clicked 
let title = document.getElementById('title').value.trim();
let author = document.getElementById('author').value.trim();
let body= document.getElementById('body').value.trim();
	let post={
		postId: uid(),
		title,
		author,
		body,
	};

	let tx = makeTX('PostStore', 'readwrite');
	tx.oncomplete = (ev) =>{
		console.log(ev);
		buildList();
		clearForm();

	};


	let store = tx.objectStore('PostStore');
	let request = store.add(post);
	request.onsuccess = (ev) =>{
		console.log('Sucessfully added Object');
	};
	request.onerror = (err) =>{
		console.log('Error in Request to Add');
	};
});

function buildList(){
	let p = document.querySelector('#postList');
	p.innerHTML = `<p>Post Loading...</p>`;
	let tx = makeTX('PostStore', 'readonly');
	tx.oncomplete = (ev)=>{

	}
	let store = tx.objectStore('PostStore');
	let getReq = store.getAll();
	// returns an array
	getReq.onsuccess = (ev)=>{
		let request = ev.target;
		console.log({request});
		p.innerHTML = request.result.map(post =>{
			return`<p data-key="${post.postId}"><span><b>Title:</b> ${post.title}</span></br> <span><b>Author:</b>${post.author}</span></br> <b>body:</b> ${post.body} </p> <hr>`
		}).join('\n');
	};
   getReq.onerror = (ev)=>{
   	console.warn(err);
	};
}
//For selscting in a list
document.querySelector('#postList').addEventListener('click', (ev) => {
    let p = ev.target.closest('[data-key]');
    let id = p.getAttribute('data-key');
    console.log(p, id);

    let tx = makeTX('PostStore', 'readonly');
    tx.oncomplete = (ev) => {
      //get transaction complete
    };
    let store = tx.objectStore('PostStore');
    let req = store.get(PostId);
    req.onsuccess = (ev) => {
      let request = ev.target;
      let post = request.result;
      document.getElementById('title').value = post.title;
      document.getElementById('author').value = post.author;
      document.getElementById('body').value = post.body;
      document.postForm.setAttribute('data-key', post.postId);
    };
    req.onerror = (err) => {
      console.warn(err);
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
	document.postForm.reset();
}
})();  