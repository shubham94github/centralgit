import React from 'react'
import { arrayOf, bool, func, object } from 'prop-types'
import MemberForm from '@components/_shared/ModalComponents/MemberForm'
import { countryType, departmentType, positionType } from '@constants/types'
import LoadingOverlay from '@components/_shared/LoadingOverlay'
import { optionsMapper } from '@utils/optionsMapper'

const AddNewMemberAdmin = ({
  onClose,
  schema,
  countries,
  handleCreateNewMember,
  departments,
  positions,
  isLoading
}) => {
  return (
    <div className='add-new-member-admin'>
      <MemberForm
        onClose={onClose}
        schema={schema}
        countries={optionsMapper(countries)}
        onSubmit={handleCreateNewMember}
        departments={optionsMapper(departments)}
        positions={optionsMapper(positions)}
      />
      {isLoading && <LoadingOverlay />}
    </div>
  )
}

AddNewMemberAdmin.propTypes = {
  onClose: func,
  handleCreateNewMember: func,
  schema: object,
  countries: arrayOf(countryType),
  departments: arrayOf(departmentType),
  positions: arrayOf(positionType),
  isLoading: bool
}

export default AddNewMemberAdmin
