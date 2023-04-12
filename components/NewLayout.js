import Link from "next/link";
import { useRouter } from "next/router";
import {
  useStoryblok,
  useStoryblokApi,
  useStoryblokBridge,
} from "@storyblok/react";

const Header = (props) => {
  return (
    <div style={{ backgroundColor: "black", display: "flex" }}>
      <Link href="/">
        <a style={{ color: "white", padding: 20 }}>
          <img src={props.logo.filename} />
        </a>
      </Link>

      {props.nav.map((b) => (
        <Link key={b.link.cached_url} href={b.link.cached_url}>
          <a style={{ color: "white", padding: 20 }}>{b.label}</a>
        </Link>
      ))}
      {props.buttons.map((b) => (
        <div style={{ color: "white", padding: 20 }}>{b.label}</div>
      ))}
    </div>
  );
};

const Footer = (props) => {
  return (
    <div
      style={{
        border: "2x solid red",
        backgroundColor: "black",
        display: "flex",
      }}
    >
      <img src={props.logo.filename} />
      <div style={{ color: "white", padding: 20 }}>
        A rich text in the footer
      </div>
    </div>
  );
};

export default function NewLayout({ children }) {
  const story = useStoryblok("site-config", { version: "published" });

  console.log("story", story);

  if (!story?.content) {
    return <div>Loading...</div>;
  }

  // ... (previous code)
  return (
    <main>
      <Header
        logo={story.content.header_logo}
        disable_transparency={story.content.header_disable_transparency}
        nav={story.content.header_nav}
        buttons={story.content.header_buttons}
        light={story.content.header_light}
      />
      {children}
      <Footer
        twitter={story.content.twitter}
        instagram={story.content.footer_instagram}
        facebook={story.content.footer_facebook}
        logo={story.content.footer_logo}
        about={story.content.footer_about}
      />
    </main>
  );
}
