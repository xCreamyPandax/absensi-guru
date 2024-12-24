import { useState, useEffect } from "react";
import { NavLink as NavLinkRRD, Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import {
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Collapse,
  Row,
  Col,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
} from "reactstrap";
import { logout } from "service/auth";

const Sidebar = ({ bgColor, routes, logo }) => {
  const [collapseOpen, setCollapseOpen] = useState(false);
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const navigate = useNavigate();

  // Ambil role dari localStorage untuk memfilter rute
  const userRole = localStorage.getItem("role");

  useEffect(() => {
    if (routes && userRole) {
      // Filter rute berdasarkan role pengguna
      const availableRoutes = routes.filter(
        (route) => !route.roles || route.roles.includes(userRole)
      );
      setFilteredRoutes(availableRoutes);
    }
  }, [routes, userRole]);

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.clear(); // Hapus semua data pengguna dari localStorage
      navigate("/auth/login");
    } catch (error) {
      console.error("Logout gagal:", error.message);
    }
  };

  // Membuat tautan navigasi
  const createLinks = (routes) => {
    return routes.map((prop, key) => (
      <NavItem key={key}>
        <NavLink
          to={prop.layout + prop.path}
          tag={NavLinkRRD}
          onClick={() => setCollapseOpen(false)} // Tutup collapse saat klik
          activeClassName="active"
        >
          <i className={prop.icon} />
          {prop.name}
        </NavLink>
      </NavItem>
    ));
  };

  let navbarBrandProps;
  if (logo && logo.innerLink) {
    navbarBrandProps = {
      to: logo.innerLink,
      tag: Link,
    };
  } else if (logo && logo.outterLink) {
    navbarBrandProps = {
      href: logo.outterLink,
      target: "_blank",
    };
  }

  return (
    <Navbar
      className={`navbar-vertical fixed-left navbar-light bg-${bgColor || "white"}`}
      expand="md"
      id="sidenav-main"
    >
      <Container fluid>
        {/* Toggler */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setCollapseOpen(!collapseOpen)}
        >
          <span className="navbar-toggler-icon" />
        </button>

        {/* Brand */}
        {logo && (
          <Link className="pt-0" {...navbarBrandProps}>
            <img
              alt={logo.imgAlt}
              className="navbar-brand-img"
              src={logo.imgSrc}
            />
          </Link>
        )}

        {/* Collapse */}
        <Collapse navbar isOpen={collapseOpen}>
          <div className="navbar-collapse-header d-md-none">
            <Row>
              {logo && (
                <Col className="collapse-brand" xs="6">
                  {logo.innerLink ? (
                    <Link to={logo.innerLink}>
                      <img alt={logo.imgAlt} src={logo.imgSrc} />
                    </Link>
                  ) : (
                    <a href={logo.outterLink}>
                      <img alt={logo.imgAlt} src={logo.imgSrc} />
                    </a>
                  )}
                </Col>
              )}
              <Col className="collapse-close" xs="6">
                <button
                  className="navbar-toggler"
                  type="button"
                  onClick={() => setCollapseOpen(false)}
                >
                  <span />
                  <span />
                </button>
              </Col>
            </Row>
          </div>

          {/* Navigation */}
          <Nav navbar>{createLinks(filteredRoutes)}</Nav>

          {/* Divider */}
          <hr className="my-3" />

          {/* Logout */}
          <Nav className="mb-md-3" navbar>
            <NavItem>
              <NavLink onClick={handleLogout} style={{ cursor: "pointer" }}>
                <i className="ni ni-user-run" />
                <span>Logout</span>
              </NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Container>
    </Navbar>
  );
};

Sidebar.defaultProps = {
  routes: [],
};

Sidebar.propTypes = {
  bgColor: PropTypes.string,
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      icon: PropTypes.string,
      layout: PropTypes.string.isRequired,
      roles: PropTypes.arrayOf(PropTypes.string), // Menentukan role akses
    })
  ),
  logo: PropTypes.shape({
    innerLink: PropTypes.string,
    outterLink: PropTypes.string,
    imgSrc: PropTypes.string.isRequired,
    imgAlt: PropTypes.string.isRequired,
  }),
};

export default Sidebar;
