import { NavLink } from "react-router-dom";
import "./Sidebar.scss"

function Sidebar() {
    return (
        <nav className="nav">
            <div className="nav--top">
                <NavLink to="/" className="nav__self"></NavLink>
            </div>
            <div className="nav--bottom">
                <NavLink to="/" exact className="nav__create" activeClassName="nav--active"></NavLink>
                <NavLink to="/room" exact className="nav__join" activeClassName="nav--active"></NavLink>
                <NavLink to="/" className="nav__leave"></NavLink>
            </div>
        </nav>
    )
}

export default Sidebar;