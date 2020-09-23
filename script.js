var noteArray = [];
var themeKey = "default";
function setPage(index){
     //Loops through elements with the page class
     //and sets their visibility to none if they don't match the index set
     //otherwise sets their visibility to block
     //useful for a rudimentary tag system
     let elements = document.getElementsByClassName("page");
     for(var i = 0; i<elements.length;i++){
          (i==index) ? elements[i].style.display="block" : elements[i].style.display="none";  
     }
}
function setPopupVisible(colour,message){
     let elements = document.getElementsByClassName("popup");
     elements[0].style.backgroundColor = colour;
     //Directly setting innerhtml to element is not easy to maintain and therefore not
     //recommended - bad decision but not problematic in small projects
     elements[0].innerHTML= "<h1>Alert</h1><break></break><p>"+message+"</p><break><break><input type='button' value='OK' onclick='removePopup()'/>";
     elements[0].style.display="block";
}
function removePopup(){
     document.getElementsByClassName("popup")[0].style.display="none";
}
function submitNote(){
     //Called when submit button on add notes tab is clicked
     //Collects form details and stores them in a temporary array
     //Encrypts note based on password inputs and stores it in localstorage
     let form = document.getElementById("noteInput");
     let inputs = form.getElementsByTagName("input");
     let textarea = form.getElementsByTagName("textarea");
     if(inputs[1].value==""){
          //Password input is empty - inform user
          //I'm not doing this with contents or title since neither of those fields would result in invalid notes
          setPopupVisible("red","Please fill password fields.");
     }
     else if(inputs[1].value==inputs[2].value) {
          //Passwords are equal. Time to encrypt and store in localstorage
          let encrypted = CryptoJS.AES.encrypt(textarea[0].value,CryptoJS.SHA512(inputs[1].value).toString());
          //Title is also encrypted
          let encryptedTitle = CryptoJS.AES.encrypt(inputs[0].value,CryptoJS.SHA512(inputs[1].value).toString());
          //Known encrypted value used to verify if string has been decrypted 
          //This is a gateway to a potential exploit (other than these values being stored locally and are therefore brute-forceable)
          //Since it's a lot easier to sort through valid passphrases when you know the input and output value already
          //See: Alan Turing and Enigma
          //I think this is alright in this case, since this project is unlikely to ever be used by anyone other than myself and you
          //conditional on you not being me
          let verification = CryptoJS.AES.encrypt("1",CryptoJS.SHA512(inputs[1].value).toString());
          //Makes a new note with the syntax encrypted text, title, and verification value
          let note = new Note(encrypted,encryptedTitle,verification);
          noteArray.push(note);
          saveAll();
          //Notifies user if no errors have occurred.
          setPopupVisible("green","Note saved.");
          //Resets all input fields
          for(var i = 0;i<inputs.length;i++){
               inputs[i].value="";
          }
          textarea[0].value="";
     }
     else{
          //Passwords are not equal. Informs user using prefabricated popup window.
          setPopupVisible("red","Password and confirmation password are not the same. Please alter before submitting again.");
     }
}
function decryptNotes(){
     //Retrieves input from 1st input tag that is a child of an element with the id "decryptionInput"
     //I used that for my form - I'm not entirely sure if there's a better way, but this way works fine if you add other elements in other areas of the doc
     //Not entirely stoked with that one tbh
     let password=document.getElementById("decryptionInput").getElementsByTagName("input")[0].value.toString();
     let decryptedNoteArray=[];
     let anyDecrypted=false;
     for(var i=0;i<noteArray.length;i++){
          let decryptedMessage=decrypt(noteArray[i].note,password);
          let decryptedVerification=decrypt(noteArray[i].verification,password);
          let decryptedTitle=decrypt(noteArray[i].title,password);
          //I.e. if the verification value has been decrypted correctly; this statement
          //basically just checks if the password was right.
          if(decryptedVerification=="1"){
               anyDecrypted=true;
               //Adds a new decrypted note object to the decrypted note array for processing into html in compileNotes()
               decryptedNoteArray.push(new DecryptedNote(decryptedMessage,decryptedTitle,noteArray[i].dateSubmitted,i));
          }
     }
     //Sends array of decompiled notes to be compiled into valid html
     if(anyDecrypted) compileNotes(decryptedNoteArray);
     else{
          document.getElementById("noteDisplay").innerHTML="";
          setPopupVisible("red",
          "No notes decrypted. This means either that a) your password did not match any notes or b) there are no notes to decrypt");
     }
}
function compileNotes(decryptedNoteArray){
     //This function compiles an array of decrypted notes into valid html and then displays it in "noteDisplay"
     let container=document.getElementById("noteDisplay");
     let contents="";
     if(decryptedNoteArray.length>0){
          contents="<h1>Decrypted Notes:</h1>";
     }
     //Loops through array to get information from each decrypted note
     for(var i=0;i<decryptedNoteArray.length;i++){
          contents+="<div class='noteDisplayBox'><h1>"+decryptedNoteArray[i].title+"</h1><break></break>";
          contents+="<p>"+decryptedNoteArray[i].decryptedMessage+"</p><break></break>";
          contents+="<input type='button' value='DELETE' onclick='deleteNote("+decryptedNoteArray[i].index+");' />";
          contents+="<p> Unix Time Signature: "+timeConverter(decryptedNoteArray[i].timeSubmitted)+" Index: "+decryptedNoteArray[i].index+"</p></div>";
     }
     container.innerHTML=contents;
}
function decrypt(message,password){
     //Attempts to decrypt the message and password
     try {
          return CryptoJS.AES.decrypt(
               message,
               CryptoJS.SHA512(password).toString())
               .toString(CryptoJS.enc.Utf8);
     }
     catch(err){
          console.log(err);
          //Malformed utf-8 errors occur when converting an incorrectly decrypted note to a utf-8 string.
          //I haven't been able to find a way to check if it has been correctly decrypted before converting it to
          //a string, so I just did this in case it's not a malformed-utf-8 error
     }
}
//Deletes a note at the given index in noteArray
//Not undoable, since it saves the notes afterward
function deleteNote(index){
     noteArray.splice(index,1);
     saveAll();
     decryptNotes();
}
//Saves the note array and theme index to localstorage
function saveAll(){
     localStorage.setItem('notes', JSON.stringify(noteArray));
     localStorage.setItem('themeKey', JSON.stringify(themeKey));
}
//Loads notes and selected theme
function loadAll(){
     //Loads notes from localstorage and parses them from json, checking if the localstorage values
     //have been initialized
     let rawNotes=localStorage.getItem("notes");
     if(rawNotes!=null&&rawNotes!="undefined"&&rawNotes!="") noteArray=JSON.parse(rawNotes);
     else console.log("No notes loaded.");
     //Attempts to load theme index
     let savedIndex=localStorage.getItem('themeKey');
     if(savedIndex!=null&&savedIndex!="undefined"&&savedIndex!="") themeKey=JSON.parse(savedIndex);
     else console.log("Theme index not loaded.");
     loadTheme(themeKey);
}
//Loads theme from string key
function loadTheme(key){
     for (let i=0;i<themes.length;i++){
          if(themes[i].key==key){
               let root = document.documentElement;
               for(let x=0;x<themes[i].savedDeclarations.length;x++) {
                    let key = themes[i].getDeclaration(x).split(":")[0];
                    let value = themes[i].getDeclaration(x).split(":")[1];
                    root.style.setProperty(key,value);
               }
               themeKey=key;
               saveAll();
               return;
          }
     }
     //Only runs if passed key is invalid due to return statement
     console.log("Invalid Key Input: "+key);
}

//TimeConverter from Shomrat on https://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript 
//Converts unix timestamp to date and time
function timeConverter(UNIX_timestamp){
     var a = new Date(UNIX_timestamp);
     var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
     var year = a.getFullYear();
     var month = months[a.getMonth()];
     var date = a.getDate();
     var hour = a.getHours();
     var min = a.getMinutes();
     var sec = a.getSeconds();
     var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
     return time;
}
//Attempts to load notes and theme upon page load
window.onload=function(){
     loadAll();
};