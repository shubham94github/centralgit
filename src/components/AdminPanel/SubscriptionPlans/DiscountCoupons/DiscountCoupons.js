import React, { memo, useState } from 'react';
import MainTable from '@components/_shared/MainTable';
import { useGetDiscountCoupons } from '@utils/hooks/useGetDiscountCoupons';
import { connect } from 'react-redux';
import { setSnackbar } from '@ducks/common/actions';
import { func } from 'prop-types';
import { getColumns } from './utils';
import DiscountCouponsHeader from './DiscountCouponsHeader';
import {
	confirmCancelMessage,
	confirmCancelText,
	confirmRemoveMessage,
	defaultTableMeta,
	discountCouponAddTitle,
	discountCouponEditTitle,
	errorText,
	successCancelText,
	successCreateText,
	successEditText,
	successRemoveText,
	tableDiscountCouponTitle,
	invalidTokenErr,
} from './constants';
import DiscountCouponForm from './DiscountCouponForm';
import AppModal from '@components/Common/AppModal';
import {
	blockDiscountCoupons,
	cancelDiscountCoupons,
	createNewDiscountCoupon,
	removeDiscountCoupons,
	unblockDiscountCoupons,
	updateDiscountCoupon,
} from '@api/adminApi';

import Confirm from '@components/_shared/ModalComponents/Confirm';
import enums from '@constants/enums';
import { setRetailersTableMeta, handleRetailerFilters } from '@ducks/admin/actions';
import { tableMetaType } from '@constants/types';
import { useHistory } from 'react-router-dom';
import { logOut } from '@ducks/auth/actions';

import './DiscountCoupons.scss';

const DiscountCoupons = ({
	setSnackbar,
	setRetailersTableMeta,
	retailersTableMeta,
	logOut,
	handleRetailerFilters,
}) => {
	const history = useHistory();
	const [tableMeta, setTableMeta] = useState(defaultTableMeta);
	const [isDiscountCouponModal, setIsDiscountCouponModal] = useState(false);
	const [selectedCoupon, setIsSelectedCoupon] = useState(null);
	const [wasUpdatedBackend, setWasUpdatedBackend] = useState(false);
	const [isDiscountCouponChanging, setIsDiscountCouponChanging] = useState(false);
	const [isShowRemoveConfirm, setIsShowRemoveConfirm] = useState(false);
	const [isShowCancelConfirm, setIsShowCancelConfirm] = useState(false);

	const toggleRemoveConfirm = () => setIsShowRemoveConfirm(prevState => !prevState);

	const toggleCancelConfirm = () => setIsShowCancelConfirm(prevState => !prevState);

	const editCouponHandler = coupon => {
		setIsSelectedCoupon(coupon);
		setIsDiscountCouponModal(true);
	};

	const closeDiscountCouponModal = () => setIsDiscountCouponModal(false);

	const openDiscountCouponCreateModal = () => {
		setIsSelectedCoupon(null);
		setIsDiscountCouponModal(true);
	};

	const onSearch = ({ fieldName, filterText }) => {
		setTableMeta({
			...tableMeta,
			[fieldName]: filterText,
		});
	};

	const removeCouponHandler = async () => {
		try {
			setIsDiscountCouponChanging(true);

			toggleRemoveConfirm();

			await removeDiscountCoupons([selectedCoupon.id]);

			setSnackbar({
				text: successRemoveText,
				type: enums.snackbarTypes.info,
			});

			setWasUpdatedBackend(true);
		} catch (e) {
			if (e.error === invalidTokenErr || e?.response?.status === 401) logOut();

			setSnackbar({
				text: errorText,
				type: enums.snackbarTypes.error,
			});
		} finally {
			setIsDiscountCouponChanging(false);
			setIsSelectedCoupon(null);
		}
	};

	const cancelCouponHandler = async () => {
		try {
			setIsDiscountCouponChanging(true);

			toggleCancelConfirm();

			await cancelDiscountCoupons([selectedCoupon.id]);

			setSnackbar({
				text: successCancelText,
				type: enums.snackbarTypes.info,
			});

			setWasUpdatedBackend(true);
		} catch (e) {
			if (e.error === invalidTokenErr || e?.response?.status === 401) logOut();

			setSnackbar({
				text: errorText,
				type: enums.snackbarTypes.error,
			});
		} finally {
			setIsDiscountCouponChanging(false);
			setIsSelectedCoupon(null);
		}
	};

	const activationCouponHandler = async (id, isBlocked) => {
		try {
			setIsDiscountCouponChanging(true);

			const activationCouponApi = isBlocked ? unblockDiscountCoupons : blockDiscountCoupons;

			await activationCouponApi([id]);

			setWasUpdatedBackend(true);
		} catch (e) {
			if (e.error === invalidTokenErr || e?.response?.status === 401) logOut();

			setSnackbar({
				text: errorText,
				type: enums.snackbarTypes.error,
			});
		} finally {
			setIsDiscountCouponChanging(false);
		}
	};

	const openRemoveModal = coupon => {
		setIsSelectedCoupon(coupon);
		toggleRemoveConfirm();
	};

	const openCancelModal = coupon => {
		setIsSelectedCoupon(coupon);
		toggleCancelConfirm();
	};

	const { discountCoupons, isLoading } = useGetDiscountCoupons({
		wasUpdatedBackend,
		setWasUpdatedBackend,
		setSnackbar,
		tableMeta,
		logOut,
	});

	const columns = getColumns({
		editCouponHandler,
		openRemoveModal,
		openCancelModal,
		activationCouponHandler,
		setRetailersTableMeta,
		retailersTableMeta,
		history,
		handleRetailerFilters,
	});

	const createDiscountCoupon = async coupon => {
		try {
			setIsDiscountCouponChanging(true);

			await createNewDiscountCoupon(coupon);

			setSnackbar({
				text: successCreateText,
				type: enums.snackbarTypes.info,
			});

			setIsDiscountCouponModal(false);
			setWasUpdatedBackend(true);
		} catch (e) {
			if (e.error === invalidTokenErr || e?.response?.status === 401) logOut();

			setSnackbar({
				text: e?.message || errorText,
				type: enums.snackbarTypes.error,
			});
		} finally {
			setIsDiscountCouponChanging(false);
		}
	};

	const editDiscountCoupon = async coupon => {
		try {
			setIsDiscountCouponChanging(true);

			await updateDiscountCoupon(coupon);

			setSnackbar({
				text: successEditText,
				type: enums.snackbarTypes.info,
			});

			setWasUpdatedBackend(true);
		} catch (e) {
			if (e.error === invalidTokenErr || e?.response?.status === 401) logOut();

			setSnackbar({
				text: e?.message || errorText,
				type: enums.snackbarTypes.error,
			});
		} finally {
			setIsDiscountCouponChanging(false);
			setIsSelectedCoupon(null);
			setIsDiscountCouponModal(false);
		}
	};

	return (
		<div className='discount-coupons'>
			<MainTable
				title={tableDiscountCouponTitle}
				sortServer
				columns={columns}
				data={discountCoupons}
				isLoading={isLoading || isDiscountCouponChanging}
				pageCount={2}
				countOfRecords={5}
				withPagination={false}
				tableHeader={DiscountCouponsHeader}
				onSearch={onSearch}
				searchFieldName='code'
				openDiscountCouponModal={openDiscountCouponCreateModal}
			/>
			{isDiscountCouponModal
				&& <AppModal
					width='690px'
					className='overflow-calendar'
					component={DiscountCouponForm}
					onClose={closeDiscountCouponModal}
					title={!!selectedCoupon ? discountCouponEditTitle : discountCouponAddTitle}
					outerProps={{
						discountCoupons,
						closeDiscountCouponModal,
						selectedCoupon,
						createDiscountCoupon,
						editDiscountCoupon,
						isDiscountCouponChanging,
					}}
				/>
			}
			{isShowRemoveConfirm
				&& <AppModal
					onClose={toggleRemoveConfirm}
					title={confirmRemoveMessage}
					outerProps={{
						successConfirm: removeCouponHandler,
						onClose: toggleRemoveConfirm,
					}}
					component={Confirm}
					width='630px'
				/>
			}
			{isShowCancelConfirm
				&& <AppModal
					onClose={toggleCancelConfirm}
					title={confirmCancelMessage}
					outerProps={{
						successConfirm: cancelCouponHandler,
						onClose: toggleCancelConfirm,
						text: confirmCancelText,
					}}
					component={Confirm}
					width='630px'
				/>
			}
		</div>
	);
};

DiscountCoupons.propTypes = {
	setSnackbar: func.isRequired,
	setRetailersTableMeta: func.isRequired,
	retailersTableMeta: tableMetaType.isRequired,
	logOut: func.isRequired,
	handleRetailerFilters: func.isRequired,
};

export default connect(({ admin }) => {
	const { retailersTableMeta } = admin;

	return {
		retailersTableMeta,
	};
}, {
	setSnackbar,
	setRetailersTableMeta,
	logOut,
	handleRetailerFilters,
})(memo(DiscountCoupons));
