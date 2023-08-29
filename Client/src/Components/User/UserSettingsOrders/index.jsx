import { useContext, useEffect, useState } from "react";
import { Container, Row, Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import UserContext from "../../../Context/User/Context";
import Loading from "../../Common/Loading";
import UserOrderCard from "../UserOrderCard";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";

const UserSettingsOrders = _ => {
    const { getUserOrders } = useContext(UserContext);
    const [ userOrders, setUserOrders ] = useState(<Loading message={"Fetching orders"}/>);

    useEffect(_ => {
        const orders = getUserOrders();
        if (orders?.length > 0)
            setUserOrders(orders.map((orderInfo, index) => <UserOrderCard key={ index } orderInfo={ orderInfo }/>));      
        else if (orders?.length == 0)
            setUserOrders(
                <Container className="text-center text-primary">
                    <h4>You haven't Order Anything</h4>
                </Container>
            );
    }, [getUserOrders()]);

    return (
        <Container className="mt-5">
            <h2>
                Orders
                <Button color="transparent" className="p-0 mx-2">
                    <FontAwesomeIcon size="xl" className="m-0 text-primary" icon={ faCartShopping } /> 
                </Button>
            </h2>
            <Row>{ userOrders }</Row>
        </Container>
    );
}

export default UserSettingsOrders;