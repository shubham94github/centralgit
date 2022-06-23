import React, { memo, useState, useEffect } from "react";
import { H1 } from "@components/_shared/text";

import { getNewsFromCms } from "@api/newsApi";
import "./NewsFeed.scss";
import { News } from "@components/News";

const NewsFeed = () => {
  const [news, SetNews] = useState([]);
  useEffect(() => {
    getNewsFromCms()
      .then((response) => response.data)
      .then((data) => SetNews(data));
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
              <a href={item.link.href} key={index} target="_blank">
                <div className="news-item">
                  <div className="news-feed-item-title">{item.title} </div>
                  <div className="news-feed-item-content">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: item.description,
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
