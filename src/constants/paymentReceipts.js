export const columns = [
  {
    name: 'Client ID',
    selector: row => row?.clientId,
    width: '100px'
  },
  {
    name: 'Plan',
    selector: row => row?.paymentPlanOutDto.uiName,
    width: '370px'
  },

  {
    name: 'Reference',
    selector: row => row?.payment_reference,
    width: '100px'
  },
  {
    name: 'Amount',
    selector: row => `USD ${row?.paymentPlanOutDto.price.unitAmount / 100}`,
    width: '100px'
  },
  {
    name: 'Payment Date',
    selector: row => new Date(row?.createdAt).toLocaleDateString(),
    width: '130px'
  },
  {
    name: 'Expiry Date',
    selector: row => new Date(row?.planexpirydate).toLocaleDateString(),
    width: '130px'
  },
  {
    name: 'Method',
    selector: row => row?.payment_Method,
    width: '150px'
  }
]
export const receiptColumns = [
  // {
  //   name: 'Client Name',
  //   selector: row => row.id,
  //   width: '150px'
  // },
  {
    name: 'Client ID',
    selector: row => row?.clientId,
    width: '100px'
  },
  {
    name: 'Plan',
    selector: row => row?.paymentPlanOutDto.uiName,
    width: '370px'
  },

  {
    name: 'Reference',
    selector: row => row?.payment_reference,
    width: '100px'
  },
  {
    name: 'Amount',
    selector: row => `USD ${row?.paymentPlanOutDto.price.unitAmount / 100}`,
    width: '100px'
  },
  {
    name: 'Payment Date',
    selector: row => new Date(row?.createdAt).toLocaleDateString(),
    width: '130px'
  },
  {
    name: 'Expiry Date',
    selector: row => new Date(row?.planexpirydate).toLocaleDateString(),
    width: '130px'
  },
  {
    name: 'Method',
    selector: row => row?.payment_Method,
    width: '150px'
  }
]
