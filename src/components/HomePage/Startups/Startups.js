import React, { memo, useEffect, useMemo, useState } from "react";
import { H1, H2, H3 } from "@components/_shared/text";
import cn from "classnames";
import { array, bool } from "prop-types";
import StartupItems from "./StartupItems";
import { generateEntityOfStartups } from "@utils/generateEntityOfStartups";
import LoadingOverlay from "@components/_shared/LoadingOverlay";

import "./Starups.scss";
import StartupProgress from "./StartupProgress/StartupProgress";

const Startups = ({
  newStartups,
  ratedStartups,
  relatedStartups,
  isLoading,
}) => {
  const entityOfStartups = useMemo(
    () => generateEntityOfStartups(newStartups, ratedStartups, relatedStartups),
    [ratedStartups, newStartups, relatedStartups]
  );

  const [selectedMenuId, setSelectedMenuId] = useState(entityOfStartups[0].id);
  const [selectedStartups, setSelectedStartups] = useState(entityOfStartups[0]);

  useEffect(() => {
    setSelectedStartups(
      entityOfStartups.find((item) => item.id === selectedMenuId)
    );
  }, [selectedMenuId, entityOfStartups]);

  useEffect(() => {
    setSelectedMenuId(entityOfStartups[0].id);
  }, [entityOfStartups]);

  return (
    <div className="homepage-startups-container">
      <StartupProgress />
      <H1 className="text-darkblue pt-5 pb-3" bold>
        Hello, Explorer! You can now start exploring Retail Hub.
      </H1>
      <H3 className="text-gray pb-5">
        Intelligent search for business owners, enterprise, tech enthusiasts.
      </H3>
      <div className="navbar-section">
        {entityOfStartups.map(({ id, label }) => {
          const onClickHandler = () => setSelectedMenuId(id);

          const classes = cn("menu-item-style", {
            "green-underline": selectedMenuId === id,
          });

          return (
            <H2 key={id} className={classes} onClick={onClickHandler} bold>
              {label}
            </H2>
          );
        })}
      </div>
      <div className="startups-section">
        {isLoading && !selectedStartups?.startups.length && <LoadingOverlay />}
        {!!selectedStartups?.startups && (
          <StartupItems
            startups={selectedStartups.startups}
            sortData={selectedStartups.sortData}
          />
        )}
      </div>
    </div>
  );
};

Startups.propTypes = {
  ratedStartups: array.isRequired,
  newStartups: array.isRequired,
  relatedStartups: array.isRequired,
  isLoading: bool,
};

export default memo(Startups);
