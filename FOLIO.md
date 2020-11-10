# Features
Delay is a project created to experience creating something within browsers that wasn't another SPA project.
Using js and minimal npm libraries its minimal soltion to show basic development and build processes.

## Project Structure  
Files are broken into:
- Models
- Services
- Core required Chrome Extension files  
-- home.js && home.html is the page that will load when you select the extension icon  
-- background.js and background.html will be in the background fo every webpage. These will monitor for navigation and tab closed events

### Tests
There are some very basic Unit Tests. These are to show how they can be utilised during the build process, in particular blocking pull-requests.

### Build Process
##### Github
When a pull request is made, circleci triggers a build and will block the pull-request if any of the tests fail.

##### npm build
package.json build script will package the req. files into a zip, this zip is whats uploaded to the chrome webstore when updating the extension.

## Next Steps
The next step would be to create a firefox extension, all chrome browser interfaces are within the BrowserService. This can be renamed so that a FirefoxBrowserService can be created and during the build process a selected browser can be passed in to determine which BrowserService file to include.



