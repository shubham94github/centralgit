import { associatedTagsErrMsg, maxAssociatedTagsLength } from '@components/Auth/constants'
import { array, object } from 'yup'

export const schema = object({
  relatedTags: array()
    .test('validateTags', associatedTagsErrMsg, val => val.length <= maxAssociatedTagsLength)
    .default([])
})
