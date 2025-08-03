import BrowserService from "./services/BrowserService";
import NavigationService from "./services/NavigationService";
import TabNavigationService from "./services/TabNavigationService";
import Element from './Element.js';

const CUSTOM_MESSAGE_ID = "customMessageP";

export default class Background {
  

  static async setCustomMessage() {
    console.log('setCustomMessageAgain');
    const delayTimeElement = Element.getById(CUSTOM_MESSAGE_ID);
    console.log(delayTimeElement);
    delayTimeElement.textContent = 'hello';  
  }
};

(function setupBrowserListeners () {
  BrowserService.setNavigationTriggerEvent(NavigationService.onNavigationEventTrigged);
  BrowserService.setTabUpdatedEvent(NavigationService.onTabUpdated);
  BrowserService.setOnExtensionClickedEvent((tab) => TabNavigationService.redirectTabToHome(tab.id));
  BrowserService.setOnClosedEvent(NavigationService.onTabClosed);
  Background.setCustomMessage();
})()

// window.addEventListener("load", function load(event){ 
  // Background.setCustomMessage();
// });
