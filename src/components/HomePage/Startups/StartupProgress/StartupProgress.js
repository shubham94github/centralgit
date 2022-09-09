import React, { memo, useState, useEffect } from "react";
import "./StartupProgress.scss";

import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Routes } from "@routes";
import { de } from "date-fns/locale";

const StartupProgress = ({ progress }) => {
  const [gotoLink, setGotoLink] = useState(Routes.SETTINGS.ACCOUNT_INFO);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    setGotoLink(Routes.SETTINGS.ACCOUNT_INFO);
    switch (progress) {
      case "25":
        setGotoLink(Routes.SETTINGS.ACCOUNT_INFO);
        break;
      case "50":
        setGotoLink(Routes.SETTINGS.COMPANY_INFO);
        break;
      case "75":
        setGotoLink(Routes.SETTINGS.BILLING_DETAILS);
        break;
      default:
        setGotoLink(Routes.SETTINGS.ACCOUNT_INFO);
    }
  }, [progress]);
  const ClosePopup = () => {
    setVisible(false);
  };
  return (
    <>
      {progress === 100 || !visible ? (
        <></>
      ) : (
        <div className="progressBarContainer">
          <div className="bold cross_button" onClick={ClosePopup}>
            X
          </div>
          <div className="title bold ">Complete your account!</div>
          <div className="subtitle_container">
            <div className="subtitle">
              <Link to={gotoLink}>complete Now &gt;</Link>
            </div>
            <div className="bold percent">{progress ? progress : 0}/100</div>
          </div>
          <div className="progressbar">
            <div
              className={`progressbar__item ${progress >= 25 ? "filled" : ""}`}
            ></div>
            <div
              className={`progressbar__item ${progress >= 50 ? "filled" : ""}`}
            ></div>
            <div
              className={`progressbar__item ${progress >= 75 ? "filled" : ""}`}
            ></div>
            <div
              className={`progressbar__item ${progress >= 100 ? "filled" : ""}`}
            ></div>
          </div>
        </div>
      )}
    </>
  );
};

export default connect(({ auth: { user } }) => ({
  progress: user?.completePercentage,
}))(memo(StartupProgress));
