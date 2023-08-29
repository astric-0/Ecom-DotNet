import React, { useEffect, useState } from "react";
import {
    faHome, faSignOut, faSignIn, faShop, faObjectGroup, faUserGear, faSignal, faSign, faPen, faCartShopping, faUserSecret, faUsersRays, faUserNinja
} from "@fortawesome/free-solid-svg-icons";
import { Nav, NavbarBrand } from "reactstrap";
import NavItemBox from "../NavItemBox";

import TokenHandler from "../../TokenHandler";
import { useLocation } from "react-router-dom";

const SideBar = _ => {        
    const [ localValues, setLocalValues ] = useState(TokenHandler.getInfo());
    
    useEffect(_ => {
        setLocalValues(TokenHandler.getInfo());
    }, [useLocation()]);

    const { name, accessToken, accountType } = localValues;
    return (
        <div className="sidebar h-100">
            <div className="sidebar-header">

            </div>

            <div className="mx-auto side-menu h-100">
                <Nav vertical className="list-unstyled pb-3 h-100" pills>                  
                    {
                        name?.length > 0 && accessToken?.length > 0 &&
                        <NavbarBrand className="m-2">
                            <h3>{name}</h3>
                        </NavbarBrand>
                    }

                    {
                        !(accountType == 'seller' || accountType == 'admin') &&
                        <>
                            <NavItemBox to='/home' icon={faHome} title='Home' />                            
                        </>
                    }

                    {
                        !accessToken &&
                        <>
                            <NavItemBox to='/user/signin' icon={faSignIn} title='Sign in' />
                            <NavItemBox to='/user/signup' icon={faPen} title='Sign up' />
                        </>
                    }

                    { 
                        accessToken && accountType == 'user' && 
                        <>
                            <NavItemBox to='/user/cart' icon={faCartShopping} title='Cart' />
                            <NavItemBox to='/user/settings' icon={faUserGear} title='Account settings' />
                        </>
                    }

                    {
                        accessToken && accountType == 'seller' &&
                        <>
                            <NavItemBox to='/seller/products' icon={faObjectGroup} title='Manage Products' />
                            <NavItemBox to='/seller/settings' icon={faUserGear} title='Account settings' />
                        </>
                    }

                    {
                        accessToken &&
                        <>
                            <NavItemBox to='/signout' icon={faSignOut} title='Sign out' />
                        </>
                    }

                    {
                        !accessToken &&
                        <div className="m-0 mt-auto mb-2">
                            <NavItemBox to='/seller' icon={faShop} title='seller panel' /> 
                            <NavItemBox to='/admin/signin' icon={faUserNinja} title='admin' /> 
                        </div>
                    }
                </Nav>
            </div>
        </div>
    )
};

export default SideBar;