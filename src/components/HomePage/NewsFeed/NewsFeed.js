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
          // console.log(result.rss.channel[0].item);
          SetNews(result.rss.channel[0].item);
        });
      });
  }, []);
  return (
    <div className="news-feed-wrapper">
      <div className="news-feed-container">
        <H1 className="title" bold>
          News
        </H1>
        <div className="news-feed-greed">
          {news.map((item, index) => {
            return (
              <a href={item.link[0]} key={index} target="_blank">
                <div className="news-item">
                  <div className="news-feed-item-title">{item.title[0]} </div>
                  <div className="news-feed-item-content">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: item.description[0],
                      }}
                    ></div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default memo(NewsFeed);
