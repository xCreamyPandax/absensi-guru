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
import Header from "components/Headers/Header.js";
import { getAllLeaves, updateLeaveStatus } from "service/auth";

const LeaveList = () => {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const data = await getAllLeaves();
      setLeaves(data);
    } catch (err) {
      console.error("Gagal mengambil data izin:", err);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateLeaveStatus(id, { status });
      alert(`Izin berhasil ${status === "approved" ? "disetujui" : "ditolak"}`);
      fetchLeaves();
    } catch (err) {
      console.error("Gagal memperbarui status izin:", err);
      alert("Gagal memperbarui status izin.");
    }
  };

  return (
    <>
      <Header />
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
                      <th scope="col">Nama Guru</th>
                      <th scope="col">Alasan</th>
                      <th scope="col">Tipe</th>
                      <th scope="col">Tanggal Izin</th> {/* Kolom baru */}
                      <th scope="col">Status</th>
                      <th scope="col">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaves.length > 0 ? (
                      leaves.map((leave, index) => (
                        <tr key={leave.id}>
                          <td>{index + 1}</td>
                          <td>{leave.user.name}</td>
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
                          <td>
                            {leave.status === "pending" && (
                              <>
                                <Button
                                  color="success"
                                  size="sm"
                                  onClick={() =>
                                    handleUpdateStatus(leave.id, "approved")
                                  }
                                >
                                  Approve
                                </Button>
                                <Button
                                  color="danger"
                                  size="sm"
                                  className="ml-2"
                                  onClick={() =>
                                    handleUpdateStatus(leave.id, "rejected")
                                  }
                                >
                                  Reject
                                </Button>
                              </>
                            )}
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

export default LeaveList;
