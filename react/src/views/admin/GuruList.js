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
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import Header from "components/Headers/Header.js";
import { getAllTeachers, deleteTeacher } from "service/auth";
import GuruAdd from "./GuruAdd";
import UserImport from "./UserImport";

const GuruTable = () => {
  const [dataGuru, setDataGuru] = useState([]);
  const [filteredGuru, setFilteredGuru] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Jumlah data per halaman
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGuru, setSelectedGuru] = useState(null); // Guru yang akan diedit

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const data = await getAllTeachers();
      setDataGuru(data);
      setFilteredGuru(data);
    } catch (err) {
      setError("Gagal mengambil data guru.");
      console.error(err.message);
    }
  };

  // Pencarian
  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSearch(keyword);
    const filtered = dataGuru.filter(
      (guru) =>
        guru.name.toLowerCase().includes(keyword) ||
        guru.nip.toLowerCase().includes(keyword)
    );
    setFilteredGuru(filtered);
    setCurrentPage(1); // Reset ke halaman pertama setelah pencarian
  };

  // Pengurutan
  const handleSort = (field) => {
    const sortedData = [...filteredGuru].sort((a, b) => {
      if (a[field] < b[field]) return sortOrder === "asc" ? -1 : 1;
      if (a[field] > b[field]) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    setFilteredGuru(sortedData);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc"); // Ganti urutan
  };

  // Hapus data
  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      try {
        await deleteTeacher(id);
        alert("Data berhasil dihapus.");
        fetchTeachers(); // Refresh data setelah penghapusan
      } catch (err) {
        console.error(err);
        alert("Gagal menghapus data.");
      }
    }
  };

  // Paginasi
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredGuru.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredGuru.length / itemsPerPage);

  // Modal tambah/edit guru
  const toggleModal = () => {
    setSelectedGuru(null); // Reset data guru jika ada
    setIsModalOpen(!isModalOpen);
  };

  const handleEdit = (guru) => {
    setSelectedGuru(guru); // Data guru yang akan diedit
    setIsModalOpen(true);
  };

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0 d-flex justify-content-between align-items-center">
                <h3 className="mb-0">Data Guru</h3>
                <Button color="primary" onClick={toggleModal} >
                    Tambah Data Guru
                  </Button>
                  <UserImport/>
                {error && <p className="text-danger">{error}</p>}
                <div>
                  <Input
                    type="text"
                    placeholder="Cari nama atau NIP"
                    value={search}
                    onChange={handleSearch}
                    style={{ maxWidth: "300px", marginRight: "10px" }}
                  />
                  
                </div>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">No</th>
                    <th
                      scope="col"
                      onClick={() => handleSort("nip")}
                      style={{ cursor: "pointer" }}
                    >
                      NIP {sortOrder === "asc" ? "↑" : "↓"}
                    </th>
                    <th
                      scope="col"
                      onClick={() => handleSort("name")}
                      style={{ cursor: "pointer" }}
                    >
                      Nama {sortOrder === "asc" ? "↑" : "↓"}
                    </th>
                    <th scope="col">Alamat</th>
                    <th scope="col">Tempat, Tanggal Lahir</th>
                    <th scope="col">Email</th>
                    <th scope="col">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((guru, index) => (
                      <tr key={guru.id}>
                        <td>{indexOfFirstItem + index + 1}</td>
                        <td>{guru.nip}</td>
                        <td>{guru.name}</td>
                        <td>{guru.address}</td>
                        <td>
                          {guru.place_of_birth}, {guru.date_of_birth}
                        </td>
                        <td>{guru.email}</td>
                        <td>
                          <Button
                            color="info"
                            size="sm"
                            onClick={() => handleEdit(guru)}
                          >
                            Edit
                          </Button>{" "}
                          <Button
                            color="danger"
                            size="sm"
                            onClick={() => handleDelete(guru.id)}
                          >
                            Hapus
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">
                        Tidak ada data guru.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
              <CardFooter className="py-4">
                <nav aria-label="...">
                  <Pagination
                    className="pagination justify-content-end mb-0"
                    listClassName="justify-content-end mb-0"
                  >
                    <PaginationItem disabled={currentPage === 1}>
                      <PaginationLink
                        onClick={() => setCurrentPage(currentPage - 1)}
                      >
                        <i className="fas fa-angle-left" />
                        <span className="sr-only">Previous</span>
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
                      <PaginationLink
                        onClick={() => setCurrentPage(currentPage + 1)}
                      >
                        <i className="fas fa-angle-right" />
                        <span className="sr-only">Next</span>
                      </PaginationLink>
                    </PaginationItem>
                  </Pagination>
                </nav>
              </CardFooter>
            </Card>
          </div>
        </Row>
      </Container>

      {/* Modal Tambah/Edit Guru */}
      <Modal isOpen={isModalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>
          {selectedGuru ? "Edit Data Guru" : "Tambah Data Guru"}
        </ModalHeader>
        <ModalBody>
          <GuruAdd
            guru={selectedGuru}
            onSuccess={() => {
              toggleModal();
              fetchTeachers(); // Refresh data setelah tambah/edit
            }}
          />
        </ModalBody>
      </Modal>
    </>
  );
};

export default GuruTable;
