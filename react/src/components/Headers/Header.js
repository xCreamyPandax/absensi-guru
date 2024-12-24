import React, { useState, useEffect } from "react";
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";
import { getAllTeachers, getAllLeaves } from "../../service/auth.js"; // Import fungsi dari API

const Header = () => {
  const [teacherCount, setTeacherCount] = useState(0);
  const [pendingLeaves, setPendingLeaves] = useState(0);

  // Fetch data dari API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch jumlah guru
        const teachers = await getAllTeachers();
        setTeacherCount(teachers.length);

        // Fetch jumlah izin yang berstatus pending
        const leaves = await getAllLeaves();
        const pendingCount = leaves.filter((leave) => leave.status === "pending").length;
        setPendingLeaves(pendingCount);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
        <Container fluid>
          <div className="header-body">
            <Row>
              {/* Total Teachers Card */}
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Jumlah Guru Pengajar
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          {teacherCount}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-primary text-white rounded-circle shadow">
                          <i className="fas fa-chalkboard-teacher" />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>

              {/* Pending Leave Requests Card */}
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Menunggu Persetujuan
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          {pendingLeaves}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                          <i className="fas fa-file-alt" />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Header;
