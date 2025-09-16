# WizLan -  Control your WIZ devices in the local network.##

The company Wiz ([https://www.wizconnected.com/](https://www.wizconnected.com/)) has developed several smart light bulbs and other devices based on a web service interface. In order to be able to use the bulbs and other devices (in the local network) together with Homey, there was a need to develop a new app. The app is not based on any official API from Wiz, and the use of the app is therefore at your own risk.

## Support

Support for all Wiz light bulbs and devices cannot be guaranteed, but most should work. Most wiz light bulbs, lamps, LED strips and smart plugs should work relative to the functionality that the device has (color, dimmable, white color adjustable and smart plug with and without power reading). The current application uses SDK 3 and Homey =>5.0.0.<br><br>
The app is a completely new app (renamed from WizWiFi), but still based on the experiences from the first app WizBulbs. WizBulbs was based on individual products from Wiz, but the new app is based on groups of functionality. This means that you will have direct support for more devices than you had before. There are three groups dealing with light, dimmable, white adjustment / dimming and color. In addition, there are two groups for SmartPlugs (with or without current measurement).<br><br>
The app source is basically "as is.." and no guarantees are given that errors cannot occur. If errors occur or if the app has shortcomings in existing functionality, please report this in bugs on GitHub.<br><br>
Remember that this is an app developed and shared for free with other users. If you were to download and change the app with functionality that others may benefit from, ***please*** submit the changes so that we may be able to include them in future versions.<br><br>
Version 1.1.1 of the app has been tested with a newer version of Wiz light bulb under the brand name Philips. These bulbs turned out to have some later response time than tested light bulb from the company Wiz Connected. It cannot be guaranteed that all Wiz bulbs from Philips work, but those tested worked in the wifi network they were connected to.<br><br>
<b>NEW!</B> The New Version 2.x.x of the app is a remake of the old version. The old drivers in the app will still work as they did before, but all fixes and new features will only be in the new drivers. This means that if you want the fixes (update capabilities etc.) to be included, you will have to delete the old ones and pair them again. The old drivers are set to outdated so that all new devices will get the new drivers.

Latest update 2.2.1 contains a redesign of color-device, new WIZ related flowcards (WIZ_nnnn) that are more adapted to the devices and several bug fixes in the other devices. Only supported devices have been updated, deprecated devices have not been changed, and will not be. The deprecated devices should be replaced with the new devices (see the website for instructions).

# Device setup
To setup the light bulbs, you must use the mobile phone app from Wiz to get each individual light bulb into the wifi network. When this is done, and the light bulbs have been assigned an IP address, you do the pairing. This is done according to the manual method, that is, you get a form where you register the IP address and the name you want to give the device. The app then checks whether it can find the device and whether it is the type you want to register. If everything is ok, the device will be in the app.


## DEVICE FUNCTIONALITY
The following device drivers are new and replace the old ones and also have new functionality. Devices on the old device drivers should be moved to the new ones. This is done by erasing the device and detecting it again.
<center>
<table style="background:#cce6ff">
  <tr>
    <th style="width:150px">Device</th>
    <th  style="width:75px">On/Off</th>
    <th  style="width:75px">Dim.</th>
    <th  style="width:75px">Temp.</th>
    <th  style="width:75px">RGB Color</th>
    <th  style="width:75px">Scenery</th>
    <th  style="width:75px">Power mshr.</th>
    <th  style="width:75px">Tested</th>
  </tr>
  <tr>
    <td><b>Dimmable devices<br><i>(Dimmable Light)</i></b></td>
    <td style="text-align:center"><br><b>&checkmark;</b></td>
    <td style="text-align:center"><br><b>&checkmark;</b></td>
    <td style="text-align:center"><br><b></b></td>
    <td style="text-align:center"> </td>
    <td style="text-align:center"><br><b></b></td>
    <td style="text-align:center"> </td>
    <td style="text-align:center"><br><b>&checkmark;</b></td>
  </tr>
  <tr>
    <td><b>Full color devices<br><i>(Color Light)</i></b></td>
    <td style="text-align:center"><br><b>&checkmark;</b></td>
    <td style="text-align:center"><br><b>&checkmark;</b></td>
    <td style="text-align:center"><br><b>&checkmark;</b></td>
    <td style="text-align:center"><br><b>&checkmark;</b></td>
    <td style="text-align:center"><br><b>&checkmark;</b></td>
    <td style="text-align:center"> </td>
    <td style="text-align:center"><br><b>&checkmark;</b></td>
  </tr>
<tr>
    <td><b>Tuneable white devices<br><i>(Tuneable Light)</i></b></td>
    <td style="text-align:center"><br><b>&checkmark;</b></td>
    <td style="text-align:center"><br><b>&checkmark;</b></td>
    <td style="text-align:center"><br><b>&checkmark;</b></td>
    <td style="text-align:center"><br><b></b></td>
    <td style="text-align:center"><br><b>&checkmark;</b></td>
    <td style="text-align:center"><br></td>
    <td style="text-align:center"><br><b>&checkmark;</b></td>
  </tr>
<tr>
    <td><b>On/off smartplugg<br><i>(Socket)</i></b></td>
    <td style="text-align:center"><br><b>&checkmark;</b></td>
    <td style="text-align:center"><br></td>
    <td style="text-align:center"><br></td>
    <td style="text-align:center"><br></td>
    <td style="text-align:center"><br></td>
    <td style="text-align:center"><br></td>
    <td style="text-align:center"><br><b>&checkmark;</b></td>
  </tr>
<tr>
    <td><b>Smartplug w/powermeter<br><i>(Energy Socket)</i></b></td>
    <td style="text-align:center"><br><b>&checkmark;</b></td>
    <td style="text-align:center"><br></td>
    <td style="text-align:center"><br></td>
    <td style="text-align:center"><br></td>
    <td style="text-align:center"><br></td>
    <td style="text-align:center"><br><b>&checkmark;</b></td>
    <td style="text-align:center"><br><b>&checkmark;</b></td>
  </tr>
</table></center>
<br><br>
## DOKUMENTATION
Documentation of the WizBulbs app can be found on the website: [https://www.boyum.priv.no/WizWiFi/](https://www.boyum.priv.no/WizWiFi/)
<br><br>
# Remarks
This app source is experimental and are used on Your own risk. The app is not based an official library from Wiz and all use of the app is at your own risk.

# Change log

**1.0.0** First Version of WizLan app (renamed from WizWiFi) modefied to meet standards. <br>
**1.0.1** Fixed timeout and type errors. <br>
**1.0.2** Bug fixes after Homey test.<br>
**1.0.3** Modified UDP communication.<br>
**1.0.4** Added Swedish translation, bugfix.<br> 
**1.0.5** Fixed type errors and Wiz command errors. <br>
**1.0.6** Corrected errors discovered in testing.<br> 
**1.0.7** Corrected logical error in device WizColor and WizTunable. <br>

**1.1.0** Modified version of the local network APP WizLan. The app reduces the vulnerability of removing a cloud service.<br> 
**1.1.1** Bug fix and tested with Wiz bulbs from Philips.<br>
**1.1.2** Bug fix after Philips lightbulb changes.<br><br>
**2.0.0** Initial version for testing.<br>
**2.0.1** Release version of 2.x.x<br>
**2.0.2** Bug fixes after release.<br>
**2.0.3** Bug fixes and modified internal parameters.<br>
**2.0.4** Bug fixes app/interface and modified internal parameters.<br>
**2.1.0** Added AI translation to German and Dutch. Added additional JSON exception handling.<br>
**2.1.1** Added object type check to old deprecated drivers.<br>
**2.2.0** Added WIZ related flowcharts WIZ_x and bug fixes<br>
**2.2.1** Redesign of color-device and WIZ flowcard. Bug fixes.<br>

#Licens
[MIT](https://github.com)


