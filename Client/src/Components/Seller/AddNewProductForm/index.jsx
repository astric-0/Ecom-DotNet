import SellerContext from "../../../Context/Seller/Context";

import { Label, Form, FormGroup, Input, Button } from "reactstrap";
import { useContext, useState } from "react";
import { SuccessAlert, ErrorAlert } from "../../Common/Alert";
import { SellerAddNewProductRequest } from "../../../requests/SellerRequests";

const AddNewProductForm = ({ shutOpenFlag }) => {
    const initFormData = { productName: '', details: '', category: '', price: '', stock: '' };
    const [formData, setFormData] = useState(initFormData);
    const { addNewProduct } = useContext(SellerContext);    

    const handleInput = key => event => setFormData({ ...formData, [key]: event.target.value });
    const handleInputNumber = key => event => !isNaN(event.target.value) && setFormData({ ...formData, [key]: event.target.value });
    const handleInputImage = event => setFormData({ ...formData, Image: event.target.files[0] });

    const handleAddNewProduct = _ => {
        SellerAddNewProductRequest(formData)
        .then(data => { 
            addNewProduct({ ...formData, ...data });
            SuccessAlert('Product ' + formData.productName + ' Added');
            setFormData(initFormData);
            shutOpenFlag();
        })
        .catch(error => ErrorAlert(error));
    }

    const { productName, details, category, price, stock } = formData;    

    return (
        <div className="text-primary">
            <Form>
                <FormGroup>
                    <Label>Product Name*</Label>
                    <Input value={productName} onChange={handleInput('productName')}  />
                </FormGroup>

                <FormGroup>
                    <Label>Product Details*</Label>
                    <Input type="textarea" value={details} onChange={handleInput('details')} />
                </FormGroup>

                <FormGroup>
                    <Label>Product Category*</Label>
                    <Input value={category} onChange={handleInput('category')} />
                </FormGroup>

                <FormGroup>
                    <Label>Product Stock*</Label>
                    <Input type="number" value={stock} onChange={handleInputNumber('stock')} /> 
                </FormGroup>

                <FormGroup>
                    <Label>Product Price*</Label>
                    <Input type="number" value={price} onChange={handleInputNumber('price')} /> 
                </FormGroup>

                <FormGroup>
                    <Label>Product Image</Label>
                    <Input type="file" onChange={handleInputImage} />
                </FormGroup>

                <Button color="primary" className="mt-2 w-100" onClick={handleAddNewProduct} outline>Add</Button>                
            </Form>
        </div>
    );
}

export default AddNewProductForm;