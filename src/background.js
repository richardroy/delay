import BrowserService from "./services/BrowserService";
import NavigationService from "./services/NavigationService";
import TabNavigationService from "./services/TabNavigationService";

(function setupBrowserListeners () {
  BrowserService.setNavigationTriggerEvent(NavigationService.onNavigationEventTrigged);
  BrowserService.setTabUpdatedEvent(NavigationService.onTabUpdated);
  BrowserService.setOnExtensionClickedEvent((tab) => TabNavigationService.redirectTabToHome(tab.id));
  BrowserService.setOnClosedEvent(NavigationService.onTabClosed);
})()