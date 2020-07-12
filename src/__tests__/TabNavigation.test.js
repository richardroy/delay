jest.mock("../services/BrowserService");

import TabNavigation, {BACKGROUND_FILE, HOME_FILE} from "../TabNavigation";
import BrowserService from "../services/BrowserService";
import Blacklist from "../model/Blacklist";

const TAB_ID = 1;
const BACKGROUND_URL = "background.url";
const HOME_URL = "home.url";
const ORIGINAL_URL = "home.url";

const BLACKLIST_ENTRY_REDDIT = {id: 1, url: ORIGINAL_URL, navigatedCount: 0, loadedCount: 0};

beforeEach(() => {
  jest.clearAllMocks();
});

test("create", () => {
  
})

test("loadDelayedUrl", () => {
  BrowserService.ExtensionUrl = jest.fn().mockReturnValue(ORIGINAL_URL);
  BrowserService.getTab = jest.fn();
  Blacklist.addLoadedEvent = jest.fn();

  TabNavigation.loadDelayedUrl(TAB_ID, BLACKLIST_ENTRY_REDDIT);

  expect(BrowserService.getExtensionUrl).toHaveBeenCalledWith(BACKGROUND_FILE);
  expect(BrowserService.getExtensionUrl).toHaveBeenCalledTimes(1);  
  expect(BrowserService.getTab).toHaveBeenCalledWith(TAB_ID, expect.anything())
})

test("redirectTabToBackground", () => {
  BrowserService.getExtensionUrl = jest.fn().mockReturnValue(BACKGROUND_URL);
  BrowserService.updateTabUrl = jest.fn();
  TabNavigation.redirectTabToBackground(TAB_ID);
  
  expect(BrowserService.getExtensionUrl).toHaveBeenCalledWith(BACKGROUND_FILE);
  expect(BrowserService.getExtensionUrl).toHaveBeenCalledTimes(1);  
  expect(BrowserService.updateTabUrl).toBeCalledWith(TAB_ID, BACKGROUND_URL);
  expect(BrowserService.updateTabUrl).toHaveBeenCalledTimes(1);  
})

test("redirectTabToHome", () => {
  BrowserService.getExtensionUrl = jest.fn().mockReturnValue(HOME_URL);
  BrowserService.updateTabUrl = jest.fn();
  TabNavigation.redirectTabToHome(TAB_ID);

  expect(BrowserService.getExtensionUrl).toHaveBeenCalledWith(HOME_FILE);
  expect(BrowserService.getExtensionUrl).toHaveBeenCalledTimes(1);  
  expect(BrowserService.updateTabUrl).toBeCalledWith(TAB_ID, HOME_URL);
  expect(BrowserService.updateTabUrl).toHaveBeenCalledTimes(1);  
})