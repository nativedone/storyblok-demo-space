import Head from "next/head";
import Layout from "../components/Layout";
import NewLayout from "../components/NewLayout";

import {
  useStoryblokState,
  getStoryblokApi,
  StoryblokComponent,
} from "@storyblok/react";

export default function Page({ story, siteConfig, locale, defaultLocale }) {
  story = useStoryblokState(story, {
    language: locale
  });

  console.log("siteConfig", siteConfig);

  return (
    <div >
      <Head>
        <title>{story ? story.name : "My Site"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NewLayout siteConfig={siteConfig}>
        <StoryblokComponent blok={story.content} locale={locale}  />
      </NewLayout>
    </div>
  );
}

export async function getStaticProps({ params, locales, locale, defaultLocale }) {
  let slug = params.slug ? params.slug.join("/") : "home";

  let sbParams = {
    version: "published", // or 'published'
    language: locale
  };

  const storyblokApi = getStoryblokApi();
  let { data } = await storyblokApi.get(`cdn/stories/${slug}`, sbParams);
  let { data: siteConfigData } = await storyblokApi.get(`cdn/stories/site-config`, sbParams);

  return {
    props: {
      locales, 
      locale, 
      defaultLocale,
      story: data ? data.story : false,
      siteConfig: siteConfigData ? siteConfigData.story : false,
      key: data ? data.story.id : false,
    },
    revalidate: 3600,
  };
}

export async function getStaticPaths({locales}) {
  const storyblokApi = getStoryblokApi();
  let { data } = await storyblokApi.get("cdn/links/" ,{
    version: 'published'
  });

  let paths = [];
  Object.keys(data.links).forEach((linkKey) => {
    if (data.links[linkKey].is_folder || data.links[linkKey].slug === "home") {
      return;
    }

    const slug = data.links[linkKey].slug;
    let splittedSlug = slug.split("/");


    for (const locale of locales) {
      paths.push({ params: { slug: splittedSlug }, locale });
    }
  });

  console.log("paths", JSON.stringify(paths, null, 2));

  return {
    paths: paths,
    fallback: false,
  };
}
