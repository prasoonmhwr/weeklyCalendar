let db:any;
let objectStore:any
const IDB = async function(){
  return new Promise(function(res) {
    let DBOpenRequest = window.indexedDB.open("calEvents",2);
  
    DBOpenRequest.onerror = function(event) {
        console.log("Error opening the db")
      };
      
    DBOpenRequest.onsuccess = async function(event) {
      
        db = DBOpenRequest.result;
        await clearData()
        res(await dumpDataFromService())
    }
    DBOpenRequest.onupgradeneeded = function(event) {
      db=DBOpenRequest.result
      if(!db.objectStoreNames.contains('events')){
        objectStore = db.createObjectStore('events', {
          keyPath : 'eventId'
        })
        objectStore.createIndex('dateTimeIdx','dateTime',{unique:false})
      }
      
    }
  })
  
}
const clearData = async function () {
  
  let txn = db.transaction("events", "readwrite");
  txn.oncomplete = function(event:any) {
    console.log('db cleared')
  };

  txn.onerror = function(err:any) {
    console.log(err)
  };

  let store = txn.objectStore("events");

  let request = store.clear();
  request.onsuccess = async function(event:any) {
  };
  request.onerror = function(err:any) {
  };
}
const dumpDataFromService = async function(){
  fetch('http://localhost:8000/events').then(async (res) => {
    let body = await res.json()
    console.log(body)
    let txn = db.transaction('events','readwrite');
    txn.oncomplete = () => {
      console.log("txn complete");
    };
    txn.onerror = (err:any) => {
      console.warn("error in txn")
    }
    let store = txn.objectStore('events');
    body.forEach(async (element: Object) => {
      let request = await store.add(element)
      request.onsuccess = () => {
        console.log("successfully added an object")
      }
      request.onerror = (err :any) => {
        console.log(err)
      }
    });
  }).catch(err => {
    console.log(err)
  })
}


async function displayEvents(db:any,start:Number,end:Number):Promise<any>{
  let txn = db.transaction("events", "readonly");
  txn.oncomplete = function(event:any) {
    console.log('fetched records complete')
  };

  txn.onerror = function(err:any) {
    console.log(err)
  };

  let store = txn.objectStore("events");
  let idx = store.index("dateTimeIdx")
  let request = idx.getAll(IDBKeyRange.bound(start,end,false,false));
  return request;
}

export {IDB,dumpDataFromService,displayEvents}