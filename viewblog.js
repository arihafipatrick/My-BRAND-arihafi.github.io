import { uid } from './uid.js';
console.log(uid());
//nothing else to import because we are using the built in methods
//https://developer.mozilla.org/en-US/docs/Web/API/IDBDatabase

const IDB = (function init() {
  let db = null;
  let objectStore = null;
  let DBOpenReq = indexedDB.open('postDB', 6);

  DBOpenReq.addEventListener('error', (err) => {
    //Error occurred while trying to open DB
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
    //OR a new version was passed into open()
    db = ev.target.result;
    let oldVersion = ev.oldVersion;
    let newVersion = ev.newVersion || db.version;
    console.log('DB updated from version', oldVersion, 'to', newVersion);

    console.log('upgrade', db);
    if (!db.objectStoreNames.contains('postStore')) {
      objectStore = db.createObjectStore('postStore', {
        keyPath: 'id',
      });
    }
  });
  document.getElementById('btnUpdate').addEventListener('click', (ev) => {
    ev.preventDefault();

    let name = document.getElementById('name').value.trim();
    let country = document.getElementById('country').value.trim();
    let body =  document.getElementById('body').value.trim();
    //id
    let key = document.postForm.getAttribute('data-key');
    if (key) {
      let post = {
        id: key,
        name,
        country,
        body
      };
      let tx = makeTX('postStore', 'readwrite');
      tx.oncomplete = (ev) => {
        console.log(ev);
        buildList();
        clearForm();
      };

      let store = tx.objectStore('postStore');
      let request = store.put(post); //request a put/update

      request.onsuccess = (ev) => {
        console.log('successfully updated an object');
        //move on to the next request in the transaction or
        //commit the transaction
      };
      request.onerror = (err) => {
        console.log('error in request to update');
      };
    }
  });

  document.getElementById('btnDelete').addEventListener('click', (ev) => {
    ev.preventDefault();
    //id
    let key = document.postForm.getAttribute('data-key');
    if (key) {
      let tx = makeTX('postStore', 'readwrite');
      tx.oncomplete = (ev) => {
        console.log(ev);
        buildList();
        clearForm();
      };

      let store = tx.objectStore('postStore');
      let request = store.delete(key); //request a delete

      request.onsuccess = (ev) => {
        console.log('successfully deleted an object');
        //move on to the next request in the transaction or
        //commit the transaction
      };
      request.onerror = (err) => {
        console.log('error in request to delete');
      };
    }
  });
  // ;

  document.getElementById('btnAdd').addEventListener('click', (ev) => {
    ev.preventDefault();
    //one of the form buttons was clicked

    let name = document.getElementById('name').value.trim();
    let country = document.getElementById('country').value.trim();
    let body = document.getElementById('body').value.trim();

    let post = {
      id: uid(),
      name,
      country,
      body,
    };

    let tx = makeTX('postStore', 'readwrite');
    tx.oncomplete = (ev) => {
      console.log(ev);
      buildList();
      clearForm();
    };

    let store = tx.objectStore('postStore');
    let request = store.add(post); //request an insert/add

    request.onsuccess = (ev) => {
      console.log('successfully added an object');
      //move on to the next request in the transaction or
      //commit the transaction
    };
    request.onerror = (err) => {
      console.log('error in request to add');
    };
  });

  function buildList() {
    //use getAll to get an array of objects from our store
    let list = document.querySelector('.wList');
    list.innerHTML = `<li>Loading...</li>`;
    let tx = makeTX('postStore', 'readonly');
    tx.oncomplete = (ev) => {
      //transaction for reading all objects is complete
    };
    let store = tx.objectStore('postStore');
    let getReq = store.getAll();
    //returns an array
    //option can pass in a key or a keyRange
    getReq.onsuccess = (ev) => {
      //getAll was successful
      let request = ev.target; //request === getReq === ev.target
      console.log({ request });
      list.innerHTML = request.result
        .map((post) => {
          return `
          <div class="col-md-4" id="cards">
  
    <h4>${post.name}</h4>
     <p data-key="${post.id}">
       ${post.body}
     </p>
     <b>Author:</b>${post.country}</span>
     <a href="singlepost.html"><button type="button" class="btn btn-primary" style="margin-left:140px;background-color: #1D4ED8;">Read More>></button></a>
      </div>
      `;
        })
        .join('\n');
    };
    getReq.onerror = (err) => {
      console.warn(err);
    };
  }

  document.querySelector('.wList').addEventListener('click', (ev) => {
    let li = ev.target.closest('[data-key]');
    let id = li.getAttribute('data-key');
    console.log(li, id);

    let tx = makeTX('postStore', 'readonly');
    tx.oncomplete = (ev) => {
      //get transaction complete
    };
    let store = tx.objectStore('postStore');
    let req = store.get(id);
    req.onsuccess = (ev) => {
      let request = ev.target;
      let post = request.result;
      document.getElementById('name').value = post.name;
      document.getElementById('country').value = post.country;
      document.getElementById('body').value = post.body;
      
      //put the post id into a form attribute
      document.postForm.setAttribute('data-key', post.id);
    };
    req.onerror = (err) => {
      console.warn(err);
    };
  });

  function makeTX(storeName, mode) {
    let tx = db.transaction(storeName, mode);
    tx.onerror = (err) => {
      console.warn(err);
    };
    return tx;
  }

  document.getElementById('btnClear').addEventListener('click', clearForm);

  function clearForm(ev) {
    if (ev) ev.preventDefault();
    document.postForm.reset();
    document.postForm.removeAttribute('data-key');
  }
})();