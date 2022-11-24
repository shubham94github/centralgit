import React, { memo, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import enums from '@constants/enums'
import { yupResolver } from '@hookform/resolvers/yup'
import { Col, Row } from 'react-bootstrap'
import { P14 } from '@components/_shared/text'
import Select from '@components/_shared/form/Select'
import { handleCreateSelectOption } from '@utils/hooks/handleCreateSelectOption'
import PrimaryButton from '@components/_shared/buttons/PrimaryButton'
import { isEmpty } from '@utils/js-helpers'
import { array, func } from 'prop-types'
import { connect } from 'react-redux'
import { getAllTags } from '@ducks/common/actions'
import prepareSelectStyles from '@components/_shared/form/Select/prepareSelectStyles'
import { schema } from './schema'

const AssociatedTags = ({ initialTags, onSubmitHandler, onClose, getAllTags, tags }) => {
  const { register, handleSubmit, setValue, control, errors, setError, clearErrors, getValues, reset } = useForm({
    mode: enums.validationMode.all,
    resolver: yupResolver(schema),
    reValidateMode: enums.reValidationMode.onChange,
    defaultValues: schema.default()
  })

  useEffect(() => {
    if (!tags.length) getAllTags()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!isEmpty(initialTags)) {
      reset({
        relatedTags: initialTags.map(tag => {
          return { value: tag, name: tag, label: tag }
        })
      })
    }
  }, [initialTags, reset])

  const onSubmit = values =>
    onSubmitHandler({
      tags: values.relatedTags.map(item => item.label)
    })

  const onSelectChange = fieldName => option => {
    if (!option) setError(fieldName, { message: `Related tags is required field` })

    clearErrors(fieldName)
    setValue(fieldName, option)
  }

  return (
    <>
      <Row>
        <Col>
          <Row>
            <Col>
              <P14 className='mb-3'>
                Add or update tags associated with the domain for which you need Startups. You can add up to 12 tags.
              </P14>
            </Col>
          </Row>
          <Row>
            <Col>
              <Select
                id='relatedTags'
                name='relatedTags'
                options={tags}
                isError={!!errors?.relatedTags}
                errorMessage={errors?.relatedTags?.message}
                register={register}
                placeholder='Add a tag'
                customStyles={prepareSelectStyles(null, null, null, true)}
                isMulti={true}
                isClearable={true}
                isCreatable={true}
                control={control}
                onChange={onSelectChange('relatedTags')}
                handleCreateOpt={handleCreateSelectOption({
                  setValue,
                  getValues,
                  setError,
                  clearErrors,
                  fieldName: 'relatedTags'
                })}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className='mt-3'>
        <Col>
          <PrimaryButton onClick={onClose} text='Cancel' isOutline isFullWidth />
        </Col>
        <Col>
          <PrimaryButton onClick={handleSubmit(onSubmit)} text='Update' isFullWidth />
        </Col>
      </Row>
    </>
  )
}

AssociatedTags.propTypes = {
  initialTags: array,
  tags: array,
  onSubmitHandler: func.isRequired,
  onClose: func.isRequired,
  getAllTags: func.isRequired
}

AssociatedTags.defaultProps = {
  initialTags: [],
  tags: []
}

const mapStateToProps = ({ common: { tags } }) => ({
  tags
})

export default connect(mapStateToProps, {
  getAllTags
})(memo(AssociatedTags))
