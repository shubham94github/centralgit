import React, { memo, useState } from "react";
import { connect } from "react-redux";
import {
  setFieldOutsideForFilter,
  setDefaultFieldForFilter,
  setWarningOfSearchRestriction,
} from "@ducks/browse/action";
import CategoriesMenu from "@components/_shared/CategoriesMenu";
import { bool, func, object } from "prop-types";
import { useHistory } from "react-router-dom";
import { Routes } from "@routes";

const CategoriesMenuHomeHOC = ({
  isTrial,
  trialData,
  setFieldOutsideForFilter,
  setDefaultFieldForFilter,
  setWarningOfSearchRestriction,
}) => {
  const history = useHistory();
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [categoriesIds, setCategoriesIds] = useState([]);
  const [idSHoverCategory, setIdSHoverCategory] = useState([]);

  const onHoverCategoryHandler = (idS) => setIdSHoverCategory(idS);

  const toggleFullMenuHandler = () => setIsOpenMenu((prevState) => !prevState);

  const handleOpenCategories = (categoriesIds) =>
    setCategoriesIds(categoriesIds);

  const onCategoryClickHandler = (idS) => {
    setDefaultFieldForFilter();

    const data = {
      field: "categoryIds",
      data: idS,
    };

    // if (!isTrial || trialData?.isTrialSearch) {
    setFieldOutsideForFilter(data);
    history.push(Routes.BROWSE_PAGE);
    // } else setWarningOfSearchRestriction();
  };

  return (
    <CategoriesMenu
      isOpenMenu={isOpenMenu}
      categoriesIds={categoriesIds}
      handleOpenCategories={handleOpenCategories}
      toggleFullMenuHandler={toggleFullMenuHandler}
      onCategoryClickHandler={onCategoryClickHandler}
      onHoverCategoryHandler={onHoverCategoryHandler}
      idSHoverCategory={idSHoverCategory}
      isBrowseFullMenu={false}
    />
  );
};

CategoriesMenuHomeHOC.propTypes = {
  trialData: object,
  isTrial: bool,
  setFieldOutsideForFilter: func.isRequired,
  setDefaultFieldForFilter: func.isRequired,
  setWarningOfSearchRestriction: func.isRequired,
};

const mapStateToProps = ({
  common: { categories, isLoading, trialData },
  auth: { user },
}) => {
  const propName = !!user?.retailer ? "retailer" : "member";

  return {
    categories,
    isLoading,
    trialData,
    isTrial: user?.trial || trialData?.isTrial,
  };
};

export default connect(mapStateToProps, {
  setFieldOutsideForFilter,
  setDefaultFieldForFilter,
  setWarningOfSearchRestriction,
})(memo(CategoriesMenuHomeHOC));
