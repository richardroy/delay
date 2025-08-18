import BrowserService from "./services/BrowserService";
import NavigationService from "./services/NavigationService";
import TabNavigationService from "./services/TabNavigationService";

// Service worker: set up listeners only
(function setup () {
  BrowserService.setNavigationTriggerEvent(NavigationService.onNavigationEventTrigged);
  BrowserService.setTabUpdatedEvent(NavigationService.onTabUpdated);
  BrowserService.setNavigationCommittedEvent(NavigationService.onNavigationCommitted);
  BrowserService.setOnExtensionClickedEvent((tab) => TabNavigationService.redirectTabToHome(tab.id));
  BrowserService.setOnClosedEvent(NavigationService.onTabClosed);
})();