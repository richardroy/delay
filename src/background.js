import BrowserService from "./services/BrowserService";
import CoreService from "./services/CoreService";
(function setupBrowserListeners () {
  BrowserService.setNavigationTriggerEvent(CoreService.onNavigationEventTrigged);
  BrowserService.setOnExtensionClickedEvent((tab) => Tab.redirectTabToHome(tab.id));
})()