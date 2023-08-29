import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink as RouterNavLink } from "react-router-dom";
import { faQuestion } from "@fortawesome/free-solid-svg-icons";
import { NavItem, NavLink } from "reactstrap";
import { useLocation } from "react-router-dom";

const NavItemBox = ({ to, icon, text, title }) => {
    const location = useLocation();
    const { pathname } = location;

    const active = (pathname == to);

    return (
        <NavItem className="my-2 text-center p-1" title={title}>
            <NavLink tag={RouterNavLink} to={to} active={active}>
                <FontAwesomeIcon icon={icon} size="xl" />
                {text}
            </NavLink>
        </NavItem>
    )
}

NavItemBox.defaultProps = {
    text: '',
    icon: faQuestion,
    to: '#'
}

export default NavItemBox;