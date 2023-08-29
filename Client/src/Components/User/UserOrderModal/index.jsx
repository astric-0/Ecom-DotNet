import { useState, useContext } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Row, Col, ListGroup, ListGroupItem } from 'reactstrap';
import UserContext from '../../../Context/User/Context';

const UserOrderModal = _ => {
    const [isOpen, setIsOpen] = useState(false);
    const { getCart } = useContext(UserContext);
    
    const handleOpenModal = _ => setIsOpen(true);
    const handleToggleModal = _ => setIsOpen(!isOpen);
    const products = getCart();

    let totalCartCost = 0;
    const header = (
        <ListGroupItem className='bg-primary text-light rounded'>
            <Row>
                <Col xs={1}>S. No.</Col>
                <Col xs={7}>Product Name</Col>
                <Col xs={1}>Price</Col>
                <Col xs={1}>Quantity</Col>
                <Col xs={2}>Total</Col>
            </Row>
        </ListGroupItem>
    )
    
    return (
        <>
            <Button color='primary' className='mt-3' onClick={ handleOpenModal }>Order Details</Button>
            <Modal isOpen={isOpen} size='xl'>
                <ModalHeader className='border-0' toggle={ handleToggleModal }>Order Details</ModalHeader>
                <ModalBody>
                    {
                    products.length > 0 
                    ? 
                    <>
                        <ListGroup flush>
                        { header }
                        {                        
                            products.map((cartProduct, index) => {
                                const { productId, productName, quantity, price } = cartProduct;
                                const totalPrice = price * quantity;

                                totalCartCost += totalPrice;
                                return (
                                    <ListGroupItem key={productId}>
                                        <Row className='my-0'>
                                            <Col xs={1}>{ index + 1 }.</Col>
                                            <Col xs={7}>
                                                <h5><b>{ productName }</b></h5>
                                            </Col>
                                            <Col xs={1}>
                                                <b>&#8377;{ price }</b>
                                            </Col>
                                            <Col xs={1}>
                                                <b>{ quantity }</b>
                                            </Col>
                                            <Col xs={2}>
                                                <b>&#8377;{ totalPrice }</b>
                                            </Col>
                                        </Row>
                                    </ListGroupItem>
                                );
                            })
                        }
                        </ListGroup>
                        
                        <div className='d-flex mt-4'>
                            <h3 className='float-right text-primary'>Total: <b>&#8377; { totalCartCost }</b></h3>
                        </div>
                    </>
                    :
                        <h1 className='text-center text-primary'>Add products in the cart</h1>
                    }
                </ModalBody>
                <ModalFooter className='border-0'>
                    {
                        (products.length > 0) &&
                        <Button color='primary' className='mx-auto' outline>Place Order</Button>                                                       
                    }
                </ModalFooter>
            </Modal>
        </>
    );
}

export default UserOrderModal;