import Head from "next/head";
// import styles from "../styles/Home.module.css";


import {
  useStoryblokState,
  getStoryblokApi,
  StoryblokComponent,
} from "@storyblok/react";
import Layout from "../components/Layout";
import NewLayout from "../components/NewLayout";

export default function Home({ story, siteConfig, locale, defaultLocale }) {
  story = useStoryblokState(story, {
    resolveRelations: ["popular-articles.articles"],
    language: locale
  });

  return (
    <div>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* <header>
        <h1>{story ? story.name : "My Site"}</h1>
      </header> */}
      <NewLayout siteConfig={siteConfig}>
        <StoryblokComponent blok={story.content} />
      </NewLayout>
    </div>
  );
}

export async function getStaticProps({locales, locale, defaultLocale}) {
  let slug = "home";

  let sbParams = {
    version: "published", // or 'published',
    resolve_relations: ["popular-articles.articles"],
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
      // key: data ? data.story.id : false,
    },
    // revalidate: 3600,
  };
}
