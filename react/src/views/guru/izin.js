import UserHeader from "components/Headers/UserHeader";
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  FormGroup,
  Input,
  Button,
  Container,
  Row,
  Col,
} from "reactstrap";
import { createLeave } from "service/auth";

const RequestLeave = () => {
  const [reason, setReason] = useState("");
  const [type, setType] = useState("sick");
  const [leaveDate, setLeaveDate] = useState("");

  const handleCreateLeave = async () => {
    if (!reason || !leaveDate) {
      alert("Alasan dan tanggal izin wajib diisi!");
      return;
    }
    try {
      await createLeave({ reason, type, leave_date: leaveDate });
      alert("Izin berhasil diajukan!");
      setReason("");
      setType("sick");
      setLeaveDate("");
    } catch (err) {
      console.error("Gagal mengajukan izin:", err);
      alert("Gagal mengajukan izin.");
    }
  };

  return (
    <>
    <UserHeader/>
      <Container className="mt--8" fluid>
        <Row className="justify-content-center">
          <Col lg="6">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Ajukan Izin</h3>
              </CardHeader>
              <CardBody>
                <FormGroup>
                  <Input
                    type="textarea"
                    placeholder="Alasan izin"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <Input
                    type="select"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option value="sick">Sakit</option>
                    <option value="personal">Pribadi</option>
                    <option value="other">Lain-lain</option>
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Input
                    type="date"
                    placeholder="Tanggal Izin"
                    value={leaveDate}
                    onChange={(e) => setLeaveDate(e.target.value)}
                  />
                </FormGroup>
              </CardBody>
              <CardFooter>
                <Button color="success" onClick={handleCreateLeave}>
                  Ajukan Izin
                </Button>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default RequestLeave;
