import UserSettingsAddresses from "../../Components/User/UserSettingsAddresses";
import UserSettingsOrders from "../../Components/User/UserSettingsOrders";

const UserSettings = _ => {
    return (
        <>
            <UserSettingsAddresses />
            <UserSettingsOrders />
        </>
    );
}

export default UserSettings;