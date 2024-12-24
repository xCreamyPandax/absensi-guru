import { Link } from "react-router-dom";
// reactstrap components
import {
  NavbarBrand,
  Navbar,
  Container,
} from "reactstrap";

const AdminNavbar = () => {
  return (
    <>
      <Navbar className="navbar-top navbar-horizontal navbar-dark" expand="md">
        <Container className="px-4">
          <NavbarBrand to="/" tag={Link}>
            <img
              alt="..."
              src={require("../../assets/img/brand/SMPN-3-SRENGAT-PUTIH.png")}
            />
          </NavbarBrand>
        </Container>
      </Navbar>
    </>
  );
};

export default AdminNavbar;
