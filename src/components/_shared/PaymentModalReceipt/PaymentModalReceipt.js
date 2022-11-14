import React from 'react'
import { Modal, Row, Col, Container } from 'react-bootstrap'
import PrimaryButton from '@components/_shared/buttons/PrimaryButton'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { client } from '@api/clientApi'

const paymentModalReceipt = props => {
  const { show, onHide, companyName, planName, clientId } = props
  return (
    <Modal size='lg' className='modal' centered show={show} onHide={onHide}>
      <Modal.Header className='modal_no-border'>
        <Modal.Title>Payment Receipt</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Container>
            <Row>
              <Col>
                <Form.Group className='mb-3' controlId=''>
                  <Form.Label>Company Name</Form.Label>
                  <Form.Control value={companyName} disabled type='email' placeholder='Client Name' />
                  {/* <Form.Text className='text-muted'>We'll never share your email with anyone else.</Form.Text> */}
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className='mb-3' controlId='formBasicPassword'>
                  <Form.Label>Plan</Form.Label>
                  <Form.Control value={planName} disabled type='text' placeholder='Plan' />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className='mb-3' controlId='formBasicPassword'>
                  <Form.Label>Client Id</Form.Label>
                  <Form.Control value={clientId} disabled type='text' placeholder='Client Id' />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className='mb-3' controlId='formBasicPassword'>
                  <Form.Label>Payment Method</Form.Label>
                  <Form.Control type='text' />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className='mb-3' controlId='formBasicPassword'>
                  <Form.Label>Price</Form.Label>
                  <Form.Control type='number' />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className='mb-3' controlId='formBasicPassword'>
                  <Form.Label>Status</Form.Label>
                  <Form.Control type='number' />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group className='mb-3' controlId='formBasicPassword'>
                  <Form.Label>Date</Form.Label>
                  <Form.Control type='date' />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className='mb-3' controlId='formBasicPassword'>
                  <Form.Label>Expiration Date</Form.Label>
                  <Form.Control type='date' />
                </Form.Group>
              </Col>
            </Row>
          </Container>
        </Form>
      </Modal.Body>
      <Modal.Footer className='modal_no-border'>
        <PrimaryButton className='modal_btn' text='Cancel' isOutline={true} isDarkTheme={false} onClick={onHide} />
        <PrimaryButton className={'modal_btn'} text='Update' isDarkTheme={false} />
      </Modal.Footer>
    </Modal>
  )
}

export default paymentModalReceipt
