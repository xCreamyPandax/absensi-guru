import UserHeader from "components/Headers/UserHeader";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Container,
  FormGroup,
  Input,
  Row,
  Col,
  Button,
  Alert,
  InputGroup,
  InputGroupText,
} from "reactstrap";
import { getUserById, updateTeacher } from "service/auth";

const Profile = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    nip: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const userId = localStorage.getItem("userId"); // Ambil ID user dari localStorage
      const data = await getUserById(userId); // Panggil API untuk mendapatkan data user
      setUser(data);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({ ...prevState, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      const userId = localStorage.getItem("userId"); // Ambil ID user dari localStorage
      await updateTeacher(userId, user); // Update profil berdasarkan ID user
      alert("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("Failed to update profile.");
    }
  };

  const handleChangePassword = async () => {
    const { newPassword, confirmPassword } = passwordData;
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      setPasswordSuccess("");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      setPasswordSuccess("");
      return;
    }

    try {
      const userId = localStorage.getItem("userId"); // Ambil ID user dari localStorage
      await updateTeacher(userId, newPassword); // API untuk mengganti password
      setPasswordSuccess("Password changed successfully!");
      setPasswordError("");
      setPasswordData({ newPassword: "", confirmPassword: "" });
    } catch (err) {
      console.error("Failed to change password:", err);
      setPasswordError("Failed to change password.");
      setPasswordSuccess("");
    }
  };

  return (
    <>
    <UserHeader/>
      <Container className="mt--8" fluid>
        <Row>
          <Col xl="6" className="m-auto">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <h3 className="mb-0">My Profile</h3>
              </CardHeader>
              <CardBody>
                
              <FormGroup>
                  <label>nip</label>
                  <Input
                    type="text"
                    name="nip"
                    value={user.nip}
                    disabled="true"
                    onChange={handleInputChange}
                  />
                </FormGroup>
                <FormGroup>
                  <label>Name</label>
                  <Input
                    type="text"
                    name="name"
                    value={user.name}
                    disabled="true"
                    onChange={handleInputChange}
                  />
                </FormGroup>
                <FormGroup>
                  <label>Email</label>
                  <Input
                    type="email"
                    name="email"
                    value={user.email}
                    disabled={!isEditing}
                    onChange={handleInputChange}
                  />
                </FormGroup>
                <div className="d-flex justify-content-between">
                  {!isEditing ? (
                    <Button color="primary" onClick={() => setIsEditing(true)}>
                      Edit Profile
                    </Button>
                  ) : (
                    <Button color="success" onClick={handleSaveProfile}>
                      Save Changes
                    </Button>
                  )}
                  {isEditing && (
                    <Button
                      color="danger"
                      onClick={() => {
                        setIsEditing(false);
                        fetchUserProfile(); // Reset to original values
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col>
          {/* Password Change Section */}
          <Card className="bg-secondary shadow mt-4">
              <CardHeader className="bg-white border-0">
                <h3 className="mb-0">Change Password</h3>
              </CardHeader>
              <CardBody>
                {passwordError && <Alert color="danger">{passwordError}</Alert>}
                {passwordSuccess && <Alert color="success">{passwordSuccess}</Alert>}
                <FormGroup>
                  <label>New Password</label>
                  <InputGroup>
                    <Input
                      type={showPassword ? "text" : "password"}
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                    />
                    <InputGroupText
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ cursor: "pointer" }}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </InputGroupText>
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <label>Confirm Password</label>
                  <InputGroup>
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                    />
                    <InputGroupText
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{ cursor: "pointer" }}
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </InputGroupText>
                  </InputGroup>
                </FormGroup>
                <Button color="success" onClick={handleChangePassword}>
                  Change Password
                </Button>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Profile;
