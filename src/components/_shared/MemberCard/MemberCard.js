import React, { memo } from "react";
import { bool, func, object } from "prop-types";
import MenuList from "./MenuList";
import CustomDropdown from "@components/_shared/CustomDropdown";
import { getUserIcon } from "@utils/getUserIcon";
import { P12, P14, S14 } from "@components/_shared/text";
import SliderCheckbox from "@components/_shared/form/SliderCheckbox";
import { dateFormattingWithTime } from "@utils/date";
import TextToggleForHeight from "@components/_shared/TextToggleForHeight";
import Tooltip from "@components/_shared/Tooltip";
import {
  bagIcon,
  emailIcon,
  locationIcon,
  menuIcon,
  userIcon,
} from "@components/_shared/MemberCard/constants";

import "./MemberCard.scss";

const onlineStatus = "ONLINE";
const maxStringLengthNoEllipsis = 25;

const MemberCard = ({
  item,
  changeMemberStatus,
  deleteMember,
  editMember,
  isMemberEditPermission,
}) => {
  const memberIcon = getUserIcon(
    item?.avatar60,
    item?.avatar60?.color,
    item?.firstName,
    item?.lastName
  );
  const lastSeen = !item?.onlineStatus
    ? "Never been active"
    : item?.onlineStatus.onlineStatus === onlineStatus
    ? item?.onlineStatus.onlineStatus
    : dateFormattingWithTime(item?.onlineStatus?.visitedAt);

  const handleActivation = () =>
    changeMemberStatus({
      isBlocked: !item.isBlocked,
      memberId: item.member.id,
    });

  const handleDeleteMember = () => deleteMember(item.member.id);

  const handleEditMember = () => editMember(item);

  const locationAddress = `${item?.country?.name}, ${item.city}`;

  return (
    <div className="member-card">
      {isMemberEditPermission && (
        <div className="actions">
          <CustomDropdown
            className="dropdown-menu"
            button={menuIcon}
            component={MenuList}
            outerProps={{
              handleEditMember,
              handleDeleteMember,
            }}
          />
        </div>
      )}
      <div className="avatar-and-name">
        <span>{memberIcon}</span>
        <div className="name-and-status">
          <P14 className="full-name" bold>
            {item.fullName}
          </P14>
          {isMemberEditPermission && (
            <div className="status">
              <S14 className="title">Status:</S14>
              <SliderCheckbox
                id={item.id.toString()}
                checked={!item.isBlocked}
                onChange={handleActivation}
              />
            </div>
          )}
        </div>
      </div>
      <div className="about">
        {!!item.position && (
          <Tooltip
            message={item.position?.name}
            placement="bottom"
            isVisibleTooltip={
              item.position?.name.length >= maxStringLengthNoEllipsis
            }
          >
            <P14 className="position">
              {userIcon}
              {item.position?.name}
            </P14>
          </Tooltip>
        )}
        {!!item.department && (
          <Tooltip
            placement="bottom"
            message={locationAddress}
            isVisibleTooltip={
              item.department?.name.length >= maxStringLengthNoEllipsis
            }
          >
            <P14 className="department">
              {bagIcon}
              {`${item.department.name}`}
            </P14>
          </Tooltip>
        )}
        {!!item.email && (
          <Tooltip
            placement="bottom"
            message={item.email}
            isVisibleTooltip={item.email.length >= maxStringLengthNoEllipsis}
          >
            <P14 className="email">
              {emailIcon}
              {item.email}
            </P14>
          </Tooltip>
        )}
        {item.country && item.city && (
          <Tooltip
            placement="bottom"
            message={locationAddress}
            isVisibleTooltip={
              locationAddress.length >= maxStringLengthNoEllipsis
            }
          >
            <P14 className="location">
              {locationIcon}
              {locationAddress}
            </P14>
          </Tooltip>
        )}
      </div>
      <div className="activity">
        <div className="last-seen">
          <P12 bold>Last seen on:</P12>
          <P14>{lastSeen}</P14>
        </div>
        {item.createdAt && (
          <div className="created">
            <P12 bold>Created on:</P12>
            <P14>{dateFormattingWithTime(item.createdAt)}</P14>
          </div>
        )}
      </div>
      {item.member.note && (
        <div className="notes">
          <TextToggleForHeight
            text={`Notes: ${item.member.note}`}
            maxHeight={80}
            textHeight={14}
          />
        </div>
      )}
    </div>
  );
};

MemberCard.propTypes = {
  item: object.isRequired,
  changeMemberStatus: func.isRequired,
  deleteMember: func.isRequired,
  editMember: func.isRequired,
  isMemberEditPermission: bool,
};

export default memo(MemberCard);
