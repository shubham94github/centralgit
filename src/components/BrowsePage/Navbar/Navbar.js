import React, { memo, useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { navbarMenuItems } from "./constants";
import { H3 } from "@components/_shared/text";
import cn from "classnames";
import { connect } from "react-redux";
import { setFieldForFilter } from "@ducks/browse/action";
import { func, string } from "prop-types";

import "./Navbar.scss";

const Navbar = ({ browseType, setFieldForFilter }) => {
  const [selectedId, setSelectedId] = useState(
    navbarMenuItems.find((item) => item.value === browseType).id
  );

  useEffect(() => {
    console.log("browseType, setFieldForFilter", browseType, setFieldForFilter);
    setSelectedId(navbarMenuItems.find((item) => item.value === browseType).id);
  }, [browseType, setFieldForFilter]);

  return (
    <Row>
      <Col className="navbar-wrapper">
        <div className="navbar-container">
          {navbarMenuItems.map(({ id, label, value }) => {
            const onClickHandler = () => {
              //   console.log("data", data);
              const data = {
                field: "browseType",
                data: value,
              };

              setSelectedId(id);
              setFieldForFilter(data);
            };
            const classes = cn("menu-item-style", {
              "green-underline": selectedId === id,
            });

            return (
              <H3 key={id} className={classes} onClick={onClickHandler} bold>
                {label}
              </H3>
            );
          })}
        </div>
      </Col>
    </Row>
  );
};

Navbar.propTypes = {
  browseType: string.isRequired,
  setFieldForFilter: func.isRequired,
};

const mapStateToProps = ({ browse: { filterCategories } }) => ({
  browseType: filterCategories.browseType,
});

export default connect(mapStateToProps, {
  setFieldForFilter,
})(memo(Navbar));
