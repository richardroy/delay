import BrowserService from "./services/BrowserService";
import NavigationService from "./services/NavigationService";
import TabNavigationService from "./services/TabNavigationService";
import Element from './Element.js';
import Config from './model/Config.js'

const CUSTOM_MESSAGE_ID = "customMessageP";

export default class Background {
  

  static async setCustomMessage() {
    const customMessage = await Config.getCustomMessage();
    const delayTimeElement = Element.getById(CUSTOM_MESSAGE_ID);
    delayTimeElement.textContent = customMessage;  
  }
};

(function setupBrowserListeners () {
  BrowserService.setNavigationTriggerEvent(NavigationService.onNavigationEventTrigged);
  BrowserService.setTabUpdatedEvent(NavigationService.onTabUpdated);
  BrowserService.setOnExtensionClickedEvent((tab) => TabNavigationService.redirectTabToHome(tab.id));
  BrowserService.setOnClosedEvent(NavigationService.onTabClosed);
  Background.setCustomMessage();
})()