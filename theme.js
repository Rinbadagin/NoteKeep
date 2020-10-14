//Written by Finn Robinson on 23/09/2020
//Simple theme config, stored server side so that themes can be edited without erasing user preferences
//Since I updated this with a Theme class that has methods for altering the style,
//It wouldn't be very difficult to make the entire theme system user customizable

//Sidenote 2: The theme system could allow for two themes to be used at once, with priority for one
//over the other. This would mean that each colour theme could be used in conjunction with a font
//theme, instead of having two have multiple versions of each colour theme

class Theme {
     //Constructor allows an array as input alongside a key or title
     //Copies css declarations and saves them in its own array
     constructor(key,input){
          this.savedDeclarations = input;
          this.key=key;
     }
     loadTheme(){
          let root = document.documentElement;
          for (let i=0;i<this.savedDeclarations.length;i++){
               let key = this.savedDeclarations[i].split(":")[0];
               let value = this.savedDeclarations[i].split(":")[1];
               root.style.setProperty(key,value);
          }
     }
     //Takes a css declaration in the format "attribute:value"
     //And saves it to the savedDeclarations
     setDeclaration(declaration){
          for(let i=0;i<this.savedDeclarations.length;i++){
               let key = this.savedDeclarations[i].split(":")[0];
               let value = this.savedDeclarations[i].split(":")[1];
               //Replaces current declaration if they have the same key
               //Avoids multiple declarations on the same attribute
               if(key==declaration.split(":")[0]) {
                    savedDeclarations[i]=declaration;
                    //Short circuit evaluation hack, only runs 
                    //code below for if this value hasn't been set
                    return;
               }
          }
          //Adds declaration to saved declarations if that attribute hasn't been added yet
          savedDeclarations.push(declaration);
     }
     //Returns css declaration from given index if it is valid
     getDeclaration(index){
          if(index>this.savedDeclarations.length) {
               console.log("Invalid getDeclaration: index out of bounds.");
               return;
          }
          return this.savedDeclarations[index];
     }
}
let themes = [
     //Default theme, index 0
     new Theme("default",
     ["--main-interactable-colour:rgba(45,30,60,0.75)",
     "--main-uninteractable-colour:rgba(0,0,0,0)",
     "--main-font-colour:white",
     "--main-background-colour:rgba(40,20,30,1)",
     "--main-highlight-colour:yellow",
     "--main-placeholder-colour:darkcyan",
     "--main-font-type:'DOS VGA 437'"]),
     //Dark theme, index 1
     new Theme("dark",
     ["--main-interactable-colour:rgba(22,22,22,0.6)",
     "--main-uninteractable-colour:rgba(11,11,11,0.6)",
     "--main-font-colour:white",
     "--main-background-colour:black",
     "--main-highlight-colour:darkslateblue",
     "--main-placeholder-colour:orange",
     "--main-font-type:'DOS VGA 437'"]),
     //Light theme, index 2
     new Theme("light",
     ["--main-interactable-colour:rgba(3,3,3,0.1)",
     "--main-uninteractable-colour:rgba(3,3,3,0.15)",
     "--main-font-colour:black",
     "--main-background-colour:white",
     "--main-highlight-colour:rgba(3,3,3,0.8)",
     "--main-placeholder-colour:darkcyan",
     "--main-font-type:'DOS VGA 437'"]),
     new Theme("modern_light",
     ["--main-interactable-colour:rgba(3,3,3,0.1)",
     "--main-uninteractable-colour:rgba(3,3,3,0.15)",
     "--main-font-colour:black",
     "--main-background-colour:white",
     "--main-highlight-colour:rgba(3,3,3,0.8)",
     "--main-placeholder-colour:darkcyan",
     "--main-font-type:'Roboto'"]),
     new Theme("modern_dark",
     ["--main-interactable-colour:rgba(22,22,22,0.6)",
     "--main-uninteractable-colour:rgba(11,11,11,0.6)",
     "--main-font-colour:white",
     "--main-background-colour:black",
     "--main-highlight-colour:darkslateblue",
     "--main-placeholder-colour:orange",
     "--main-font-type:'Roboto'"]),
     new Theme("modern_default",
     ["--main-interactable-colour:rgba(45,30,60,0.75)",
     "--main-uninteractable-colour:rgba(0,0,0,0)",
     "--main-font-colour:white",
     "--main-background-colour:rgba(40,20,30,1)",
     "--main-highlight-colour:yellow",
     "--main-placeholder-colour:darkcyan",
     "--main-font-type:'Roboto'"])
]