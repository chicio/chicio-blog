---
title: "Which Locale? Decoding the Madness Behind iOS Localization and Language Preferences"
description: ""
date: 2025-03-17
image: /images/posts/which-locale-en-gb-country-gb.jpg
tags: [swift, ios, apple, mobile application development]
comments: true
commentsIdentifier: https://www.fabrizioduroni.it/blog/post/2025/03/17/locale-ios
authors: [fabrizio_duroni]
---

In the last weeks I worked with my colleague [Antonino Gitto](xxxxx), a senior software engineer with 5+ years of
experience in mobile app development, and [Marco De Lucchi](xxxx) (do you remember him for our [previous post about the
iOS widget](xxxx)?) on improving how the [lastminute.com](xxxx) mobile apps are managing localisation (because we are preparing
something very special coming in the following months :smirk:).  
In lastminute.com we have a lot of configuration based on the locale of the user. For example the currency explicitly
depend on these parameters. Until today we were using [react-native-localization](xxx) to manage localization in our
app. Anyway the method exposed by the library to get the locale is reading the "AppleLanguages" user default. We run
some experiment to understand the logic based on the value contained in this user default, and we were astonished by the
fact that none of the value returned was related to the translation defined in our xcode project. So we decided we
needed to understand better how iOS manages the locale of the user.   
This was the exact moment we went into the rabbit hole of the madness related to iOS locale mechanism, where we learned
a lot about how iOS behaves with respect to locale to be selected for an app that contains multiple localization.  
Join us in this trip of madness to avoi to get trapped (like us), in the iOS locale madness.


## How does the locale works on iOS?

....

## Some experiment to prove the behaviour: the "Which locale?" app


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