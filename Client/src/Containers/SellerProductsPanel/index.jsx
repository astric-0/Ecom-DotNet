import AddNewProduct from '../../Components/Seller/AddNewProduct';
import SellerProductsViewer from '../../Components/Seller/SellerProductsViewer';

const SellerProductsPanel = _ => {    
    return (
        <>
            <AddNewProduct />
            <SellerProductsViewer />
        </>           
    );
}

export default SellerProductsPanel;