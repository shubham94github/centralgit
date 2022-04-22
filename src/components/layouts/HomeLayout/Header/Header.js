import React, { memo, useEffect, useState } from "react";
import { bool, func, number, object } from "prop-types";
import cn from "classnames";
import { Col, Container, Row } from "react-bootstrap";
import { useHistory, useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import { Routes } from "@routes";
import { P12, P14, S14, S16 } from "@components/_shared/text";
import { colors } from "@colors";
import CustomDropdown from "@components/_shared/CustomDropdown";
import SearchForCategories from "@components/_shared/SearchForCategories";
import Mission from "@components/Mission";

import {
  burgerMenuIcon,
  constantsMainMenu,
  emailIcon,
  logInIcon,
  logOutIcon,
  maxLengthName,
  rhLogoHeaderIcon,
  settingsIcon,
} from "./constants";
import {
  logOut,
  setUser,
  clearEmailForSignUp,
  generateListOfPermissions,
  onSubscriptionPaidSuccess,
  onSubscriptionPaidFailed,
} from "@ducks/auth/actions";
import { connect } from "react-redux";
import { getUserIcon } from "@utils/getUserIcon";
import enums from "@constants/enums";
import {
  setFieldOutsideForFilter,
  setFieldForFilter,
  setDefaultFieldForFilter,
  setWarningOfSearchRestriction,
  setWarningOfCountCharactersSearch,
  getStartupFilterInFork,
} from "@ducks/browse/action";
import { toColor } from "@utils";
import PillCounter from "@components/_shared/Notifications/PillCounter";
import { connectToWebsocket } from "@api/websocketApi";
import {
  getChatsByUserId,
  onConnectionStatus,
  onNewChat,
  onNewCounters,
  onNewMessage,
  onReadMessage,
  setWarningOfChatRestriction,
} from "@ducks/messages/actions";
import {
  getNotifications,
  onNotifications,
  clearNotifications,
} from "@ducks/notifications/actions";
import NotificationsPanel from "@components/_shared/NotificationsPanel";
import { userType } from "@constants/types";
import { getTrialData, getTrialDataInFork } from "@ducks/common/actions";
import { Icons } from "@icons";
import Tooltip from "@components/_shared/Tooltip";
import tooltipsText from "@constants/tooltipsText";
import { onNewReportStatus } from "@ducks/admin/actions";
import LoadingOverlay from "@components/_shared/LoadingOverlay";
import { getItemFromStorage } from "@utils/storage";
import { Modal, Button } from "react-bootstrap";

import "./Header.scss";

const {
  notificationsTooltipText,
  chatTooltips: { headerText },
} = tooltipsText;
const { userRoles } = enums;

const Header = ({
  isAuthenticated,
  logOut,
  user,
  userAvatar,
  setFieldOutsideForFilter,
  setFieldForFilter,
  setDefaultFieldForFilter,
  newMessagesCounter,
  onNewMessage,
  onReadMessage,
  onConnectionStatus,
  getChatsByUserId,
  setUser,
  clearEmailForSignUp,
  onNotifications,
  getNotifications,
  countOfNewNotifications,
  clearNotifications,
  onNewCounters,
  onNewChat,
  setWarningOfChatRestriction,
  isTrial,
  trialData,
  setWarningOfSearchRestriction,
  setWarningOfCountCharactersSearch,
  onNewReportStatus,
  isLoading,
  getStartupFilterInFork,
  getTrialDataInFork,
  generateListOfPermissions,
  onSubscriptionPaidSuccess,
  onSubscriptionPaidFailed,
}) => {
  const isHideForFirstRelease = true;
  const location = useLocation();
  const history = useHistory();
  const isApprovedByAdmin = user?.isApprovedByAdmin;
  const isVisibleSearch = location.pathname === Routes.HOME;
  const isHomePage =
    isAuthenticated &&
    (location.pathname === Routes.HOME ||
      location.pathname.includes("profile") ||
      location.pathname.includes("news") ||
      location.pathname === Routes.BROWSE_PAGE ||
      location.pathname === Routes.MISSION ||
      location.pathname.includes(Routes.ADMIN_PANEL.INDEX) ||
      location.pathname.includes(Routes.SETTINGS.INDEX));
  const isSubscriptionPage = location.pathname.includes(
    Routes.SUBSCRIPTION.INDEX
  );
  const isPasswordRecovery =
    !isAuthenticated &&
    location.pathname.includes(Routes.AUTH.PASSWORD_RECOVERY.INDEX);
  const isMessagesPage = location.pathname.includes("messages");
  const isLandingPage = location.pathname === Routes.LANDING;
  const isSignInPage = location.pathname === Routes.AUTH.SIGN_IN;
  const { userRoles } = enums;
  const isMember = user?.role === userRoles.member;
  const isRetailer =
    user?.role !== userRoles.startup &&
    user?.role !== userRoles.admin &&
    user?.role !== userRoles.superAdmin &&
    user?.role !== userRoles.member;
  const isAdmin =
    user?.role === userRoles.admin || user?.role === userRoles.superAdmin;
  const isGettingStarted = location.pathname.includes(
    Routes.AUTH.GETTING_STARTED.INDEX
  );
  const userIcon = getUserIcon(
    user?.avatar60,
    userAvatar?.color || toColor(user?.id.toString()),
    user?.firstName,
    user?.lastName
  );
  const userName =
    user && user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : "";
  const companyShortName = user?.role?.includes("STARTUP")
    ? user?.startup?.companyShortName
    : isMember
    ? user?.member?.companyShortName
    : user?.retailer?.companyShortName;
  const companyShortNameTruncate =
    user && companyShortName && companyShortName.length > maxLengthName
      ? `${companyShortName.substr(0, maxLengthName)}...`
      : companyShortName;
  const isCompletedStatus =
    user?.status === enums.gettingStartedStatuses.completedGettingStarted;

  const notificationIcon = Icons.notificationIcon(
    countOfNewNotifications > 0 ? colors.grass40 : colors.white
  );
  const isEmailVerifyingPage =
    location.pathname ===
      Routes.AUTH.SIGN_UP.EMAIL_VERIFICATION_PROCEED_STARTUP ||
    location.pathname === Routes.AUTH.SIGN_UP.EMAIL_VERIFICATION_PROCEED_RETAIL;

  const isSettingsPage = location.pathname.includes(Routes.SETTINGS.INDEX);

  const isApproved = isMember
    ? !user?.member?.isDisabled
    : isAdmin
    ? true
    : isApprovedByAdmin;

  const isVerified = user?.isVerified;

  useEffect(() => {
    if (user && isAuthenticated && isApproved) clearEmailForSignUp();
  }, [clearEmailForSignUp, isApproved, isAuthenticated, user]);

  useEffect(() => {
    if (
      user?.id &&
      isCompletedStatus &&
      isApproved &&
      !isSubscriptionPage &&
      isVerified
    )
      getNotifications();
    else clearNotifications();
  }, [
    user?.id,
    getNotifications,
    clearNotifications,
    isCompletedStatus,
    isApproved,
    isSubscriptionPage,
    isVerified,
  ]);

  const openChatHandler = () => {
    if ((isRetailer || isMember) && isTrial) setWarningOfChatRestriction();
    else history.push(Routes.MESSAGES.INDEX);
  };

  useEffect(() => {
    if (isAuthenticated && isCompletedStatus && isApproved) {
      connectToWebsocket(user.id, {
        onNewMessage,
        onReadMessage,
        onConnectionStatus,
        onNotifications,
        onNewCounters,
        onNewChat,
        onNewReportStatus,
        onSubscriptionPaidSuccess,
        onSubscriptionPaidFailed,
      });

      if (
        !newMessagesCounter &&
        isCompletedStatus &&
        !isSubscriptionPage &&
        isVerified
      )
        getChatsByUserId({ offset: 0, limit: 20 });
    } else if (
      !isAuthenticated &&
      location.pathname !== Routes.LANDING &&
      location.pathname !== Routes.AUTH.SIGN_UP.EMAIL_VERIFICATION_STARTUP &&
      location.pathname !== Routes.AUTH.SIGN_UP.EMAIL_VERIFICATION_RETAIL &&
      location.pathname !== Routes.AUTH.SIGN_UP.EMAIL_VERIFICATION_MEMBER &&
      location.pathname !== Routes.AUTH.SIGN_UP.CHOOSE_BUSINESS_TYPE
    ) {
      const localUser = getItemFromStorage("user");

      if (!localUser && !isPasswordRecovery) history.push(Routes.AUTH.SIGN_IN);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, newMessagesCounter, isCompletedStatus]);

  useEffect(() => {
    if (isAuthenticated && isRetailer && isTrial && isVerified)
      getTrialDataInFork();

    if (
      isAuthenticated &&
      isCompletedStatus &&
      isApprovedByAdmin &&
      !isSubscriptionPage &&
      isVerified &&
      (isRetailer || (isMember && !user?.member?.isDisabled)) &&
      !location.pathname.includes("settings")
    )
      getStartupFilterInFork();
  }, [
    isAuthenticated,
    isRetailer,
    isTrial,
    getStartupFilterInFork,
    getTrialDataInFork,
    isCompletedStatus,
    isMember,
    isSubscriptionPage,
    isApprovedByAdmin,
    user,
    isVerified,
    location,
  ]);

  useEffect(() => {
    const user = getItemFromStorage("user");
    const userAvatar = getItemFromStorage("userAvatar");
    const companyAvatar = getItemFromStorage("companyAvatar");

    if (user && userAvatar && companyAvatar) {
      setUser({
        user,
        userAvatar,
        companyAvatar,
      });
      generateListOfPermissions({ user });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const successfulHandleSearch = ({ search, category }) => {
    const searchRequest = search.trim();

    setDefaultFieldForFilter();

    const data = {
      field: "keyWord",
      data: searchRequest,
    };

    if (location.pathname === Routes.BROWSE_PAGE) setFieldForFilter(data);
    else setFieldOutsideForFilter(data);

    if (category.id) {
      const data = {
        field: "categoryIds",
        data: [category.id],
      };

      setFieldOutsideForFilter(data);
    }

    history.push(Routes.BROWSE_PAGE);
  };

  const handleSearch = ({ search, category }) => {
    if (search.length > 2) {
      if (!isTrial || trialData?.isTrialSearch)
        successfulHandleSearch({ search, category });
      else setWarningOfSearchRestriction();
    } else setWarningOfCountCharactersSearch();
  };

  const handleLogOut = (e) => {
    e.preventDefault();

    if (isLoading) return;

    logOut();
  };

  const handleAuthClick = (e) => {
    e.preventDefault();

    if (isAuthenticated) return handleLogOut(e);

    if (!isAuthenticated) history.push(Routes.AUTH.SIGN_IN);
  };

  const handleClick = (e) => {
    e.preventDefault();

    if (
      location.pathname ===
        Routes.AUTH.SIGN_UP.EMAIL_VERIFICATION_PROCEED_RETAIL ||
      location.pathname ===
        Routes.AUTH.SIGN_UP.EMAIL_VERIFICATION_PROCEED_STARTUP
    )
      return;

    if (!isAuthenticated) history.push(Routes.AUTH.SIGN_IN);
    else history.push(Routes.HOME);
  };
  const [ModelsIsvisible, SetModelIsVisible] = useState(() => {
    let obj = {};
    constantsMainMenu
      .filter((link) => {
        return link.type === "modal";
      })
      .map((item) => {
        obj[item.name] = false;
      });
    return obj;
  });

  const OpenClosePopup = (name) => {
    Object.keys(ModelsIsvisible).forEach(function (key, value) {
      if (key === name) return (ModelsIsvisible[key] = !ModelsIsvisible[key]);
      else return (ModelsIsvisible[key] = false);
    });
    SetModelIsVisible((oldstate) => {
      return { ...oldstate };
    });
  };

  if (isLandingPage) {
    return (
      <header className="header-wrapper">
        <div className="landing-container">
          <Container fluid>
            <Row>
              <Col className="d-flex justify-content-end">
                <NavLink className="link" to={Routes.AUTH.SIGN_IN}>
                  {logInIcon}
                  <S14 className="link__text-margin link__text-white">
                    Log in
                  </S14>
                </NavLink>
              </Col>
            </Row>
          </Container>
        </div>
      </header>
    );
  }
  return (
    <header className="header-wrapper header-wrapper__dark">
      <Container fluid>
        <div className="home-container">
          <Row className="justify-content-between">
            <Col
              xs={1}
              sm={1}
              className={(isHomePage || isMessagesPage) && "d-none d-md-block"}
            >
              <div className="logo-sm">
                <span className="link" onClick={handleClick}>
                  {rhLogoHeaderIcon}
                </span>
              </div>
            </Col>
            {(isHomePage || isMessagesPage || !isSettingsPage) && (
              <>
                <Col
                  xs={6}
                  sm={6}
                  md={1}
                  className="d-flex justify-content-start align-items-center d-md-none"
                >
                  {burgerMenuIcon}
                </Col>
                <Col className="d-none d-md-block">
                  {isVisibleSearch && user && (isRetailer || isMember) && (
                    <SearchForCategories handleSearch={handleSearch} />
                  )}
                </Col>
              </>
            )}
            <Col className="d-flex justify-content-end align-items-center">
              {(isRetailer ||
                isMember ||
                isEmailVerifyingPage ||
                isGettingStarted) && (
                <div
                  className={cn("nav-links-wrapper", {
                    hidden: isHomePage || isMessagesPage,
                  })}
                >
                  {isHomePage || isMessagesPage ? (
                    constantsMainMenu.map((link, index) => {
                      const handleClickRedirectHandler = () => {
                        switch (link.type) {
                          case "redirect":
                            setDefaultFieldForFilter();
                            history.push(link.path);
                            break;
                          case "modal":
                            setDefaultFieldForFilter();

                            //here we have to create a model
                            //history.push(link.path);
                            OpenClosePopup(link.name);

                            break;
                          default: {
                            break;
                          }
                        }
                      };

                      return link.tooltipText ? (
                        <Tooltip
                          placement="bottom"
                          message={<P12>{link.tooltipText}</P12>}
                          key={`${link}-${index}`}
                        >
                          <div
                            className="clickable link py-2"
                            onClick={handleClickRedirectHandler}
                          >
                            {link.icon}
                            <S14 className="link__text-white">{link.name}</S14>
                          </div>
                        </Tooltip>
                      ) : (
                        <div
                          key={`${link}-${index}`}
                          className="clickable link"
                          onClick={handleClickRedirectHandler}
                        >
                          {link.icon}
                          <S14 className="link__text-white">{link.name}</S14>
                        </div>
                      );
                    })
                  ) : (
                    <>
                      {!isHideForFirstRelease && (
                        <NavLink className="link" to={Routes.LANDING}>
                          <P14 className="link__text-white">Help</P14>
                        </NavLink>
                      )}
                      {!isSignInPage && (
                        <span
                          className="link link__ml-login"
                          onClick={handleAuthClick}
                        >
                          {logInIcon}
                          <S14 className="link__text-margin link__text-white">
                            {isAuthenticated ? "Log out" : "Log in"}
                          </S14>
                        </span>
                      )}
                    </>
                  )}
                </div>
              )}
              {(isHomePage || isMessagesPage) && (
                <div className="notifications-wrapper">
                  <CustomDropdown
                    className="dropdown-notifications"
                    component={NotificationsPanel}
                    button={
                      <Tooltip
                        placement="bottom-end"
                        message={<P12>{notificationsTooltipText}</P12>}
                      >
                        <div className="py-2">
                          <span className="d-none d-sm-block clickable">
                            {notificationIcon}
                            {countOfNewNotifications > 0 && (
                              <PillCounter counter={countOfNewNotifications} />
                            )}
                          </span>
                        </div>
                      </Tooltip>
                    }
                  />
                  {!isAdmin && (
                    <Tooltip
                      placement="bottom-end"
                      message={<P12>{headerText}</P12>}
                    >
                      <div className="py-2">
                        <span
                          onClick={openChatHandler}
                          className="d-none d-sm-block clickable"
                        >
                          {emailIcon}
                          {newMessagesCounter > 0 && (
                            <PillCounter counter={newMessagesCounter} />
                          )}
                        </span>
                      </div>
                    </Tooltip>
                  )}
                  <div className="notification__ml">
                    <CustomDropdown
                      className="dropdown-menu-header"
                      button={userIcon}
                    >
                      <ul>
                        <li className="d-flex flex-row align-items-center">
                          <span className="pe-2">{userIcon}</span>
                          <div className="name-wrapper">
                            <S16 bold className="list-text">
                              {userName}
                            </S16>
                            <S16 className="company-name">
                              {companyShortNameTruncate}
                            </S16>
                          </div>
                        </li>
                        {!isAdmin && (
                          <li>
                            <NavLink
                              className="link"
                              to={Routes.SETTINGS.INDEX}
                            >
                              <S16>
                                <span className="pe-3">{settingsIcon}</span>
                                Settings
                              </S16>
                            </NavLink>
                          </li>
                        )}
                        <li className="position-relative">
                          {isLoading && (
                            <LoadingOverlay classNames="loader-log-out" />
                          )}
                          <span className="link" onClick={handleLogOut}>
                            <S16>
                              <span className="pe-3">{logOutIcon}</span>
                              Log out
                            </S16>
                          </span>
                        </li>
                      </ul>
                    </CustomDropdown>
                  </div>
                </div>
              )}
            </Col>
          </Row>
        </div>
      </Container>
      <Modal
        show={ModelsIsvisible["Mission"]}
        onHide={() => OpenClosePopup("Mission")}
        backdrop="static"
        size="lg"
      >
        {/* <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header> */}
        <Mission handleClose={() => OpenClosePopup("Mission")} />
      </Modal>
    </header>
  );
};

Header.propTypes = {
  isAuthenticated: bool,
  logOut: func,
  user: userType,
  userAvatar: object,
  setFieldOutsideForFilter: func.isRequired,
  setFieldForFilter: func.isRequired,
  setDefaultFieldForFilter: func.isRequired,
  newMessagesCounter: number,
  onNewMessage: func.isRequired,
  onReadMessage: func.isRequired,
  onConnectionStatus: func.isRequired,
  getChatsByUserId: func.isRequired,
  setUser: func.isRequired,
  clearEmailForSignUp: func.isRequired,
  onNotifications: func.isRequired,
  getNotifications: func.isRequired,
  clearNotifications: func.isRequired,
  countOfNewNotifications: number.isRequired,
  onNewCounters: func.isRequired,
  onNewChat: func.isRequired,
  setWarningOfChatRestriction: func.isRequired,
  getTrialData: func.isRequired,
  isTrial: bool,
  setWarningOfSearchRestriction: func.isRequired,
  trialData: object,
  setWarningOfCountCharactersSearch: func.isRequired,
  onNewReportStatus: func.isRequired,
  isLoading: bool,
  getStartupFilterInFork: func,
  getTrialDataInFork: func,
  generateListOfPermissions: func,
  onSubscriptionPaidSuccess: func,
  onSubscriptionPaidFailed: func,
};

export default connect(
  (state) => {
    const {
      auth,
      notifications,
      messaging: { newMessagesCounters },
      common: { trialData, isLoading: isLoadingCommon },
      home: { isLoading: isLoadingHome },
    } = state;
    const { user, userAvatar } = auth;
    const { countOfNewNotifications } = notifications;

    const counter = newMessagesCounters.reduce((acc, item) => {
      acc += item.count;

      return acc;
    }, 0);
    const isRetailer = !!user?.retailer;
    const isAdmin =
      user?.role === userRoles.admin || user?.role === userRoles.superAdmin;
    const isStartup = !!user?.startup;

    return {
      isAuthenticated: !!user,
      user,
      userAvatar,
      newMessagesCounter: counter,
      countOfNewNotifications,
      isTrial:
        !!user &&
        !isAdmin &&
        !isStartup &&
        user[isRetailer ? "retailer" : "member"].stripePaymentSettings?.isTrial,
      trialData,
      isLoading: isLoadingHome || isLoadingCommon,
    };
  },
  {
    clearEmailForSignUp,
    clearNotifications,
    generateListOfPermissions,
    getChatsByUserId,
    getNotifications,
    getStartupFilterInFork,
    getTrialData,
    getTrialDataInFork,
    logOut,
    onConnectionStatus,
    onNewChat,
    onNewCounters,
    onNewMessage,
    onNewReportStatus,
    onNotifications,
    onReadMessage,
    setDefaultFieldForFilter,
    setFieldForFilter,
    setFieldOutsideForFilter,
    setUser,
    setWarningOfChatRestriction,
    setWarningOfCountCharactersSearch,
    setWarningOfSearchRestriction,
    onSubscriptionPaidSuccess,
    onSubscriptionPaidFailed,
  }
)(memo(Header));
