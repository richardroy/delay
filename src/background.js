import BrowserService from "./services/BrowserService";
import CoreService from "./services/CoreService";
import TabNavigation from "./TabNavigation";

(function setupBrowserListeners () {
  BrowserService.setNavigationTriggerEvent(CoreService.onNavigationEventTrigged);
  BrowserService.setOnExtensionClickedEvent((tab) => TabNavigation.redirectTabToHome(tab.id));
})()