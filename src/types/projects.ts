import { tracking } from "./tracking";

export interface ProjectCallToAction {
  label: string;
  link: string;
  trackingAction: string;
  trackingCategory: string;
  trackingLabel: string;
}

export interface Project {
  name: string;
  abstract: string;
  description: string;
  callToActions: ProjectCallToAction[];
  features: string[];
  image: string;
}

export const projects: Record<string, Project> = {
  "spectral-clara-lux-tracer": {
    name: "Spectral Clara Lux Tracer",
    abstract:
      "Physically based ray tracer with multiple shading models support and Color Rendering Index (CRI)" +
      " evaluation.",
    description:
      "Physically based ray tracer with multiple shading models support and CRI" +
      " evaluation. Project developed for my master degree thesis at University Milano-Bicocca - Imaging and Vision" +
      " Laboratory.",
    features: [
      "Computer graphics",
      "Ray-tracing",
      "Physically based rendering",
      "Color Rendering index calculation",
      "iOS, macOS, Windows",
      "C++"
    ],
    callToActions: [
      {
        label: "Github",
        trackingCategory: tracking.category.home,
        trackingAction: tracking.action.open_sclt_github,
        trackingLabel: tracking.label.body,
        link: "https://github.com/chicio/Spectral-Clara-Lux-Tracer",
      },
      {
        label: "Thesis",
        trackingCategory: tracking.category.home,
        trackingAction: tracking.action.open_sclt_thesis,
        trackingLabel: tracking.label.body,
        link: "https://www.fabrizioduroni.it/tesi-fabrizio-duroni-770157.pdf",
      },
    ],
    image: '/images/projects/spectral-clara-lux-tracer.jpg'
  },
  "spectral-brdf-explorer": {
    name: "Spectral BRDF Explorer",
    abstract: "An iOS OpenGL ES app for exploring lighting models.",
    description:
      "An iOS OpenGL ES application inspired by Walt Animation Disney Studios BRDF Viewer. It" +
      " shows some of the most famous lighting model used in computer graphics and that supports color calculation using RGB and spectral data of lights and object surfaces.",
    features: [
      "Computer graphics",
      "OpenGL ES",
      "Color calculation using spectral data",
      "iOS, Android",
      "Objective-C, Java, C++",
    ],
    callToActions: [
      {
        label: "Github",
        trackingCategory: tracking.category.home,
        trackingAction: tracking.action.open_spectral_brdf_explorer_github,
        trackingLabel: tracking.label.body,
        link: "https://github.com/chicio/Spectral-BRDF-Explorer",
      },
    ],
    image: '/images/projects/spectral-brdf-explorer.png'

  },
  id3tageditor: {
    name: "ID3TagEditor",
    abstract: "A Swift library to edit ID3 Tag of any mp3 file. ",
    description:
      "A Swift library to read and modify ID3 Tag of any mp3 file. Supported " +
      "ID3 tag version: 2.2. and 2.3. Listed in the implementations section " +
      "of the official ID3 standard website id3.org. It supports the following operating systems: iOS, macOS, tvOS, watchOS, Linux.",
    features: [
      "Multiple id3 tag version supported",
      "Strictly adhere to the offical standard",
      "No external dependencies",
      "Swift SPM and cocoapods support",
      "100% Swift",
    ],
    callToActions: [
      {
        label: "Github",
        trackingCategory: tracking.category.home,
        trackingAction: tracking.action.open_id3tageditor_github,
        trackingLabel: tracking.label.body,
        link: "https://github.com/chicio/ID3TagEditor",
      },
      {
        label: "Docs",
        trackingCategory: tracking.category.home,
        trackingAction: tracking.action.open_id3tageditor_doc,
        trackingLabel: tracking.label.body,
        link: "https://chicio.github.io/ID3TagEditor/documentation/id3tageditor/",
      },
    ],
    image: '/images/projects/id3tageditor.jpg'
  },
  "range-ui-slider": {
    name: "RangeUISlider",
    abstract: "A RangeUISlider component for iOS and iPadOS.",
    description:
      "A highly customizable iOS range selection slider, developed using " +
      "autolayout and completely customizable using IBDesignabled and " +
      "IBInspectable. Compatible with SwiftUI.",
    features: [
      "Cocoa Touch",
      "SwiftUI",
      "Autolayout",
      "IBDesignable + IBInspectable",
      "iOS",
      "Swift",
    ],
    callToActions: [
      {
        label: "Github",
        trackingCategory: tracking.category.home,
        trackingAction: tracking.action.open_rangeuislider_github,
        trackingLabel: tracking.label.body,
        link: "https://github.com/chicio/RangeUISlider",
      },
      {
        label: "Docs",
        trackingCategory: tracking.category.home,
        trackingAction: tracking.action.open_rangeuislider_doc,
        trackingLabel: tracking.label.body,
        link: "https://chicio.github.io/RangeUISlider/",
      },
    ],
    image: '/images/projects/range-ui-slider.png'
  },
  tabbaruiaction: {
    name: "TabBarUIAction",
    abstract: "A SwiftUI custom TabBar for iOS and macOS.",
    description:
      "A SwiftUI custom TabBar view with action button for modal content " +
      "display. Fully compatible with Mac Catalyst. Available as a standalone " +
      "framework, a SwiftPM package and as a Cocoapods pod.",
    features: [
      "customizable tab item",
      "custom central tab item action to show modal screens",
      "supported platform: iOS, iPadOS and macOS",
    ],
    callToActions: [
      {
        label: "Github",
        trackingCategory: tracking.category.home,
        trackingAction: tracking.action.open_tabbaruiaction_github,
        trackingLabel: tracking.label.body,
        link: "https://github.com/chicio/TabBarUIAction",
      },
      {
        label: "Docs",
        trackingCategory: tracking.category.home,
        trackingAction: tracking.action.open_tabbaruiaction_doc,
        trackingLabel: tracking.label.body,
        link: "https://chicio.github.io/TabBarUIAction/",
      },
    ],
    image: '/images/projects/tabbaruiaction.png'
  },
  mp3id3tagger: {
    name: "Mp3ID3Tagger",
    abstract: "A macOS application to edit the ID3 tag of your mp3 files.",
    description:
      "A macOS application to edit the ID3 tag of your mp3 files. " +
      "Mp3ID3Tagger supports the following ID3 tag versions: 2.2. and 2.3. It " +
      "will let you modify the information inside the ID3 tag of " +
      "you mp3 files.",
    features: [
      "100% macOS native app",
      "Implemented using Reactive programming (RxCocoa)",
    ],
    callToActions: [
      {
        label: "Github",
        trackingCategory: tracking.category.home,
        trackingAction: tracking.action.open_mp3id3tagger_github,
        trackingLabel: tracking.label.body,
        link: "https://github.com/chicio/Mp3ID3Tagger",
      },
      {
        label: "Download",
        trackingCategory: tracking.category.home,
        trackingAction: tracking.action.open_mp3id3tagger_github,
        trackingLabel: tracking.label.body,
        link: "https://github.com/chicio/Mp3ID3Tagger/raw/master/Release/Mp3ID3Tagger.dmg",
      },
    ],
    image: '/images/projects/mp3id3tagger.jpg'
  },
};
