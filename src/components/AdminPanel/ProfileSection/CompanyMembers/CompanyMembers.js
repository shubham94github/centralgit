import React, { memo, useEffect, useState } from "react";
import { arrayOf, bool, func, number } from "prop-types";
import AppModal from "@components/Common/AppModal";
import {
  countryType,
  departmentType,
  positionType,
  userType,
} from "@constants/types";
import { connect } from "react-redux";
import {
  getCountries,
  getPositions,
  getDepartments,
  setSnackbar,
} from "@ducks/common/actions";
import enums from "@constants/enums";
import {
  addMemberSchema,
  editMemberSchema,
} from "../../../Settings/CompanyMembersSettings/schema";
import {
  changeMemberStatus,
  createNewMember,
  downloadMemberAvatar,
  editMember,
  removeMember,
} from "@api/adminApi";
import { isEmpty } from "@utils/js-helpers";
import MemberForm from "@components/_shared/ModalComponents/MemberForm";
import LoadingOverlay from "@components/_shared/LoadingOverlay";
import {
  addMemberTitle,
  editMemberTitle,
} from "@components/AdminPanel/ProfileSection/CompanyMembers/constants";
import {
  successAddedMember,
  successDeletedMember,
  successEditedMember,
} from "@ducks/settings/sagas";
import { getCompanyMembers } from "@ducks/admin/actions";
import EditMember from "./EditMember";
import MemberCard from "@components/_shared/MemberCard/MemberCard";
import AddNewMemberCard from "@components/Settings/CompanyMembersSettings/AddNewMemberCard";
import MasonryLayout from "@components/_shared/MasonryLayout";
import Confirm from "@components/_shared/ModalComponents/Confirm";

import "./CompanyMembers.scss";

const CompanyMembers = ({
  countries,
  departments,
  positions,
  getCountries,
  getDepartments,
  getPositions,
  isLoading,
  profileId,
  retailerId,
  setSnackbar,
  getCompanyMembers,
  profileMembers,
  isMemberEditPermission,
  maxMembers,
  isTrial,
}) => {
  const [isAddMemberModal, setIsAddMemberModal] = useState(false);
  const [members, setMembers] = useState(profileMembers);
  const [editingMember, setEditingMember] = useState(null);
  const [deletingMemberId, setDeletingMemberId] = useState(null);
  const [isRemovingMember, setIsRemovingMember] = useState(null);
  const schema = editingMember ? editMemberSchema : addMemberSchema;
  const isDisabledButtonAddNewMember =
    !maxMembers || members?.length >= maxMembers;

  useEffect(() => {
    if (isEmpty(countries)) getCountries();
    if (isEmpty(departments)) getDepartments();
    if (isEmpty(positions)) getPositions();
    if (isEmpty(profileMembers)) getCompanyMembers(profileId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isEmpty(profileMembers)) setMembers(profileMembers);
  }, [profileMembers, setMembers]);

  const openAddMemberModal = () => setIsAddMemberModal(true);

  const closeAddMemberModal = () => setIsAddMemberModal(false);

  const openEditModal = (member) => setEditingMember(member);

  const closeEditModal = () => setEditingMember(null);

  const handleSaveMember = async ({
    memberData,
    setFormError,
    setIsLoading,
  }) => {
    try {
      if (setIsLoading) setIsLoading(true);

      const saveMemberRequest = !!memberData.userId
        ? editMember
        : createNewMember;

      const savedMember = await saveMemberRequest({
        ...memberData,
        countryId: memberData.country.id,
        retailerId: !memberData.userId ? retailerId : null,
        isDisabled: editingMember?.member.isDisabled,
        note: memberData.note || null,
      });

      const savedMemberWithAvatar = await downloadMemberAvatar(savedMember);

      setMembers((prevMembers) => {
        if (!prevMembers.some((item) => item.id === savedMemberWithAvatar.id))
          return prevMembers.concat(savedMemberWithAvatar);

        return prevMembers.reduce((acc, item) => {
          if (item.id === savedMemberWithAvatar.id)
            acc.push(savedMemberWithAvatar);
          else acc.push(item);

          return acc;
        }, []);
      });

      setSnackbar({
        text: memberData.userId ? successEditedMember : successAddedMember,
        type: enums.snackbarTypes.info,
      });
      closeAddMemberModal();
      closeEditModal();
    } catch (e) {
      if (setFormError) setFormError(e.message);
    } finally {
      if (setIsLoading) setIsLoading(false);
    }
  };

  const handleChangeMemberStatus = async ({
    memberId,
    setFormError,
    setIsLoading,
    isBlocked,
  }) => {
    try {
      if (setIsLoading) setIsLoading(true);

      const member = await changeMemberStatus(memberId, isBlocked);

      setMembers((prevMembers) => {
        return prevMembers.reduce((acc, item) => {
          if (item.id === member.id) {
            acc.push({
              ...item,
              isBlocked: member.isBlocked,
              member: { ...member.member },
            });
          } else acc.push(item);

          return acc;
        }, []);
      });

      if (editingMember) setEditingMember({ ...editingMember, ...member });
    } catch (e) {
      if (setFormError) setFormError(`Server Error. Please, try again.`);
      else {
        setSnackbar({
          text: `Something went wrong. Please try again later. Error: ${e.message}`,
          type: enums.snackbarTypes.error,
        });
      }
    } finally {
      if (setIsLoading) setIsLoading(false);
    }
  };

  const openDeletingConfirmationModal = (memberId) =>
    setDeletingMemberId(memberId);

  const closeDeletingConfirmationModal = () => setDeletingMemberId(null);

  const deleteMember = async () => {
    try {
      setIsRemovingMember(true);
      const memberId = deletingMemberId;

      closeDeletingConfirmationModal();
      await removeMember(memberId);

      setMembers((prevMembers) =>
        prevMembers.filter((member) => member.member.id !== memberId)
      );

      setSnackbar({
        text: successDeletedMember,
        type: enums.snackbarTypes.info,
      });
    } catch (e) {
      setSnackbar({
        text: `Something went wrong. Please try again later. Error: ${e.message}`,
        type: enums.snackbarTypes.error,
      });
    } finally {
      setIsRemovingMember(false);
    }
  };

  const cancelDeletingMember = () => {
    setDeletingMemberId(null);
    setIsAddMemberModal(false);
    setIsRemovingMember(false);
  };

  return (
    <div className="company-members-admin">
      <MasonryLayout
        items={members}
        brickComponent={MemberCard}
        itemProps={{
          changeMemberStatus: handleChangeMemberStatus,
          deleteMember: openDeletingConfirmationModal,
          editMember: openEditModal,
        }}
        lastBrickComponent={AddNewMemberCard}
        lastBrickProps={{
          toggleModal: openAddMemberModal,
          isDisabledButtonAddNewMember,
          maxMembers,
          isTrial,
        }}
        isMemberEditPermission={isMemberEditPermission}
      />
      {isAddMemberModal && (
        <AppModal
          outerProps={{
            onSubmit: handleSaveMember,
            schema,
            countries,
            departments,
            positions,
            isLoading,
          }}
          onClose={closeAddMemberModal}
          title={addMemberTitle}
          component={MemberForm}
          staticBackdrop={false}
          width="675px"
          isDarkModal
        />
      )}
      {!!editingMember && (
        <AppModal
          outerProps={{
            onSubmit: handleSaveMember,
            schema,
            countries,
            departments,
            positions,
            isLoading,
            member: editingMember,
            changeMemberStatus: handleChangeMemberStatus,
          }}
          onClose={closeEditModal}
          title={editMemberTitle}
          component={EditMember}
          staticBackdrop={false}
          width="675px"
          isDarkModal
        />
      )}
      {deletingMemberId && (
        <AppModal
          component={Confirm}
          className="confirm-pop-up"
          onClose={cancelDeletingMember}
          title={"Are you sure you want to remove the member?"}
          outerProps={{
            successConfirm: deleteMember,
            onClose: cancelDeletingMember,
          }}
        />
      )}
      {(isLoading || isRemovingMember) && <LoadingOverlay />}
    </div>
  );
};

CompanyMembers.propTypes = {
  countries: arrayOf(countryType),
  departments: arrayOf(departmentType),
  positions: arrayOf(positionType),
  getCountries: func,
  getDepartments: func,
  getPositions: func,
  isLoading: bool,
  profileId: number,
  retailerId: number,
  setSnackbar: func,
  getCompanyMembers: func,
  profileMembers: arrayOf(userType),
  isMemberEditPermission: bool,
  maxMembers: number,
  isTrial: bool,
};

export default connect(
  ({
    common: { isLoading, countries, positions, departments },
    admin: { profile },
    auth,
  }) => {
    const { listOfPermissions } = auth;
    const maxMembers = profile.retailer?.paymentPlan?.memberGroup?.maxMembers;
    // const isTrial = profile.retailer?.stripePaymentSettings?.isTrial;
    const isTrial = profile.trial;

    return {
      isLoading,
      countries,
      positions,
      departments,
      profileId: profile.id,
      retailerId: profile.retailer?.id,
      profileMembers: profile.members,
      isMemberEditPermission: listOfPermissions?.isMemberEditPermission,
      maxMembers,
      isTrial,
    };
  },
  {
    getCountries,
    getDepartments,
    getPositions,
    setSnackbar,
    getCompanyMembers,
  }
)(memo(CompanyMembers));
