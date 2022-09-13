import React, { memo, useCallback, useMemo } from "react";
import { connect } from "react-redux";
import { H3, P12 } from "@components/_shared/text";
import Avatar from "@components/_shared/Avatar";
import { useHistory } from "react-router-dom";
import enums from "@constants/enums";
import { array, bool, func, number, object, shape, string } from "prop-types";
import { colors } from "@colors";
import RatingStars from "@components/_shared/RatingStars";
import Tooltip from "@components/_shared/Tooltip";
import combineCategoriesByName from "@utils/combineCategoriesByName";
import { isEmpty } from "@utils/js-helpers";
import Markdown from "markdown-to-jsx";
import { Icons } from "@icons";
import tooltipsText from "@constants/tooltipsText";
import replaceBreakLinesWithAsterisk from "@utils/replaceBreakLinesWithAsterisk";

const {
  chatTooltips: { profileStartupText },
  bookmarkTooltips: { bookmarkText, unBookmarkText },
} = tooltipsText;

const ItemStartup = ({
  startup,
  openChat,
  setWarningOfProfileRestriction,
  setWarningOfChatRestriction,
  trialData,
  isTrial,
  setIsBookmark,
  isAdmin,
}) => {
  const {
    id,
    categories,
    companyShortName,
    logo120,
    areasOfInterest,
    foundedAt,
    rateStars,
    rate,
    user,
    solutionProductsServices,
    companyDescription,
    accountType,
    isEnableMailing,
    isBookmarked,
  } = startup;

  const chatIcon = Icons.chatIcon(colors.grass50);
  const bookmarkIcon = Icons.bookmarkIcon(
    isBookmarked ? colors.grass50 : colors.darkblue70
  );
  const isDemoStartup = accountType === enums.accountType.demo;
  const history = useHistory();
  const getYearFounded = useMemo(
    () => new Date(foundedAt).getFullYear(),
    [foundedAt]
  );
  const isFullNameFilled = !!(user?.firstName && user?.lastName);

  const handleOpenProfile = useCallback(() => {
    if (isAdmin) {
      history.push(`/admin-panel/profile/startup/${user.id}`);
    } // if (!isTrial || trialData?.isTrialProfile)
    else history.push(`/profile/startup/${id}`);
    // else setWarningOfProfileRestriction();
  }, [history, id, isAdmin, user]);

  const handleOpenChat = () => {
    if (isTrial) setWarningOfChatRestriction();
    else openChat(user.id);
  };

  const handleBookmarkClick = () => setIsBookmark({ id, isBookmarked });

  const combinedCategories = combineCategoriesByName(categories);
  const combinedAreas = combineCategoriesByName(areasOfInterest);

  return (
    <div className="browse-item-startup" key={id}>
      <div className="g-3">
        <div className="d-flex">
          <div
            onClick={handleOpenProfile}
            className="d-flex justify-content-center img-wrapper-home"
          >
            <Avatar logo={logo120} />
          </div>
          <div className="content-startup">
            <div className="d-flex flex-row flex-nowrap justify-content-between align-items-center pb-2">
              <div className="d-flex flex-row flex-nowrap align-items-center">
                <H3
                  onClick={handleOpenProfile}
                  className="text__darkblue clickable text-start me-2"
                  bold
                >
                  <span className="truncate-name">{companyShortName}</span>
                </H3>
                {!!foundedAt && (
                  <H3 className="text__darkblue clickable text-start me-2">
                    ({getYearFounded})
                  </H3>
                )}
                {!isAdmin &&
                  isFullNameFilled &&
                  !isDemoStartup &&
                  isEnableMailing && (
                    <Tooltip
                      placement="bottom-end"
                      message={<P12>{profileStartupText}</P12>}
                    >
                      <div
                        onClick={handleOpenChat}
                        className="clickable me-2 py-2 chat-icon"
                      >
                        {chatIcon}
                      </div>
                    </Tooltip>
                  )}
                {!isAdmin && (
                  <Tooltip
                    placement="bottom-end"
                    message={
                      <P12>{isBookmarked ? unBookmarkText : bookmarkText}</P12>
                    }
                  >
                    <div
                      onClick={handleBookmarkClick}
                      className="clickable me-2 py-2 chat-icon"
                    >
                      {bookmarkIcon}
                    </div>
                  </Tooltip>
                )}
              </div>
              {!!rate && <RatingStars rate={rateStars} />}
            </div>
            {!!companyDescription && (
              <div className="company-description">
                <Markdown options={{ forceInline: true, wrapper: "div" }}>
                  {replaceBreakLinesWithAsterisk(companyDescription)}
                </Markdown>
              </div>
            )}
            {!!solutionProductsServices && (
              <>
                <P12 className="mt-2" bold>
                  Solutions, products and services:{" "}
                </P12>
                <div className="company-description">
                  <Markdown options={{ forceInline: true, wrapper: "div" }}>
                    {replaceBreakLinesWithAsterisk(solutionProductsServices)}
                  </Markdown>
                </div>
              </>
            )}
            {!isEmpty(categories) && (
              <div className="mt-2 d-flex">
                <div className="sector-size">
                  <P12 className="text-bold sector-size">
                    Sector of competence:{" "}
                  </P12>
                </div>
                <div>
                  <P12 className="sectors-style">
                    {combinedCategories.map((sector, i) => (
                      <Tooltip
                        key={sector.name + i}
                        message={
                          <P12 className="parent-paths">
                            <>
                              {sector.sameItems.map((item) => (
                                <span key={item}>
                                  {item}
                                  <br />
                                </span>
                              ))}
                            </>
                          </P12>
                        }
                      >
                        <span key={sector.id}>
                          {sector.name}
                          {sector.sameItems.length > 1 && (
                            <>&nbsp; ({sector.sameItems.length})</>
                          )}
                        </span>
                      </Tooltip>
                    ))}
                  </P12>
                </div>
              </div>
            )}
            {!isEmpty(areasOfInterest) && (
              <div className="mt-2 d-flex">
                <div className="sector-size">
                  <P12 className="text-bold sector-size">
                    Areas of interest:{" "}
                  </P12>
                </div>
                <div>
                  <P12 className="sectors-style">
                    {combinedAreas.map((area) => (
                      <Tooltip
                        key={area.name + area.id}
                        message={
                          <P12 className="parent-paths">
                            <>
                              {area.sameItems.map((item, index) => {
                                return (
                                  <span key={item + index}>
                                    {item}
                                    <br />
                                  </span>
                                );
                              })}
                            </>
                          </P12>
                        }
                      >
                        <span key={area.id}>
                          {area.name}
                          {area.sameItems.length > 1 && (
                            <>&nbsp; ({area.sameItems.length})</>
                          )}
                        </span>
                      </Tooltip>
                    ))}
                  </P12>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

ItemStartup.propTypes = {
  openChat: func,
  setWarningOfProfileRestriction: func,
  setWarningOfChatRestriction: func,
  startup: shape({
    id: number,
    problemSolved: string,
    solutionOffered: string,
    categories: array,
    companyShortName: string,
    logo120: object,
    areasOfInterest: array,
    foundedAt: number,
    rateStars: number,
    rate: number,
    isEnableMailing: bool,
  }),
  trialData: object,
  // isTrial: bool,
  setIsBookmark: func,
  isAdmin: bool,
};

const mapStateToProps = ({
  // browse: { startups, isLoading, filterCategories, countOfRecords },
  // common: { trialData },
  auth: { user },
}) => {
  return {
    isTrial: user.trial,
  };
};

export default connect(mapStateToProps)(memo(ItemStartup));
