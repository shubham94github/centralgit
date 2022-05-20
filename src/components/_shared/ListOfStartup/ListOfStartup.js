import React, { memo, useEffect, useState } from "react";
import ItemStartup from "./ItemStartup";
import { array, bool, func, number, object, string } from "prop-types";
import { useLocation } from "react-router-dom";

import LoadingOverlay from "@components/_shared/LoadingOverlay";
import Paginate from "@components/_shared/Paginate";
import { isEmpty } from "@utils/js-helpers";
import { P16 } from "@components/_shared/text";
import cn from "classnames";

import "./ListOfStartup.scss";
import { setWarningOfProfileRestriction } from "@ducks/profile/actions";

const ListOfStartup = ({
  startups,
  isLoading,
  pageSize,
  countOfRecords,
  page,
  setFieldForFilter,
  trialData,
  isTrial,
  openChat,
  setWarningOfProfileRestriction,
  setWarningOfChatRestriction,
  setIsBookmark,
  width,
  emptyStartupsMessage,
  isAdmin,
}) => {
  const [pageCount, setPageCount] = useState(0);
  const trialPeriodSearchWarning = `You have reached daily trial period limitations (${trialData?.trialSearchMax} Searches).`;
  const paginateClasses = cn("browse-paginate", { "p-50": !isAdmin });
  const errorMessageClasses = cn("error-messages", {
    center: !!emptyStartupsMessage,
  });
  const search = useLocation().search;
  const searchedClient = new URLSearchParams(search).get("client");
  const handlePageClick = (page) => {
    const data = {
      field: "page",
      data: page.selected + 1,
      filterClientName: searchedClient,
    };

    setFieldForFilter(data);
  };

  const changePageSizeHandler = (size) => {
    const data = {
      field: "pageSize",
      data: size,
      filterClientName: searchedClient,
    };
    console.log(data);
    setFieldForFilter(data);
  };

  useEffect(
    () => setPageCount(Math.ceil(countOfRecords / pageSize)),
    [countOfRecords, setPageCount, pageSize]
  );

  return (
    <div className="list-of-startup-wrapper">
      {isEmpty(startups) && !isLoading ? (
        isTrial && !trialData?.isTrialSearch ? (
          <P16 className="error-messages">{trialPeriodSearchWarning}</P16>
        ) : (
          <div className={errorMessageClasses}>
            <P16>
              {!!emptyStartupsMessage ? (
                emptyStartupsMessage
              ) : (
                <>
                  There are no Startups that match your selected filters.
                  <br />
                  Please adjust search filter and try again.
                </>
              )}
            </P16>
          </div>
        )
      ) : isTrial && !trialData?.isTrialSearch && !isLoading ? (
        <P16 className="error-messages">{trialPeriodSearchWarning}</P16>
      ) : (
        <>
          <div className="d-inline-block" style={{ width }}>
            {startups.map((startup) => (
              <div key={startup.id}>
                <ItemStartup
                  trialData={trialData}
                  startup={startup}
                  isTrial={isTrial}
                  openChat={openChat}
                  setWarningOfProfileRestriction={
                    setWarningOfProfileRestriction
                  }
                  setWarningOfChatRestriction={setWarningOfChatRestriction}
                  setIsBookmark={setIsBookmark}
                  isAdmin={isAdmin}
                />
                <div className="separator-horizontal" />
              </div>
            ))}
          </div>
          {!isTrial && (
            <div>
              <div className={paginateClasses}>
                <Paginate
                  handlePageClick={handlePageClick}
                  pageCount={pageCount}
                  forcePage={page - 1}
                  countOfRecords={countOfRecords}
                  pageSize={pageSize}
                  changePageSizeHandler={changePageSizeHandler}
                />
              </div>
            </div>
          )}
        </>
      )}
      {isLoading && <LoadingOverlay />}
    </div>
  );
};

ListOfStartup.defaultProps = {
  isAdmin: false,
  isTrial: false,
  width: "100%",
};

ListOfStartup.propTypes = {
  startups: array.isRequired,
  isLoading: bool.isRequired,
  countOfRecords: number,
  page: number,
  pageSize: number,
  setFieldForFilter: func.isRequired,
  trialData: object,
  isTrial: bool,
  openChat: func,
  setWarningOfProfileRestriction: func,
  setWarningOfChatRestriction: func,
  setIsBookmark: func.isRequired,
  width: string,
  emptyStartupsMessage: string,
  isAdmin: bool,
};

export default memo(ListOfStartup);
