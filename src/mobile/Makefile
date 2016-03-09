####################################################
#### react-native-android-boilerplate Helper #######
####################################################

################################################################################
### PROGRAMS ###
CP := cp
NODE := node
GRADLE := cd android && ./gradlew

### RULES ###
help:
	@echo "-----------------------------------------------------"
	@echo "------ react-native-android-boilerplate Helper ------"
	@echo "-----------------------------------------------------"
	@echo "User Environments variables :"
	@echo "\t KEY_ALIAS (used by gen-apk-key rule): $(KEY_ALIAS)"
	@echo "\t DEBUG_IP (used by configure-debug-android rule): $(DEBUG_IP)"
	@echo
	@echo "Rules :"
	@echo " --------- BASIC -----------"
	@echo "\t help \t\t\t\t This help page."
	@echo "\t clean-apk \t\t\t Apply a gradle clean for delete builded files."
	@echo "\t clean-cache \t\t\t Remove react stuffs in cache."
	@echo "\t clean \t\t\t\t Apply clean-apk and clean-cache rules."
	@echo "\t clean-all \t\t\t Apply clean-apk, clean-cache and uninstall-all-apk rules."
	@echo
	@echo " --------- ANDROID KEYS -----------"
	@echo "\t gen-apk-key \t\t\t generate apk release keystore. (using KEY_ALIAS environment variable)"
	@echo "\t show-debug-key \t\t show key informations about your debug keystore."
	@echo "\t show-release-key \t\t show key informations about your release keystore."
	@echo
	@echo " --------- DEVELOPMENT -----------"
	@echo "\t dev \t\t\t\t Start the react-native dev server packager."
	@echo "\t run-android \t\t\t Install and launch app on your device (debug mode)."
	@echo
	@echo " --------- DEBUG -----------"
	@echo "\t build-debug-apk \t\t build ./app.apk file."
	@echo "\t rebuild-debug-apk \t\t rebuild ./app.apk file."
	@echo "\t install-debug-apk \t\t install debug apk on a connected device."
	@echo "\t uninstall-debug-apk \t\t uninstall debug apk."
	@echo
	@echo " --------- RELEASE -----------"
	@echo "\t build-release-apk \t\t build ./app.apk"
	@echo "\t rebuild-release-apk \t\t rebuild ./app.apk file."
	@echo "\t install-release-apk \t\t install release apk on a connected device."
	@echo "\t uninstall-release-apk \t\t uninstall release apk."
	@echo
	@echo " --------- MISC -----------"
	@echo "\t uninstall-all-apk \t\t uninstall all apk (debug and release)."
	@echo "\t configure-debug-android \t send some key events to your device for automatically configure debug app with your local ip address (using DEBUG_IP environment variable)."
	@echo "\t run-android-then-configure \t run-android rule -> wait 10 seconds -> configure-debug-android rule"
	@echo

clean: clean-cache clean-apk
	@echo --- clean done.

clean-apk:
	@echo --- Delete app.apk
	@$(RM) app.apk
	@echo --- Apply Gradle clean
	@$(GRADLE) clean
	@echo --- Remove build directories
	@$(RM) -r android/build && $(RM) -r android/app/build
	@echo --- clean-apk done.

clean-cache:
	@[ -d "$(TMPDIR)" ] || \
			(echo --- clean-cache ERROR: TMPDIR environment variable is not defined && false)
	@$(RM) -f $(TMPDIR)/react-*
	@echo --- clean-cache done.

clean-all: clean-cache clean-apk uninstall-all-apk
	@echo --- clean-all done.

gen-apk-key:
	@if [ -f "params/release.keystore" ] ; then \
		echo --- ERROR: for regenerate keystore, remove params/release.keystore && false \
	; fi
	@if [ "$(KEY_ALIAS)" == "" ] ; then \
		echo --- ERROR: must have a KEY_ALIAS environment variable && false\
	; fi
	@keytool -genkey -v -keystore params/release.keystore -alias $(KEY_ALIAS) -keyalg RSA -keysize 2048 -validity 10000
	@echo --- gen-apk-key done.
	@echo "--- Edit the file '~/.gradle/gradle.properties' and add the following"
	@echo "DEFAULT_RELEASE_STORE_FILE=release.keystore"
	@echo "DEFAULT_RELEASE_KEY_ALIAS=$(KEY_ALIAS)"
	@echo "DEFAULT_RELEASE_STORE_PASSWORD=<storePassword>"
	@echo "DEFAULT_RELEASE_KEY_PASSWORD=<keyPassword>"

show-debug-key:
	@echo --- Default password is : android && keytool -list -v -keystore ~/.android/debug.keystore
	@echo --- show-debug-key done.

show-release-key:
	@keytool -list -v -keystore params/release.keystore
	@echo --- show-release-key done.

dev: clean-cache
	@echo --- Starting react-native server packager...
	@$(NODE) $(NODEFLAGS) ./node_modules/react-native/local-cli/cli.js start
	@echo --- dev done.

run-android: uninstall-all-apk
	@echo --- Building and running app on your device...
	@react-native run-android
	@echo --- run-android done.

build-debug-apk:
	@echo --- Build debug app...
	@$(GRADLE) assembleDebug
	@$(CP) android/app/build/outputs/apk/app-debug.apk app.apk
	@echo --- build-debug-apk done.

rebuild-debug-apk: clean-apk build-debug-apk
	@echo --- rebuild-debug-apk done.

install-debug-apk: uninstall-all-apk
	@echo --- Install debug app...
	@$(GRADLE) installDebug
	@echo --- install-debug-apk done.

uninstall-debug-apk:
	@echo --- Uninstall debug app...
	@$(GRADLE) uninstallDebug
	@echo --- uninstall-debug-apk done.


build-release-apk:
	@echo --- Build release app...
	@$(GRADLE) assembleRelease
	@$(CP) android/app/build/outputs/apk/app-release.apk app.apk
	@echo --- build-release-apk done.

rebuild-release-apk: clean-apk build-release-apk
	@echo --- rebuild-release-apk done.

install-release-apk: uninstall-all-apk
	@echo --- Install release app...
	@$(GRADLE) installRelease
	@echo --- install-release-apk done.

uninstall-release-apk:
	@echo --- Uninstall release app...
	@$(GRADLE) uninstallRelease
	@echo --- uninstall-release-apk done.

uninstall-all-apk:
	@echo --- Uninstall all app...
	@$(GRADLE) uninstallAll
	@echo --- uninstall-all-apk done.

configure-debug-android:
	@echo --- Sending sequences keyevent sequences to the device.
	@adb shell input keyevent 82 20 20 20 20 20 20 20 23
	@adb shell input keyevent 20 20 20 23
	@adb shell input keyevent 123 67 67 67 67 67 67 67 67 67 67 67 67 67 67 67 67 67 67 67 67 67 67
	@adb shell input text "$(DEBUG_IP)"
	@adb shell input keyevent 20 23
	@adb shell input keyevent 4
	@adb shell input keyevent 82
	@adb shell input keyevent 23 23
	@echo --- configure-debug-android done.

run-android-then-configure: run-android
	@echo --- Waiting 10 seconds...
	@sleep 10 && $(MAKE) configure-debug-android
	@echo --- run-android-then-configure done.

PHONY: help clean-apk clean clean-cache clean-all native-init native-rename gen-apk-key show-debug-key dev run-android build-debug-apk rebuild-debug-apk install-debug-apk uninstall-debug-apk build-release-apk rebuild-release-apk install-release-apk uninstall-release-apk uninstall-all-apk configure-debug-android run-android-then-configure
