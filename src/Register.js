import React, { useState } from "react";
import "./App.css"; // Include your styles here

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    contact: "",
    dob: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { username, password, confirmPassword, email, contact, dob } =
      formData;
    const newErrors = {};

    if (username.length < 8 || username.length > 16 || username.includes(" ")) {
      newErrors.username =
        "Username must be between 8 and 16 characters and contain no spaces.";
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,15}$/;
    if (!passwordRegex.test(password)) {
      newErrors.password =
        "Password must be 8-15 characters long, contain an uppercase letter, a number, and a symbol.";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (!email.includes("@") || !email.includes(".")) {
      newErrors.email = "Please enter a valid email address.";
    }

    const contactRegex = /^[0-9]{10}$/;
    if (!contactRegex.test(contact)) {
      newErrors.contact = "Please enter a valid 10-digit contact number.";
    }

    const age = calculateAge(dob);
    if (age < 18) {
      newErrors.dob = "You must be at least 18 years old to register.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const difference = Date.now() - birthDate.getTime();
    const ageDate = new Date(difference);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await fetch("http://localhost:3001/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        alert("Registration successful!");
        window.location.href = "/login";
      } else {
        alert(data.message || "An error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="container full-height">
      <div className="register-container">
        <form onSubmit={handleSubmit}>
          <h2 className="text-center mb-4">Register</h2>

          <div className="input-group">
            <div className="input-group-prepend">
              <span className="input-group-text">
                <i className="material-icons">person</i>
              </span>
            </div>
            <input
              type="text"
              className="form-control"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          {errors.username && <div className="error-message">{errors.username}</div>}

          <div className="input-group">
            <div className="input-group-prepend">
              <span className="input-group-text">
                <i className="material-icons">lock</i>
              </span>
            </div>
            <input
              type="password"
              className="form-control"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          {errors.password && <div className="error-message">{errors.password}</div>}

          <div className="input-group">
            <div className="input-group-prepend">
              <span className="input-group-text">
                <i className="material-icons">lock</i>
              </span>
            </div>
            <input
              type="password"
              className="form-control"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          {errors.confirmPassword && (
            <div className="error-message">{errors.confirmPassword}</div>
          )}

          <div className="input-group">
            <div className="input-group-prepend">
              <span className="input-group-text">
                <i className="material-icons">mail</i>
              </span>
            </div>
            <input
              type="email"
              className="form-control"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          {errors.email && <div className="error-message">{errors.email}</div>}

          <div className="input-group">
            <div className="input-group-prepend">
              <span className="input-group-text">
                <i className="material-icons">phone</i>
              </span>
            </div>
            <input
              type="text"
              className="form-control"
              name="contact"
              placeholder="Contact Number"
              value={formData.contact}
              onChange={handleChange}
              required
            />
          </div>
          {errors.contact && <div className="error-message">{errors.contact}</div>}

          <div className="input-group">
            <div className="input-group-prepend">
              <span className="input-group-text">
                <i className="material-icons">calendar_today</i>
              </span>
            </div>
            <input
              type="date"
              className="form-control"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
            />
          </div>
          {errors.dob && <div className="error-message">{errors.dob}</div>}

          <button type="submit" className="btn btn-custom">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
