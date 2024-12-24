import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Col,
} from "reactstrap";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "service/auth"; // Fungsi login

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Periksa apakah token ada di localStorage
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const role = localStorage.getItem("role");
        if (role === "admin") {
          navigate("/admin/index");
        } else if (role === "guru") {
          navigate("/guru/absensi");
        }
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error sebelum mencoba login

    try {
      // Panggil fungsi login dari auth.js
      const data = await login({ email, password });

      // Simpan token ke localStorage
      localStorage.setItem("token", data.token);

      // Cek role dan navigasi berdasarkan peran user
      if (data.role === "admin") {
        navigate("/admin/dashboard");
      } else if (data.role === "guru") {
        navigate("/guru/dashboard");
      } else {
        setError("Invalid user role.");
      }
    } catch (err) {
      // Tampilkan pesan error dari backend atau default
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <Col lg="5" md="7">
      <Card className="bg-secondary shadow border-0">
        <CardBody className="px-lg-5 py-lg-5">
          <div className="text-center text-muted mb-4">
            <small>Sign in</small>
            {error && <p className="text-danger">{error}</p>}
          </div>
          <Form role="form" onSubmit={handleSubmit}>
            <FormGroup className="mb-3">
              <InputGroup className="input-group-alternative">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="ni ni-email-83" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <InputGroup className="input-group-alternative">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="ni ni-lock-circle-open" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </InputGroup>
            </FormGroup>
            <div className="text-center">
              <Button className="my-4" color="primary" type="submit">
                Sign in
              </Button>
            </div>
          </Form>
        </CardBody>
      </Card>
    </Col>
  );
};

export default Login;
