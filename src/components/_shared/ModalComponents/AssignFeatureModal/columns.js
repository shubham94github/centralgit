import React from 'react'
import Checkbox from '@components/_shared/form/Checkbox'

/* eslint-disable */

export const getColumns = ({ assignType, handleChangeTableData }) => {
  return [
    {
      name: 'Item',
      grow: 2,
      property: 'title',
      selector: 'title',
      sortable: false,
      width: '350px',
      omit: false,
      disableOmit: true
    },
    {
      name: assignType?.label,
      grow: 2,
      property: assignType?.property,
      selector: assignType?.property,
      sortable: false,
      width: '140px',
      omit: false,
      disableOmit: false,
      cell: row => {
        const handleOnChange = e => handleChangeTableData(row.id, e.target.checked)

        return (
          <div className='centered-checkbox'>
            <Checkbox name={`${row.title}-${row.id}`} onChange={handleOnChange} checked={row[assignType?.property]} />
          </div>
        )
      }
    }
  ]
}
