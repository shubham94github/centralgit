import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import PrimaryButton from '@components/_shared/buttons/PrimaryButton'
import { S16 } from '@components/_shared/text'
import { useFormik } from 'formik'
import { useDispatch } from 'react-redux'
import { editArticle, createArticle } from '@ducks/admin/actions'

function EditArticle(props) {
  const dispatch = useDispatch()

  const { title, description, articles_link, onHide, update, id } = props
  console.log('update ->', update)
  const formik = useFormik({
    initialValues: {
      title,
      description,
      articles_link
    },
    onSubmit: (values, action) => {
      if (update) {
        dispatch(createArticle({ ...values }))
      } else dispatch(editArticle({ ...values, id }))
      onHide()
    }
  })
  const { values, handleChange, handleBlur, touched, handleSubmit } = formik

  return (
    <Modal {...props} size='lg' centered>
      <Modal.Header closeButton>
        <S16 bold>Edit Article</S16>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className='mb-3' controlId='title'>
            <Form.Label>Title</Form.Label>
            <Form.Control
              type='text'
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.title || title}
              placeholder='title'
            />
          </Form.Group>
          <Form.Group className='mb-3' controlId='articles_link'>
            <Form.Label>Link</Form.Label>
            <Form.Control
              type='text'
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.articles_link || articles_link}
              placeholder='https://www.retailhub.com'
            />
          </Form.Group>
          <Form.Group className='mb-3' controlId='description'>
            <Form.Label>Description</Form.Label>
            <Form.Control
              as='textarea'
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.description || description}
              placeholder='Description'
              rows={3}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <PrimaryButton onClick={handleSubmit} isFullWidth>
          {!update ? 'Update' : 'Save'}
        </PrimaryButton>
      </Modal.Footer>
    </Modal>
  )
}

export default EditArticle
