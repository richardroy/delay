# Delay  
Link to the [Extension](https://chrome.google.com/webstore/detail/delay/fbhbfbladmbgakfkccbfjpbabagjcmid)  
Identify and remove the habits that have you habitually opening websites.

Create a list of URL's and they will have a delay before the websites displayed. The delay enables you to recognise you've opened a certain URL and gives you time to acknowledge what is typically an unconscious decision. 
Once the tabs delay has expired you can continue browsing blacklisted websites within that tab.

<p align="center">
  <img src="https://lh3.googleusercontent.com/RMXoN8SddGnbCaCECVSj49Ujf5XXQo6JL0GlZ2cnRm-o89-niVM2DFGQXtuv4xkhsy-80uaEoA=w640-h400-e365"/>
</p>


## Running Locally
Clone the repository. Within your teminal run:
```
npm install
npm run watch
```

From within chrome, right click your extensions, within the dropdown select `Manage Extensions`. You'll now be on `chrome://extensions/`.  
At this point you may need to enable `Developer mode` there should be a input in the top right of the screen to enable it.  
Now there should be a button on the upper left of the screen `Load Unpacked`
Select the directory you just cloned the repository into.  
Now the local Delay extension will be using the local version.
