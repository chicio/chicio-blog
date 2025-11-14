export const tracking = {
  action: {
    download_curriculum_vitae: "download_curriculum_vitae",
    open_blog: "open_blog",
    open_github: "open_github",
    open_linkedin: "open_linkedin",
    send_mail: "send_email",
    open_medium: "open_medium",
    open_devto: "open_devto",
    open_twitter: "open_twitter",
    open_facebook: "open_facebook",
    open_instagram: "open_instagram",
    open_sclt_github: "open_sclt_github",
    open_sclt_thesis: "open_sclt_thesis",
    open_spectral_brdf_explorer_github: "open_spectral_brdf_explorer_github",
    open_id3tageditor_github: "open_id3tageditor_github",
    open_id3tageditor_doc: "open_id3tageditor_doc",
    open_mp3id3tagger_github: "open_mp3id3tagger_github",
    open_mp3id3tagger_dmg: "open_mp3id3tagger_dmg",
    open_rangeuislider_github: "open_rangeuislider_github",
    open_rangeuislider_doc: "open_rangeuislider_doc",
    open_tabbaruiaction_github: "open_tabbaruiaction_github",
    open_tabbaruiaction_doc: "open_tabbaruiaction_doc",
    open_home: "open_home",
    open_about_me: "open_about_me",
    open_art: "open_art",
    open_chat: "open_chat",
    open_blog_archive: "open_blog_archive",
    open_blog_tags: "open_blog_tags",
    open_http_cookie_policy: "open_http_cookie_policy",
    reload: "reload",
    open_blog_post: "open_blog_post",
    open_blog_next_page: "open_blog_next_page",
    open_blog_previous_page: "open_blog_previous_page",
    open_blog_author: "open_blog_author",
    open_experience_and_education: "open_experience_and_education",
    open_blog_tag: "open_blog_tag",
    pull_to_refresh: "pull_to_refresh",
    red_pill: "red_pill",
    blue_pill: "blue_pill",
    open_down_arrow: "open_down_arrow",
    open_dsa_time_and_space_complexity: "open_dsa_time_and_space_complexity",
    open_dsa_arrays: "open_dsa_arrays",
    open_dsa_strings: "open_dsa_strings",
    open_dsa_bit_manipulation: "open_dsa_bit_manipulation",
    open_dsa_hash_tables: "open_dsa_hash_tables",
    open_dsa_two_pointers: "open_dsa_two_pointers",
    open_dsa_prefix_sum: "open_dsa_prefix_sum",
  },
  category: {
    home: "home",
    blog_home: "blog_home",
    blog_archive: "blog_archive",
    blog_post: "blog_post",
    blog_tags: "blog_tags",
    blog_tag: "blog_tags",
    blog_search: "blog_search",
    cookie_policy: "cookie_policy",
    privacy_policy: "privacy_policy",
    notfound: "notfound",
    art: "art",
    dsa: "dsa",
    chat: "chat",
    clowns: "clowns"
  },
  label: {
    footer: "footer",
    body: "body",
    header: "header",
  },
};

export interface TrackingData {
  category: string;
  label: string | undefined;
  action: string;
}

export interface TrackingElementProps {
  trackingData: TrackingData;
}

export type TrackingPayload = { event_category: string, event_label: string | undefined };

declare global {

  interface Window {
    gtag: (event: "event", action: string, payload: TrackingPayload) => void
  }
}
