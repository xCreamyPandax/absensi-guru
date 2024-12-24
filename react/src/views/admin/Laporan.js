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
} from "reactstrap";
import Header from "components/Headers/Header.js";
import * as XLSX from "xlsx";
import { getReportsAll } from "service/auth";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import ExcelJS from "exceljs";
import AttendanceOverview from "./LaporanSemua";

const ReportTable = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [selectedGuru, setSelectedGuru] = useState("");
  const [gurus, setGurus] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const data = await getReportsAll();
      setReports(data);
      setFilteredReports(data);
      const uniqueGurus = Array.from(
        new Set(data.map((report) => report.name)),
      );
      setGurus(uniqueGurus);
    } catch (err) {
      console.error("Gagal mengambil laporan absensi:", err);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value.toLowerCase());
  };

  const handleFilter = () => {
    let filtered = reports;

    if (startDate && endDate) {
      filtered = filtered.filter((report) => {
        const checkInDate = new Date(report.tanggal);
        return (
          checkInDate >= new Date(startDate) && checkInDate <= new Date(endDate)
        );
      });
    }

    if (selectedGuru) {
      filtered = filtered.filter((report) => report.name === selectedGuru);
    }

    filtered = filtered.filter(
      (report) =>
        report.name.toLowerCase().includes(search) ||
        report.status.toLowerCase().includes(search) ||
        report.tanggal.toLowerCase().includes(search),
    );

    setFilteredReports(filtered);
    setCurrentPage(1);
  };

  const handleExport = async () => {
    // Membuat workbook dan worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Laporan Absensi");

    // Menambahkan kop

    const kopCell = worksheet.getCell("A1");
    kopCell.value = "Daftar Hadir Guru UPT SMPN 3 Srengat";

    worksheet.mergeCells("A1:E1");
    kopCell.alignment = { horizontal: "center", vertical: "middle" };
    kopCell.font = { bold: true, size: 16 };

    // Menambahkan header
    const headers = ["No", "Tanggal", "Nama", "Status", "Keterangan"];
    worksheet.addRow([]);
    worksheet.addRow(headers);

    // Gaya untuk header
    const headerRow = worksheet.getRow(3);
    headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
    headerRow.alignment = { horizontal: "center", vertical: "middle" };
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "4CAF50" }, // Warna hijau header
      };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // Menambahkan data
    const data = filteredReports.map((report, index) => [
      index + 1,
      report.tanggal,
      report.name,
      report.status,
      report.keterangan,
    ]);
    data.forEach((row) => worksheet.addRow(row));

    // Gaya untuk data
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 2) {
        row.eachCell((cell) => {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });
      }
    });

    // Mengatur lebar kolom
    worksheet.columns = [
      { width: 5 },
      { width: 20 },
      { width: 20 },
      { width: 15 },
      { width: 15 },
    ];

    // Menambahkan tabel ringkasan total hadir dan izin
    worksheet.addRow([]); // Baris kosong pemisah
    const summaryHeaders = ["No", "Nama", "Total Hadir", "Total Izin"];
    worksheet.addRow(summaryHeaders);

    // Gaya untuk header ringkasan
    const summaryHeaderRow = worksheet.getRow(worksheet.lastRow.number);
    summaryHeaderRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
    summaryHeaderRow.alignment = { horizontal: "center", vertical: "middle" };
    summaryHeaderRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "4CAF50" }, // Warna hijau header
      };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // Menghitung total hadir dan izin
    const summaryData = [];
    const groupedData = filteredReports.reduce((acc, report) => {
      if (!acc[report.name]) {
        acc[report.name] = { hadir: 0, izin: 0 };
      }
      if (report.status === "Hadir") {
        acc[report.name].hadir += 1;
      } else if (report.status === "Izin") {
        acc[report.name].izin += 1;
      }
      return acc;
    }, {});

    Object.entries(groupedData).forEach(([name, counts], index) => {
      summaryData.push([index + 1, name, counts.hadir, counts.izin]);
    });

    summaryData.forEach((row) => worksheet.addRow(row));

    // Gaya untuk data ringkasan
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > worksheet.lastRow.number - summaryData.length - 1) {
        row.eachCell((cell) => {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });
      }
    });

    // Menyimpan file Excel
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const dateNow = new Date();
    const formattedDate = `${String(dateNow.getDate()).padStart(
      2,
      "0",
    )}-${String(dateNow.getMonth() + 1).padStart(
      2,
      "0",
    )}-${dateNow.getFullYear()}`; // Format: YYYY-MM-DD
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Laporan_Absensi_${formattedDate}.xlsx`; // Hapus tanda kutip ekstra
    a.click();
    window.URL.revokeObjectURL(url);
  };


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReports.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);

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
                <h3 className="mb-0">Laporan Absensi</h3>
                <div className="d-flex align-items-center mt-3">
                  <Input
                    type="text"
                    placeholder="Cari laporan"
                    value={search}
                    onChange={handleSearch}
                    style={{ maxWidth: "300px", marginRight: "10px" }}
                  />
                  <FormGroup>
                    <Label for="start-date">Dari Tanggal:</Label>
                    <DatePicker
                      id="start-date"
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      dateFormat="yyyy-MM-dd"
                      className="form-control"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="end-date">Sampai Tanggal:</Label>
                    <DatePicker
                      id="end-date"
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      dateFormat="yyyy-MM-dd"
                      className="form-control"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="guru">Guru:</Label>
                    <Input
                      type="select"
                      id="guru"
                      value={selectedGuru}
                      onChange={(e) => setSelectedGuru(e.target.value)}
                    >
                      <option value="">Semua Guru</option>
                      {gurus.map((guru, index) => (
                        <option
                          key={index}
                          value={guru}
                        >
                          {guru}
                        </option>
                      ))}
                    </Input>
                  </FormGroup>
                  <Button
                    color="success"
                    onClick={handleFilter}
                  >
                    Terapkan Filter
                  </Button>
                  <Button
                    color="primary"
                    className="ml-2"
                    onClick={handleExport}
                  >
                    Ekspor Excel
                  </Button>
                </div>
              </CardHeader>
              <Table
                className="align-items-center table-flush"
                responsive
              >
                <thead className="thead-light">
                  <tr>
                    <th scope="col">No</th>
                    <th scope="col">Tanggal</th>
                    <th scope="col">Nama</th>
                    <th scope="col">Status</th>
                    <th scope="col">Keterangan</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((report, index) => (
                      <tr key={index}>
                        <td>{indexOfFirstItem + index + 1}</td>
                        <td>{report.tanggal}</td>
                        <td>{report.name}</td>
                        <td>{report.status}</td>
                        <td>{report.keterangan}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="text-center"
                      >
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
                      <PaginationLink
                        onClick={() => setCurrentPage(currentPage - 1)}
                      >
                        <i className="fas fa-angle-left" />
                      </PaginationLink>
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <PaginationItem
                        active={i + 1 === currentPage}
                        key={i}
                      >
                        <PaginationLink onClick={() => setCurrentPage(i + 1)}>
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem disabled={currentPage === totalPages}>
                      <PaginationLink
                        onClick={() => setCurrentPage(currentPage + 1)}
                      >
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
      <AttendanceOverview />
    </>
  );
};

export default ReportTable;
