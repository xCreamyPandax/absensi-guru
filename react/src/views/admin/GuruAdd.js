import React, { useState, useEffect } from "react";
import { Form, FormGroup, Label, Input, Button, Row, Col } from "reactstrap";
import { createTeacher, updateTeacher } from "service/auth";

const GuruAdd = ({ guru, onSuccess }) => {
  // State untuk form
  const [form, setForm] = useState({
    nip: "",
    name: "",
    address: "",
    place_of_birth: "",
    date_of_birth: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Jika ada data guru (edit mode), isi form dengan data tersebut
  useEffect(() => {
    if (guru) {
      setForm({
        nip: guru.nip,
        name: guru.name,
        address: guru.address,
        place_of_birth: guru.place_of_birth,
        date_of_birth: guru.date_of_birth,
        email: guru.email,
        password: "", // Password kosong untuk keamanan
      });
    }
  }, [guru]);

  // Handle perubahan input form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (guru) {
        // Mode edit
        await updateTeacher(guru.id, form);
        alert("Data guru berhasil diperbarui.");
      } else {
        // Mode tambah
        await createTeacher(form);
        alert("Data guru berhasil ditambahkan.");
      }
      onSuccess(); // Callback untuk tutup modal dan refresh data
    } catch (err) {
      console.error(err);
      setError("Gagal menyimpan data. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <p className="text-danger">{error}</p>}
      <Row>
        <Col>
        <FormGroup >
        <Label for="nip" size="sm">NIP</Label>
        <Input
          type="text"
          name="nip"
          id="nip"
          value={form.nip}
          onChange={handleChange}
          required
          size="sm"
        />
      </FormGroup>
      <FormGroup>
        <Label for="name" size="sm">Nama</Label>
        <Input
          type="text"
          name="name"
          id="name"
          value={form.name}
          onChange={handleChange}
          required
          size="sm"
        />
      </FormGroup>
      <FormGroup>
        <Label for="address" size="sm">Alamat</Label>
        <Input
          type="text"
          name="address"
          id="address"
          value={form.address}
          onChange={handleChange}
          required
          size="sm"
        />
      </FormGroup>
        </Col>
        <Col>
        <FormGroup>
        <Label for="place_of_birth" size="sm">Tempat Lahir</Label>
        <Input
          type="text"
          name="place_of_birth"
          id="place_of_birth"
          value={form.place_of_birth}
          onChange={handleChange}
          required
          size="sm"
        />
      </FormGroup>
      <FormGroup>
        <Label for="date_of_birth" size="sm">Tanggal Lahir</Label>
        <Input
          type="date"
          name="date_of_birth"
          id="date_of_birth"
          value={form.date_of_birth}
          onChange={handleChange}
          required
          size="sm"
        />
      </FormGroup>
      <FormGroup>
        <Label for="email" size="sm">Email</Label>
        <Input
          type="email"
          name="email"
          id="email"
          value={form.email}
          onChange={handleChange}
          required
          size="sm"
        />
      </FormGroup>
      {!guru && (
        <FormGroup >
          <Label for="password" size="sm">Password</Label>
          <Input
            type="password"
            name="password"
            id="password"
            value={form.password}
            onChange={handleChange}
            required={!guru}
            size="sm" // Password wajib hanya untuk tambah data
          />
        </FormGroup>
      )}
        </Col>
      </Row>
      <Button color="primary" type="submit" disabled={loading} size="sm">
        {loading ? "Menyimpan..." : guru ? "Perbarui" : "Tambah"}
      </Button>
    </Form>
  );
};

export default GuruAdd;
