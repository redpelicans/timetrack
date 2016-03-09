# Timetrack on mobile

***********************
Introduction
------------------

This project is a [Timetrack](https://github.com/redpelicans/timetrack/) PoC for android device.

It used with [react-native](https://facebook.github.io/react-native/) 0.2

Soon, I'm going to try for use timetrack redux store. ( reducers / actions / selectors )


***********************
Requirements
------------------

### React Native and android sdk

- react-native: [How to Install](https://facebook.github.io/react-native/docs/getting-started.html)
- android: [How to install](https://facebook.github.io/react-native/docs/android-setup.html#content)

At this point, we need either an android virtual device or a physical android device.

To check this, running  :
```sh
$ adb devices
```
should return something like :

```sh
List of devices attached
07bdb2f7	device
```

### Android SDK Requirements
Need install 2 extra packages.

Go in the Android SDK Manager running : ``` android ```
Install this packages:
- Local Maven repository for Support Libraries
- Google repository

***********************
Installation
------------------
A simple npm install should work :
```
npm install
```

***********************
Build
------------------
### Building debug
- Start the packager server running :
```
make dev
```

- In another terminal, run :
```
make run-android
```

### Building release
#### Get private release.keystore and passwords
- Send a mail to guillaumearm@redpelicans.com to ask him for the release.keystore and gradle.properties files.

- Build apk running :
```
make build-release-apk
```
This will create an app.apk on your project root.

- Install apk on a connected device running :
```
make install-release-apk
```

***********************
Flow type checker
------------------
[Flow](http://flowtype.org/) is a **static type checker** for JavaScript. It can be used to catch common bugs in JavaScript programs before they run.

Check the [official documentation](http://flowtype.org/docs/).

### In practice
For say to flow what file you want to check
- Add this comment at the top of the file :
```javascript
/* @flow */
```

More info [on this page](http://flowtype.org/docs/existing.html).

***************************
