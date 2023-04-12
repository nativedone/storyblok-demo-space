import {
  useStoryblokState,
  getStoryblokApi,
  StoryblokComponent,
} from "@storyblok/react";

const HOME_PAGE_SLUG = "homepage";

const RESOLVE_RELATIONS = [
  "services-overview-list.selected_services",
  "more-services-section.selected_more_services",

  "home-services-section.selected_services",

  "service-advice-process-section.reference",

  "home-life-events-section.selected_life_events",

  "resources-types-section.selected_articles",
  "resources-types-section.selected_videos",
  "resources-types-section.selected_policy_forms",

  "testimonial-section.testimonials",

  "home-testimonial-section.selected_testimonials",
  "about-us-article.selected_article",

  "service-intro-section.services_benefits_files_list",

  "privacy-policy-page.selected_policy_forms",
];

// test 3 without resolve relations

export default function AllRoutes(props) {
  // console.log("AllRoutes props", props);

  const story = useStoryblokState(props.story, {
    resolveRelations: RESOLVE_RELATIONS,
  });

  if (!story.content) {
    // might still be loading
    return null;
  }

  return (
    <StoryblokComponent
      blok={story.content}
      globalSiteConfigStory={props.globalSiteConfigStory}
    />
  );
}

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation is enabled and a new request comes in
export async function getStaticProps({ params }) {
  const slug = params.slug ? params.slug.join("/") : HOME_PAGE_SLUG;

  let sbParams = {
    // load the content version from env (published or draft)
    // The draft version does NOT work with the PUBLIC token. Make sure envs are correct. Usually:
    // 'main' branch (production site) => storyblok public token + content version equal to published
    // 'cms-draft' branch (preview site) => storyblok preview token + content version equal to draft
    version: "published",
    // version: process.env.STORY_BLOK_VERSION,
    resolve_relations: RESOLVE_RELATIONS,
    // cv: Date.now(),
  };

  // test 2 without cv: Date.now()

  const storyblokApi = getStoryblokApi();
  // let { data } = await storyblokApi.get(`cdn/stories/${slug}`, sbParams);

  console.log("process.version", process.version,)


  let data, headerStory, footerStory, contactBoxStory;
  try {
    console.log(`before mainResponse on get static props at ${slug}`);
    const mainResponse = await storyblokApi.get(
      `cdn/stories/pages/${slug}`,
      sbParams
    );
    data = mainResponse?.data;
    console.log(
      `after mainResponse on get static props at ${slug}`,
      mainResponse?.data?.story?.name
    );

    console.log(`before headerResponse on get static props at ${slug}`);
    const headerResponse = await storyblokApi.get(
      "cdn/stories/shared-content/header-global-reference",
      sbParams
    );
    headerStory = headerResponse?.data;
    console.log(
      `after headerResponse on get static props at ${slug}`,
      headerResponse?.data?.story?.name
    );

    console.log(`before footerResponse on get static props at ${slug}`);
    const footerResponse = await storyblokApi.get(
      "cdn/stories/shared-content/footer-global-reference",
      sbParams
    );
    footerStory = footerResponse?.data;
    console.log(
      `after footerResponse on get static props at ${slug}`,
      footerResponse?.data?.story?.name
    );

    console.log(`before contactBoxResponse on get static props at ${slug}`);
    const contactBoxResponse = await storyblokApi.get(
      "cdn/stories/shared-content/contact-box-global-reference",
      sbParams
    );
    contactBoxStory = contactBoxResponse?.data;
    console.log(
      `after contactBoxResponse on get static props at ${slug}`,
      contactBoxResponse?.data?.story?.name
    );
  } catch (error) {
    console.log(
      `\x1b[33m error on get static props at ${slug} \x1b[0m`,
      JSON.stringify(error, null, 2)
    );
  }

  const oneSec = 1;
  const oneMonth = 60 * 60 * 24 * 30;

  // // Redirect to 404
  // if (!data) {
  //   return {
  //     notFound: true,
  //   };
  // }

  return {
    props: {
      story: data ? data.story : false,
      globalSiteConfigStory: {
        headerStory: headerStory ? headerStory.story : false,
        footerStory: footerStory ? footerStory.story : false,
        contactBoxStory: contactBoxStory ? contactBoxStory.story : false,
      },
    },

    // Revalidate only pretty much only for preview
    // revalidate:
    //   process.env.NEXT_PUBLIC_SITE_URL === constants.urlProduction
    //     ? oneMonth
    //     : oneSec,
  };
}

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// the path has not been generated.
export async function getStaticPaths() {
  let data;
  const storyblokApi = getStoryblokApi();

  try {
    const response = await storyblokApi.get("cdn/links/", {
      cv: Date.now(),
       // version: process.env.STORY_BLOK_VERSION,
    version: "published",
    });
    data = response.data;
  } catch (error) {
    console.log("error on get static paths", JSON.stringify(error, null, 2));
  }

  const paths = [];
  Object.keys(data.links).forEach((linkKey) => {
    if (
      data.links[linkKey].is_folder 
      // || data.links[linkKey].slug === `pages/${HOME_PAGE_SLUG}`
    ) {
      return;
    }

    // get array for slug because of catch all
    const slug = data.links[linkKey].slug;
    let splittedSlug = slug.split("/").filter((_) => _ !== "");

    if (splittedSlug[0] !== "pages") {
      return;
    }

    if (slug.includes("data-only")) {
      return;
    }

    splittedSlug.shift();

    if (slug === `pages/${HOME_PAGE_SLUG}`) splittedSlug = false;

    paths.push({ params: { slug: splittedSlug } });
  });

  // We'll pre-render only these paths at build time.
  // { fallback: 'blocking' } will server-render pages
  // on-demand if the path doesn't exist.

  // console.log("88888888paths", JSON.stringify(paths, null, 2));
  return {
    paths,
    fallback: "blocking",
  };
}
