import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HeartPulse,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Droplets,
  Activity,
  UserPlus,
  Loader2,
  AlertCircle,
} from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="premium-auth-page">
      {/* Background decoration */}
      <div className="auth-bg-circle auth-bg-circle-one" />
      <div className="auth-bg-circle auth-bg-circle-two" />
      <div className="auth-bg-circle auth-bg-circle-three" />

      <div className="premium-auth-layout">
        {/* LEFT BRAND PANEL */}
        <div className="auth-brand-panel">
          <div className="brand-content">
            <div className="brand-logo">
              <div className="brand-logo-icon">
                <HeartPulse size={28} strokeWidth={2.3} />
              </div>

              <div>
                <h1>BloodBank</h1>
                <span>Healthcare Management</span>
              </div>
            </div>

            <div className="brand-heading">
              <span className="brand-eyebrow">
                <Activity size={14} />
                Saving lives through technology
              </span>

              <h2>
                Every donation
                <br />
                <span>can save a life.</span>
              </h2>

              <p>
                Securely manage blood donations, donors, hospitals and
                emergency blood requests from one centralized platform.
              </p>
            </div>

            <div className="brand-features">
              <div className="brand-feature">
                <div className="feature-icon">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <strong>Secure & Reliable</strong>
                  <span>Protected healthcare data</span>
                </div>
              </div>

              <div className="brand-feature">
                <div className="feature-icon">
                  <Droplets size={18} />
                </div>
                <div>
                  <strong>Blood Management</strong>
                  <span>Real-time inventory tracking</span>
                </div>
              </div>

              <div className="brand-feature">
                <div className="feature-icon">
                  <Activity size={18} />
                </div>
                <div>
                  <strong>Emergency Ready</strong>
                  <span>Fast request management</span>
                </div>
              </div>
            </div>
          </div>

          <div className="brand-footer">
            <span>© {new Date().getFullYear()} BloodBank</span>
            <span>Healthcare • Technology • Life</span>
          </div>
        </div>

        {/* RIGHT LOGIN PANEL */}
        <div className="auth-form-panel">
          <div className="premium-auth-card">
            <div className="mobile-brand">
              <div className="mobile-brand-icon">
                <HeartPulse size={23} />
              </div>

              <div>
                <strong>BloodBank</strong>
                <span>Healthcare Management</span>
              </div>
            </div>

            <div className="login-header">
              <div className="login-icon">
                <LockKeyhole size={22} />
              </div>

              <div>
                <span className="login-eyebrow">WELCOME BACK</span>
                <h2>Sign in to your account</h2>
                <p>
                  Access your BloodBank management dashboard.
                </p>
              </div>
            </div>

            {error && (
              <div className="premium-error">
                <div className="error-icon">
                  <AlertCircle size={17} />
                </div>

                <div>
                  <strong>Unable to sign in</strong>
                  <span>{error}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="premium-login-form">
              {/* EMAIL */}
              <div className="premium-form-group">
                <label htmlFor="email">
                  Email Address
                </label>

                <div className="premium-input-wrapper">
                  <Mail size={18} className="input-icon" />

                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="premium-form-group">
                <div className="password-label-row">
                  <label htmlFor="password">
                    Password
                  </label>

                  <span>Secure login</span>
                </div>

                <div className="premium-input-wrapper">
                  <LockKeyhole
                    size={18}
                    className="input-icon"
                  />

                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                    aria-label={
                      showPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                className="premium-login-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2
                      size={18}
                      className="spin"
                    />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* REGISTER */}
            <div className="register-section">
              <div className="register-divider">
                <span />
                <small>NEW TO BLOODBANK?</small>
                <span />
              </div>

              <Link
                to="/register"
                className="register-link"
              >
                <UserPlus size={17} />
                Create a new account
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* DEMO ACCOUNTS */}
            <div className="demo-section">
              <div className="demo-header">
                <div className="demo-title">
                  <div className="demo-icon">
                    <ShieldCheck size={15} />
                  </div>

                  <div>
                    <strong>Demo Access</strong>
                    <span>Use these credentials to explore</span>
                  </div>
                </div>
              </div>

              <div className="demo-grid">
                <div className="demo-account">
                  <div className="demo-role admin">
                    A
                  </div>

                  <div className="demo-info">
                    <strong>Admin</strong>
                    <span>admin@bloodbank.com</span>
                  </div>

                  <code>admin123</code>
                </div>

                <div className="demo-account">
                  <div className="demo-role staff">
                    S
                  </div>

                  <div className="demo-info">
                    <strong>Staff</strong>
                    <span>staff@bloodbank.com</span>
                  </div>

                  <code>staff123</code>
                </div>

                <div className="demo-account">
                  <div className="demo-role donor">
                    D
                  </div>

                  <div className="demo-info">
                    <strong>Donor</strong>
                    <span>ali@donor.com</span>
                  </div>

                  <code>donor123</code>
                </div>

                <div className="demo-account">
                  <div className="demo-role hospital">
                    H
                  </div>

                  <div className="demo-info">
                    <strong>Hospital</strong>
                    <span>hospital@city.com</span>
                  </div>

                  <code>hospital123</code>
                </div>
              </div>
            </div>

            <div className="secure-footer">
              <ShieldCheck size={14} />
              <span>Your connection is secure and protected</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        * {
          box-sizing: border-box;
        }

        .premium-auth-page {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          display: flex;
          align-items: stretch;
          background:
            radial-gradient(
              circle at 10% 10%,
              rgba(220, 38, 38, 0.08),
              transparent 30%
            ),
            #f8fafc;
          color: #0f172a;
        }

        /* =========================
           BACKGROUND
        ========================= */

        .auth-bg-circle {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(1px);
        }

        .auth-bg-circle-one {
          width: 420px;
          height: 420px;
          top: -210px;
          right: -100px;
          background: rgba(239, 68, 68, 0.07);
        }

        .auth-bg-circle-two {
          width: 300px;
          height: 300px;
          bottom: -170px;
          left: 30%;
          background: rgba(220, 38, 38, 0.05);
        }

        .auth-bg-circle-three {
          width: 180px;
          height: 180px;
          top: 35%;
          left: 45%;
          background: rgba(248, 113, 113, 0.035);
        }

        /* =========================
           MAIN LAYOUT
        ========================= */

        .premium-auth-layout {
          position: relative;
          z-index: 2;
          width: 100%;
          min-height: 100vh;
          display: grid;
          grid-template-columns: minmax(390px, 0.9fr) minmax(520px, 1.1fr);
        }

        /* =========================
           BRAND PANEL
        ========================= */

        .auth-brand-panel {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 100vh;
          padding: 58px 7%;
          overflow: hidden;
          color: #fff;
          background:
            radial-gradient(
              circle at 80% 15%,
              rgba(248, 113, 113, 0.20),
              transparent 27%
            ),
            linear-gradient(
              145deg,
              #991b1b 0%,
              #b91c1c 45%,
              #7f1d1d 100%
            );
        }

        .auth-brand-panel::before {
          content: '';
          position: absolute;
          width: 430px;
          height: 430px;
          border-radius: 50%;
          right: -240px;
          bottom: -180px;
          border: 1px solid rgba(255,255,255,.10);
          box-shadow:
            0 0 0 45px rgba(255,255,255,.025),
            0 0 0 90px rgba(255,255,255,.018);
        }

        .auth-brand-panel::after {
          content: '✚';
          position: absolute;
          right: 9%;
          top: 17%;
          font-size: 130px;
          line-height: 1;
          font-weight: 900;
          color: rgba(255,255,255,.035);
          transform: rotate(8deg);
        }

        .brand-content,
        .brand-footer {
          position: relative;
          z-index: 2;
        }

        .brand-logo {
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .brand-logo-icon {
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 15px;
          color: #b91c1c;
          background: #fff;
          box-shadow:
            0 12px 28px rgba(0,0,0,.15);
        }

        .brand-logo h1 {
          margin: 0;
          font-size: 21px;
          line-height: 1.1;
          font-weight: 850;
          letter-spacing: -.5px;
        }

        .brand-logo span {
          display: block;
          margin-top: 4px;
          color: rgba(255,255,255,.65);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: .5px;
        }

        .brand-heading {
          max-width: 470px;
          margin-top: 110px;
        }

        .brand-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 7px 11px;
          border: 1px solid rgba(255,255,255,.13);
          border-radius: 999px;
          color: rgba(255,255,255,.85);
          background: rgba(255,255,255,.08);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .3px;
          backdrop-filter: blur(10px);
        }

        .brand-heading h2 {
          margin: 24px 0 16px;
          font-size: clamp(38px, 4vw, 58px);
          line-height: 1.04;
          letter-spacing: -2.5px;
          font-weight: 850;
        }

        .brand-heading h2 span {
          color: #fecaca;
        }

        .brand-heading p {
          max-width: 440px;
          margin: 0;
          color: rgba(255,255,255,.68);
          font-size: 14px;
          line-height: 1.8;
        }

        /* =========================
           FEATURES
        ========================= */

        .brand-features {
          display: grid;
          gap: 12px;
          margin-top: 48px;
          max-width: 430px;
        }

        .brand-feature {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 13px;
          background: rgba(255,255,255,.055);
          backdrop-filter: blur(8px);
        }

        .feature-icon {
          width: 35px;
          height: 35px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border-radius: 10px;
          color: #fecaca;
          background: rgba(255,255,255,.09);
        }

        .brand-feature strong {
          display: block;
          font-size: 11px;
          font-weight: 750;
        }

        .brand-feature span {
          display: block;
          margin-top: 2px;
          color: rgba(255,255,255,.55);
          font-size: 9px;
        }

        .brand-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          color: rgba(255,255,255,.45);
          font-size: 9px;
          font-weight: 600;
          letter-spacing: .2px;
        }

        /* =========================
           FORM PANEL
        ========================= */

        .auth-form-panel {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 0;
          padding: 40px 7%;
        }

        .premium-auth-card {
          width: 100%;
          max-width: 500px;
          padding: 38px;
          border: 1px solid #e2e8f0;
          border-radius: 22px;
          background: rgba(255,255,255,.94);
          box-shadow:
            0 25px 70px rgba(15,23,42,.08),
            0 4px 15px rgba(15,23,42,.035);
        }

        .mobile-brand {
          display: none;
        }

        /* =========================
           LOGIN HEADER
        ========================= */

        .login-header {
          display: flex;
          align-items: flex-start;
          gap: 13px;
          margin-bottom: 28px;
        }

        .login-icon {
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

        .login-eyebrow {
          display: block;
          margin-bottom: 5px;
          color: #dc2626;
          font-size: 8px;
          font-weight: 850;
          letter-spacing: 1.1px;
        }

        .login-header h2 {
          margin: 0;
          color: #0f172a;
          font-size: 23px;
          line-height: 1.2;
          font-weight: 800;
          letter-spacing: -.5px;
        }

        .login-header p {
          margin: 6px 0 0;
          color: #94a3b8;
          font-size: 11px;
          line-height: 1.5;
        }

        /* =========================
           ERROR
        ========================= */

        .premium-error {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 20px;
          padding: 11px 12px;
          border: 1px solid #fecaca;
          border-radius: 12px;
          background: #fff7f7;
        }

        .error-icon {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border-radius: 8px;
          color: #dc2626;
          background: #fee2e2;
        }

        .premium-error strong {
          display: block;
          color: #991b1b;
          font-size: 10px;
          font-weight: 800;
        }

        .premium-error span {
          display: block;
          margin-top: 2px;
          color: #b91c1c;
          font-size: 9px;
        }

        /* =========================
           FORM
        ========================= */

        .premium-login-form {
          display: flex;
          flex-direction: column;
          gap: 19px;
        }

        .premium-form-group {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .premium-form-group label,
        .password-label-row label {
          color: #334155;
          font-size: 10px;
          font-weight: 800;
        }

        .password-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .password-label-row span {
          color: #94a3b8;
          font-size: 8px;
          font-weight: 600;
        }

        .premium-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .premium-input-wrapper .input-icon {
          position: absolute;
          left: 13px;
          color: #94a3b8;
          pointer-events: none;
          transition: color .2s ease;
        }

        .premium-input-wrapper input {
          width: 100%;
          height: 46px;
          padding: 0 43px;
          border: 1px solid #e2e8f0;
          border-radius: 11px;
          outline: none;
          color: #0f172a;
          background: #f8fafc;
          font-family: inherit;
          font-size: 11px;
          transition:
            border-color .2s ease,
            background .2s ease,
            box-shadow .2s ease;
        }

        .premium-input-wrapper input::placeholder {
          color: #a8b3c2;
        }

        .premium-input-wrapper input:hover {
          border-color: #cbd5e1;
          background: #fff;
        }

        .premium-input-wrapper input:focus {
          border-color: #ef4444;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(239,68,68,.08);
        }

        .premium-input-wrapper:focus-within .input-icon {
          color: #dc2626;
        }

        .password-toggle {
          position: absolute;
          right: 10px;
          width: 31px;
          height: 31px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 0;
          border-radius: 8px;
          color: #94a3b8;
          background: transparent;
          cursor: pointer;
          transition: all .2s ease;
        }

        .password-toggle:hover {
          color: #dc2626;
          background: #fef2f2;
        }

        /* =========================
           LOGIN BUTTON
        ========================= */

        .premium-login-btn {
          position: relative;
          width: 100%;
          height: 47px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          margin-top: 4px;
          border: 0;
          border-radius: 11px;
          color: #fff;
          background:
            linear-gradient(
              135deg,
              #dc2626,
              #b91c1c
            );
          box-shadow:
            0 9px 22px rgba(185,28,28,.20);
          font-family: inherit;
          font-size: 11px;
          font-weight: 800;
          cursor: pointer;
          transition:
            transform .2s ease,
            box-shadow .2s ease,
            opacity .2s ease;
        }

        .premium-login-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow:
            0 12px 28px rgba(185,28,28,.28);
        }

        .premium-login-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .premium-login-btn:disabled {
          opacity: .65;
          cursor: not-allowed;
        }

        .spin {
          animation: spin .9s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* =========================
           REGISTER
        ========================= */

        .register-section {
          margin-top: 26px;
        }

        .register-divider {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 14px;
        }

        .register-divider span {
          flex: 1;
          height: 1px;
          background: #eef2f7;
        }

        .register-divider small {
          color: #94a3b8;
          font-size: 7px;
          font-weight: 800;
          letter-spacing: .8px;
          white-space: nowrap;
        }

        .register-link {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          height: 41px;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          color: #475569;
          background: #fff;
          text-decoration: none;
          font-size: 10px;
          font-weight: 750;
          transition: all .2s ease;
        }

        .register-link svg:last-child {
          margin-left: 3px;
          transition: transform .2s ease;
        }

        .register-link:hover {
          color: #dc2626;
          border-color: #fecaca;
          background: #fffafa;
        }

        .register-link:hover svg:last-child {
          transform: translateX(3px);
        }

        /* =========================
           DEMO ACCOUNTS
        ========================= */

        .demo-section {
          margin-top: 24px;
          padding: 14px;
          border: 1px solid #f1f5f9;
          border-radius: 13px;
          background: #f8fafc;
        }

        .demo-title {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .demo-icon {
          width: 27px;
          height: 27px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          color: #64748b;
          background: #fff;
          border: 1px solid #e2e8f0;
        }

        .demo-title strong {
          display: block;
          color: #334155;
          font-size: 9px;
          font-weight: 800;
        }

        .demo-title span {
          display: block;
          margin-top: 2px;
          color: #94a3b8;
          font-size: 7px;
        }

        .demo-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 7px;
          margin-top: 12px;
        }

        .demo-account {
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 8px;
          border: 1px solid #e8edf3;
          border-radius: 9px;
          background: #fff;
        }

        .demo-role {
          width: 25px;
          height: 25px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border-radius: 7px;
          font-size: 8px;
          font-weight: 850;
        }

        .demo-role.admin {
          color: #b91c1c;
          background: #fee2e2;
        }

        .demo-role.staff {
          color: #7c3aed;
          background: #ede9fe;
        }

        .demo-role.donor {
          color: #be123c;
          background: #ffe4e6;
        }

        .demo-role.hospital {
          color: #0369a1;
          background: #e0f2fe;
        }

        .demo-info {
          min-width: 0;
          flex: 1;
        }

        .demo-info strong {
          display: block;
          color: #475569;
          font-size: 8px;
          font-weight: 800;
        }

        .demo-info span {
          display: block;
          overflow: hidden;
          margin-top: 2px;
          color: #94a3b8;
          font-size: 7px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .demo-account code {
          padding: 3px 5px;
          border-radius: 5px;
          color: #64748b;
          background: #f1f5f9;
          font-family: monospace;
          font-size: 7px;
        }

        /* =========================
           SECURITY FOOTER
        ========================= */

        .secure-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          margin-top: 18px;
          color: #94a3b8;
          font-size: 8px;
        }

        .secure-footer svg {
          color: #10b981;
        }

        /* =========================
           RESPONSIVE
        ========================= */

        @media (max-width: 1050px) {
          .premium-auth-layout {
            grid-template-columns: 0.8fr 1.2fr;
          }

          .auth-brand-panel {
            padding: 45px 7%;
          }

          .brand-heading {
            margin-top: 80px;
          }

          .brand-heading h2 {
            font-size: 42px;
          }

          .auth-form-panel {
            padding: 35px 5%;
          }
        }

        @media (max-width: 820px) {
          .premium-auth-layout {
            display: block;
          }

          .auth-brand-panel {
            display: none;
          }

          .auth-form-panel {
            min-height: 100vh;
            padding: 25px 18px;
          }

          .premium-auth-card {
            max-width: 500px;
            padding: 30px 26px;
          }

          .mobile-brand {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 28px;
          }

          .mobile-brand-icon {
            width: 39px;
            height: 39px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 11px;
            color: #fff;
            background: linear-gradient(135deg, #dc2626, #991b1b);
          }

          .mobile-brand strong {
            display: block;
            color: #0f172a;
            font-size: 16px;
            font-weight: 850;
          }

          .mobile-brand span {
            display: block;
            margin-top: 2px;
            color: #94a3b8;
            font-size: 8px;
          }
        }

        @media (max-width: 500px) {
          .auth-form-panel {
            padding: 15px;
          }

          .premium-auth-card {
            padding: 25px 19px;
            border-radius: 18px;
          }

          .login-header {
            margin-bottom: 23px;
          }

          .login-header h2 {
            font-size: 20px;
          }

          .demo-grid {
            grid-template-columns: 1fr;
          }

          .demo-account code {
            margin-left: auto;
          }
        }
      `}</style>
    </div>
  );
}