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


  let { loadedEvents, navigatedEvents } = NavEvents.filterEventList();
  const loadedLineData = [];
  const loadedEventKeys = Object.keys(loadedEvents);
  for(const index in loadedEventKeys){
    const roundedEventDate = new Date(loadedEvents[loadedEventKeys[index]].date).setHours(0,0,0,0);
    loadedLineData.push({x: roundedEventDate, y: loadedEvents[loadedEventKeys[index]].count});
  }

  const navigatedLineData = [];
  const navigatedEventKeys = Object.keys(navigatedEvents);
  for(const index in loadedEventKeys){
    const roundedEventDate = new Date(navigatedEvents[navigatedEventKeys[index]].date).setHours(0,0,0,0);    
    navigatedLineData.push({x: roundedEventDate, y: navigatedEvents[navigatedEventKeys[index]].count});
  }

  var ctx = document.getElementById("myChart");
  var myChart = new Chart(ctx, {
      type: 'line',
      data: {
          datasets: [{
            data: navigatedLineData,
            label: '# Navigated',
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)'
            ],
            borderColor: [
              'rgba(255,99,132,1)'
            ],
            pointBackgroundColor: 'rgba(255,99,132,1)',            
            borderWidth: 1
          },{
            data: loadedLineData,
            label: '# Loaded',
            backgroundColor: [
                'rgba(99, 132, 255, 0.2)'
            ],
            borderColor: [
              'rgba(99, 132, 255, 1)'
            ],
            pointBackgroundColor: 'rgba(99, 132, 255, 1)',
            borderWidth: 1            
        }]
      },
      options: {
        hover: {
          mode: 'single'
        },
        legend: {
          display: false
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }],
          xAxes: [{
            type: 'time',
            time: {
              unit: 'day',
              tooltipFormat: 'll'
            }
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
});