import Blacklist from "./Blacklist";

export default class Home {
  static getBlacklistInputElement() {
    const blackListInput = document.getElementById("blacklistInput");
    return blackListInput;
  }
  
  static getBlacklistInputValue() {
    const blackListInput = this.getBlacklistInputElement();
    return blackListInput.value;
  }
  
  static clearBlacklistUrlInput() {
    const blackListInput = this.getBlacklistInputElement();
    blackListInput.value = '';
  }
  
  static onDeleteClicked(event) {
    const blacklist = Blacklist.load();
    const index = blacklist.indexOf(event.srcElement.previousSibling)
    blacklist.splice(index, 1);
    Blacklist.save(blacklist);
    delete event.srcElement.parentNode.remove();  
  }
  
  static createDeleteButton() {
    const deleteButton = document.createElement("Button");
    deleteButton.id = "deleteButton";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", (event) => this.onDeleteClicked(event))
    return deleteButton;
  }
  
  static createNewBlacklistLiElement(url) {
    const newUrlLi = document.createElement("li");
    newUrlLi.textContent = url;
    const deleteButton = this.createDeleteButton();
    newUrlLi.appendChild(deleteButton);
    return newUrlLi;  
  }
  
  static addNewUrlElementToBlacklist(url) {
    const urlBlacklist = document.getElementById("urlBlacklist");
    const newUrlLi = this.createNewBlacklistLiElement(url);
    urlBlacklist.appendChild(newUrlLi);
  }
  
  static submitNewUrl() {
    const url = this.getBlacklistInputValue();
    this.addNewUrlElementToBlacklist(url);
    Blacklist.addNewUrl(url);  
    this.clearBlacklistUrlInput();
  }
}

document.getElementById("blacklistSubmit").addEventListener("click", Home.submitNewUrl);
document.getElementById("blacklistInput").addEventListener("keypress", (e) => {if(e.keyCode === 13) Home.submitNewUrl();});//submitNewUrl);

window.addEventListener("load", function load(event){ 
  const blacklist = Blacklist.load();
  for(let index in blacklist) {
    const url = blacklist[index];
    Home.addNewUrlElementToBlacklist(url);
  }
})