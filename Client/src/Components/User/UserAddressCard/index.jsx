import { useContext } from 'react';
import { ListGroupItem, Card, CardBody, CardText, CardFooter, ButtonGroup, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPen, faHome, faBriefcase, faSmile, faSquarePhone } from '@fortawesome/free-solid-svg-icons';

import { UserDeleteAddressRequest } from '../../../requests/UserRequests';
import { ErrorAlert } from '../../Common/Alert';
import UserContext from '../../../Context/User/Context';

const iconsTypes = {
    "HOME": faHome,
    "OFFICE": faBriefcase,
    "DEFAULT": faSmile
};

const UserAddressCard = ({ address, onClick, isSelected, index }) => {
    const { removeAddressByIndex } = useContext(UserContext);
    const { addressId, userId, userAddress } = address;

    const handleOnClick = _ => onClick(address);
    const { Type, HouseNumber, Area, State, PhoneNumber }  = JSON.parse(userAddress);

    const handleDelete = async _ => {
        try {
            await UserDeleteAddressRequest(addressId);
            removeAddressByIndex(index);
        }
        catch (error) {
            ErrorAlert(error);
        }
    }

    return (
        <ListGroupItem className="border-0">           
            <Card className={ "shadow mx-3 " + (isSelected ? "border-2 border-primary" : "") } key={ addressId } onClick={ handleOnClick }>
                <CardBody>
                    <CardText className='h5'>                    
                        <FontAwesomeIcon className="text-primary mx-2" icon={ faSquarePhone } />
                        { PhoneNumber }
                    </CardText>             
                    <CardText className='h4 fw-bold'>                                     
                        <FontAwesomeIcon className="h5 text-primary mx-2" icon={ iconsTypes[Type?.toUpperCase() ?? "DEFAULT"] } />
                        { `${ HouseNumber }, ${ Area }, ${ State }` }                        
                    </CardText>             
                </CardBody>

                <CardFooter className="d-flex border-0 bg-transparent">
                    <ButtonGroup className="mx-auto w-25">                            
                        <Button color="danger" onClick={ handleDelete } outline>
                            <FontAwesomeIcon icon={ faTrash } />
                        </Button>
                        <Button color="primary">
                            <FontAwesomeIcon icon={ faPen } />
                        </Button>
                    </ButtonGroup>
                </CardFooter>            
            </Card>             
        </ListGroupItem>    
    );
}

UserAddressCard.defaultProps = {
    onClick: _ => {}
}

export default UserAddressCard;