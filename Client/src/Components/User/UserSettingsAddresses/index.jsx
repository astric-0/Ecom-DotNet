import { useContext, useEffect, useState } from "react";
import { Container, Button, ListGroup } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";

import UserContext from "../../../Context/User/Context";
import Loading from "../../Common/Loading";
import UserAddressCard from "../UserAddressCard";
import UserAddAddressForm from "../UserAddAddressForm";

const UserSettingsAddresses = _ => {

    const { getAddresses } = useContext(UserContext);
    const [ addresses, setAddressess ] = useState(<Loading />);   
    const [ addressFormVisiblity, setAddressFormVisiblity ] = useState(false);

    const toggle = _ => setAddressFormVisiblity(!addressFormVisiblity);

    useEffect(_ => {
        const addressesList = getAddresses()?.map((element, index) => 
            <UserAddressCard key={ element.addressId } index={ index } address={ element } />);

        if (addressesList.length > 0)
            setAddressess([ ...addressesList ]);
        else 
            setAddressess( 
                <Container className="text-center text-danger">
                    <h4>You haven't added any Address</h4>
                </Container>
            );

    }, [getAddresses()]);

    return (
        <Container className="mt-5">
            <h2>
                Addresses
                <Button color="transparent" className="btn p-0 mx-2" onClick={ toggle }>
                    <FontAwesomeIcon size="xl" className="m-0 text-primary" icon={faPlusCircle} /> 
                </Button>
            </h2>
            <UserAddAddressForm isVisible={ addressFormVisiblity } toggle={ toggle } />            

            <ListGroup flush>
                { addresses }
            </ListGroup>

        </Container>
    );
}

export default UserSettingsAddresses;