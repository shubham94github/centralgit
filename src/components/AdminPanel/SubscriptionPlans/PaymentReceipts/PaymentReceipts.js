import React from 'react'
import { P16 } from '@components/_shared/text'
import { connect, useDispatch } from 'react-redux'
import MainTable from '@components/_shared/MainTable'
import { isEmpty } from '@utils/js-helpers'
import { receiptColumns } from '@constants/paymentReceipts'
import { useEffect } from 'react'
import { getAllPaymentReceipts } from '@ducks/admin/actions'
import LoadingOverlay from '@components/_shared/LoadingOverlay'

const PaymentReceipts = props => {
  const dispatch = useDispatch()
  const { paymentReceipts, isLoading } = props

  useEffect(() => {
    if (isEmpty(paymentReceipts)) dispatch(getAllPaymentReceipts())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div>
      <P16 bold>Payment Receipts</P16>
      <MainTable columns={receiptColumns} data={paymentReceipts} />
      {isLoading && <LoadingOverlay />}
    </div>
  )
}

export default connect(({ admin: { allPaymentReceipts, isLoading } }) => {
  return {
    paymentReceipts: allPaymentReceipts,
    isLoading
  }
})(PaymentReceipts)
