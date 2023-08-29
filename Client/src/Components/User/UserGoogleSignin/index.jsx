import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import config from '../../../Config';
import { UserGoogleSigninRequest } from '../../../requests/UserRequests';
import { ErrorAlert } from '../../Common/Alert';

const UserGoogleSignin = _ => {
    const navigate = useNavigate();

    const handleOnSuccess = async googleResponse  => {
        try {
            await UserGoogleSigninRequest(googleResponse.credential);
            navigate("/home");
        }
        catch (error) {
            ErrorAlert(error);
        }
    }    

    return (
        <div className='w-100 mt-4'>            
            <GoogleOAuthProvider clientId={config.getGoogleClientId()}>
                <GoogleLogin                     
                    onSuccess={handleOnSuccess}
                    onError={_ => ErrorAlert("Some error occured")}
                />
            </GoogleOAuthProvider>            
        </div>
    )
}

export default UserGoogleSignin;