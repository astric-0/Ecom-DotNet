import Swal from 'sweetalert2';
import config from '../../../Config';

export const SuccessAlert = message => {
    Swal.fire({
        html: `<b>${message}<br/>`,
        icon: 'success',
        confirmButtonText: 'Close'
    });
}

export const ErrorAlert = message => {
    Swal.fire({
        html: `<b>${message}<br/>`,
        icon: 'error',
        confirmButtonText: 'Close'
    });
}

export const ShowProductInfo = product => {
    const { productName, filename, details, stock, price } = product;
    Swal.fire({
        title: productName,
        html:
            `<div class="card-col overflow-hidden">
                <div class='row justify-content-between'>
                    <div class='col-5'>
                        <img src='${config.path('/images/' + filename)}' style='object-fit: cover; height: 23vw' >
                    </div>
                    <div class='col-6' style='text-align:justify;'>
                        <div class='row'>
                            <small class='mb-4'>${details}</small>
                            <h3 class='card-title mt-4'>Price: &#8377; ${price}</h3>
                            <h4>Quantity: ${stock}</h4>
                        </div>
                    </div>
                </div>
            </div>`
        ,
        width: '70%'
    });
}

export const ShowProductInfoCaps = product => {
    const { ProductName, Filename, Details, Stock, Price } = product;
    Swal.fire({
        title: ProductName,
        html:
            `<div class="card-col overflow-hidden">
                <div class='row justify-content-between'>
                    <div class='col-5'>
                        <img src='${config.path('/images/' + Filename)}' style='object-fit: cover; height: 23vw' >
                    </div>
                    <div class='col-6' style='text-align:justify;'>
                        <div class='row'>
                            <small class='mb-4'>${ Details }</small>
                            <h3 class='card-title mt-4'>Price: &#8377; ${ Price }</h3>
                            <!--h4>Quantity: ${ Stock }</h4-->
                        </div>
                    </div>
                </div>
            </div>`
        ,
        width: '70%'
    });
}

export const ShowSellerData = sellerData => {
    const { sellerName, about, email, address, isVerified, joinedOn } = sellerData;
    Swal.fire({
        title: sellerName,
        html:
            `
            <div class='card'>
                <div class='card-body'>
                    <div class='row'>
                        <div class='col-4'>
                            <label><b>Seller name</b></label>
                        </div>
                        <div class='col'>
                            <h3>${sellerName}</h3>
                        </div>
                    </div>

                    <div class='row'>
                        <div class='col-4'>
                            <label><b>About</b></label>
                        </div>
                        <div class='col'>
                            <h3>${about}</h3>
                        </div>
                    </div>                                                                

                    <div class='row'>
                        <div class='col-4'>
                            <label><b>Email</b></label>
                        </div>
                        <div class='col'>
                            <h3>${email}</h3>
                        </div>
                    </div>                                         

                    <div class='row'>
                        <div class='col-4'>
                            <label><b>Address</b></label>
                        </div>
                        <div class='col'>
                            <h3>${address}</h3>
                        </div>
                    </div> 

                    <div class='row'>
                        <div class='col-4'>
                            <label><b>Joined On</b></label>
                        </div>
                        <div class='col'>
                            <h3>${joinedOn}</h3>
                        </div>
                    </div> 

                    <div class='card-text mt-2'>
                        <label><b>Seller is ${ isVerified === true ? '' : 'not' } verified </b></label>
                    </div>
                </div>
            </div>
            `
        ,
        width: '70%'
    });
}