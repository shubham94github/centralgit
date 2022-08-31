import React from "react";
import combineCategoriesByName from "@utils/combineCategoriesByName";
import Tooltip from "@components/_shared/Tooltip";
import { P12 } from "@components/_shared/text";
import { array } from "prop-types";

import "./CategoriesButtons.scss";

const CategoriesButtons = ({ categories }) => (
  <div className="categories-buttons">
    {combineCategoriesByName(categories).map((category, i) => {
      return (
        <Tooltip
          key={category.id + i + category.name}
          trigger={["hover", "focus"]}
          message={
            <P12 className="parent-paths">
              <>
                {category.sameItems.map((item) => (
                  <span key={item}>
                    {item}
                    <br />
                  </span>
                ))}
              </>
            </P12>
          }
        >
          <div className="categories-buttons_item">
            <P12 className="text__white">
              {category?.name}
              {category.sameItems.length > 1 && (
                <>&nbsp; ({category.sameItems.length})</>
              )}
            </P12>
          </div>
        </Tooltip>
      );
    })}
  </div>
);

CategoriesButtons.propTypes = {
  categories: array.isRequired,
};

export default CategoriesButtons;
