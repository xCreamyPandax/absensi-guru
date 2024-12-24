import UserHeader from "components/Headers/UserHeader";
import React, { useState } from "react";
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";
import { checkOut, checkIn } from "service/auth";

const Absensi = () => {
  const [message, setMessage] = useState(""); // Untuk menampilkan pesan hasil

  const handleCheckIn = async () => {
    try {
      const response = await checkIn({ /* Data yang diperlukan, jika ada */ });
      setMessage("Check-in berhasil!");
    } catch (error) {
      setMessage(`Check-in gagal: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleCheckOut = async () => {
    try {
      const response = await checkOut({ /* Data yang diperlukan, jika ada */ });
      setMessage("Check-out berhasil!");
    } catch (error) {
      setMessage(`Check-out gagal: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <>
    <UserHeader/>
        <Container fluid>
          <div className="mt--8">
            {/* Card stats */}
            <Row>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0" onClick={handleCheckIn}>
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Absensi
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">MASUK</span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-success text-white rounded-circle shadow">
                          <i className="fas fa-chart-bar" />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0" onClick={handleCheckOut}>
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Absensi
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">KELUAR</span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                          <i className="fas fa-chart-bar" />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            {/* Pesan Hasil */}
            {message && (
              <Row className="mt-4">
                <Col>
                  <div className="alert alert-info" role="alert">
                    {message}
                  </div>
                </Col>
              </Row>
            )}
          </div>
        </Container>
    </>
  );
};

export default Absensi;
