import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HeartPulse,
  UserRound,
  Mail,
  LockKeyhole,
  Phone,
  Building2,
  MapPin,
  Droplets,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  UserPlus,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

const BLOOD_GROUPS = [
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'AB-',
  'O+',
  'O-',
];

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'donor',
    bloodGroup: '',
    hospitalName: '',
    address: '',
    city: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoleChange = (e) => {
    const role = e.target.value;

    setForm({
      ...form,
      role,
      bloodGroup: role === 'hospital' ? '' : form.bloodGroup,
      hospitalName: role === 'donor' ? '' : form.hospitalName,
      city: role === 'donor' ? '' : form.city,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Registration failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="premium-register-page">
      {/* Background decorations */}
      <div className="register-bg register-bg-one" />
      <div className="register-bg register-bg-two" />
      <div className="register-bg register-bg-three" />

      <div className="premium-register-layout">

        {/* =========================================
            LEFT BRAND PANEL
        ========================================== */}
        <aside className="register-brand-panel">
          <div className="register-brand-content">

            <Link
              to="/login"
              className="back-login-link"
            >
              <ArrowLeft size={14} />
              Back to Sign In
            </Link>

            <div className="register-brand-logo">
              <div className="register-brand-icon">
                <HeartPulse size={27} />
              </div>

              <div>
                <strong>BloodBank</strong>
                <span>Healthcare Management</span>
              </div>
            </div>

            <div className="register-brand-heading">
              <span className="register-eyebrow">
                <UserPlus size={13} />
                JOIN OUR NETWORK
              </span>

              <h1>
                Together we can
                <br />
                <span>save more lives.</span>
              </h1>

              <p>
                Create your BloodBank account and become
                part of a connected healthcare network
                helping donors, hospitals and patients.
              </p>
            </div>

            <div className="register-benefits">

              <div className="benefit-card">
                <div className="benefit-icon">
                  <Droplets size={18} />
                </div>

                <div>
                  <strong>Donate Blood</strong>
                  <span>
                    Help patients find the blood they need.
                  </span>
                </div>

                <CheckCircle2
                  size={16}
                  className="benefit-check"
                />
              </div>

              <div className="benefit-card">
                <div className="benefit-icon">
                  <Building2 size={18} />
                </div>

                <div>
                  <strong>Hospital Access</strong>
                  <span>
                    Manage requests and blood requirements.
                  </span>
                </div>

                <CheckCircle2
                  size={16}
                  className="benefit-check"
                />
              </div>

              <div className="benefit-card">
                <div className="benefit-icon">
                  <ShieldCheck size={18} />
                </div>

                <div>
                  <strong>Secure Platform</strong>
                  <span>
                    Your account and information stay protected.
                  </span>
                </div>

                <CheckCircle2
                  size={16}
                  className="benefit-check"
                />
              </div>

            </div>
          </div>

          <div className="register-brand-footer">
            <span>
              © {new Date().getFullYear()} BloodBank
            </span>

            <span>
              Healthcare • Technology • Life
            </span>
          </div>
        </aside>

        {/* =========================================
            FORM PANEL
        ========================================== */}
        <main className="register-form-panel">

          <div className="premium-register-card">

            {/* Mobile brand */}
            <div className="mobile-register-brand">
              <div className="mobile-register-icon">
                <HeartPulse size={22} />
              </div>

              <div>
                <strong>BloodBank</strong>
                <span>Healthcare Management</span>
              </div>
            </div>

            {/* Header */}
            <div className="register-header">

              <div className="register-header-icon">
                <UserPlus size={21} />
              </div>

              <div>
                <span className="register-header-eyebrow">
                  GET STARTED
                </span>

                <h2>Create your account</h2>

                <p>
                  Register to access the BloodBank platform.
                </p>
              </div>

            </div>

            {/* Error */}
            {error && (
              <div className="register-error">

                <div className="register-error-icon">
                  <AlertCircle size={17} />
                </div>

                <div>
                  <strong>
                    Registration failed
                  </strong>

                  <span>{error}</span>
                </div>

              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="premium-register-form"
            >

              {/* Name + Phone */}
              <div className="form-row">

                <div className="premium-field">
                  <label htmlFor="name">
                    Full Name
                  </label>

                  <div className="premium-register-input">
                    <UserRound
                      size={17}
                      className="register-input-icon"
                    />

                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Your full name"
                      value={form.name}
                      onChange={handleChange}
                      autoComplete="name"
                      required
                    />
                  </div>
                </div>

                <div className="premium-field">
                  <label htmlFor="phone">
                    Phone Number
                  </label>

                  <div className="premium-register-input">
                    <Phone
                      size={17}
                      className="register-input-icon"
                    />

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+92 300 1234567"
                      value={form.phone}
                      onChange={handleChange}
                      autoComplete="tel"
                    />
                  </div>
                </div>

              </div>

              {/* Email */}
              <div className="premium-field">
                <label htmlFor="email">
                  Email Address
                </label>

                <div className="premium-register-input">
                  <Mail
                    size={17}
                    className="register-input-icon"
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="premium-field">
                <div className="field-label-row">
                  <label htmlFor="password">
                    Password
                  </label>

                  <span>
                    Minimum 6 characters
                  </span>
                </div>

                <div className="premium-register-input">
                  <LockKeyhole
                    size={17}
                    className="register-input-icon"
                  />

                  <input
                    id="password"
                    name="password"
                    type={
                      showPassword
                        ? 'text'
                        : 'password'
                    }
                    placeholder="Create a secure password"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    minLength={6}
                    required
                  />

                  <button
                    type="button"
                    className="register-password-toggle"
                    onClick={() =>
                      setShowPassword(
                        (prev) => !prev
                      )
                    }
                    aria-label={
                      showPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>
              </div>

              {/* Role */}
              <div className="premium-field">
                <label htmlFor="role">
                  Account Type
                </label>

                <div className="role-options">

                  <label
                    className={`role-card ${
                      form.role === 'donor'
                        ? 'selected'
                        : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="donor"
                      checked={
                        form.role === 'donor'
                      }
                      onChange={handleRoleChange}
                    />

                    <div className="role-card-icon donor-role">
                      <Droplets size={18} />
                    </div>

                    <div className="role-card-content">
                      <strong>Blood Donor</strong>
                      <span>
                        Donate blood & help patients
                      </span>
                    </div>

                    <div className="role-radio">
                      <span />
                    </div>
                  </label>

                  <label
                    className={`role-card ${
                      form.role === 'hospital'
                        ? 'selected'
                        : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="hospital"
                      checked={
                        form.role === 'hospital'
                      }
                      onChange={handleRoleChange}
                    />

                    <div className="role-card-icon hospital-role">
                      <Building2 size={18} />
                    </div>

                    <div className="role-card-content">
                      <strong>Hospital</strong>
                      <span>
                        Manage blood requests
                      </span>
                    </div>

                    <div className="role-radio">
                      <span />
                    </div>
                  </label>

                </div>
              </div>

              {/* =================================
                  DONOR FIELDS
              ================================== */}
              {form.role === 'donor' && (
                <div className="conditional-section">

                  <div className="section-heading">
                    <div className="section-heading-icon donor-section">
                      <Droplets size={15} />
                    </div>

                    <div>
                      <strong>
                        Donor Information
                      </strong>

                      <span>
                        Tell us about your blood type
                      </span>
                    </div>
                  </div>

                  <div className="premium-field">
                    <label htmlFor="bloodGroup">
                      Blood Group
                    </label>

                    <div className="premium-select-wrapper">
                      <Droplets
                        size={17}
                        className="register-input-icon"
                      />

                      <select
                        id="bloodGroup"
                        name="bloodGroup"
                        value={form.bloodGroup}
                        onChange={handleChange}
                      >
                        <option value="">
                          Select your blood group
                        </option>

                        {BLOOD_GROUPS.map((bg) => (
                          <option
                            key={bg}
                            value={bg}
                          >
                            {bg}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                </div>
              )}

              {/* =================================
                  HOSPITAL FIELDS
              ================================== */}
              {form.role === 'hospital' && (
                <div className="conditional-section">

                  <div className="section-heading">
                    <div className="section-heading-icon hospital-section">
                      <Building2 size={15} />
                    </div>

                    <div>
                      <strong>
                        Hospital Information
                      </strong>

                      <span>
                        Add your healthcare organization
                      </span>
                    </div>
                  </div>

                  <div className="premium-field">
                    <label htmlFor="hospitalName">
                      Hospital Name
                    </label>

                    <div className="premium-register-input">
                      <Building2
                        size={17}
                        className="register-input-icon"
                      />

                      <input
                        id="hospitalName"
                        name="hospitalName"
                        type="text"
                        placeholder="Enter hospital name"
                        value={form.hospitalName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">

                    <div className="premium-field">
                      <label htmlFor="city">
                        City
                      </label>

                      <div className="premium-register-input">
                        <MapPin
                          size={17}
                          className="register-input-icon"
                        />

                        <input
                          id="city"
                          name="city"
                          type="text"
                          placeholder="e.g. Karachi"
                          value={form.city}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="premium-field">
                      <label htmlFor="address">
                        Address
                      </label>

                      <div className="premium-register-input">
                        <MapPin
                          size={17}
                          className="register-input-icon"
                        />

                        <input
                          id="address"
                          name="address"
                          type="text"
                          placeholder="Hospital address"
                          value={form.address}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                  </div>

                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="premium-register-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2
                      size={18}
                      className="register-spin"
                    />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

            </form>

            {/* Login */}
            <div className="already-account">

              <span>
                Already have an account?
              </span>

              <Link to="/login">
                Sign In
                <ArrowRight size={14} />
              </Link>

            </div>

            {/* Security */}
            <div className="register-secure-footer">
              <ShieldCheck size={14} />
              <span>
                Your information is securely protected
              </span>
            </div>

          </div>
        </main>
      </div>

      <style>{`

        * {
          box-sizing: border-box;
        }

        /* =========================================
           PAGE
        ========================================== */

        .premium-register-page {
          position: relative;
          min-height: 100vh;
          overflow-x: hidden;
          background:
            radial-gradient(
              circle at 80% 10%,
              rgba(239,68,68,.07),
              transparent 28%
            ),
            #f8fafc;
          color: #0f172a;
        }

        .register-bg {
          position: fixed;
          border-radius: 50%;
          pointer-events: none;
        }

        .register-bg-one {
          width: 400px;
          height: 400px;
          top: -200px;
          right: -120px;
          background: rgba(239,68,68,.06);
        }

        .register-bg-two {
          width: 300px;
          height: 300px;
          bottom: -180px;
          left: 35%;
          background: rgba(220,38,38,.045);
        }

        .register-bg-three {
          width: 180px;
          height: 180px;
          top: 40%;
          left: 47%;
          background: rgba(248,113,113,.025);
        }

        /* =========================================
           LAYOUT
        ========================================== */

        .premium-register-layout {
          position: relative;
          z-index: 2;
          min-height: 100vh;
          display: grid;
          grid-template-columns:
            minmax(390px, .85fr)
            minmax(580px, 1.15fr);
        }

        /* =========================================
           BRAND PANEL
        ========================================== */

        .register-brand-panel {
          position: relative;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 42px 7%;
          overflow: hidden;
          color: #fff;
          background:
            radial-gradient(
              circle at 85% 12%,
              rgba(248,113,113,.2),
              transparent 28%
            ),
            linear-gradient(
              145deg,
              #991b1b,
              #b91c1c 48%,
              #7f1d1d
            );
        }

        .register-brand-panel::before {
          content: '';
          position: absolute;
          width: 500px;
          height: 500px;
          right: -300px;
          bottom: -220px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,.09);
          box-shadow:
            0 0 0 45px rgba(255,255,255,.025),
            0 0 0 90px rgba(255,255,255,.018);
        }

        .register-brand-panel::after {
          content: '✚';
          position: absolute;
          right: 8%;
          top: 18%;
          color: rgba(255,255,255,.035);
          font-size: 130px;
          font-weight: 900;
          transform: rotate(8deg);
        }

        .register-brand-content,
        .register-brand-footer {
          position: relative;
          z-index: 2;
        }

        /* Back link */

        .back-login-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 40px;
          color: rgba(255,255,255,.62);
          text-decoration: none;
          font-size: 9px;
          font-weight: 700;
          transition: color .2s ease;
        }

        .back-login-link:hover {
          color: #fff;
        }

        /* Brand */

        .register-brand-logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .register-brand-icon {
          width: 49px;
          height: 49px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 15px;
          color: #b91c1c;
          background: #fff;
          box-shadow:
            0 12px 28px rgba(0,0,0,.16);
        }

        .register-brand-logo strong {
          display: block;
          font-size: 20px;
          font-weight: 850;
          letter-spacing: -.5px;
        }

        .register-brand-logo span {
          display: block;
          margin-top: 3px;
          color: rgba(255,255,255,.6);
          font-size: 9px;
          font-weight: 600;
        }

        /* Heading */

        .register-brand-heading {
          max-width: 470px;
          margin-top: 80px;
        }

        .register-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 10px;
          border: 1px solid rgba(255,255,255,.13);
          border-radius: 999px;
          color: rgba(255,255,255,.84);
          background: rgba(255,255,255,.07);
          font-size: 8px;
          font-weight: 850;
          letter-spacing: .9px;
          backdrop-filter: blur(10px);
        }

        .register-brand-heading h1 {
          margin: 23px 0 15px;
          font-size: clamp(38px, 4vw, 54px);
          line-height: 1.04;
          letter-spacing: -2.4px;
          font-weight: 850;
        }

        .register-brand-heading h1 span {
          color: #fecaca;
        }

        .register-brand-heading p {
          max-width: 430px;
          margin: 0;
          color: rgba(255,255,255,.65);
          font-size: 13px;
          line-height: 1.8;
        }

        /* Benefits */

        .register-benefits {
          display: grid;
          gap: 10px;
          max-width: 450px;
          margin-top: 38px;
        }

        .benefit-card {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 11px;
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 12px;
          background: rgba(255,255,255,.055);
          backdrop-filter: blur(8px);
        }

        .benefit-icon {
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border-radius: 9px;
          color: #fecaca;
          background: rgba(255,255,255,.08);
        }

        .benefit-card strong {
          display: block;
          font-size: 10px;
          font-weight: 800;
        }

        .benefit-card span {
          display: block;
          margin-top: 2px;
          color: rgba(255,255,255,.5);
          font-size: 8px;
        }

        .benefit-check {
          margin-left: auto;
          color: #86efac;
          flex-shrink: 0;
        }

        .register-brand-footer {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          color: rgba(255,255,255,.42);
          font-size: 8px;
          font-weight: 600;
        }

        /* =========================================
           FORM PANEL
        ========================================== */

        .register-form-panel {
          min-width: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 35px 6%;
        }

        .premium-register-card {
          width: 100%;
          max-width: 620px;
          padding: 32px;
          border: 1px solid #e2e8f0;
          border-radius: 22px;
          background: rgba(255,255,255,.95);
          box-shadow:
            0 25px 70px rgba(15,23,42,.075),
            0 4px 16px rgba(15,23,42,.035);
        }

        .mobile-register-brand {
          display: none;
        }

        /* =========================================
           HEADER
        ========================================== */

        .register-header {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 22px;
        }

        .register-header-icon {
          width: 43px;
          height: 43px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border-radius: 12px;
          color: #dc2626;
          background: #fef2f2;
          border: 1px solid #fee2e2;
        }

        .register-header-eyebrow {
          display: block;
          margin-bottom: 4px;
          color: #dc2626;
          font-size: 8px;
          font-weight: 850;
          letter-spacing: 1px;
        }

        .register-header h2 {
          margin: 0;
          color: #0f172a;
          font-size: 23px;
          line-height: 1.2;
          font-weight: 800;
          letter-spacing: -.5px;
        }

        .register-header p {
          margin: 5px 0 0;
          color: #94a3b8;
          font-size: 10px;
        }

        /* =========================================
           ERROR
        ========================================== */

        .register-error {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          margin-bottom: 18px;
          padding: 10px 11px;
          border: 1px solid #fecaca;
          border-radius: 11px;
          background: #fff7f7;
        }

        .register-error-icon {
          width: 27px;
          height: 27px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border-radius: 7px;
          color: #dc2626;
          background: #fee2e2;
        }

        .register-error strong {
          display: block;
          color: #991b1b;
          font-size: 9px;
          font-weight: 800;
        }

        .register-error span {
          display: block;
          margin-top: 2px;
          color: #b91c1c;
          font-size: 8px;
        }

        /* =========================================
           FORM
        ========================================== */

        .premium-register-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .premium-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .premium-field label,
        .field-label-row label {
          color: #334155;
          font-size: 9px;
          font-weight: 800;
        }

        .field-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .field-label-row span {
          color: #94a3b8;
          font-size: 7px;
          font-weight: 600;
        }

        /* Input */

        .premium-register-input,
        .premium-select-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .register-input-icon {
          position: absolute;
          left: 12px;
          z-index: 2;
          color: #94a3b8;
          pointer-events: none;
          transition: color .2s ease;
        }

        .premium-register-input input,
        .premium-select-wrapper select {
          width: 100%;
          height: 42px;
          padding: 0 38px;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          outline: none;
          color: #0f172a;
          background: #f8fafc;
          font-family: inherit;
          font-size: 10px;
          transition:
            border-color .2s ease,
            background .2s ease,
            box-shadow .2s ease;
        }

        .premium-select-wrapper select {
          appearance: auto;
          cursor: pointer;
        }

        .premium-register-input input::placeholder {
          color: #a8b3c2;
        }

        .premium-register-input input:hover,
        .premium-select-wrapper select:hover {
          border-color: #cbd5e1;
          background: #fff;
        }

        .premium-register-input input:focus,
        .premium-select-wrapper select:focus {
          border-color: #ef4444;
          background: #fff;
          box-shadow:
            0 0 0 3px rgba(239,68,68,.08);
        }

        .premium-register-input:focus-within
        .register-input-icon,
        .premium-select-wrapper:focus-within
        .register-input-icon {
          color: #dc2626;
        }

        /* Password */

        .register-password-toggle {
          position: absolute;
          right: 8px;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 0;
          border-radius: 7px;
          color: #94a3b8;
          background: transparent;
          cursor: pointer;
          transition: all .2s ease;
        }

        .register-password-toggle:hover {
          color: #dc2626;
          background: #fef2f2;
        }

        /* =========================================
           ROLE CARDS
        ========================================== */

        .role-options {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 9px;
        }

        .role-card {
          position: relative;
          display: flex;
          align-items: center;
          gap: 9px;
          min-height: 61px;
          padding: 9px 10px;
          border: 1px solid #e2e8f0;
          border-radius: 11px;
          background: #f8fafc;
          cursor: pointer;
          transition:
            border-color .2s ease,
            background .2s ease,
            box-shadow .2s ease,
            transform .2s ease;
        }

        .role-card:hover {
          border-color: #fecaca;
          background: #fff;
          transform: translateY(-1px);
        }

        .role-card.selected {
          border-color: #fca5a5;
          background: #fffafa;
          box-shadow:
            0 0 0 2px rgba(239,68,68,.055);
        }

        .role-card input {
          position: absolute;
          opacity: 0;
          pointer-events: none;
        }

        .role-card-icon {
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border-radius: 9px;
        }

        .donor-role {
          color: #dc2626;
          background: #fee2e2;
        }

        .hospital-role {
          color: #0369a1;
          background: #e0f2fe;
        }

        .role-card-content {
          min-width: 0;
          flex: 1;
        }

        .role-card-content strong {
          display: block;
          color: #334155;
          font-size: 9px;
          font-weight: 800;
        }

        .role-card-content span {
          display: block;
          margin-top: 2px;
          color: #94a3b8;
          font-size: 7px;
          line-height: 1.3;
        }

        .role-radio {
          width: 15px;
          height: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border: 1.5px solid #cbd5e1;
          border-radius: 50%;
        }

        .role-card.selected .role-radio {
          border-color: #dc2626;
        }

        .role-card.selected .role-radio span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #dc2626;
        }

        /* =========================================
           CONDITIONAL SECTION
        ========================================== */

        .conditional-section {
          padding: 13px;
          border: 1px solid #f1f5f9;
          border-radius: 12px;
          background: #fafafa;
          animation: sectionIn .2s ease;
        }

        @keyframes sectionIn {
          from {
            opacity: 0;
            transform: translateY(-3px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .section-heading {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        .section-heading-icon {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
        }

        .donor-section {
          color: #dc2626;
          background: #fee2e2;
        }

        .hospital-section {
          color: #0369a1;
          background: #e0f2fe;
        }

        .section-heading strong {
          display: block;
          color: #475569;
          font-size: 9px;
          font-weight: 800;
        }

        .section-heading span {
          display: block;
          margin-top: 2px;
          color: #94a3b8;
          font-size: 7px;
        }

        /* =========================================
           BUTTON
        ========================================== */

        .premium-register-btn {
          width: 100%;
          height: 45px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 2px;
          border: 0;
          border-radius: 10px;
          color: #fff;
          background:
            linear-gradient(
              135deg,
              #dc2626,
              #b91c1c
            );
          box-shadow:
            0 9px 22px rgba(185,28,28,.19);
          font-family: inherit;
          font-size: 10px;
          font-weight: 800;
          cursor: pointer;
          transition:
            transform .2s ease,
            box-shadow .2s ease,
            opacity .2s ease;
        }

        .premium-register-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow:
            0 12px 28px rgba(185,28,28,.27);
        }

        .premium-register-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .premium-register-btn:disabled {
          opacity: .65;
          cursor: not-allowed;
        }

        .register-spin {
          animation: registerSpin .9s linear infinite;
        }

        @keyframes registerSpin {
          to {
            transform: rotate(360deg);
          }
        }

        /* =========================================
           LOGIN LINK
        ========================================== */

        .already-account {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          margin-top: 19px;
          color: #94a3b8;
          font-size: 8px;
        }

        .already-account a {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          color: #dc2626;
          text-decoration: none;
          font-weight: 800;
        }

        .already-account a:hover {
          color: #991b1b;
        }

        /* =========================================
           SECURITY
        ========================================== */

        .register-secure-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          margin-top: 14px;
          color: #94a3b8;
          font-size: 7px;
        }

        .register-secure-footer svg {
          color: #10b981;
        }

        /* =========================================
           RESPONSIVE
        ========================================== */

        @media (max-width: 1100px) {
          .premium-register-layout {
            grid-template-columns:
              minmax(350px, .75fr)
              minmax(540px, 1.25fr);
          }

          .register-brand-panel {
            padding-left: 6%;
            padding-right: 6%;
          }

          .register-brand-heading {
            margin-top: 65px;
          }

          .register-brand-heading h1 {
            font-size: 42px;
          }

          .register-form-panel {
            padding-left: 4%;
            padding-right: 4%;
          }
        }

        @media (max-width: 850px) {
          .premium-register-layout {
            display: block;
          }

          .register-brand-panel {
            display: none;
          }

          .register-form-panel {
            min-height: 100vh;
            padding: 24px 16px;
          }

          .premium-register-card {
            max-width: 620px;
            padding: 28px 24px;
          }

          .mobile-register-brand {
            display: flex;
            align-items: center;
            gap: 9px;
            margin-bottom: 26px;
          }

          .mobile-register-icon {
            width: 38px;
            height: 38px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 10px;
            color: #fff;
            background:
              linear-gradient(
                135deg,
                #dc2626,
                #991b1b
              );
          }

          .mobile-register-brand strong {
            display: block;
            color: #0f172a;
            font-size: 15px;
            font-weight: 850;
          }

          .mobile-register-brand span {
            display: block;
            margin-top: 2px;
            color: #94a3b8;
            font-size: 7px;
          }
        }

        @media (max-width: 560px) {
          .register-form-panel {
            padding: 12px;
          }

          .premium-register-card {
            padding: 23px 17px;
            border-radius: 17px;
          }

          .form-row,
          .role-options {
            grid-template-columns: 1fr;
          }

          .register-header h2 {
            font-size: 20px;
          }

          .register-header {
            margin-bottom: 20px;
          }

          .premium-register-form {
            gap: 13px;
          }
        }

        @media (max-width: 380px) {
          .premium-register-card {
            padding: 20px 14px;
          }

          .register-header-icon {
            width: 39px;
            height: 39px;
          }

          .premium-register-input input,
          .premium-select-wrapper select {
            height: 40px;
          }
        }

      `}</style>
    </div>
  );
}