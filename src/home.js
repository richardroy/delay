import NavEventChart from './NavEventChart.js';
import Blacklist from "./model/Blacklist.js";
import Config from "./model/Config.js";
import Element from './Element.js';
import BulkBlockList from './model/BulkBlockList.js';
import Whitelist from './model/Whitelist.js';

const BLACKLIST_ID = "urlBlacklist";
const BLACKLIST_INPUT_ID = "blacklistInput";
const WHITELIST_ID = "urlWhitelist";
const WHITELIST_INPUT_ID = "whitelistInput";
const BLOCK_ALL_CHECKBOX_ID = "blockAll";
const TYPED_REDELAY_CHECKBOX_ID = "typedReDelay";
const DELAY_TIME_INPUT_ID = "delayTimeInput";
const DELAY_TIME_OUTPUT_ID = "delayTimeOutput";
const CUSTOM_MESSAGE_ID = "customMessageInput";

const DELAY_TIME_MIN = 1;

const URL_MIN_LENGTH = 5;

export default class Home {

  static clearBlacklistUrlInput() {
    const blackListInput = Element.getById(BLACKLIST_INPUT_ID);
    blackListInput.value = '';
  }

  static clearWhitelistUrlInput() {
    const whitelistInput = Element.getById(WHITELIST_INPUT_ID);
    whitelistInput.value = '';
  }
  
  static createDeleteButton() {
    const deleteButton = document.createElement("Button");
    deleteButton.id = "deleteButton";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", (event) => this.onDeleteClicked(event))
    return deleteButton;
  }

  static createDeleteButtonWhitelist() {
    const deleteButton = document.createElement("Button");
    deleteButton.id = "deleteButtonWhitelist";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", (event) => this.onDeleteClickedWhitelist(event))
    return deleteButton;
  }

  static onDeleteClicked(event) {
    const url = event.srcElement.previousSibling.textContent
    Blacklist.deleteByUrl(url);
    delete event.srcElement.parentNode.remove();  
  }

  static onDeleteClickedWhitelist(event) {
    const url = event.srcElement.previousSibling.textContent
    Whitelist.deleteByUrl(url);
    delete event.srcElement.parentNode.remove();
  }

  static onSetMessageClicked() {
    const customMessage = Element.getValueFromId(CUSTOM_MESSAGE_ID);
    Config.setCustomMessage(customMessage);
  }

  static setEnabledStatus() {
    const enabledValue = document.querySelector('input[name="active"]:checked').value;
    if(enabledValue)
      Config.setEnabledStatus(enabledValue)
  }

  static async initialiseEnabledRadio() {
    const enabled = await Config.isExtensionEnabled();
    if(enabled) {
      const input = document.querySelector('input[id="enabled"]');
      input.checked = true;
    } else { 
      const input = document.querySelector('input[id="disabled"]');
      input.checked = true;
    }
  }

  static async initialiseIncEnabledRadio() {
    const enabled = await Config.isIncEnabled();
    if(enabled) {
      const input = document.querySelector('input[id="incEnabled"]');
      input.checked = true;
    } else { 
      const input = document.querySelector('input[id="incDisabled"]');
      input.checked = true;
    }
  }

  static setIncEnabledStatus() {
    const incEnabledValue = document.querySelector('input[name="incActive"]:checked').value;
    if(incEnabledValue)
      Config.setIncEnabledStatus(incEnabledValue)
  }

  static initialiseIncEnabled() {
    const incEnabledValue = document.querySelector('input[id="incActive"]').value;
  }
  
  static createNewBlacklistLiElement(url) {
    const newUrlLi = document.createElement("li");
    newUrlLi.textContent = url;
    const deleteButton = this.createDeleteButton();
    newUrlLi.appendChild(deleteButton);
    return newUrlLi;  
  }

  static createNewWhitelistLiElement(url) {
    const newUrlLi = document.createElement("li");
    newUrlLi.textContent = url;
    const deleteButton = this.createDeleteButtonWhitelist();
    newUrlLi.appendChild(deleteButton);
    return newUrlLi;
  }
  
  static addNewUrlElementToBlacklist(url) {
    const urlBlacklist = Element.getById(BLACKLIST_ID);
    const newUrlLi = this.createNewBlacklistLiElement(url);
    urlBlacklist.appendChild(newUrlLi);
  }

  static addNewUrlElementToWhitelist(url) {
    const urlWhitelist = Element.getById(WHITELIST_ID);
    const newUrlLi = this.createNewWhitelistLiElement(url);
    urlWhitelist.appendChild(newUrlLi);
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

  static submitNewWhitelistUrl() {
    const url = Element.getValueFromId(WHITELIST_INPUT_ID);
    const isValid = this.validateURL(url)
    if(isValid) {
      Whitelist.addNewUrl(url);
      this.addNewUrlElementToWhitelist(url);
      this.clearWhitelistUrlInput();
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

  static async buildInitialWhitelist() {
    const whitelist = await Whitelist.load();
    for (let index in whitelist) {
      const url = whitelist[index];
      this.addNewUrlElementToWhitelist(url);
    }
  }

  static async setDelayTimeOutputElement(time) {
    const delayTimeElement = Element.getById(DELAY_TIME_OUTPUT_ID);
    delayTimeElement.textContent = time;  
  }

  static async setInitalDelayTimeElement() {
    this.setDelayTimeOutputElement(await Config.getDelayTime()); 
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

  static async initialiseBlockAllCheckbox() {
    const enabled = await Config.isBlockAllEnabled();
    const cb = document.getElementById(BLOCK_ALL_CHECKBOX_ID);
    if (cb) cb.checked = !!enabled;
  }

  static async setBlockAllStatus() {
    const cb = document.getElementById(BLOCK_ALL_CHECKBOX_ID);
    if (cb) {
      await Config.setBlockAllStatus(cb.checked);
    }
  }

  static async initialiseTypedReDelayCheckbox() {
    const enabled = await Config.isTypedReDelayEnabled();
    const cb = document.getElementById(TYPED_REDELAY_CHECKBOX_ID);
    if (cb) cb.checked = !!enabled;
  }

  static async setTypedReDelayStatus() {
    const cb = document.getElementById(TYPED_REDELAY_CHECKBOX_ID);
    if (cb) await Config.setTypedReDelayStatus(cb.checked);
  }
}

document.getElementById("blacklistSubmit").addEventListener("click", () => Home.submitNewUrl());
document.getElementById("customMessage").addEventListener("click", () => Home.onSetMessageClicked());
document.getElementById("blacklistInput").addEventListener("keypress", (e) => {if(e.keyCode === 13) Home.submitNewUrl();});
document.getElementById("delayTimeSubmit").addEventListener("click", () => Home.setDelayTime());
document.getElementById("enabledSubmit").addEventListener("click", () => Home.setEnabledStatus());
document.getElementById("incEnabledSubmit").addEventListener("click", () => Home.setIncEnabledStatus());
document.getElementById("bulkBlock").addEventListener("click", () => Home.displayModal());
document.getElementById("bulkBlockUpdate").addEventListener("click", () => Home.updateBulkBlockList());
document.getElementById("whitelistSubmit").addEventListener("click", () => Home.submitNewWhitelistUrl());
document.getElementById("whitelistInput").addEventListener("keypress", (e) => { if(e.keyCode === 13) Home.submitNewWhitelistUrl(); });
document.getElementById("blockAllSubmit").addEventListener("click", () => Home.setBlockAllStatus());
document.getElementById("typedReDelaySubmit").addEventListener("click", () => Home.setTypedReDelayStatus());

window.addEventListener("load", function load(event){ 
  Home.buildInitialBlacklist();
  Home.buildInitialWhitelist();
  Home.setInitalDelayTimeElement();
  Home.initialiseEnabledRadio();
  Home.initialiseIncEnabledRadio();
  Home.initialiseBlockAllCheckbox();
  Home.initialiseTypedReDelayCheckbox();
});

window.addEventListener("click", function(event) {
  Home.closeModalIfNotSelected(event);
});

NavEventChart.initialiseGraph();