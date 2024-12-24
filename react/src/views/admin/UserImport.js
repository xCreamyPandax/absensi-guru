import React, { useState } from "react";
import { downloadTemplate, importTeacher } from '../../service/auth';
import { Col, Row, Button, Form, Input } from "reactstrap";

const UserImport = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Pilih file terlebih dahulu");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    console.log(formData);

    try {
      await importTeacher(formData);
      alert("Data guru berhasil ditambahkan.");
    } catch (error) {
      alert(
        `Gagal mengunggah data: ${
          error.response?.data?.message || error.message
        }`);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      await downloadTemplate();
    } catch (error) {
      alert('Gagal mengunduh template. Silakan coba lagi.');
    }
  };

  return (
    <Form size="sm" onSubmit={handleSubmit}>
    <Row>
      <Col>
        <div>
          <Button onClick={handleDownloadTemplate}>Unduh Format Excel</Button >
          {/* Tambahkan komponen unggah file di sini */}
        </div>
      </Col>
      
      <Col>
      
        
          <Input
          bsSize="sm"
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
          />
          </Col>
          <Col>
          <Button size="sm" type="submit" color="success" >Upload</Button >
        
      </Col>
    </Row>
    </Form>
  );
};

export default UserImport;
