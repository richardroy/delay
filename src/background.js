import BrowserService from "./services/BrowserService";
import NavigationService from "./services/NavigationService";
import TabNavigation from "./TabNavigation";

(function setupBrowserListeners () {
  BrowserService.setNavigationTriggerEvent(NavigationService.onNavigationEventTrigged);
  BrowserService.setOnExtensionClickedEvent((tab) => TabNavigation.redirectTabToHome(tab.id));
  BrowserService.setOnClosedEvent(NavigationService.onTabClosed);
})()