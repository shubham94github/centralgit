import React from 'react'
import { Icons } from '@icons'
import { colors } from '@colors'
import DropdownList from './DropdownList'
import CustomDropdown from '@components/_shared/CustomDropdown'
import { client } from '@api/clientApi'

const menuIcon = Icons.threeDotsMenuIcon(colors.black)
const notApplicable = 'N/A'

export const generateColumns = ({ handleEdit }) => [
  {
    name: 'Actions',
    property: 'actions',
    selector: 'actions',
    width: '100px',
    // eslint-disable-next-line react/prop-types
    cell: item => {
      const editPrice = () => handleEdit(item)
      const outerProps = {
        id: item.id,
        editPrice
      }

      return (
        <div className='center'>
          <CustomDropdown
            className='dropdown-menu-table'
            button={menuIcon}
            outerProps={outerProps}
            component={DropdownList}
          />
        </div>
      )
    }
  },
  {
    name: 'Client ID',
    selector: row => row?.clientId || notApplicable,
    width: '100px'
  },
  {
    name: 'Plan',
    selector: row => row?.paymentPlanOutDto.uiName || notApplicable,
    width: '370px'
  },

  {
    name: 'Reference',
    selector: row => row?.payment_reference || notApplicable,
    width: '100px'
  },
  {
    name: 'Amount',
    selector: row => row.price || notApplicable,
    // selector: row => `USD ${row?.paymentPlanOutDto.price.unitAmount / 100}` || notApplicable ,
    width: '120px'
  },
  {
    name: 'Payment Date',
    selector: row => new Date(row?.createdAt).toLocaleDateString() || notApplicable,
    width: '130px'
  },
  {
    name: 'Expiry Date',
    selector: row => new Date(row?.planexpirydate).toLocaleDateString() || notApplicable,
    width: '130px'
  },
  {
    name: 'Method',
    selector: row => row?.payment_Method || notApplicable,
    width: '150px'
  }
]
export const receiptColumns = [
  {
    name: 'Client Name',
    selector: row => row.clientName || notApplicable,
    width: '180px'
  },
  {
    name: 'Client ID',
    selector: row => row?.clientId || notApplicable,
    width: '100px'
  },
  {
    name: 'Plan',
    selector: row => row?.paymentPlanOutDto.uiName || notApplicable,
    width: '370px'
  },

  {
    name: 'Reference',
    selector: row => row?.payment_reference || notApplicable,
    width: '100px'
  },
  {
    name: 'Amount',
    selector: row => `USD ${row?.paymentPlanOutDto.price.unitAmount / 100}` || notApplicable,
    width: '100px'
  },
  {
    name: 'Payment Date',
    selector: row => new Date(row?.createdAt).toLocaleDateString() || notApplicable,
    width: '130px'
  },
  {
    name: 'Expiry Date',
    selector: row => new Date(row?.planexpirydate).toLocaleDateString() || notApplicable,
    width: '130px'
  },
  {
    name: 'Method',
    selector: row => row?.payment_Method || notApplicable,
    width: '150px'
  }
]
