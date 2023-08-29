import SellerContext from "../../../Context/Seller/Context";
import config from "../../../Config";

import style from './style.module.css';
import { Card, CardBody, CardImg, CardFooter, Label, Input, FormGroup, Button } from "reactstrap";
import { useState, useContext } from "react";
import { SellerDeleteProductRequest, SellerUpdateProductRequest } from "../../../requests/SellerRequests";

import { ErrorAlert, SuccessAlert } from "../../Common/Alert";

const SellerProductCard = ({ index }) => {

    const [editFlag, setEditFlag] = useState(false); 
    const { removeProductByIndex, getProductByIndex, updateProductByIndex } = useContext(SellerContext);
    const [cardState, setCardState] = useState({ ...getProductByIndex(index), imageIgnoreFlag: true });

    const { productId, productName, details, category, stock, price, filename } = cardState;

    const handleDelete = _ => {
        SellerDeleteProductRequest(productId)
        .then(_ => { 
            SuccessAlert('Product '+ cardState.productName + ' Removed');
            removeProductByIndex(index);
        })
        .catch(error =>ErrorAlert(error));
    }

    const toggleEditFlag = _ => {
        if (editFlag) {
            SellerUpdateProductRequest(cardState)
            .then(_ => { 
                updateProductByIndex(index, cardState);
                SuccessAlert('Product ' + cardState.productName + ' Updated');
            })
            .catch(error => ErrorAlert(error));
        }
        setEditFlag(!editFlag);        
    } 

    const shutEditFlag = _ => (editFlag && setEditFlag(false));

    const handleInput = key => event => setCardState({ ...cardState, [key]: event.target.value });    
    const handleInputNumber = key => event => !isNaN(event.target.value) && setCardState({ ...cardState, [key]: event.target.value });
    //const handleInputImage = event => setCardState({ ...cardState, Image: event.target.files[0] });

    return (
        <Card className="mt-5 mx-4" outline onClick={shutEditFlag}>
            <CardImg src={config.path('/images/' + filename)} className={style.cardImgTop} top />
            <CardBody>
                <FormGroup>
                    <Label>Product Name</Label>
                    <Input value={productName} onChange={handleInput('productName')} disabled={!editFlag} />
                </FormGroup>

                <FormGroup>
                    <Label>Product Details</Label>
                    <Input type="textarea" value={details} onChange={handleInput('details')} disabled={!editFlag} />
                </FormGroup>

                <FormGroup>
                    <Label>Product Category</Label>
                    <Input value={category} onChange={handleInput('category')} disabled={!editFlag} />
                </FormGroup>

                <FormGroup>
                    <Label>Product Stock</Label>
                    <Input value={stock} onChange={handleInputNumber('stock')}  disabled={!editFlag} />
                </FormGroup>

                <FormGroup>
                    <Label>Product Price</Label>
                    <Input value={price} onChange={handleInputNumber('price')} disabled={!editFlag} />
                </FormGroup>
            </CardBody>

            <CardFooter>
                <Button color="primary" active={editFlag} className="w-100 my-2" onClick={toggleEditFlag} outline>Update</Button>
                <Button color="danger" className="w-100 my-2" onClick={handleDelete} outline>Delete</Button>
            </CardFooter>
        </Card>
    );
}

export default SellerProductCard;