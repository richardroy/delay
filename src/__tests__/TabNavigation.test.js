jest.mock("../services/BrowserService");

import TabNavigationService, {BACKGROUND_FILE, HOME_FILE} from "../services/TabNavigationService";
import BrowserService from "../services/BrowserService";
import Blacklist from "../model/Blacklist";

const TAB_ID = 1;
const BACKGROUND_URL = "background.url";
const HOME_URL = "home.url";
const ORIGINAL_URL = "home.url";
const DESIRED_URL = "desired.url";
const REDIRECT_URL = BACKGROUND_URL + "?" + DESIRED_URL;

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

  TabNavigationService.loadDelayedUrl(TAB_ID, BLACKLIST_ENTRY_REDDIT);

  expect(BrowserService.getExtensionUrl).toHaveBeenCalledWith(BACKGROUND_FILE);
  expect(BrowserService.getExtensionUrl).toHaveBeenCalledTimes(1);  
  expect(BrowserService.getTab).toHaveBeenCalledWith(TAB_ID, expect.anything())
})

test("redirectTabToBackground", () => {
  BrowserService.getExtensionUrl = jest.fn().mockReturnValue(BACKGROUND_URL);
  BrowserService.updateTabUrl = jest.fn();
  TabNavigationService.redirectTabToBackground(TAB_ID, DESIRED_URL);
  
  expect(BrowserService.getExtensionUrl).toHaveBeenCalledWith(BACKGROUND_FILE);
  expect(BrowserService.getExtensionUrl).toHaveBeenCalledTimes(1);  
  expect(BrowserService.updateTabUrl).toBeCalledWith(TAB_ID, REDIRECT_URL);
  expect(BrowserService.updateTabUrl).toHaveBeenCalledTimes(1);  
})

test("redirectTabToHome", () => {
  BrowserService.getExtensionUrl = jest.fn().mockReturnValue(HOME_URL);
  BrowserService.updateTabUrl = jest.fn();
  TabNavigationService.redirectTabToHome(TAB_ID);

  expect(BrowserService.getExtensionUrl).toHaveBeenCalledWith(HOME_FILE);
  expect(BrowserService.getExtensionUrl).toHaveBeenCalledTimes(1);  
  expect(BrowserService.updateTabUrl).toBeCalledWith(TAB_ID, HOME_URL);
  expect(BrowserService.updateTabUrl).toHaveBeenCalledTimes(1);  
})