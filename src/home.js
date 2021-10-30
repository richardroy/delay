import NavEventChart from './NavEventChart.js';
import Blacklist from "./model/Blacklist.js";
import Config from "./model/Config.js";
import Element from './Element.js';
import BulkBlockList from './model/BulkBlockList.js';

const BLACKLIST_ID = "urlBlacklist";
const BLACKLIST_INPUT_ID = "blacklistInput";
const DELAY_TIME_INPUT_ID = "delayTimeInput";
const DELAY_TIME_OUTPUT_ID = "delayTimeOutput";

const DELAY_TIME_MIN = 1;

const URL_MIN_LENGTH = 5;

export default class Home {

  static clearBlacklistUrlInput() {
    const blackListInput = Element.getById(BLACKLIST_INPUT_ID);
    blackListInput.value = '';
  }
  
  static createDeleteButton() {
    const deleteButton = document.createElement("Button");
    deleteButton.id = "deleteButton";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", (event) => this.onDeleteClicked(event))
    return deleteButton;
  }

  static onDeleteClicked(event) {
    const url = event.srcElement.previousSibling.textContent
    Blacklist.deleteByUrl(url);
    delete event.srcElement.parentNode.remove();  
  }

  static setEnabledStatus() {
    const enabledValue = document.querySelector('input[name="active"]:checked').value;
    if(enabledValue)
      Config.setEnabledStatus(enabledValue)
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
    return (url.length >= URL_MIN_LENGTH)
  }

  static setDelayTime() {
    const time = Element.getValueFromId(DELAY_TIME_INPUT_ID);
    const valid = this.validateDelayTime(time);
    if(valid) {
      Config.setDelayTime(time);
      this.setDelayTimeOutputElement(time);
    } else {
      alert("Delay must be more than "+DELAY_TIME_MIN+" seconds")
    }
  }

  static validateDelayTime(time) {
    return (time >= DELAY_TIME_MIN)
  }

  static async buildInitialBlacklist() {
    const blacklist = await Blacklist.load();
    for(let index in blacklist) {
      const url = blacklist[index];
      this.addNewUrlElementToBlacklist(url);
    }
  }

  static async setDelayTimeOutputElement(time) {
    const delayTimeElement = Element.getById(DELAY_TIME_OUTPUT_ID);
    delayTimeElement.textContent = time;  
  }

  static async setInitalDelayTimeElement() {
    this.setDelayTimeOutputElement(await Config.getDelayTime()); 
  }

  static async setInitialEnabledStatus() {
    const enabled = await Config.isExtensionEnabled();
    const enabledElement = document.querySelector('input[value="'+enabled+'"]');
    enabledElement.checked = true;
  }

  static async displayModal() {
    this.loadBulkBlockList();
    var modal = document.getElementById("myModal");
    modal.style.display = "block";
  }

  static async closeModalIfNotSelected(event) {
    var modal = document.getElementById("myModal");
    if (event.target == modal) {
      Home.closeModal();
    }
  }

  static async closeModal() {
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
  }

  static async updateBulkBlockList() {
    var bulkList = document.getElementById("bulkBlockList").value;
    BulkBlockList.save(bulkList);
  }

  static async loadBulkBlockList() {
    const bulkBlockList = await BulkBlockList.load();
    document.getElementById("bulkBlockList").value = bulkBlockList;
  }
}

document.getElementById("blacklistSubmit").addEventListener("click", () => Home.submitNewUrl());
document.getElementById("blacklistInput").addEventListener("keypress", (e) => {if(e.keyCode === 13) Home.submitNewUrl();});
document.getElementById("delayTimeSubmit").addEventListener("click", () => Home.setDelayTime());
document.getElementById("enabledSubmit").addEventListener("click", () => Home.setEnabledStatus());
document.getElementById("bulkBlock").addEventListener("click", () => Home.displayModal());
document.getElementById("bulkBlockUpdate").addEventListener("click", () => Home.updateBulkBlockList());


window.addEventListener("load", function load(event){ 
  Home.buildInitialBlacklist();
  Home.setInitalDelayTimeElement();
  Home.setInitialEnabledStatus();
});

window.addEventListener("click", function(event) {
  Home.closeModalIfNotSelected(event);
});

NavEventChart.initialiseGraph();