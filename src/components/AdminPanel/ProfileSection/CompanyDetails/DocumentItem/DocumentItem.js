import React, { memo, useState } from 'react'
import AppModal from '@components/Common/AppModal'
import Confirm from '@components/_shared/ModalComponents/Confirm'
import { S12 } from '@components/_shared/text'
import { func, number, string } from 'prop-types'
import { Icons } from '@icons'

const DocumentItem = ({ id, filename, size, handleRemoveDocument }) => {
  const [isShowConfirm, setIsShowConfirm] = useState(false)
  const confirmMessage = 'Are you sure you want to delete document?'
  const convertByteToMB = byte => (byte / Math.pow(1024, 2)).toFixed(1)
  const toggleConfirm = () => setIsShowConfirm(prevState => !prevState)
  const removeDocument = () => {
    handleRemoveDocument(id)
    toggleConfirm()
  }

  return (
    <>
      {isShowConfirm && (
        <AppModal
          className='confirm-pop-up'
          onClose={toggleConfirm}
          title={confirmMessage}
          outerProps={{
            successConfirm: removeDocument,
            onClose: toggleConfirm
          }}
          component={Confirm}
        />
      )}
      <div key={id} className='document-item'>
        <span onClick={toggleConfirm} className='remove-icon'>
          {Icons.removeSmallIcon()}
        </span>
        <S12>{convertByteToMB(size)} MB</S12>
        <S12 className='truncate'>{filename}</S12>
      </div>
    </>
  )
}

DocumentItem.propTypes = {
  id: number.isRequired,
  filename: string.isRequired,
  size: number.isRequired,
  handleRemoveDocument: func.isRequired
}

export default memo(DocumentItem)
