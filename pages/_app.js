import "../styles/globals.css";
import { storyblokInit, apiPlugin } from "@storyblok/react";
import Feature from "../components/Feature";
import Grid from "../components/Grid";
import Page from "../components/Page";
import Teaser from "../components/Teaser";
import Hero from "../components/Hero";
import AllArticles from "../components/AllArticles";
import Article from "../components/Article";
import PopularArticles from "../components/PopularArticles";

const components = {
  feature: Feature,
  grid: Grid,
  teaser: Teaser,
  "default-page": Page,
  hero: Hero,
  "all-articles": AllArticles,
  article: Article,
  "popular-articles": PopularArticles,
  "text-section": () => <div>this is text section</div>,
  "form-section": () => <div>this is form section</div>,
  "grid-section": () => <div>this is grid section</div>,
  "banner-reference": () => <div>this is banner reference</div>,
  "featured-articles-section": () => <div>this is featured articles section</div>,
  "banner": () => <div>this is banner</div>,
  "image-text-section": () => <div>this is image text section</div>,
  "article-overview-page": () => <div>This is articles overview page</div>,
  "category": () => <div>this is category component</div>,
  "home-page": () => <div>this is homepage component</div>,
  "terms-page": () => <div>terms-page</div>,
  "life-event-page": () => <div>life-event-page</div>,
  "contact-us-page": () => <div>contact-us-page</div>,
  "about-us-page": () => <div>about-us-page</div>,
  "testimonial-page": () => <div>testimonial-page</div>,
  "resources-overview-page": () => <div>resources-overview-page</div>,
  "service-page": () => <div>service-page</div>,
  "resources-overview-page": () => <div>resources-overview-page</div>,
  "services-overview-page": () => <div>services-overview-page</div>,
  "privacy-policy-page": () => <div>privacy-policy-page</div>,
};

storyblokInit({
  accessToken: "N8q5toeq3qQ0RzLU3b9Dcwtt", // public token
  // accessToken: "n44BuFJIFtsBEKCWkwznMwtt", // preview token
  // accessToken: "RnKnH1XOkfk2r3xyJiXrvgtt", // preview token
  // for spaces located in the US:
  // apiOptions: {
  //   region: "us",
  // },
  use: [apiPlugin],
  components,
});

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
