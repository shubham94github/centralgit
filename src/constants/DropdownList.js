import React from 'react'
import { bool, func, number, oneOfType, string } from 'prop-types'

const DropdownList = ({ id, editPrice, isAbleToDelete }) => {
  const onEdit = () => editPrice(id)

  return (
    <div className='dropdown-list'>
      <div className='dropdown-item' onClick={onEdit}>
        Edit
      </div>
      {/* {isAbleToDelete && (
        <div className='dropdown-item' onClick={onDelete}>
          Delete
        </div>
      )} */}
    </div>
  )
}

DropdownList.propTypes = {
  id: oneOfType([string, number]),
  editPrice: func,
  deletePrice: func,
  isAbleToDelete: bool
}

export default DropdownList
