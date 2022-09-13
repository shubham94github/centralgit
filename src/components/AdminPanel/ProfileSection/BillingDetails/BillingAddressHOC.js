import React, { memo, useEffect } from "react";
import { connect } from "react-redux";
import { schema } from "./schema";
import BillingDetails from "@components/Auth/GettingStarted/BillingDetails";
import { getCountries } from "@ducks/common/actions";
import { array, bool, func, object, string } from "prop-types";
import { handleUpdateBillingAddress } from "@ducks/admin/actions";
import { userType } from "@constants/types";

const BillingAddressHOC = ({
  onClose,
  getCountries,
  countries,
  isLoading,
  profileRetailer,
  city,
  companyLegalName,
  country,
  handleUpdateBillingAddress,
  user,
}) => {
  const onSubmit = (values) => {
    const data = {
      ...values,
      countryId: values.countryId?.id,
      vatNumber: values.vatNumber || null,
      postZipCode: values.postZipCode || null,
      legalName: values.companyLegalName,
    };

    handleUpdateBillingAddress({ data });
    onClose();
  };

  useEffect(() => {
    if (!countries?.length) getCountries();
  }, [getCountries, countries]);

  return (
    <div>
      <BillingDetails
        onClose={onClose}
        schema={schema}
        onSubmit={onSubmit}
        isEditPaymentPlanModal={false}
        setIsEditPaymentPlanModal={() => {}}
        companyLegalName={companyLegalName}
        city={city}
        countries={countries}
        isLoading={isLoading}
        countryId={country?.id}
        client={profileRetailer}
        user={user}
        isAdmin
      />
    </div>
  );
};

BillingAddressHOC.propTypes = {
  onClose: func.isRequired,
  getCountries: func.isRequired,
  countries: array.isRequired,
  isLoading: bool,
  profileRetailer: object.isRequired,
  city: string,
  companyLegalName: string,
  country: object,
  handleUpdateBillingAddress: func.isRequired,
  user: userType,
};

const mapStateToProps = ({ common: { countries, isLoading }, admin }) => {
  const {
    profile: { retailer, city, country },
  } = admin;

  return {
    isLoading,
    countries,
    profileRetailer: retailer,
    city,
    companyLegalName: retailer.companyLegalName,
    country,
    user: admin.profile,
  };
};

export default connect(mapStateToProps, {
  getCountries,
  handleUpdateBillingAddress,
})(memo(BillingAddressHOC));
