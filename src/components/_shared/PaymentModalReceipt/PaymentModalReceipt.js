import React from 'react'
import { Modal, Row, Col, Container } from 'react-bootstrap'
import PrimaryButton from '@components/_shared/buttons/PrimaryButton'

import Form from 'react-bootstrap/Form'
// import { client } from '@api/clientApi'
import { isEmpty } from '@utils/js-helpers'

const paymentModalReceipt = props => {
  const {
    receiptLoading,
    show,
    onHide,
    companyName,
    planName,
    clientId,
    paymentMethod,
    togglePaymentMethod,
    date,
    setDate,
    status,
    setStatus,
    expDate,
    setExpDate,
    price,
    handleReceipt,
    setPrice
  } = props

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
                  <Row className='align-items-center'>
                    <Col>
                      <Form.Check type={'radio'} id={'credit'}>
                        <Form.Check.Input
                          checked={paymentMethod}
                          onChange={togglePaymentMethod}
                          type={'radio'}
                          isValid={paymentMethod}
                        />
                        <Form.Check.Label>Credit Card</Form.Check.Label>
                      </Form.Check>
                    </Col>
                    <Col>
                      <Form.Check type={'radio'} id={'bank'}>
                        <Form.Check.Input
                          checked={!paymentMethod}
                          onChange={togglePaymentMethod}
                          type={'radio'}
                          isValid={!paymentMethod}
                        />
                        <Form.Check.Label>Bank Transfer</Form.Check.Label>
                      </Form.Check>
                    </Col>
                  </Row>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className='mb-3' controlId='formBasicPassword'>
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    value={price}
                    onChange={e => {
                      const re = /^[0-9\b]+$/
                      if (e.target.value === '' || re.test(e.target.value)) {
                        setPrice(e.target.value)
                      }
                    }}
                    type='text'
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className='mb-3' controlId='formBasicPassword'>
                  <Form.Label>Status</Form.Label>
                  <Form.Control value={status} onChange={e => setStatus(e.target.value)} type='text' />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group className='mb-3' controlId='formBasicPassword'>
                  <Form.Label>Date</Form.Label>
                  <Form.Control value={date} onChange={e => setDate(e.target.value)} type='date' />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className='mb-3' controlId='formBasicPassword'>
                  <Form.Label>Expiration Date</Form.Label>
                  <Form.Control value={expDate} onChange={e => setExpDate(e.target.value)} type='date' />
                </Form.Group>
              </Col>
            </Row>
          </Container>
        </Form>
      </Modal.Body>
      <Modal.Footer className='modal_no-border'>
        <PrimaryButton className='modal_btn' text='Cancel' isOutline={true} isDarkTheme={false} onClick={onHide} />
        <PrimaryButton
          className={'modal_btn'}
          disabled={isEmpty(date) || isEmpty(expDate) || isEmpty(status) || isEmpty(price)}
          text='Update'
          isDarkTheme={false}
          onClick={handleReceipt}
          isLoading={receiptLoading}
        />
      </Modal.Footer>
    </Modal>
  )
}

export default paymentModalReceipt
