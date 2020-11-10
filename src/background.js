import BrowserService from "./services/BrowserService";
import NavigationService from "./services/NavigationService";
import TabNavigationService from "./TabNavigationService";

(function setupBrowserListeners () {
  BrowserService.setNavigationTriggerEvent(NavigationService.onNavigationEventTrigged);
  BrowserService.setOnExtensionClickedEvent((tab) => TabNavigationService.redirectTabToHome(tab.id));
  BrowserService.setOnClosedEvent(NavigationService.onTabClosed);
})()