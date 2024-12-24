import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardFooter,
  Pagination,
  PaginationItem,
  PaginationLink,
  Table,
  Container,
  Row,
  Input,
  Button,
  FormGroup,
  Label,
  Col,
} from "reactstrap";
import { getAttendanceByUserId } from "service/auth";
import UserHeader from "components/Headers/UserHeader";

const ReportTableById = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [selectedFilter, setSelectedFilter] = useState("all");

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const userId = localStorage.getItem("userId"); // Mendapatkan userId dari localStorage
      const data = await getAttendanceByUserId(userId); // Mengambil data absensi user
      setReports(data);
      setFilteredReports(data);
    } catch (err) {
      console.error("Gagal mengambil laporan absensi:", err);
    }
  };

  const handleFilter = () => {
    let filtered = reports;

    // Filter berdasarkan waktu
    if (selectedFilter !== "all") {
      const now = new Date();
      filtered = filtered.filter((report) => {
        const checkInDate = new Date(report.check_in);
        if (selectedFilter === "tahun") {
          return checkInDate.getFullYear() === now.getFullYear();
        }
        if (selectedFilter === "bulan") {
          return (
            checkInDate.getFullYear() === now.getFullYear() &&
            checkInDate.getMonth() === now.getMonth()
          );
        }
        if (selectedFilter === "minggu") {
          const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
          return checkInDate >= weekStart;
        }
        return true;
      });
    }

    // Filter berdasarkan pencarian
    if (search.trim()) {
      filtered = filtered.filter(
        (report) =>
          report.check_in.toLowerCase().includes(search.toLowerCase()) ||
          report.check_out.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredReports(filtered);
    setCurrentPage(1); // Reset ke halaman pertama setelah filter
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReports.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);

  return (
    <>
      <UserHeader />
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row>
                    <Col>
                    <h3 className="mb-0">Absensi</h3>
                    </Col>
                    <Col>
                    <div className="d-flex align-items-center mt-3">
                  <FormGroup>
                    <Label for="filter">Filter Waktu:</Label>
                    <Input
                      type="select"
                      id="filter"
                      value={selectedFilter}
                      onChange={(e) => setSelectedFilter(e.target.value)}
                    >
                      <option value="all">Semua Waktu</option>
                      <option value="tahun">Tahun Ini</option>
                      <option value="bulan">Bulan Ini</option>
                      <option value="minggu">Minggu Ini</option>
                    </Input>
                  </FormGroup>
                  <Button color="success" onClick={handleFilter} className="ml-3">
                    Terapkan Filter
                  </Button>
                </div>
                    </Col>
                </Row>
                
                
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">No</th>
                    <th scope="col">Check In</th>
                    <th scope="col">Check Out</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((report, index) => (
                      <tr key={index}>
                        <td>{indexOfFirstItem + index + 1}</td>
                        <td>{report.check_in}</td>
                        <td>{report.check_out}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center">
                        Tidak ada data laporan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
              <CardFooter className="py-4">
                <nav aria-label="...">
                  <Pagination className="pagination justify-content-end mb-0">
                    <PaginationItem disabled={currentPage === 1}>
                      <PaginationLink onClick={() => setCurrentPage(currentPage - 1)}>
                        <i className="fas fa-angle-left" />
                      </PaginationLink>
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <PaginationItem active={i + 1 === currentPage} key={i}>
                        <PaginationLink onClick={() => setCurrentPage(i + 1)}>
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem disabled={currentPage === totalPages}>
                      <PaginationLink onClick={() => setCurrentPage(currentPage + 1)}>
                        <i className="fas fa-angle-right" />
                      </PaginationLink>
                    </PaginationItem>
                  </Pagination>
                </nav>
              </CardFooter>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default ReportTableById;
