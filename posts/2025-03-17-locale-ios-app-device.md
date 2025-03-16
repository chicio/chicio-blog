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

In the past few weeks, I’ve been working with my colleague [Antonino
Gitto](https://www.linkedin.com/in/antonino-gitto/), a senior software engineer with over five years of experience in
mobile app development, and [Marco De Lucchi](https://www.linkedin.com/in/marcodelucchi/) (you might remember him from
our [previous post about iOS widgets](xxxx)) on improving how the [lastminute.com](https://corporate.lastminute.com)
mobile apps handle localization. And we’re doing it for a very special reason—something exciting is coming in the next
few months! :smirk:  

At lastminute.com, many configurations depend on the user’s locale. A clear example is currency, which is explicitly
determined by these parameters. Until now, we’ve been using
[react-native-localization](https://github.com/stefalda/ReactNativeLocalization/) to manage localization in our app.
However, the method provided by this library to retrieve the locale reads the `AppleLanguages` user default.  

We conducted several experiments to understand the logic behind the values stored in this user default, only to be
astonished by the results: none of the returned values was matching our expection in terms of locale with respect to the
ones we defined in our apps.
That’s when we realized we needed to gain a deeper understanding of how iOS determines a user’s locale.  

This marked the beginning of our journey down the rabbit hole of iOS localization wolrd. Along the way, we learned a lot
about how iOS selects a locale for apps with multiple locale defined in its bundle.  

Join us on this wild ride and avoid falling into the same traps we did when dealing with iOS locale madness!


## How does the locale works on iOS?

iOS operates with two different levels of locale: **device locale** and **app locale**.

The **device locale** is set in *Settings → General → Language & Region*. It can either be selected directly from the
*Preferred Languages* menu or derived from a combination of *Preferred Languages* and *Region*.  

Here’s how it works in detail, and how iOS choose the device locale based on this two settings:
- If the user selects a language that is tied to a specific country (a dialect), then the locale is simply the first
  entry in the *Preferred Languages* list.  
  - Example: Choosing `English (UK)` sets the locale to `en-GB`.  
- If the user selects a generic language, the locale is a combination of the *Preferred Language* and *Region* settings.  
  - Example: Choosing `English` (generic) and `Italy` as the region results in a locale of `en-IT`. Even if this is not
    a locale that exists, it stil makes sense as pointed by an [Apple engineer in this post](https://developer.apple.com/forums/thread/9246?answerId=26717022#26717022). 
    this can happen because you can have your native language set as the preferred one, but have the region set to
    something else (eg. because for example you live abroad). Anyway it is strange to see this "non sense" locale
    created by iOS by combining the two fields above :sweat_smile:.

![iOS language and region settings](/images/posts/which-locale-settings-ios.jpg)

The **app locale** is the locale the app uses to select translations. This is determined through a specific algorithm (which we’ll call the *app locale algorithm*), as explained in this [Apple documentation article](https://developer.apple.com/library/archive/qa/qa1828/_index.html#//apple_ref/doc/uid/DTS40014938) (which, by the way, wasn’t easy to find! :sweat_smile:).  

Let’s take a look at a key excerpt from the article:

> To determine the language for your app, iOS considers not only the user’s language preferences (set in *General → Language & Region*), but also the localizations your app supports. The process works as follows:
>
> - iOS first checks the user’s most preferred language (the first entry in the *Preferred Languages* list).  
> - It then verifies whether this language is supported by the app by checking for a corresponding `.lproj` folder in the app bundle. If the folder exists, iOS selects that language. Otherwise, it moves on to the next language in the user’s preferences and repeats the process.  
> - If the user’s preferred language is a regional variant that is not supported by the app, iOS attempts to fall back to a more generic language before giving up.  
>   - Example: If the user’s preferred language is British English but the app does not include `en-GB.lproj` or `en_GB.lproj`, iOS checks for an `en.lproj` folder and defaults to English if available.  
> - If none of the user’s preferred languages are supported, iOS defaults to the app’s development region (`CFBundleDevelopmentRegion`).  


In summary, the app locale algorithm attempts to match the most specific locale supported by your app (as defined in the
Xcode project settings) with the user's language and dialect preferences in the *Preferred Languages* menu. It starts with
the most specific option and progressively falls back to less specific ones. If no match is found, the locale defined in
the `CFBundleDevelopmentRegion` option in the `Info.plist` is used as a fallback.

### Retrieving the Device and App Locale

Now that we understand how iOS selects the locale, how do we retrieve this information in code? There are a few key APIs in the iOS SDK:

- `Locale.preferredLanguages`: returns the list of available **device locales**. The **first entry** represents the **device’s selected locale** (i.e., the system-wide locale).  
  - Related to this, the `"AppleLanguages"` entry in `UserDefaults` stores the same data and is used by [react-native-localization](https://github.com/stefalda/ReactNativeLocalization/blob/master/ios/ReactLocalization.m#L48) to retrieve the locale.  
- `Bundle.main.preferredLocalizations`: returns the locales included in the app bundle (as defined in the Xcode project).  
  - According to Apple’s documentation, the returned locales are ordered based on the user’s language preferences, so
    based on the sorting of the *Preferred Languages* selected.  
  - **The first entry in this list represents the locale selected by the app**, based on the **user’s device settings** and the **localizations available in the app bundle**.  

The user can also manually override the app’s locale using the app-specific language settings. However, this menu is only available if multiple languages are selected in *Preferred Languages*. If you want the menu to always be available, you can force it by adding `UIPrefersShowingLanguageSettings` to `Info.plist`.  

Clear as mud, right? :laughing:  

To illustrate all of this, let’s explore some real-world examples using a small one-screen testing app I built called *Which Locale?*.

## "Which locale?" app: locale APIs in action


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

## Conclusion

..... https://github.com/chicio/WhichLocale
