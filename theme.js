//Written by Finn Robinson on 23/09/2020
//Simple theme config, stored server side so that themes can be edited without erasing user preferences
//Key rather than index based storage would be good, but not necessary.
let themes = [
     //Default theme, index 0
     ["--main-interactable-colour:rgba(45,30,60,0.75)",
     "--main-uninteractable-colour:rgba(0,0,0,0)",
     "--main-font-colour:white",
     "--main-background-colour:rgba(40,20,30,1)",
     "--main-highlight-colour:yellow",
     "--main-placeholder-colour:darkcyan"],
     //Dark theme, index 1
     ["--main-interactable-colour:rgba(22,22,22,0.6)",
     "--main-uninteractable-colour:rgba(11,11,11,0.6)",
     "--main-font-colour:white",
     "--main-background-colour:black",
     "--main-highlight-colour:darkgreen",
     "--main-placeholder-colour:orange"],
     //Light theme, index 2
     ["--main-interactable-colour:rgba(3,3,3,0.1)",
     "--main-uninteractable-colour:rgba(3,3,3,0.15)",
     "--main-font-colour:black",
     "--main-background-colour:white",
     "--main-highlight-colour:rgba(3,3,3,0.8)",
     "--main-placeholder-colour:darkcyan"],
]