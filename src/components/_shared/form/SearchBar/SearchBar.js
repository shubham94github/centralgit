import React, { memo, useMemo, useState } from "react";
import { string, any, arrayOf, shape, func, object } from "prop-types";
import Select from "@components/_shared/form/Select";
import TextInput from "@components/_shared/form/TextInput";
import PrimaryButton from "@components/_shared/buttons/PrimaryButton";
import { colors } from "@colors";
import {
  defaultWidthMenu,
  otherElementsSizes,
  defaultWidthSingleValue,
  averageLetterSize,
  textInput,
  searchIcon,
} from "./constants";

import "./SearchBar.scss";

const SearchBar = ({
  control,
  register,
  searchName,
  categoryName,
  searchOptions,
  onChange,
  onClickHandler,
}) => {
  const [widthSingleValue, setWidthSingleValue] = useState(
    defaultWidthSingleValue
  );
  const [widthMenu, setWidthMenu] = useState(defaultWidthMenu);
  const selectStyles = useMemo(
    () => ({
      control: (base, state) => {
        const borderRadius = state.menuIsOpen ? "8px 0 0 0" : "8px 0 0 8px";

        return {
          ...base,
          borderRadius,
          border: "none",
          height: "50px",
          boxShadow: "none",
          width: `${widthSingleValue}px`,
        };
      },
      singleValue: (base) => ({
        ...base,
        color: colors.darkblue70,
      }),
      menu: (base) => ({
        ...base,
        margin: "0",
        zIndex: 2,
        boxShadow: "none",
        borderRadius: "0px 0px 8px 8px",
        width: `${widthMenu}px`,
      }),
      option: (base, state) => {
        const backgroundColor = state.isSelected
          ? colors.grass50
          : colors.white;
        const color = state.isSelected ? colors.white : colors.darkblue70;

        return {
          ...base,
          backgroundColor,
          color: color,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",

          "&:hover": {
            backgroundColor: colors.grass10,
            color: colors.darkblue70,
          },
        };
      },
    }),
    [widthSingleValue, widthMenu]
  );

  const selectWidthHandler = (value) => {
    const selectedValueLength = value.length;
    const fullWidthSingleValue = !!selectedValueLength
      ? selectedValueLength * averageLetterSize + otherElementsSizes
      : defaultWidthSingleValue;
    const fullWidthMenu = fullWidthSingleValue + textInput;

    setWidthSingleValue(fullWidthSingleValue);
    setWidthMenu(fullWidthMenu);
  };

  const onChangeHandler = (option) => {
    selectWidthHandler(option.value);
    onChange(option);
  };

  return (
    <div className="search-bar-container">
      <Select
        name={categoryName}
        control={control}
        register={register}
        options={searchOptions}
        customStyles={selectStyles}
        onChange={onChangeHandler}
      />
      <TextInput
        className="text-input"
        type="text"
        name={searchName}
        placeholder="Search for Startups"
        isLightTheme
        register={register}
      />
      <PrimaryButton className="search-button" onClick={onClickHandler}>
        {searchIcon}
      </PrimaryButton>
    </div>
  );
};

SearchBar.defaultProps = {
  searchName: "",
  categoryName: "",
};

SearchBar.propTypes = {
  control: object,
  register: func,
  searchName: string,
  categoryName: string,
  searchOptions: arrayOf(shape({ label: string, value: any })),
  onChange: func.isRequired,
  onClickHandler: func.isRequired,
};

export default memo(SearchBar);
