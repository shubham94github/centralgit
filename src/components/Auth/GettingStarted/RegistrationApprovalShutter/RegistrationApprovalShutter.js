import React, { memo } from "react";
import { P14, P16 } from "@components/_shared/text";
import { connect } from "react-redux";
import { number, string } from "prop-types";
import ApprovalForRetailCompany from "./ApprovalForRetailCompany";
import enums from "@constants/enums";
import backgroundRetailer from "@assets/images/stuffer-gs-retailer.png";
import { colors } from "@colors";
import cn from "classnames";
import { getItemFromStorage } from "@utils/storage";

import "./RegistrationApprovalShutter.scss";

const {
  userRoles: {
    retailerCompany,
    retailerBrand,
    retailerConsultant,
    retailerServiceProvider,
    retailerVentureCapital,
  },
} = enums;

const RegistrationApprovalShutter = ({ userRole, trial }) => {
  const isRetailerCompany =
    userRole === retailerCompany ||
    userRole === retailerBrand ||
    userRole === retailerConsultant ||
    userRole === retailerServiceProvider ||
    userRole === retailerVentureCapital;
  const isStartup = userRole.includes("STARTUP");
  const classes = cn("registration-approval-content", {
    "modal-startup": isStartup,
  });

  const cssStyle = isStartup
    ? null
    : {
        backgroundSize: "cover",
        backgroundPosition: isStartup ? "center" : "left top",
        backgroundColor: colors.darkblue90,
        backgroundImage: `url(${backgroundRetailer}) `,
      };

  return isRetailerCompany ? (
    <ApprovalForRetailCompany cssStyle={cssStyle} />
  ) : (
    <div className="registration-approval-container" style={cssStyle}>
      <div className={classes}>
        {isStartup ? (
          <h2>
            <span>Thank you </span>for adding your company!
          </h2>
        ) : (
          <p className="approvel-title">
            Your <span>account registration</span> is being
            <span> approved by RetailHub!</span>
          </p>
        )}
        {isStartup ? (
          <P14>
            A RetailHub Manager will approve your registration.
            <br />
            Upon approval, you will be able to access the full features of the
            site. We will inform you of your account activation status via
            e-mail.
          </P14>
        ) : (
          <p>
            {/* .Thank you for adding your Company. Your account registration is
            being approved by RetailHub. Once a RetailHub Manager approves your
            registration, you will be able to access the full features of the
            site. We will inform you via e-mail about your account activation
            <br />
            <br /> */}
            {/* {!!trial ? (
              <> */}
            You have a FREE 7 day trial period that will start once your account
            is approved. You will only be charged the amount according to your
            Subscription plan after the FREE trial period has ended. Please wait
            a few seconds and you will be redirected to the home page where
            RetailHub has matched Startups that are most related to your
            interest.
            {/* </>
            ) : (
              <>
                There is no trial period in your payment plan. You will be
                charged for the next monthly fee according to your Payment Plan.
                Please check your email for account activation.
              </>
            )} */}
          </p>
        )}
      </div>
    </div>
  );
};

RegistrationApprovalShutter.propTypes = {
  userRole: string,
  trial: number,
};

const mapStateToProps = ({ auth }) => {
  const user = auth.user || getItemFromStorage("user");
  return {
    userRole: user?.role,
    trial: user?.retailer?.paymentPlan?.trial,
  };
};

export default connect(mapStateToProps)(memo(RegistrationApprovalShutter));
