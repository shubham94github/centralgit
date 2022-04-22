import React, { memo, useState, useEffect } from "react";
import { H1 } from "@components/_shared/text";
import { parseString } from "xml2js";
import axios from "axios";
import "./NewsFeed.scss";

const NewsFeed = () => {
  const [news, SetNews] = useState([]);
  useEffect(() => {
    axios
      .get("https://www.gra.world/category/retail-news/feed/")
      .then((response) => response.data)
      .then(async (data) => {
        parseString(data, { mergeAttrs: true }, (err, result) => {
          if (err) {
            throw err;
          }
          console.log(result.rss.channel[0].item);
        });
      });
  }, []);
  return (
    <div className="news-feed-wrapper">
      <div className="news-feed-container">
        <H1 className="title" bold>
          News
        </H1>
        <div className="news-feed-greed">Coming soon!</div>
      </div>
    </div>
  );
};

export default memo(NewsFeed);
