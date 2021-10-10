

let db;
let DBOpenRequest = window.indexedDB.open("calEvents",1);

DBOpenRequest.onerror = function(event) {
    console.log("Error opening the db")
  };
  
DBOpenRequest.onsuccess = function(event) {
  
    db = DBOpenRequest.result;
    displayEvents();
};

const displayEvents = function(){

}

export default {}