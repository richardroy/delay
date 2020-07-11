import NavEventChart from './NavEventChart';
import Blacklist from "./Blacklist";
import Config from "./Config";
import Element from './Element';

const BLACKLIST_ID = "urlBlacklist";
const BLACKLIST_INPUT_ID = "blacklistInput";
const DELAY_TIME_INPUT_ID = "delayTimeInput";
const DELAY_TIME_OUTPUT_ID = "delayTimeOutput";

const DELAY_TIME_MIN = 1;
const DELAY_TIME_MAX = 300;

const URL_MIN_LENGTH = 5;

export default class Home {

  static clearBlacklistUrlInput() {
    const blackListInput = Element.getById(BLACKLIST_INPUT_ID);
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
    const urlBlacklist = Element.getById(BLACKLIST_ID);
    const newUrlLi = this.createNewBlacklistLiElement(url);
    urlBlacklist.appendChild(newUrlLi);
  }
  
  static submitNewUrl() {
    const url = Element.getValueFromId(BLACKLIST_INPUT_ID);
    const isValid = this.validateURL(url)
    if(isValid) {
      Blacklist.addNewUrl(url);  
      this.addNewUrlElementToBlacklist(url);
      this.clearBlacklistUrlInput();
    } else {
      alert("The URL should be atleast 5 characters long");
    }
  }

  static validateURL(url) {
    return (url.length >= 5)
  }

  static setDelayTime() {
    const time = Element.getValueFromId(DELAY_TIME_INPUT_ID);
    const valid = this.validateDelayTime(time);
    if(valid) {
      Config.setDelayTime(time);
      this.setDelayTimeOutputElement(time);
    } else {
      alert("Delay must be between "+DELAY_TIME_MIN+" and "+DELAY_TIME_MAX+" seconds")
    }
  }

  static validateDelayTime(time) {
    return (time >= DELAY_TIME_MIN && time <= DELAY_TIME_MAX)
  }

  static buildInitialBlacklist() {
    const blacklist = Blacklist.load();
    for(let index in blacklist) {
      const url = blacklist[index].url;
      this.addNewUrlElementToBlacklist(url);
    }
  }

  static setDelayTimeOutputElement(time) {
    const delayTimeElement = Element.getById(DELAY_TIME_OUTPUT_ID);
    delayTimeElement.textContent = time;  
  }

  static setInitalDelayTimeElement() {
    this.setDelayTimeOutputElement(Config.getDelayTime()); 
  }
}

document.getElementById("blacklistSubmit").addEventListener("click", () => Home.submitNewUrl());
document.getElementById("blacklistInput").addEventListener("keypress", (e) => {if(e.keyCode === 13) Home.submitNewUrl();});
document.getElementById("delayTimeSubmit").addEventListener("click", () => Home.setDelayTime());

window.addEventListener("load", function load(event){ 
  Home.buildInitialBlacklist();
  Home.setInitalDelayTimeElement();
});

NavEventChart.initialiseGraph();