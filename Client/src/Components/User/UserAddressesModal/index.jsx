import { useContext, useState } from "react";
import { 
    Modal, ModalBody, ModalFooter, ListGroup, Button, ButtonGroup, Container, Label 
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import UserContext from "../../../Context/User/Context";
import UserAddressCard from "../UserAddressCard";
import { faCheck, faClose, faUserGear } from "@fortawesome/free-solid-svg-icons";
import { UserOrderSingleProduct } from '../../../requests/UserRequests';
import { ErrorAlert, SuccessAlert } from "../../Common/Alert";

import PaymentApp from "../../Common/PaymentApp";

const UserAddressesModal = ({ isOpen, toggle, selectedProduct }) => {    

    const { getAddresses, deleteCartProductByIndex } = useContext(UserContext);    
    const [ selectedAddress, setSelectedAddress ] = useState();    
    const [ paymentMethod, setPaymentMethod ] = useState('COD');
    const navigate = useNavigate();

    const handleSelectAddress = address => setSelectedAddress(address);

    const placeOrderCB = _ => {
        toggle();
        deleteCartProductByIndex(selectedProduct.index);
        SuccessAlert(`Order Placed for ${ selectedProduct.productName }`);
    }

    const handlePlaceOrder = async _ => {
        try {
            const payload = {
                addressId: selectedAddress?.addressId,
                cartId: selectedProduct?.cartId,
                paymentMethod,
            };
            
            await UserOrderSingleProduct(payload); 
            placeOrderCB();
        }        
        catch (error) {
            ErrorAlert(error);
        }
    }

    const addresses = getAddresses();
    const addressItems = 
        addresses?.length > 0
        ?
        addresses.map((address, index) =>            
            <UserAddressCard
                key={ address.addressId }
                index={ index }
                address={ address }
                onClick={ handleSelectAddress } 
                isSelected={ address.addressId == selectedAddress?.addressId } 
            /> 
        )
        :
        <Container className="text-center text-danger">
            <h4>You haven't added any Address</h4>
        </Container>

    return (
        <>
        <Button color="primary" className="mx-3 mt-3" onClick={ toggle } >Addresses</Button>
        <Modal size="xl" isOpen={ isOpen } toggle={ toggle }>
            <ModalBody>
                {
                    selectedProduct && 
                    <div className="text-center">
                        <h4 className="fw-bold">{ selectedProduct.productName }</h4>                
                    </div>
                }

                <Container>
                    <Label className="fw-bold">Select Address*</Label>
                    <ListGroup flush>
                        { addressItems }                        
                    </ListGroup>
                    <div className="d-flex">
                        <Button color="primary" className="mt-2 mx-auto" onClick={ _ => navigate("/user/settings") }>
                            <FontAwesomeIcon icon={ faUserGear }/> Add Address
                        </Button>
                    </div>
                </Container>

                { 
                    selectedProduct &&
                    <Container className="mt-2">
                        <Label className="fw-bold">Mode Of Payment*</Label> <br/>
                        <ButtonGroup className="mx-auto">
                            <Button color="primary" onClick={ _ => setPaymentMethod('COD') } outline active={ paymentMethod == 'COD' }>Cash On Delivery</Button>
                            <Button color="primary" onClick={ _ => setPaymentMethod('CARD') } outline active={ paymentMethod == 'CARD' }>Card</Button>
                        </ButtonGroup>
                    </Container>
                }

                {
                    selectedProduct && selectedAddress && paymentMethod == 'CARD' && 
                    <PaymentApp 
                        payload={{ 
                            cartId: selectedProduct.cartId, 
                            addressId: selectedAddress.addressId 
                        }}

                        cb = { placeOrderCB }
                    />
                }
            </ModalBody>

            <ModalFooter className="border-0">
                <ButtonGroup className="mx-auto">
                    {
                        selectedProduct && paymentMethod != 'CARD' &&
                        <Button color="primary" onClick={ handlePlaceOrder }>
                            <FontAwesomeIcon icon={ faCheck } className="mx-2" />
                            Place Order
                        </Button>
                    }
                    <Button color="danger" onClick={ toggle } outline>
                        <FontAwesomeIcon icon={ faClose } className="mx-2" />                        
                    </Button>
                </ButtonGroup>
            </ModalFooter>
        </Modal>
        </>
    );
}

export default UserAddressesModal;