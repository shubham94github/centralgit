import React, { memo, useEffect, useState } from "react";
import { connect } from "react-redux";
import { arrayOf, bool, func, number, shape, string } from "prop-types";
import { useForm } from "react-hook-form";
import RadioButton from "@components/_shared/form/RadioButton";
import Confirm from "@components/_shared/ModalComponents/Confirm";
import PaymentFormWithProvider from "@components/_shared/PaymentFormWithProvider";
import DeleteConfirmContent from "./DeleteConfirmContent";
import AppModal from "@components/Common/AppModal";
import enums from "@constants/enums";
import { attachPaymentMethod, detachPaymentMethod } from "@ducks/auth/actions";
import usePrevious from "@utils/hooks/usePrevious";
import { Icons } from "@icons";

import "./CardsInfo.scss";

const editIcons = Icons.edit();
const trashIcon = Icons.trash();
const plusIcon = Icons.plus();

const CardsInfo = ({
  attachPaymentMethod,
  cards,
  defaultPaymentMethodId,
  detachPaymentMethod,
  isGettingStarted,
  nextPaymentDate,
}) => {
  const [isAddNewCardModal, setIsAddNewCardModal] = useState(false);
  const [isEditCardModal, setIsEditCardModal] = useState(false);
  const [idDeletePaymentMethod, setIdDeletePaymentMethod] = useState(null);
  const [isDeletePaymentMethodModal, setIsDeletePaymentMethodModal] =
    useState(false);
  const [dataSelectedCard, setDataSelectedCard] = useState(null);
  const isLastCard = cards?.length === 1;

  const { getValues, register, watch } = useForm();

  const toggleAddCardModal = () => setIsAddNewCardModal(!isAddNewCardModal);
  const toggleEditCardModal = () => setIsEditCardModal(!isEditCardModal);
  const toggleDeleteConfirmModal = (methodId) => {
    const selectedCard = cards.find(
      (card) => card.paymentMethodId === methodId
    );

    setDataSelectedCard(selectedCard);
    if (!!methodId) setIdDeletePaymentMethod(methodId);
    setIsDeletePaymentMethodModal(!!methodId);
  };

  const handleDetachPaymentMethod = () => {
    if (
      !isLastCard &&
      !isGettingStarted &&
      idDeletePaymentMethod === defaultPaymentMethodId
    )
      return;

    detachPaymentMethod(idDeletePaymentMethod);

    toggleDeleteConfirmModal(false);
  };

  const prevSelectedPaymentMethod = usePrevious(getValues("paymentMethod"));
  const selectedPaymentMethod = watch("paymentMethod");

  useEffect(() => {
    if (selectedPaymentMethod !== prevSelectedPaymentMethod)
      attachPaymentMethod(selectedPaymentMethod, false);
  }, [attachPaymentMethod, prevSelectedPaymentMethod, selectedPaymentMethod]);

  return (
    <>
      {cards.map(({ brand, last4, paymentMethodId }, idx) => {
        const addCard = () => {
          if (idx !== cards.length - 1) return;

          toggleAddCardModal();
        };

        const deleteCard = () => {
          if (
            !isLastCard &&
            !isGettingStarted &&
            paymentMethodId === defaultPaymentMethodId
          )
            return;

          toggleDeleteConfirmModal(paymentMethodId);
        };

        return (
          <div className="payment-card-info" key={paymentMethodId}>
            {cards.length > 1 && (
              <RadioButton
                value={paymentMethodId}
                name="paymentMethod"
                type="radio"
                id={paymentMethodId}
                defaultChecked={paymentMethodId === defaultPaymentMethodId}
                register={register}
              />
            )}
            <div className="card-container">
              <div className="card-logo">{enums.paymentCardLogos[brand]}</div>
              <div className="card-number p14">{last4}</div>
              {!isGettingStarted && (
                <>
                  <div className="edit" onClick={toggleEditCardModal}>
                    {editIcons}
                  </div>
                  <div className="delete" onClick={deleteCard}>
                    {(isLastCard ||
                      paymentMethodId !== defaultPaymentMethodId) &&
                      trashIcon}
                  </div>
                  <div className="add-card-btn" onClick={addCard}>
                    {idx === cards.length - 1 && plusIcon}
                  </div>
                </>
              )}
            </div>
            {isEditCardModal && (
              <AppModal
                component={PaymentFormWithProvider}
                className="add-new-card-modal"
                outerProps={{
                  isModal: true,
                  isUpdating: true,
                  toggleModal: toggleEditCardModal,
                  selectedPaymentMethod,
                }}
                title=""
                onClose={toggleEditCardModal}
                staticBackdrop={false}
                width="668px"
                isDarkModal
              />
            )}
          </div>
        );
      })}
      {isDeletePaymentMethodModal && (
        <AppModal
          component={Confirm}
          outerProps={{
            component: DeleteConfirmContent,
            componentProps: {
              brand: dataSelectedCard?.brand,
              last4: dataSelectedCard?.last4,
              isLastCard: isLastCard,
              nextPaymentDate: nextPaymentDate,
            },
            successConfirm: handleDetachPaymentMethod,
          }}
          title="Are you sure you want to remove this credit card?"
          onClose={toggleDeleteConfirmModal}
          width="630px"
        />
      )}
      {isAddNewCardModal && (
        <AppModal
          component={PaymentFormWithProvider}
          className="add-new-card-modal"
          outerProps={{
            isModal: true,
            isUpdating: false,
            toggleModal: toggleAddCardModal,
          }}
          title=""
          onClose={toggleAddCardModal}
          staticBackdrop={false}
          width="668px"
          isDarkModal
        />
      )}
    </>
  );
};

CardsInfo.defaultProps = {
  isGettingStarted: false,
};

CardsInfo.propTypes = {
  cards: arrayOf(
    shape({
      brand: string.isRequired,
      last4: string.isRequired,
      paymentMethodId: string.isRequired,
    })
  ),
  attachPaymentMethod: func.isRequired,
  detachPaymentMethod: func.isRequired,
  defaultPaymentMethodId: string,
  isGettingStarted: bool,
  nextPaymentDate: number,
};

export default connect(null, {
  attachPaymentMethod,
  detachPaymentMethod,
})(memo(CardsInfo));
