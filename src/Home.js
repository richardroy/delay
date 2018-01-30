import Blacklist from "./Blacklist";
import NavEvents from "./NavEvents";
import Config from "./Config";
import Chart from 'chart.js';

export default class Home {
  static getBlacklistInputElement() {
    const blackListInput = document.getElementById("blacklistInput");
    return blackListInput;
  }

  static getDelayTimeInputElement() {
    const delayTimeInput = document.getElementById("delayTimeInput");
    return delayTimeInput;
  }

  static getDelayTimeOuputElement() {
    const delayTimeOutput = document.getElementById("delayTimeOutput");
    return delayTimeOutput;
  }
  
  static getBlacklistInputValue() {
    const blackListInput = this.getBlacklistInputElement();
    return blackListInput.value;
  }

  static getDelayTimeInputValue() {
    const dealyTimeInput = this.getDelayTimeInputElement();
    return delayTimeInput.value;
  }

  static getDelayTimeOutputValue() {
    const delayTimeOutput = this.getDelayTimeOuputElement();
    return delayTimeOutput.value;
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

  static setDelayTime() {
    const time = this.getDelayTimeInputValue();
    Config.setDelayTime(time);
    this.setDelayTimeOutputElement(time);
  }

  static buildInitialBlacklist() {
    const blacklist = Blacklist.load();
    for(let index in blacklist) {
      const url = blacklist[index].url;
      this.addNewUrlElementToBlacklist(url);
    }
  }

  static setDelayTimeOutputElement(time) {
    const delayTimeElement = this.getDelayTimeOuputElement();
    delayTimeElement.textContent = time;  
  }

  static setInitalDelayTimeElement() {
    this.setDelayTimeOutputElement(Config.getDelayTime()); 
  }
}

function getDateString(millis) {
  const date = new Date(millis);
  const dateString = date.getFullYear().toString() + date.getMonth().toString() + date.getDate().toString();
  return dateString;
}
  const navEvents = NavEvents.load();  
  const loadedTimes = [];
  const navigatedTimes = [];
  const loadedEvents = {};
  const navigatedEvents = {};
  

  for(const index in navEvents) {
    if(navEvents[index].type === "loaded") {
      const uniqueDate = getDateString(navEvents[index].time);
      if(loadedEvents[uniqueDate]) {
        loadedEvents[uniqueDate].count += 1;
      } else {
        loadedEvents[""+uniqueDate] = {}
        loadedEvents[""+uniqueDate].date = navEvents[index].time;
        loadedEvents[""+uniqueDate].count = 1;
      }
      loadedTimes.push({x: new Date(navEvents[index].time), y:1});
    } else if(navEvents[index].type === "navigated") {
      const uniqueDate = getDateString(navEvents[index].time);
      if(navigatedEvents[uniqueDate]) {
        navigatedEvents[uniqueDate].count += 1;
      } else {
        navigatedEvents[""+uniqueDate] = {}
        navigatedEvents[""+uniqueDate].date = navEvents[index].time;
        navigatedEvents[""+uniqueDate].count = 1;
      }
      loadedTimes.push({x: new Date(navEvents[index].time), y:1});
    }
  }

  const loadedLineData = [];
  const loadedEventKeys = Object.keys(loadedEvents);
  for(const index in loadedEventKeys){
    loadedLineData.push({x: loadedEvents[loadedEventKeys[index]].date, y: loadedEvents[loadedEventKeys[index]].count});
  }

  const navigatedLineData = [];
  const navigatedEventKeys = Object.keys(navigatedEvents);
  for(const index in loadedEventKeys){
    navigatedLineData.push({x: navigatedEvents[navigatedEventKeys[index]].date, y: navigatedEvents[navigatedEventKeys[index]].count});
  }


  var ctx = document.getElementById("myChart");
  var myChart = new Chart(ctx, {
      type: 'line',
      data: {
          datasets: [{
              data: loadedLineData,
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)'
              ],
              borderColor: [
                'rgba(255,99,132,1)'
              ],
              borderWidth: 1
          },{
            data: navigatedLineData,
            pointHitRadius: 0,
            backgroundColor: [
                'rgba(99, 132, 255, 0.2)'
            ],
            borderColor: [
              'rgba(99, 132, 255, 1)'
            ],
            borderWidth: 1
        }]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero:true
            }
          }],
          xAxes: [{
            type: 'time'
          }]
        },
        responsive: false
      }
  });

document.getElementById("blacklistSubmit").addEventListener("click", () => Home.submitNewUrl());
document.getElementById("blacklistInput").addEventListener("keypress", (e) => {if(e.keyCode === 13) Home.submitNewUrl();});//submitNewUrl);

document.getElementById("delayTimeSubmit").addEventListener("click", () => Home.setDelayTime());

window.addEventListener("load", function load(event){ 
  Home.buildInitialBlacklist();
  Home.setInitalDelayTimeElement();
})