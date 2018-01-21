const BACKGROUND_URL = "background.url";
const BACKGROUND_TAB = { url: BACKGROUND_URL }
const HOME_URL = "home.url";
const HOME_TAB = { url: HOME_URL }
class BrowserService {};

const getTab = jest.fn()
.mockImplementationOnce((tabId, callback) => {
  callback(BACKGROUND_TAB);
})
.mockImplementationOnce((tabId, callback) => {
  callback(HOME_TAB);
})
BrowserService.getTab = getTab;

const getExtensionUrl = jest.fn((filename) => {
  return true;
});
BrowserService.getExtensionUrl = getExtensionUrl

const updateTabUrl = jest.fn((tabId, url) => {
  return true;
});
BrowserService.updateTabUrl = updateTabUrl

const setOnExtensionClickedEvent = jest.fn((listener) => {
  return true;
})
BrowserService.setOnExtensionClickedEvent = setOnExtensionClickedEvent

const setNavigationTriggerEvent = jest.fn((listener) => {
  return true;
})
BrowserService.setNavigationTriggerEvent = setNavigationTriggerEvent


export default BrowserService;