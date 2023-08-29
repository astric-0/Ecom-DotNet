import React, { useState, useEffect } from 'react'
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { Form, Button, Row, Col } from 'reactstrap';
import { loadStripe } from '@stripe/stripe-js';

import TokenHandler from '../../../TokenHandler';
import { ErrorAlert, SuccessAlert } from '../Alert';
import config from '../../../Config';

const style = {
    base: {
        iconColor: '#c4f0ff',
        color: 'black',
        fontWeight: '500',
        fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
        fontSize: '25px',
        fontSmoothing: 'antialiased',
        ':-webkit-autofill': {
            color: '#fce883',
        },
        '::placeholder': {
            color: '#87BBFD',
        },
    },
    invalid: {
        iconColor: '#FFC7EE',
        color: '#FFC7EE',
    }
}

const stripePromise = loadStripe('pk_test_51Njbk6SJOMIb1X77FRjhmSkGbV2mxDox3SdU0YAJYjRaCEZ4KT2zRVZKAHYUse2YxookHscscht7gIH2UrPGbe2l00JYrVIbpb');

const PaymentForm = ({ payload, cb }) => {    
    const { amount, cartId, addressId } = payload;
    const [ clientSecret, setClientSecret ] = useState();
    const elements = useElements();
    
    useEffect(_ => {

        const fetchClientSecret = async _ => {
            const response = await fetch(config.path('create-payment'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'accessToken': TokenHandler.getAccessToken()
                },
                body: JSON.stringify({ amount, cartId, addressId })
            });

            if (response.status == 200) {
                const data = await response.json();
                setClientSecret(data.clientSecret);
            }
            else
                ErrorAlert(await response.text());
        }

        fetchClientSecret();
    }, []);    

    const handlePayment = async event => {
        event.preventDefault();
        const stripe = await stripePromise;
        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: { 
                card: elements.getElement(CardElement)
            }
        });

        if (result.error)
            ErrorAlert(result.error.message);
        else {
            SuccessAlert("Payment Successed");
            cb();
        }
    }

    return (
        <Form onSubmit={ handlePayment }>
            <Row className='my-3 justify-content-center'>
                <Col xs={ 8 }>
                    <CardElement options={ { style } } />
                </Col>
            </Row>
            <div className="d-flex my-2">
                <Button color='primary' type="submit" className='mx-auto' outline>Pay & Place Order</Button>
            </div>
        </Form>        
    );
}

export default function PaymentApp({ payload, cb }) {    
    return (
        <Elements stripe={ stripePromise }>
            <PaymentForm payload={ payload } cb = { cb } />
        </Elements>
    )
}