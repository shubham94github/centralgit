import React, { useMemo } from "react";
import Avatar from "@components/_shared/Avatar";
import { H1, P12, S16 } from "@components/_shared/text";
import { colors } from "@colors";
import { bool, func, number, object, string } from "prop-types";
import { setAboutItems } from "./constants";
import { Icons } from "@icons";
import tooltipsText from "@constants/tooltipsText";
import Tooltip from "@components/_shared/Tooltip";
import linlogo from "@assets/images/icons/linlogo.png";
import weblogo from "@assets/images/icons/website.png";
import "./ProfileHeader.scss";

const locationIcon = Icons.locationIcon(colors.grass50);
const chatIcon = Icons.chatIconProfile();
const {
  chatTooltips: { profileStartupText, profileUserText },
  bookmarkTooltips: { bookmarkText, unBookmarkText },
} = tooltipsText;
const maxStringLength = 42;

const ProfileHeader = ({
  logo,
  companyShortName,
  isRetailer,
  handleOpenChat,
  isDemoStartup,
  isEnableMailing,
  country,
  foundedAt,
  city,
  owner,
  totalFundingAmount,
  isFullNameFilled,
  isBookmarked,
  handleBookmarkClick,
  isAuthRoleRetailer,
  isStartup,
}) => {
  const bookmarkIcon = Icons.bookmarkIcon(
    isBookmarked ? colors.grass50 : colors.darkblue70
  );

  const aboutItems = useMemo(
    () => setAboutItems(country, owner, foundedAt, totalFundingAmount),
    [country, owner, foundedAt, totalFundingAmount]
  );

  const isVisibleChatIcon =
    isFullNameFilled &&
    !isStartup &&
    (isRetailer ? !isAuthRoleRetailer : !isDemoStartup && isEnableMailing);

  return (
    <div className="profile-header-container">
      <div className="image-section">
        <div className="img-profile-wrapper me-3">
          <Avatar logo={logo} className="avatar-for-profile" />
        </div>
        <div>
          <div className="company-name">
            <Tooltip
              placement="bottom"
              message={companyShortName}
              isVisibleTooltip={companyShortName.length > maxStringLength}
            >
              <H1 className="text__black text-start">{companyShortName}</H1>
            </Tooltip>
            {isVisibleChatIcon && (
              <Tooltip
                placement="bottom"
                message={
                  <P12>{isRetailer ? profileUserText : profileStartupText}</P12>
                }
              >
                <div className="ps-2 py-2 chat-icon" onClick={handleOpenChat}>
                  {chatIcon}
                </div>
              </Tooltip>
            )}
            {!isRetailer && !isStartup && (
              <Tooltip
                placement="bottom"
                message={
                  <P12>{isBookmarked ? unBookmarkText : bookmarkText}</P12>
                }
              >
                <div className="p-2 clickable" onClick={handleBookmarkClick}>
                  {bookmarkIcon}
                </div>
              </Tooltip>
            )}
          </div>
          <div>
            <P12 className="word-wrap">
              <span className="pe-2">{locationIcon}</span>
              {!!city && `${city}, `}
              {country?.name}
              <br />
            </P12>
          </div>
          <div>
            <P12 className="word-wrap">
              <span className="pe-2">
                <img src={linlogo} className={`icon`}></img>
              </span>
              {!!city && `${city}, `}

              <br />
            </P12>
          </div>
          <div>
            <P12 className="word-wrap">
              <span className="pe-2">
                <img src={weblogo} className="icon"></img>
              </span>
              {country?.name}
              <br />
            </P12>
          </div>
        </div>
      </div>
      {!isRetailer && (
        <div className="about-section">
          <div className="about-panel">
            {aboutItems.map(({ id, title, value }) => {
              const isLastItem = id === aboutItems.length;
              const isVisibleTooltipOwner =
                owner?.length > 50 && title.name === "Founder";

              return (
                <div className="d-flex" key={id}>
                  <div className="about-item">
                    <S16 className="title">
                      <span className="icon">{title.icon}</span>&nbsp;
                      {title.name}
                    </S16>
                    <Tooltip
                      placement="bottom"
                      isVisibleTooltip={isVisibleTooltipOwner}
                      message={owner}
                    >
                      <S16 className="value" bold>
                        {value.text}
                      </S16>
                    </Tooltip>
                  </div>
                  {!isLastItem && <div className="separator" />}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

ProfileHeader.propTypes = {
  logo: object.isRequired,
  companyShortName: string.isRequired,
  isRetailer: bool.isRequired,
  handleOpenChat: func.isRequired,
  isDemoStartup: bool.isRequired,
  isEnableMailing: bool.isRequired,
  isFullNameFilled: bool.isRequired,
  country: object,
  foundedAt: number,
  city: string,
  owner: string,
  totalFundingAmount: number,
  isBookmarked: bool,
  handleBookmarkClick: func.isRequired,
  isAuthRoleRetailer: bool,
  isStartup: bool,
};

ProfileHeader.defaltProps = {
  totalFundingAmount: null,
  owner: "",
  isBookmarked: false,
};

export default ProfileHeader;
