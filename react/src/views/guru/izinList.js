import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Table,
  Button,
  Container,
  Row,
  Badge,
} from "reactstrap";
import { getLeavesByUserId, } from "service/auth";
import UserHeader from "components/Headers/UserHeader";

const LeaveListById = () => {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
        const userId = localStorage.getItem("userId");
      const data = await getLeavesByUserId(userId);
      setLeaves(data);
    } catch (err) {
      console.error("Gagal mengambil data izin:", err);
    }
  };

  return (
    <>
      <UserHeader />
      <Container
        className="mt--7"
        fluid
      >
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Daftar Izin</h3>
              </CardHeader>
              <CardBody>
                <Table
                  className="align-items-center table-flush"
                  responsive
                >
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">No</th>
                      <th scope="col">Alasan</th>
                      <th scope="col">Tipe</th>
                      <th scope="col">Tanggal Izin</th> {/* Kolom baru */}
                      <th scope="col">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaves.length > 0 ? (
                      leaves.map((leave, index) => (
                        <tr key={leave.id}>
                          <td>{index + 1}</td>
                          <td>{leave.reason}</td>
                          <td>{leave.type}</td>
                          <td>{leave.leave_date}</td> {/* Data tanggal izin */}
                          <td>
                            <Badge
                              color={
                                leave.status === "approved"
                                  ? "success"
                                  : leave.status === "rejected"
                                  ? "danger"
                                  : "warning"
                              }
                            >
                              {leave.status}
                            </Badge>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="7"
                          className="text-center"
                        >
                          Tidak ada data izin.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default LeaveListById;
