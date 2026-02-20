import React from 'react'
import {
    Button,
    Typography,
    Tabs,
    TabsHeader,
    Tab,
  } from "@material-tailwind/react";
  import { ArrowSmallDownIcon } from "@heroicons/react/24/solid";
const tabs = () => {
  return (
    <section className="grid min-h-screen place-items-center p-8">
      <Tabs value="trends" className="mx-auto max-w-7xl w-full mb-16 ">
        <div className="w-full flex mb-8 flex-col items-center">
          <TabsHeader className="h-10 !w-12/12 md:w-[50rem] border border-white/25 bg-opacity-90">
            <Tab value="trends">Trends</Tab>
            <Tab value="frontend">Frontend</Tab>
            <Tab value="backend">Backend</Tab>
            <Tab value="cloud">Cloud</Tab>
            <Tab value="ai">AI</Tab>
            <Tab value="tools">Tools</Tab>
          </TabsHeader>
        </div>
      </Tabs>
      <Typography variant="h6" className="mb-2">
        Latest Blog Posts
      </Typography>
      <Typography variant="h1" className="mb-2">
        Trends News
      </Typography>
      <Typography
        variant="lead"
        color="gray"
        className="max-w-3xl mb-36 text-center text-gray-500"
      >
        Check out what&apos;s new in the web development and tech worls! Do not
        forget to subscribe to our blog and we will notify you with the latest
        news.
      </Typography>
      <div className="container my-auto grid grid-cols-1 gap-x-8 gap-y-16 items-start lg:grid-cols-3">
        {POSTS.map(({ img, tag, title, desc, date, author }) => (
          <BlogPostCard
            key={title}
            img={img}
            tag={tag}
            title={title}
            desc={desc}
            date={date}
            author={{
              img: author.img,
              name: author.name,
            }}
          />
        ))}
      </div>
      <Button
        variant="text"
        size="lg"
        color="gray"
        className="flex items-center gap-2 mt-24"
      >
        <ArrowSmallDownIcon className="h-5 w-5 font-bold text-gray-900" />
        VIEW MORE
      </Button>
    </section>
  )
}

export default tabs
