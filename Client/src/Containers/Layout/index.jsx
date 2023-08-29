import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.css';
import { Row, Col } from 'reactstrap';

import SellerState from '../../Context/Seller/State';
import HomeState from '../../Context/Home/State';
import UserState from '../../Context/User/State';

import SideBar from '../../Partials/Sidebar';

import Home from '../Home';

import UserSignup from '../UserSignup';
import UserSignin from '../UserSignin';
import UserCart from '../UserCart';

import SellerInitPanel from '../SellerInitPanel';
import SellerProductsPanel from '../SellerProductsPanel';
import Signout from '../../Components/Common/Signout';

import AdminSignin from '../AdminSignin';

import { InternalRouteRestriction, ExternalRouteRestriction } from '../RouteRestrictions/Common';
import { HomeRouteRestriction } from '../RouteRestrictions/Home';
import UserSettings from '../Usersettings';

import Center from '../../Components/Common/Center';
import PaymentApp from '../../Components/Common/PaymentApp';

const Layout = _ => {
    return (
        <Router>
            <Row className='vh-100 overflow-hidden p-0'>
                <Col xs={1}>
                    <SideBar />
                </Col>

                <Col xs={11} className='overflow-auto h-100 p-0'>
                    <Routes>
                        <Route exact path="/home" element={
                            <HomeRouteRestriction>
                                <HomeState>
                                    <Home />
                                </HomeState>
                            </HomeRouteRestriction>
                        } />

                        <Route exact path="/signout" element={<Signout/>} />

                        <Route exact path="/seller" element={  
                            <ExternalRouteRestriction>
                                <SellerInitPanel />
                            </ExternalRouteRestriction>
                        } />

                        <Route exact path='/seller/products' element={
                            <InternalRouteRestriction accountType={'seller'}>
                                <SellerState>
                                    <SellerProductsPanel />
                                </SellerState>
                            </InternalRouteRestriction>
                        } />

                        <Route exact path='/user/signin' element={
                            <ExternalRouteRestriction>
                                <UserSignin />
                            </ExternalRouteRestriction>
                        } />

                        <Route exact path='/user/signup' element={
                            <ExternalRouteRestriction>
                                <UserSignup />
                            </ExternalRouteRestriction>
                        } />

                        <Route exact path='/user/cart' element={
                            <InternalRouteRestriction accountType={'user'}>
                                <UserState>
                                    <UserCart />
                                </UserState>
                            </InternalRouteRestriction>
                        } />

                        <Route exact path='/user/settings' element={
                            <>
                                <h3>Settings</h3>
                                <InternalRouteRestriction accountType={'user'}>
                                    <UserState>
                                        <UserSettings />
                                    </UserState>
                                </InternalRouteRestriction>
                            </>
                        } />

                        <Route exact path='/admin/signin' element={
                            <ExternalRouteRestriction>
                                <AdminSignin />
                            </ExternalRouteRestriction>
                        } />

                        <Route exact path='/test' element={                            
                            <PaymentApp />
                        } />
                    </Routes>
                </Col>
            </Row>
        </Router>
    );
}

export default Layout;