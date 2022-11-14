import React, { memo, useState, useEffect } from 'react'
import { P12, P16 } from '@components/_shared/text'
import { Dropdown, Modal } from 'react-bootstrap'
import { Icons } from '@icons'
import { colors } from '@colors'
import { connect, useDispatch } from 'react-redux'
import enums from '@constants/enums'
import { dateFormatCorrection } from '@utils'
import { arrayOf, number, object, string, bool } from 'prop-types'
import BillingAddressHOC from './BillingAddressHOC'
import AppModal from '@components/Common/AppModal'
import PrimaryButton from '@components/_shared/buttons/PrimaryButton'
import PaymentModalReceipt from '@components/_shared/PaymentModalReceipt'
import { subscriptionPlanType } from '@constants/types'
import { getSubscriptionPlans } from '@ducks/admin/actions'
import { isEmpty } from '@utils/js-helpers'
import { updateSubscriptionPlan } from '@api/subscriptionPansApi'
import { SET_UPDATED_PROFILE } from '@ducks/admin/index'
import './BillingDetails.scss'

const editIcon = Icons.editIcon(colors.darkblue70)
const PlusIcon = Icons.plus(colors.darkblue70)
const BillingDetails = ({
  companyLegalName,
  country,
  city,
  address,
  vatNumber,
  postZipCode,
  nextBillingDate,
  brand,
  last4,
  enterpriseCode,
  discountCode,
  isRetailersEditBillingDetailsPermission,
  uiName,
  id,
  subscriptionPlans,
  paymentPlan,
  amount
}) => {
  const dispatch = useDispatch()
  useEffect(() => {
    if (isEmpty(subscriptionPlans)) dispatch(getSubscriptionPlans())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const paymentCardIcon = enums.paymentCardLogos[brand]
  const nextBillingDateFormat = nextBillingDate && dateFormatCorrection(nextBillingDate, 'MMM d, yyyy')
  const [isEditBillingAddress, setIsEditBillingAddress] = useState(false)
  const [billingPlan, setBillingPlan] = useState(false)
  const [paymentDetails, setPaymentDetails] = useState(false)
  const [billingName, setBillingName] = useState('')
  const [updateId, setUpdateId] = useState('')
  const [loading, setLoading] = useState(false)

  const toggleBillingAddressEditModal = () => setIsEditBillingAddress(prevState => !prevState)
  const toggleBillingPlan = () => setBillingPlan(prevState => !prevState)
  const togglePaymentDetails = () => setPaymentDetails(prevState => !prevState)
  const handleUpdate = async () => {
    setLoading(true)
    try {
      const response = await updateSubscriptionPlan(id, updateId)
      dispatch({
        type: SET_UPDATED_PROFILE,
        payload: { profile: response }
      })
    } catch (error) {
      // TOTO::fixme and add a proper error
      console.log('response =>', error)
    } finally {
      setLoading(false)
      toggleBillingPlan()
    }
  }
  return (
    <>
      <PaymentModalReceipt
        show={paymentDetails}
        onHide={togglePaymentDetails}
        companyName={companyLegalName}
        planName={uiName}
        clientId={id}
      />
      {isEditBillingAddress && (
        <AppModal
          component={BillingAddressHOC}
          className='account-information-pop-up'
          onClose={toggleBillingAddressEditModal}
          title='Billing address'
          outerProps={{
            onClose: toggleBillingAddressEditModal
          }}
          width='630px'
        />
      )}
      {billingPlan && (
        <Modal className='modal' centered show={billingPlan} onHide={toggleBillingPlan}>
          <Modal.Header className='modal_no-border'>
            <Modal.Title>Billing Plan</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Dropdown s>
              <Dropdown.Toggle
                style={{ width: '100%', backgroundColor: '#D2E085', outline: 'none' }}
                id='dropdown-basic'>
                {billingName || uiName}
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ width: '100%', maxHeight: '400px', overflow: 'scroll' }}>
                {subscriptionPlans.map(item => (
                  <Dropdown.Item
                    onClick={() => {
                      setBillingName(item.uiName)
                      setUpdateId(item.id)
                    }}
                    key={item.id}>
                    {item.uiName}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>{' '}
          </Modal.Body>
          <Modal.Footer className='modal_no-border'>
            <PrimaryButton
              className='modal_btn'
              text='Cancel'
              isOutline={true}
              isDarkTheme={false}
              onClick={() => {
                toggleBillingPlan()
                setBillingName('')
                setUpdateId('')
              }}
            />
            <PrimaryButton
              className={'modal_btn'}
              text='Update'
              isLoading={loading}
              isDarkTheme={false}
              onClick={handleUpdate}
            />
          </Modal.Footer>
        </Modal>
      )}
      <div className='billing-details-admin-container'>
        <div>
          <P16 bold>
            Billing address
            {isRetailersEditBillingDetailsPermission && (
              <span className='edit-icon' onClick={toggleBillingAddressEditModal}>
                {editIcon}
              </span>
            )}
          </P16>
          {companyLegalName && (
            <P12 className='word-break'>
              <b>Legal name:</b>&nbsp;{companyLegalName}
            </P12>
          )}
          {country?.name && (
            <P12>
              <b>Country:</b>&nbsp;{country.name}
            </P12>
          )}
          {city && (
            <P12>
              <b>City: </b>&nbsp;{city}
            </P12>
          )}
          {address && (
            <P12>
              <b>Address:</b>&nbsp;{address}
            </P12>
          )}
          {vatNumber && (
            <P12>
              <b>VAT Number:</b>&nbsp;{vatNumber}
            </P12>
          )}
          {postZipCode && (
            <P12>
              <b>Post/Zip code:</b>&nbsp;{postZipCode}
            </P12>
          )}
        </div>
        <div>
          <P16 bold>Billing</P16>
          {last4 && (
            <P12 className='card-center'>
              <b>Card number:</b>&nbsp;{paymentCardIcon}&nbsp;{last4}
            </P12>
          )}
          {uiName && (
            <P12>
              <b>Current plan:</b>&nbsp;{uiName}{' '}
              <span className='edit-icon' onClick={toggleBillingPlan}>
                {editIcon}
              </span>
            </P12>
          )}
          {nextBillingDate && (
            <P12>
              <b>Next billing date:</b>&nbsp;{nextBillingDateFormat}
            </P12>
          )}
          {amount && (
            <P12>
              <b>Amount:</b>&nbsp;{'USD ' + amount / 100}
            </P12>
          )}
          {discountCode && (
            <P12>
              <b>Coupon:</b>&nbsp;{discountCode}
            </P12>
          )}
          {enterpriseCode && (
            <P12>
              <b>Enterprise code:</b>&nbsp;{enterpriseCode}
            </P12>
          )}
        </div>
        <div>
          <P16 bold>Payment Receipts</P16>
          <P12>
            <b></b>&nbsp;
            <span className='edit-icon' onClick={togglePaymentDetails}>
              {PlusIcon}
            </span>
          </P12>
        </div>
      </div>
    </>
  )
}

BillingDetails.propTypes = {
  subscriptionPlans: arrayOf(subscriptionPlanType),
  companyLegalName: string,
  country: object,
  city: string,
  address: string,
  vatNumber: string,
  postZipCode: string,
  nextBillingDate: number,
  brand: string,
  last4: string,
  enterpriseCode: string,
  discountCode: number,
  isRetailersEditBillingDetailsPermission: bool,
  uiName: string
}

export default connect(({ admin: { subscriptionPlans, profile }, auth }) => {
  const { listOfPermissions } = auth

  const {
    retailer: {
      companyLegalName,
      address,
      vatNumber,
      postZipCode,
      nextBillingDate,
      brand,
      last4,
      enterpriseCode,
      discountCode,
      paymentPlan
    },
    city,
    country,
    id
  } = profile

  return {
    id,
    companyLegalName,
    country,
    city,
    address,
    vatNumber,
    postZipCode,
    nextBillingDate,
    brand,
    last4,
    enterpriseCode,
    discountCode,
    isRetailersEditBillingDetailsPermission: listOfPermissions?.isRetailersEditBillingDetailsPermission,
    uiName: paymentPlan?.uiName,
    paymentPlan,
    amount: paymentPlan?.price?.unitAmount,
    subscriptionPlans
  }
})(memo(BillingDetails))
