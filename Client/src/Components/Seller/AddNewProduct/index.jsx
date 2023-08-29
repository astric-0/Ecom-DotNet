import { Button, Offcanvas, OffcanvasBody, OffcanvasHeader } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

import AddNewProductForm from '../AddNewProductForm';

const AddNewProduct = _ => {

    const [openFlag, setOpenFlag] = useState(false);
    const toggleOpenFlag = _ => setOpenFlag(!openFlag);
    const shutOpenFlag = _ => (openFlag && setOpenFlag(false));
    return (
        <>
        <div className='w-100 position-fixed'>
            <Button color="primary" className='rounded-pill' onClick={toggleOpenFlag} title='Add new product'>
                <FontAwesomeIcon className='' icon={faAdd} size='xl' />
            </Button>
        </div>
        
        <div>
            <Offcanvas fade className='w-50' toggle={toggleOpenFlag} isOpen={openFlag}>
                <OffcanvasHeader toggle={toggleOpenFlag}>
                    Add New Product
                </OffcanvasHeader>
                <OffcanvasBody> 
                    <AddNewProductForm shutOpenFlag={shutOpenFlag} />
                </OffcanvasBody>    
            </Offcanvas>
        </div>        
        </>
    );
}

export default AddNewProduct;