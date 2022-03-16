import React, { memo, useState } from 'react';
import { P14, S16 } from '@components/_shared/text';
import GridContainer from '@components/layouts/GridContainer';
import { colors } from '@colors';
import { Icons } from '@icons';
import PrimaryButton from '@components/_shared/buttons/PrimaryButton';
import AppModal from '@components/Common/AppModal';
import AddNewPrice from '@components/AdminPanel/SubscriptionPlans/Prices/AddNewPrice';
import { createPrice, editPrice, removePrice } from '@api/subscriptionPansApi';
import PricesTable from '@components/AdminPanel/SubscriptionPlans/Prices/PricesTable';
import EditPrice from '@components/AdminPanel/SubscriptionPlans/Prices/EditPrice';
import Confirm from '@components/_shared/ModalComponents/Confirm';
import { setSnackbar } from '@ducks/common/actions';
import enums from '@constants/enums';
import LoadingOverlay from '@components/_shared/LoadingOverlay';
import { connect } from 'react-redux';
import { func } from 'prop-types';
import { logOut } from '@ducks/auth/actions';
import { useGetPrices } from '@utils/hooks/useGetPrices';
import { isEmpty } from '@utils/js-helpers';
import { deleteError, deleteTitle, guidelinesText } from './constants';
import { invalidTokenErr } from '@components/AdminPanel/SubscriptionPlans/DiscountCoupons/constants';

import './Prices.scss';

const infoIcon = Icons.infoIcon(colors.grass50);
const plusIcon = Icons.plus(colors.white);
const deleteSuccessMessage = 'This Price has been deleted!';
const updateSuccessMessage = 'This Price has been changed!';
const createSuccessMessage = 'A new Price has been created!';

const Prices = ({
	setSnackbar,
	logOut,
}) => {
	const [isAddNewPriceModal, setIsAddNewPriceModal] = useState(false);
	const [deletingPriceId, setDeletingPriceId] = useState(null);
	const [editingPriceId, setEditingPriceId] = useState(null);
	const [isLoading, setIsLoading] = useState(null);
	const [wasUpdatedBackend, setWasUpdatedBackend] = useState(null);

	const { isLoading: isLoadingPrices, prices } = useGetPrices({
		setSnackbar,
		wasUpdatedBackend,
		setWasUpdatedBackend,
	});

	const openAddNewPriceModal = () => setIsAddNewPriceModal(true);
	const closeAddNewPriceModal = () => setIsAddNewPriceModal(false);
	const closeEditPriceModal = () => setEditingPriceId(null);

	const saveNewPrice = newPrice => {
		setIsLoading(true);

		return createPrice(newPrice)
			.then(() => {
				setWasUpdatedBackend(true);
				setIsAddNewPriceModal(false);
				setSnackbar({
					text: createSuccessMessage,
					type: enums.snackbarTypes.info,
				});
			})
			.catch(e => {
				if (e.error === invalidTokenErr || e?.response?.status === 401) return logOut();

				return { error: e.message };
			}).finally(() => {
				setIsLoading(false);
			});
	};

	const updatePrice = price => {
		setIsLoading(true);

		return editPrice(price)
			.then(() => {
				setWasUpdatedBackend(true);
				setEditingPriceId(null);

				setSnackbar({
					text: updateSuccessMessage,
					type: enums.snackbarTypes.info,
				});
			})
			.catch(e => {
				if (e.error === invalidTokenErr || e?.response?.status === 401) return logOut();

				return { error: e.message };
			}).finally(() => {
				setIsLoading(false);
			});
	};

	const deletePrice = async () => {
		setIsLoading(true);

		return removePrice(deletingPriceId).then(() => {
			setWasUpdatedBackend(true);

			setSnackbar({
				text: deleteSuccessMessage,
				type: enums.snackbarTypes.info,
			});
		}).catch(e => {
			if (e.error === invalidTokenErr || e?.response?.status === 401) return logOut();

			setSnackbar({
				text: deleteError,
				type: enums.snackbarTypes.error,
			});
		}).finally(() => {
			setIsLoading(false);
			setDeletingPriceId(null);
		});
	};

	const openDeleteConfirmModal = id => setDeletingPriceId(id);

	const cancelDeletingPrice = () => setDeletingPriceId(null);

	return (
		<div className='prices'>
			<GridContainer>
				<S16 className='page-title' bold>Prices</S16>
			</GridContainer>
			<div className='guidelines'>
				{infoIcon}
				<P14>
					{guidelinesText}
				</P14>
			</div>
			<GridContainer>
				<PrimaryButton onClick={openAddNewPriceModal} className='admin-primary'>
					{plusIcon}
					<S16 bold>Add new Price</S16>
				</PrimaryButton>
			</GridContainer>
			<GridContainer>
				<PricesTable
					prices={isEmpty(prices) ? [] : [...prices].map((item, i) => ({ ...item, number: i + 1 }))}
					handleDelete={openDeleteConfirmModal}
					handleEdit={setEditingPriceId}
				/>
			</GridContainer>
			{
				isAddNewPriceModal
				&& <AppModal
					outerProps={{
						cancel: closeAddNewPriceModal,
						saveNewPrice,
						isLoading,
					}}
					isDarkModal={false}
					isCloseIcon
					title='Add new price'
					width='630px'
					component={AddNewPrice}
					isHeader onClose={closeAddNewPriceModal}
				/>
			}
			{
				editingPriceId
					&& <AppModal
						onClose={closeEditPriceModal}
						outerProps={{
							cancel: closeEditPriceModal,
							updatePrice,
							price: prices.find(item => item.id === editingPriceId),
							isLoading,
						}}
						isDarkModal={false}
						isCloseIcon
						title='Edit Price'
						width='630px'
						component={EditPrice}
						isHeader
					/>
			}
			{
				deletingPriceId
					&& <AppModal
						outerProps={{
							successConfirm: deletePrice,
							onClose: cancelDeletingPrice,
						}}
						isDarkModal={false}
						isCloseIcon
						onClose={cancelDeletingPrice}
						title={deleteTitle}
						component={Confirm}
						isHeader
					/>
			}
			{(isLoading || isLoadingPrices) && <LoadingOverlay/>}
		</div>
	);
};

Prices.propTypes = {
	setSnackbar: func,
	logOut: func,
};

export default connect(null, {
	setSnackbar,
	logOut,
})(memo(Prices));
