import { useState, useContext } from "react";
import { Container, FormGroup, Label, Input, Button, ButtonGroup, Row } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faClose, faBriefcase } from "@fortawesome/free-solid-svg-icons";
import { UserAddAddressRequest } from "../../../requests/UserRequests";
import { ErrorAlert, SuccessAlert } from "../../Common/Alert";

import UserContext from "../../../Context/User/Context";

const UserAddAddressForm = ({ isVisible, toggle }) => {    
    if (isVisible === false) return <></>;

    const { addAddress } = useContext(UserContext);

    const init = {
        phoneNumber: '',
        houseNumber: '',
        area: '',
        landMark: '',
        pinCode: '',
        city: '',
        state: '',
        type: 'HOME'
    };

    const [ address, setAddress ] = useState(init);    

    const handleNumber = (field, max) => event => {
        const pinCodeValue = event.target.value
        if (!isNaN(pinCodeValue) && pinCodeValue.toString().length < max + 1)
            setAddress({ ...address, [ field ]: pinCodeValue });
    }

    const handleField = field => event =>
        setAddress({ ...address, [ field ]: event.target.value });

    const handleType = type => _ => setAddress({ ...address, 'type': type.toUpperCase() });

    const handleAddAddress = async _ => {
        try {
            const newAddress = await UserAddAddressRequest(address);
            addAddress(newAddress);
            toggle();
            SuccessAlert("Address Added");
        }
        catch (error) {
            ErrorAlert(error);
        }
    }

    const { phoneNumber, houseNumber, area, landMark, pinCode, city, state, type } = address;
    return (
        <Container className="w-75 my-5 border-1">
            <Row>
                <FormGroup className="col-md-12 col-lg-6">
                    <Label className="fw-bold">Phone Number*</Label>
                    <Input 
                        type="number" 
                        onChange={ handleNumber('phoneNumber', 10) } 
                        value={ phoneNumber } 
                        placeholder="max 10 digits"
                        autoFocus
                    />
                </FormGroup>

                <FormGroup className="col-md-12 col-lg-6">
                    <Label className="fw-bold">Flat, House Number, Building*</Label>
                    <Input 
                        type="text" 
                        onChange={ handleField('houseNumber') } 
                        value={ houseNumber }
                        placeholder="Or Company, Apartment ?"
                    />
                </FormGroup>
            </Row>

            <Row>
                <FormGroup className="col-md-12">
                    <Label className="fw-bold">Area, Sector, Village*</Label>
                    <Input 
                        type="textarea" 
                        onChange={ handleField('area') }
                        value={ area } 
                        placeholder="From the meadows?!"
                    />
                </FormGroup>          
            </Row>

            <Row>
                <FormGroup className="col-md-12 col-lg-6">
                    <Label className="fw-bold">Land Mark</Label>
                    <Input 
                        type="text" 
                        onChange={ handleField('landMark') } 
                        value={ landMark } 
                        placeholder="near any known building?"
                    />
                </FormGroup>

                <FormGroup className="col-md-12 col-lg-6">
                    <Label className="fw-bold">Pin Code*</Label>
                    <Input 
                        type="number" 
                        onChange={ handleNumber('pinCode', 6) }
                        value={ pinCode }
                        placeholder="max 6 digits"
                    />
                </FormGroup>
            </Row>

            <Row>
                <FormGroup>
                    <Label className="fw-bold">Address Type*</Label>
                    
                    <div className="d-flex">
                        <ButtonGroup className="mx-auto w-50">
                            <Button color="primary" onClick={ handleType('home') } outline active={ type == 'HOME' }>
                                <FontAwesomeIcon icon={ faHome }  /> { ' Home' }
                            </Button>

                            <Button color="primary" onClick={ handleType('office') } outline active={ type == 'OFFICE' }>
                                <FontAwesomeIcon icon={ faBriefcase }  /> { ' Office' }                                
                            </Button>
                        </ButtonGroup>  
                    </div>
                </FormGroup>              
            </Row>

            <Row>
                <FormGroup className="col-md-12 col-lg-6">
                    <Label className="fw-bold">Town / City*</Label>
                    <Input 
                        type="text" 
                        onChange={ handleField('city') } 
                        value={ city } 
                        placeholder="Cape town?"
                    />
                </FormGroup>

                <FormGroup className="col-md-12 col-lg-6">
                    <Label className="fw-bold">State*</Label>
                    <Input 
                        type="text" 
                        onChange={ handleField('state') } 
                        value={ state } 
                        placeholder="mine is bad!"
                    />
                </FormGroup>
            </Row>

            <div className="d-flex mt-3">
                <ButtonGroup className="mx-auto">
                    <Button color="primary" onClick={ handleAddAddress }>Save Addresss</Button>
                    <Button color="danger" onClick={ toggle } outline>
                        <FontAwesomeIcon icon={ faClose } />
                    </Button>
                </ButtonGroup>
            </div>
        </Container>
    );
}

UserAddAddressForm.defaultProps = {
    isVisible: true,
    toggle: false
};

export default UserAddAddressForm;