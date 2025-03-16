---
title: "Which Locale? Decoding the Madness Behind iOS Localization and Language Preferences"
description: ""
date: 2025-03-17
image: /images/posts/which-locale-en-gb-country-gb.jpg
tags: [swift, ios, apple, mobile application development]
comments: true
commentsIdentifier: https://www.fabrizioduroni.it/blog/post/2025/03/17/locale-ios-app-device
authors: [fabrizio_duroni, antonino_gitto, marco_de_lucchi]
---

In the last weeks I worked with my colleague [Antonino Gitto](https://www.linkedin.com/in/antonino-gitto/), a senior software engineer with 5+ years of
experience in mobile app development, and [Marco De Lucchi](https://www.linkedin.com/in/marcodelucchi/) (do you remember him for our [previous post about the
iOS widget](xxxx)?) on improving how the [lastminute.com](https://corporate.lastminute.com) mobile apps are managing localisation (because we are preparing
something very special coming in the following months :smirk:).  

In lastminute.com we have a lot of configuration based on the locale of the user. For example the currency explicitly
depend on these parameters. Until today we were using [react-native-localization](https://github.com/stefalda/ReactNativeLocalization/) to manage localization in our
app. Anyway the method exposed by the library to get the locale is reading the "AppleLanguages" user default. We run
some experiment to understand the logic based on the value contained in this user default, and we were astonished by the
fact that none of the value returned was related to the translation defined in our xcode project. So we decided we
needed to understand better how iOS manages the locale of the user.   

This was the exact moment we went into the rabbit hole of the madness related to iOS locale mechanism, where we learned
a lot about how iOS behaves with respect to locale to be selected for an app that contains multiple localization.  
Join us in this trip of madness to avoid to get trapped (like us), in the iOS locale madness.


## How does the locale works on iOS?

iOS has two different levels of locale: **device locale** and **app locale**.

The device locale can be set in the settings in *General -> Language & Region*. This locale can be one choosen
directly from the *Preferred Languages* menu option or it is a combination of *Preferred Languages* and *Region* menu options. In particular, if the
language choosen by the user is a specific one for a country (a dialect), then the locale will be just the
*Preferred Languages* menu option **first entry**. For example, if you choose `English (UK)` from this menu the locale will be `en-GB`. On
the contrary, if the language chosen is a generic one, the locale of the user will be a combination of the  *Language*
and *Region*. For example, if you choose `English` (generic one) and `Italy` from the menu option described before, the
returned locale will be `en-IT`.  
  
![iOS language and region settings](/images/posts/which-locale-settings-ios.jpg)

The app locale is the locale the app will use to select the translations for your app. This locale (and in particular
the language) is calculated with a
specific algorithm (called from here the app locale algorithm) described quite extensively in this [article in the apple documentation](xxx) (it required some
effort to find it :sweat_smile:).
Let's see a quote from the article.

>To determine the language for your app, iOS considers not only the order of the user language preferences (in General > Language & Region of the Settings application) but also the localizations your app declares it supports. Here is the detailed process:
>
> - iOS first looks up your user's most preferred language, which is the first entry in their language preferences.
> - It proceeds to check if that language is supported by your app. iOS searches your app bundle for an .lproj folder matching the preferred language. If the folder exists, iOS infers that your app has been localized for that language and chooses it for your app. Otherwise, iOS selects the next language in the user language preferences, then repeats the above check.
The dialect support in iOS may slightly change the above behavior. If your user's preferred language is a regional variant that is not supported by your app, iOS will try to fall back to a more generic language before giving up. For example, if your user's preferred language is British English and your app bundle doesn't contain an en-GB.lproj or en_GB.lproj folder, iOS then searches your bundle for an en.lproj folder and chooses English for your app if the folder exists.
> - If none of the user’s preferred languages are supported by your app, iOS chooses the language matching your app's development region (CFBundleDevelopmentRegion).

So to summarize the quote: the app locale algorithm will try to match the most specific locale that your app supports
(translations in the Xcode project settings) with respect to the languages/dialects selected in the *Preferred
Languages* menu options, from the most specific one until the less specific one. If none matches the
locale defined in the `CFBundleDevelopmentRegion` option in the `Info.plist` is used.

Now the question is: how do you retrieve the locale selected by your app with the algorithm above? how do you get device
locales? We have some APIs in the iOS sdk that can help us in this mission:

* `Locale.preferredLanguages`, this will return the list of **device locale** available. The **first entry** in this list is
  the **locale selected at device level**, so for the entire system.  
  * Similar to this have the `"AppleLanguages"` entry in `UserDefaults`. This is basically storage
    location for the option above (and the same option used by [react-native-localization to retrieve the locale](https://github.com/stefalda/ReactNativeLocalization/blob/master/ios/ReactLocalization.m#L48)).
* `Bundle.main.preferredLocalizations`, this will return the locales contained in the bundle and defined in the Xcode
  project. As reported in the Apple documentaion the locales returned are ordered according to the user's language
  preferences in the *Preferred Languages* and *Region* menu options. **This means that the first entry of this list is the locale selected by the
  app** based on the **choice of the user at device level** for the locale and the **available locale in the bundle** of
  the app.

the user can change the locale selected with the algortihm described above (and retrieved with the APIs above), by
accessing the app specific language menu option. This menu will be available only if the user has selected multiple
options in the *Preferred Languages* menu option. Anyway, there is the possibility to force the menu to be always shown by adding
the `UIPrefersShowingLanguageSettings` entry in the `Info.plist`.  

Clear, isn't it? :laughing: Let's see some example of the stuff described above with a small "one screen" testing app I created
called "Which locale?".

## "Which locale?" app: locale APIs in action


## Conclusion

..... https://github.com/chicio/WhichLocale



.....
Resources

/// - https://developer.apple.com/library/archive/qa/qa1828/_index.html#//apple_ref/doc/uid/DTS40014938
/// - https://stackoverflow.com/questions/24591167/how-to-get-current-language-code-with-swift/66551476#66551476
/// - https://developer.apple.com/forums/thread/9246?answerId=26717022#26717022

/// previous localization library
https://github.com/stefalda/ReactNativeLocalization/
https://github.com/stefalda/ReactNativeLocalization/blob/master/ios/ReactLocalization.m#L48

/// wwwdc stuff My video about uiprefersshowlanguage
https://www.youtube.com/watch?v=b9SdW3kUJXY

/// My video about uiprefersshowlanguage
https://www.youtube.com/watch?v=_Asr8gg5LJI

/// Images
whichlocale-development-region-show-language-menu.png
whichlocale-locales-supported.png

which-locale-fr-with-fallback-it-country-fr.jpg
which-locale-fr-country-fr.jpg
which-locale-en-generic-country-italy.jpg
which-locale-en-gb-country-italy.jpg
which-locale-en-gb-country-gb.jpg
which-locale-en-country-ie.jpg