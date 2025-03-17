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
our [previous post about iOS widgets](/blog/post/2023/01/10/widget-ios-swiftui-image-problem)) on improving how the [lastminute.com](https://corporate.lastminute.com)
mobile apps handle localization. And we’re doing it for a very special reason (that we cannot share today): something exciting is coming in the next
few months, so stay tuned! :smirk:  

At [lastminute.com](https://corporate.lastminute.com), many configurations depend on the user’s locale. A clear example is currency, which is explicitly
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

iOS operates with two different levels of locale: *device locale* and *app locale*.

The *device locale* is set in *Settings → General → Language & Region*. It can either be selected directly from the
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

The *app locale* is the locale the app uses to select translations. This is determined through a specific algorithm (which we’ll call the *app locale algorithm*), as explained in this [Apple documentation article](https://developer.apple.com/library/archive/qa/qa1828/_index.html#//apple_ref/doc/uid/DTS40014938) (which, by the way, wasn’t easy to find! :sweat_smile:).  

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

NB.: in the most recent version of Xcode (16 at the time of this writing), the `.lproj` folder for the localisable string
has been partially replaced by the string catalogs for translations (`.xcstrings` file), but the algorithm described
above is still valid.

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

To illustrate all of this, let’s explore some real-world examples using a small one-screen testing app we built called *Which Locale?*.

## "Which Locale?" app: locale APIs in action

"Which Locale?" is a simple, single-screen app designed to help us compare the different locale settings discussed
earlier and observe how they behave when the user changes either the device or app locale. Let’s walk through the Xcode
project setup and the implementation of this app.

The app supports 5 different locales: 

* "English (Ireland)"
* "English (United Kindom)"
* "German"
* "Italian"
* "Italian (Switzerland)"

By default, the app’s locale is set to "English (United Kingdom)".

!["Which Locale?" supported locales](/images/posts/whichlocale-locales-supported.png)

In the `Info.plist` of the project we also added some settings:

* `CFBundleDevelopmentRegion` or usually called "Default localization" to be the `$(DEVELOPMENT_REGION)`, that is
  basically the "English (United Kindom)" default choosen in the previous screen.
* `UIPrefersShowingLanguageSettings` to true, that as we will see later will enable a cool feture related to the *app
  language menu*

!["Which Locale?" Info.plist](/images/posts/whichlocale-development-region-show-language-menu.png)

As we mentioned before, the app consists of a single view, structured into sections that display the device and app
locale settings using relevant iOS APIs.

The device locale section retrieves and displays:
* the `Locale.preferredLanguages` 
* the `"AppleLanguages"` entry in `UserDefaults`

The app locale section displays:
* the `Bundle.preferredLocalizations`, that contains the locale selected by the app based on the device settings
* the `Bundle.main.localizations`, that contains the locales configured in the screen shown before where it is possible
  to add locales supported by the app.

```swift
import SwiftUI

struct ContentView: View {
    var body: some View {
        NavigationView {
            List {
                Section(header: Text("Device User Locale").font(.title2).bold()) {
                    LocaleSectionView(title: "Locale.preferredLanguages", languages: Locale.preferredLanguages, showCurrent: true)
                    LocaleSectionView(title: "UserDefaults AppleLanguages", languages: getAppleLanguagesArray(), showCurrent: true)
                }
                
                Section(header: Text("App Locale").font(.title2).bold()) {
                    LocaleSectionView(title: "Bundle.preferredLocalizations", languages: Bundle.main.preferredLocalizations, showCurrent: true)
                    LocaleSectionView(title: "Bundle.localizations", languages: Bundle.main.localizations, showCurrent: false)
                }
                
                Section {
                    Text("mobile_app.greetings")
                        .font(.headline)
                        .foregroundColor(.blue)
                }
            }
            .navigationTitle("Which Locale?")
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: openAppSettings) {
                        Label("Settings", systemImage: "gear")
                    }
                }
            }
        }
    }
    
    private func openAppSettings() {
        if let url = URL(string: UIApplication.openSettingsURLString) {
            UIApplication.shared.open(url)
        }
    }
    
    private func getAppleLanguagesArray() -> [String] {
        if let appleLanguages = UserDefaults.standard.array(forKey: "AppleLanguages") as? [String] {
            return appleLanguages
        }
        return ["Not Found"]
    }
}

struct LocaleSectionView: View {
    let title: String
    let languages: [String]
    let showCurrent: Bool

    var body: some View {
        VStack(alignment: .leading, spacing: 5) {
            Text(title).bold()
            if showCurrent, let primary = languages.first {
                Text("Current: \(primary)")
                    .font(.headline)
                    .foregroundColor(.blue)
            }
            ForEach(languages, id: \.self) { language in
                Text(language)
                    .font(.system(.body, design: .monospaced))
                    .foregroundColor(.secondary)
            }
        }
    }
}
```

By running the app and modifying the device language settings or overriding the app-specific language settings, we can
observe how iOS dynamically adjusts both the device locale and the app locale based on user preferences.  

Let's start with a simple case: language selected "English (United Kindom)" and region "United Kindom". In this case the
`Locale.preferredLanguages` (which always matches `AppleLanguages`) returns `en-GB` and
also `Bundle.preferredLocalization` returns `en-GB`. This behavior makes sense because "English (United Kingdom)" is a
locale supported by the app, making it an easy match between the device's locale and the app's available localizations.

![An example with the default locale set at device level, that matches the app locale](/images/posts/which-locale-en-gb-country-gb.jpg)

Now, let's add some complexity. This time, we will select "English (United Kindom)" as language but set the regionas
"Italy". What happens in this case? The locale at both device and app level is still "English (United
Kindom)". Why? Because the language selected is already a specific dialect, that represents itself a locale
(because it is a combination of language and region). So the "region" settings in this case is completely ignored, and
`Bundle.preferredLocalization` will return again `en-GB`.

![An example of dialect (language + region) selected as language and region that doesn't match the dialect one.](/images/posts/which-locale-en-gb-country-italy.jpg)

The next case is another interesting one. The language selected in this case is "English", without specifying a
particular dialect, and the region selected it "Ireland". In this case the locale is calculated as a combination of
language and region. As a result, both `Locale.preferredLanguages` and `Bundle.preferredLocalization` returns `en-IE`.

![An example with language without dialect (no region specified in the language) an a region that combined with the language created an app supported locale](/images/posts/which-locale-en-country-ie.jpg)

Now, let's make things even more complex. What happens if we select "English" (without a specific dialect) and choose a region
that is not associated to that language in our app, like for example "Italy". In this case we encounter the first mismatch between
`Locale.preferredLanguages` and `Bundle.preferredLocalization`. The first one will return `en-IT`, so a very basic
combination of the preferred language and region device settings. This allow iOS to:

* translate everything at system level with the "en" language
* format numbers, dates etc. according to the region, in this case "IT"

Even though this behavior might seem counterintuitive at first, it actually makes sense. A user with this configuration
might be a native English speaker living in Italy, so iOS attempts to mix and match the language and region settings
accordingly.

On the other hand, `Bundle.preferredLocalization` returns `en-GB`. Why? This follows the algorithm we discussed earlier:

* iOS tries to match the most similar locale supported by the app to the one derived from the device's language and region settings.
* In this case, the device locale is `en-IT`, but the app only supports `en-GB` and `en-IE`.
* Since there's no exact match and no generic en locale available in the app, iOS falls back to the `CFBundleDevelopmentRegion` setting, which defaults to `en-GB`.

![An example with a language without dialect and a region that doesn't match in combination any locale supported by the app](/images/posts/which-locale-en-generic-country-italy.jpg)

Let's explore a more complex case, where the device locale configuration includes:

* a preferred language selected not supported by the app, eg. `fr`
* a second preferred language supported by the app, eg. `it`
* a region not supported by any locale in the app, eg. `FR`

This is very tricky (and a common case for users like me that have multiple preferred languages selected in the
settings). In this case iOS will return `fr-FR` as the locale from `Locale.preferredLanguages`. This makes sense 
because at system level the locale considers only the first (main) entry in the language settings when determining the device locale.  
However `fr-FR` is not supported by the app. But, since the user has `it` as second preferred language,
`Bundle.preferredLocalization` will return `it` as locale. This happens because the second language matches a generic
locale (i.e., `it`) supported by the app, even though the region is not directly supported.

![An example of device locale not supported by the app, but with a second preferred language supported](/images/posts/which-locale-fr-with-fallback-it-country-fr.jpg)

If we remove the `it` language as the second option from the preferred languages, the situation changes. Since there is no
longer a supported language in the preferred languages list, the `Bundle.preferredLocalization` will not find any match.
In this case, it will simply fallback to the `CFBundleDevelopmentRegion` (`en-GB`).

This happens because, without a matching supported language, iOS will default to the `CFBundleDevelopmentRegion`
specified in the app's configuration, ensuring that the app can still present content in a default locale when no other
match exists.

![An example with a device locale not supported by the app](/images/posts/which-locale-fr-country-fr.jpg)

Last but not least, what does happen if the preferred language in the system settings is not supported by the app
but the region is? For example we have `fr` as preferred language and `ch` as region. In this case, even if we have a
locale that supports that region (`it-CH`) in the app, the system will first try to match based on the language. In fact
if there is no match for that language the system fallbacks to `CFBundleDevelopmentRegion`. 

So the region is only used to resolve conflicts if there is a first match between the language across multiple locales.
If there is no matching language, the region setting is ignored, and iOS will fall back to `CFBundleDevelopmentRegion`.

![An example with a device locale not supported by the app, but with a country supported by another locale in the app](/images/posts/which-locale-fr-country-ch.jpg)

That's it. As you can see, the cases are quite interesting, and once you start to fully understand the algorithm at the
OS level, everything makes sense. 


There's one last aspect to cover before wrapping up, related to how iOS manages app menu settings. Up until now, we've
focused on the device settings, but what if you want the user to customize the app's language via the app’s settings
section? You might expect iOS to make this easy, but... it doesn't. In fact, if the user has only one language selected
in the preferred languages option in the device settings, the language menu in the app will not appear :fearful:. This can lead
to frustrating situations where users are redirected to the settings section of the app, only to find there's nothing
they can change :sweat_smile:.

We were quite desperate about this issue, but then, buried in a [WWDC 2024 video](https://youtu.be/b9SdW3kUJXY?si=gKALNZ_0PA3HHtEK&t=915), 
we found a solution. Do you remember when we mentioned we added `UIPrefersShowingLanguageSettings` to the `Info.plist`? With
this option, the language menu will always be visible in your app's settings. Additionally, if a user selects a locale
from the ones supported by your app, that locale will be added to the device’s preferred languages, either as a generic
language or a dialect, depending on how you've defined the locales in your app. Check out the video below to see a live
example of how this option works.

https://www.youtube.com/watch?v=vWTUY0sBYlQ

## Conclusion

The codebase for the "Which Locale?" app can be found in this [github repo](https://github.com/chicio/WhichLocale). Feel free to experiment with it and run your
own tests. Everything should be consistent with what we've covered in this post :rocket:. We'll do our best to keep this
post updated if anything changes on Apple’s side. See you next time (we hope not again for the "locale madness" topic :laughing:).