import React, { memo, useEffect, useMemo, useState } from 'react';
import { Routes } from '@routes';
import { useHistory } from 'react-router-dom';
import { P14, S14, S16 } from '@components/_shared/text';
import GridContainer from '@components/layouts/GridContainer';
import { colors } from '@colors';
import { Icons } from '@icons';
import PrimaryButton from '@components/_shared/buttons/PrimaryButton';
import AppModal from '@components/Common/AppModal';
import Confirm from '@components/_shared/ModalComponents/Confirm';
import { setSnackbar } from '@ducks/common/actions';
import {
	saveNewSubscriptionPlan,
	deleteSubscriptionPlan,
	editSubscriptionPlan,
	getAllPaymentPlanNames,
	getPrices,
	getMemberGroups,
	getSubscriptionPlans,
	handleChangePaymentPlanStatus,
} from '@ducks/admin/actions';
import LoadingOverlay from '@components/_shared/LoadingOverlay';
import { connect } from 'react-redux';
import { arrayOf, bool, func, string } from 'prop-types';
import AddNewSubscriptionPlan from './AddNewSubscriptionPlan/AddNewSubscriptionPlan';
import { isEmpty } from '@utils/js-helpers';
import SubscriptionPlansTable from './SubscriptionPlansTable';
import { memberGroupType, priceType, subscriptionPlanType } from '@constants/types';
import cn from 'classnames';
import SubscriptionPlansTableHeader from './SubscriptionPlansTable/SubscriptionPlansTableHeader';
import { currencyFormatter } from '@utils/currencyFormatter';
import { userRoleAllOptions } from './SubscriptionPlanForm/constants';
import EditSubscriptionPlan from './EditSubscriptionPlan';

import './SubscriptionPlanTab.scss';

const enterpriseRoute = Routes.ADMIN_PANEL.ENTERPRISE;

const filtersIcon = Icons.filtersIcon(colors.white);
const infoIcon = Icons.infoIcon(colors.grass50);
const plusIcon = Icons.plus(colors.white);

const SubscriptionPlans = ({
	subscriptionPlans,
	isLoading,
	saveNewSubscriptionPlan,
	deleteSubscriptionPlan,
	getSubscriptionPlans,
	getAllPaymentPlanNames,
	paymentPlanTypes,
	getPrices,
	prices,
	memberGroups,
	getMemberGroups,
	editSubscriptionPlan,
	handleChangePaymentPlanStatus,
}) => {
	const history = useHistory();

	const [isAddNewSubscriptionPlanModal, setIsAddNewSubscriptionPlanModal] = useState(false);
	const [deletingSubscriptionPlanId, setDeletingSubscriptionPlanId] = useState(null);
	const [editingSubscriptionPlanId, setEditingSubscriptionPlanId] = useState(null);
	const [filterValues, setFilterValues] = useState(null);
	const [isFilterOpen, setIsFilterOpen] = useState(true);

	const toggleFilters = () => setIsFilterOpen(prevState => !prevState);

	useEffect(() => {
		if (isEmpty(subscriptionPlans)) getSubscriptionPlans();
		if (isEmpty(paymentPlanTypes)) getAllPaymentPlanNames();
		if (isEmpty(prices)) getPrices();
		if (isEmpty(memberGroups)) getMemberGroups();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const openAddNewSubscriptionPlan = () => setIsAddNewSubscriptionPlanModal(true);
	const closeAddNewSubscriptionPlan = () => setIsAddNewSubscriptionPlanModal(false);
	const closeEditSubscriptionPlanModal = () => setEditingSubscriptionPlanId(null);

	const openDeleteConfirmModal = id => setDeletingSubscriptionPlanId(id);

	const updateSubscriptionPlan = (updatedPlan, setFormError) => {
		editSubscriptionPlan(updatedPlan, closeEditSubscriptionPlanModal, setFormError);
	};

	const createSubscriptionPlan = (newPaymentPlan, setFormError) => saveNewSubscriptionPlan(
		newPaymentPlan,
		closeAddNewSubscriptionPlan,
		setFormError,
	);

	const cancelDeletingPlan = () => setDeletingSubscriptionPlanId(null);

	const pricesOptions = useMemo(() => {
		return prices.map(item => {
			return {
				label: `${`Price ${item.id}`} - ${currencyFormatter.format(item.unitAmount / 100)}`,
				value: item.id,
			};
		});
	}, [prices]);

	const memberGroupsOptions = useMemo(() => memberGroups
		.map(item => ({ label: item.name, value: item.id })), [memberGroups]);

	const handleSetFilters = filterValues => setFilterValues(filterValues);

	const chosenFilters = useMemo(() => filterValues
		? Object.keys(filterValues)
			.filter(key => !!filterValues[key])
			.reduce((acc, key) => {
				acc[key] = filterValues[key];

				return acc;
			}, [])
		: {}, [filterValues]);

	const filteredPlans = useMemo(() => {
		if (isEmpty(filterValues)) return subscriptionPlans;

		if (isEmpty(chosenFilters)) return subscriptionPlans;

		return subscriptionPlans.filter(item => {
			const isRole = !chosenFilters?.role?.value || item.role === chosenFilters?.role.value;
			const isMemberId = !chosenFilters?.memberGroupId?.value
				|| item.memberGroup?.id === +chosenFilters.memberGroupId.value;
			const isPrice = !chosenFilters?.paymentPlanPriceIds?.value
				|| item.price.id === +chosenFilters.paymentPlanPriceIds.value;
			const isHidden = !chosenFilters?.isHidden?.value || item.isHidden === chosenFilters?.isHidden.value;

			return isRole && isMemberId && isPrice && isHidden;
		});
	}, [chosenFilters, filterValues, subscriptionPlans]);

	const filterButtonClasses = cn('show-filter-btn', {
		'active': !isEmpty(chosenFilters),
	});

	const handleDeletePlan = () => {
		deleteSubscriptionPlan(deletingSubscriptionPlanId);
		setDeletingSubscriptionPlanId(null);
	};

	const handleClickEnterprise = e => {
		e.stopPropagation();

		history.push(enterpriseRoute);
	};

	return (
		<div className='subscription-plans'>
			<GridContainer>
				<S16 className='page-title' bold>Payment Plans</S16>
			</GridContainer>
			<div className='guidelines'>
				{infoIcon}
				<P14>
					Create a Payment Plan based on a User Role. If the selected Plan Type is Enterprise, a generated
					code will be provided to the potential user via email or sms. To access the generated code,<br/>
					go to&nbsp;
					<S14
						className='link'
						onClick={handleClickEnterprise}
					>
						Enterprise
					</S14>
					.
				</P14>
			</div>
			<GridContainer gap='15px' columns={2}
				customClassName='buttons'>
				<PrimaryButton onClick={openAddNewSubscriptionPlan} className='admin-primary'>
					{plusIcon}
					<S16 bold>Add new Payment Plan</S16>
				</PrimaryButton>
				<PrimaryButton onClick={toggleFilters} className={filterButtonClasses}>
					{filtersIcon}
					Filter
				</PrimaryButton>
			</GridContainer>
			<GridContainer>
				{isFilterOpen
					&& <SubscriptionPlansTableHeader
						handleSetFilter={handleSetFilters}
						prices={pricesOptions}
						userRoles={userRoleAllOptions}
						members={memberGroupsOptions}
						filters={filterValues}
					/>
				}
				<SubscriptionPlansTable
					subscriptionPlans={[...filteredPlans].map((item, i) => ({ ...item, number: i + 1 }))}
					handleDelete={openDeleteConfirmModal}
					handleEdit={setEditingSubscriptionPlanId}
					handleChangePaymentPlanStatus={handleChangePaymentPlanStatus}
				/>
			</GridContainer>
			{isAddNewSubscriptionPlanModal
				&& <AppModal
					outerProps={{
						cancel: closeAddNewSubscriptionPlan,
						saveNewSubscriptionPlan: createSubscriptionPlan,
						isLoading,
						paymentPlanTypes,
						prices,
						memberGroups,
						paymentPlans: subscriptionPlans,
					}}
					isDarkModal={false}
					isCloseIcon
					title='Add New Payment Plan'
					width='630px'
					component={AddNewSubscriptionPlan}
					isHeader
					onClose={closeAddNewSubscriptionPlan}
					isDisableClickOutside
				/>
			}
			{editingSubscriptionPlanId
				&& <AppModal
					onClose={closeEditSubscriptionPlanModal}
					outerProps={{
						cancel: closeEditSubscriptionPlanModal,
						updateSubscriptionPlan,
						plan: subscriptionPlans.find(item => item.id === editingSubscriptionPlanId),
						isLoading,
						paymentPlanTypes,
						paymentPlans: subscriptionPlans,
						prices,
						memberGroups,
					}}
					isDarkModal={false}
					isCloseIcon
					title='Edit Payment Plan'
					width='630px'
					isHeader
					component={EditSubscriptionPlan}
					isDisableClickOutside
				/>
			}
			{deletingSubscriptionPlanId
				&& <AppModal
					outerProps={{
						successConfirm: handleDeletePlan,
						onClose: cancelDeletingPlan,
					}}
					isDarkModal={false}
					isCloseIcon
					onClose={cancelDeletingPlan}
					title='Are you sure you want to delete this set?'
					component={Confirm}
					isHeader
				/>
			}
			{isLoading && <LoadingOverlay/>}
		</div>
	);
};

SubscriptionPlans.propTypes = {
	subscriptionPlans: arrayOf(subscriptionPlanType),
	isLoading: bool,
	saveNewSubscriptionPlan: func.isRequired,
	deleteSubscriptionPlan: func.isRequired,
	editSubscriptionPlan: func.isRequired,
	getSubscriptionPlans: func.isRequired,
	getAllPaymentPlanNames: func.isRequired,
	paymentPlanTypes: arrayOf(string),
	getPrices: func.isRequired,
	prices: arrayOf(priceType),
	memberGroups: arrayOf(memberGroupType),
	getMemberGroups: func.isRequired,
	handleChangePaymentPlanStatus: func.isRequired,
};

const mapStateToProps = ({ admin: { subscriptionPlans, isLoading, paymentPlansNames, prices, memberGroups } }) => {
	return {
		subscriptionPlans,
		isLoading,
		paymentPlanTypes: paymentPlansNames,
		prices,
		memberGroups,
	};
};

export default connect(mapStateToProps, {
	setSnackbar,
	saveNewSubscriptionPlan,
	deleteSubscriptionPlan,
	editSubscriptionPlan,
	getSubscriptionPlans,
	getAllPaymentPlanNames,
	getPrices,
	getMemberGroups,
	handleChangePaymentPlanStatus,
})(memo(SubscriptionPlans));
