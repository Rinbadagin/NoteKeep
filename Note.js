class Note{
     constructor(encryptedNote,title,verification){
          this.note=encryptedNote.toString();
          this.title=title.toString();
          this.dateSubmitted=Date.now();
          this.verification=verification.toString();
     }
}