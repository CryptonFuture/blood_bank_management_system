import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Droplets,
  FileText,
  Hospital,
  Loader2,
  Send,
  ShieldCheck,
  UserRound,
  Zap,
} from 'lucide-react';
import api from '../services/api';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function RequestBlood() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    bloodGroup: 'O+',
    unitsRequested: 1,
    urgency: 'normal',
    patientName: '',
    patientAge: '',
    hospitalName: '',
    reason: '',
    notes: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/requests', {
        ...form,
        unitsRequested: Number(form.unitsRequested),
        patientAge: form.patientAge
          ? Number(form.patientAge)
          : undefined,
      });

      navigate('/requests');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Request failed'
      );
    } finally {
      setLoading(false);
    }
  };

  const urgencyConfig = {
    normal: {
      label: 'Normal',
      icon: <CheckCircle2 size={15} />,
      className: 'normal',
    },
    urgent: {
      label: 'Urgent',
      icon: <Zap size={15} />,
      className: 'urgent',
    },
    critical: {
      label: 'Critical',
      icon: <AlertCircle size={15} />,
      className: 'critical',
    },
  };

  return (
    <div className="request-blood-page">
      <div className="request-blood-shell">

        {/* Header */}
        <div className="request-page-header">

          <div className="request-header-content">
            <div className="request-eyebrow">
              <Droplets size={15} />
              Blood Bank Management
            </div>

            <h1>Request Blood</h1>

            <p>
              Submit a blood request with patient and hospital
              information for processing.
            </p>
          </div>

          <button
            type="button"
            className="back-btn"
            onClick={() => navigate('/requests')}
          >
            <ArrowLeft size={16} />
            Back to Requests
          </button>

        </div>

        {/* Error */}
        {error && (
          <div className="request-error">
            <div className="request-error-icon">
              <AlertCircle size={18} />
            </div>

            <div>
              <strong>Request could not be submitted</strong>
              <p>{error}</p>
            </div>

            <button
              type="button"
              onClick={() => setError('')}
              aria-label="Close error"
            >
              ×
            </button>
          </div>
        )}

        <div className="request-layout">

          {/* Main Form */}
          <div className="request-form-card">

            <div className="form-card-header">
              <div className="form-title-icon">
                <FileText size={20} />
              </div>

              <div>
                <h2>Blood Request Details</h2>
                <p>
                  Please provide the required information below.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>

              {/* Blood Requirement */}
              <div className="form-section">

                <div className="section-heading">
                  <div>
                    <h3>Blood Requirement</h3>
                    <p>Select the blood group and required quantity.</p>
                  </div>
                </div>

                <div className="premium-form-row">

                  <div className="premium-form-group">
                    <label>
                      Blood Group <span>*</span>
                    </label>

                    <div className="input-with-icon">
                      <Droplets size={17} />

                      <select
                        name="bloodGroup"
                        value={form.bloodGroup}
                        onChange={handleChange}
                        required
                      >
                        {BLOOD_GROUPS.map(bg => (
                          <option key={bg} value={bg}>
                            {bg}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="selected-blood">
                      <span className="blood-indicator">
                        <Droplets size={13} />
                      </span>

                      <strong>{form.bloodGroup}</strong>

                      <span>Blood Group Selected</span>
                    </div>
                  </div>

                  <div className="premium-form-group">
                    <label>
                      Units Required <span>*</span>
                    </label>

                    <div className="input-with-icon">
                      <Droplets size={17} />

                      <input
                        type="number"
                        name="unitsRequested"
                        min="1"
                        value={form.unitsRequested}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <small className="field-hint">
                      Enter the number of blood units required.
                    </small>
                  </div>

                </div>

              </div>

              {/* Urgency */}
              <div className="form-section">

                <div className="section-heading">
                  <div>
                    <h3>Request Priority</h3>
                    <p>
                      Select the urgency level for this request.
                    </p>
                  </div>
                </div>

                <div className="urgency-options">

                  {Object.entries(urgencyConfig).map(
                    ([value, config]) => (
                      <label
                        key={value}
                        className={`urgency-option ${
                          form.urgency === value
                            ? `selected ${config.className}`
                            : ''
                        }`}
                      >
                        <input
                          type="radio"
                          name="urgency"
                          value={value}
                          checked={form.urgency === value}
                          onChange={handleChange}
                        />

                        <span className="urgency-radio">
                          {form.urgency === value && (
                            <span />
                          )}
                        </span>

                        <span className="urgency-icon">
                          {config.icon}
                        </span>

                        <span className="urgency-text">
                          <strong>{config.label}</strong>

                          <small>
                            {value === 'normal'
                              ? 'Standard processing'
                              : value === 'urgent'
                              ? 'Needs quick attention'
                              : 'Immediate attention required'}
                          </small>
                        </span>
                      </label>
                    )
                  )}

                </div>

              </div>

              {/* Patient Information */}
              <div className="form-section">

                <div className="section-heading">
                  <div>
                    <h3>Patient Information</h3>
                    <p>
                      Enter the patient's basic information.
                    </p>
                  </div>
                </div>

                <div className="premium-form-row">

                  <div className="premium-form-group">
                    <label>Patient Name</label>

                    <div className="input-with-icon">
                      <UserRound size={17} />

                      <input
                        name="patientName"
                        value={form.patientName}
                        onChange={handleChange}
                        placeholder="Enter patient name"
                      />
                    </div>
                  </div>

                  <div className="premium-form-group">
                    <label>Patient Age</label>

                    <div className="input-with-icon">
                      <CalendarDays size={17} />

                      <input
                        type="number"
                        name="patientAge"
                        min="0"
                        value={form.patientAge}
                        onChange={handleChange}
                        placeholder="Age"
                      />
                    </div>
                  </div>

                </div>

                <div className="premium-form-group">
                  <label>Hospital Name</label>

                  <div className="input-with-icon">
                    <Hospital size={17} />

                    <input
                      name="hospitalName"
                      value={form.hospitalName}
                      onChange={handleChange}
                      placeholder="Enter hospital name"
                    />
                  </div>
                </div>

              </div>

              {/* Additional Details */}
              <div className="form-section last-section">

                <div className="section-heading">
                  <div>
                    <h3>Additional Details</h3>
                    <p>
                      Help the blood bank understand the request.
                    </p>
                  </div>
                </div>

                <div className="premium-form-group">
                  <label>Reason</label>

                  <div className="input-with-icon">
                    <FileText size={17} />

                    <input
                      name="reason"
                      value={form.reason}
                      onChange={handleChange}
                      placeholder="Surgery, Accident, Anemia, etc."
                    />
                  </div>
                </div>

                <div className="premium-form-group">
                  <label>Notes</label>

                  <textarea
                    name="notes"
                    rows={3}
                    value={form.notes}
                    onChange={handleChange}
                    placeholder="Add any additional information..."
                  />
                </div>

              </div>

              {/* Submit */}
              <div className="submit-area">

                <div className="secure-note">
                  <ShieldCheck size={16} />
                  <span>
                    Request information is securely submitted
                    to the blood bank.
                  </span>
                </div>

                <button
                  type="submit"
                  className="submit-request-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2
                        size={18}
                        className="spin"
                      />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send size={17} />
                      Submit Blood Request
                    </>
                  )}
                </button>

              </div>

            </form>
          </div>

          {/* Side Summary */}
          <aside className="request-summary">

            <div className="summary-card">

              <div className="summary-header">
                <div className="summary-icon">
                  <Droplets size={19} />
                </div>

                <div>
                  <h3>Request Summary</h3>
                  <p>Review before submitting</p>
                </div>
              </div>

              <div className="summary-blood">
                <div className="large-blood-icon">
                  <Droplets size={25} />
                </div>

                <div>
                  <span>Blood Group</span>
                  <strong>{form.bloodGroup}</strong>
                </div>
              </div>

              <div className="summary-list">

                <div className="summary-item">
                  <span>Units Required</span>
                  <strong>{form.unitsRequested}</strong>
                </div>

                <div className="summary-item">
                  <span>Urgency</span>

                  <span
                    className={`summary-urgency ${form.urgency}`}
                  >
                    {form.urgency}
                  </span>
                </div>

                <div className="summary-item">
                  <span>Patient</span>
                  <strong>
                    {form.patientName || 'Not provided'}
                  </strong>
                </div>

                <div className="summary-item">
                  <span>Hospital</span>
                  <strong>
                    {form.hospitalName || 'Not provided'}
                  </strong>
                </div>

              </div>

            </div>

            <div className="help-card">
              <div className="help-icon">
                <AlertCircle size={18} />
              </div>

              <div>
                <h4>Important</h4>
                <p>
                  Critical requests should only be selected
                  when blood is urgently required.
                </p>
              </div>
            </div>

          </aside>

        </div>
      </div>

      <style>{`
        .request-blood-page {
          min-height: calc(100vh - 70px);
          background:
            radial-gradient(
              circle at top left,
              rgba(220, 38, 38, 0.035),
              transparent 32%
            ),
            #f8fafc;
          padding: 28px 20px 45px;
        }

        .request-blood-shell {
          width: 100%;
          max-width: 1080px;
          margin: 0 auto;
        }

        .request-page-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 22px;
        }

        .request-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: #dc2626;
          font-size: 0.73rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 7px;
        }

        .request-header-content h1 {
          margin: 0;
          color: #0f172a;
          font-size: clamp(1.7rem, 3vw, 2.1rem);
          font-weight: 800;
          letter-spacing: -0.04em;
        }

        .request-header-content p {
          margin: 7px 0 0;
          color: #64748b;
          font-size: 0.88rem;
        }

        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 13px;
          border: 1px solid #e2e8f0;
          border-radius: 9px;
          background: #fff;
          color: #475569;
          font-size: 0.76rem;
          font-weight: 700;
          cursor: pointer;
          transition: 0.2s ease;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
        }

        .back-btn:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
          transform: translateY(-1px);
        }

        .request-error {
          display: flex;
          align-items: center;
          gap: 11px;
          margin-bottom: 18px;
          padding: 12px 14px;
          border: 1px solid #fecaca;
          border-radius: 11px;
          background: #fef2f2;
          color: #991b1b;
        }

        .request-error-icon {
          width: 34px;
          height: 34px;
          flex: 0 0 34px;
          display: grid;
          place-items: center;
          border-radius: 8px;
          background: #fee2e2;
          color: #dc2626;
        }

        .request-error strong {
          display: block;
          font-size: 0.77rem;
        }

        .request-error p {
          margin: 2px 0 0;
          font-size: 0.72rem;
        }

        .request-error > button {
          margin-left: auto;
          border: 0;
          background: transparent;
          color: #991b1b;
          font-size: 1.2rem;
          cursor: pointer;
        }

        .request-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 285px;
          gap: 18px;
          align-items: start;
        }

        .request-form-card,
        .summary-card,
        .help-card {
          background: #fff;
          border: 1px solid #e5eaf0;
          border-radius: 15px;
          box-shadow: 0 5px 22px rgba(15, 23, 42, 0.05);
        }

        .request-form-card {
          overflow: hidden;
        }

        .form-card-header {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 18px 20px;
          border-bottom: 1px solid #eef2f6;
        }

        .form-title-icon {
          width: 39px;
          height: 39px;
          display: grid;
          place-items: center;
          flex: 0 0 39px;
          border-radius: 10px;
          background: #fef2f2;
          color: #dc2626;
        }

        .form-card-header h2 {
          margin: 0;
          color: #172033;
          font-size: 0.98rem;
          font-weight: 800;
        }

        .form-card-header p {
          margin: 3px 0 0;
          color: #94a3b8;
          font-size: 0.72rem;
        }

        form {
          padding: 0 20px;
        }

        .form-section {
          padding: 20px 0;
          border-bottom: 1px solid #eef2f6;
        }

        .last-section {
          border-bottom: 0;
          padding-bottom: 18px;
        }

        .section-heading {
          margin-bottom: 15px;
        }

        .section-heading h3 {
          margin: 0;
          color: #1e293b;
          font-size: 0.82rem;
          font-weight: 800;
        }

        .section-heading p {
          margin: 3px 0 0;
          color: #94a3b8;
          font-size: 0.69rem;
        }

        .premium-form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 13px;
        }

        .premium-form-group {
          margin-bottom: 13px;
        }

        .premium-form-group:last-child {
          margin-bottom: 0;
        }

        .premium-form-group label {
          display: block;
          margin-bottom: 6px;
          color: #334155;
          font-size: 0.7rem;
          font-weight: 750;
        }

        .premium-form-group label span {
          color: #dc2626;
        }

        .input-with-icon {
          position: relative;
        }

        .input-with-icon > svg {
          position: absolute;
          left: 11px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          pointer-events: none;
        }

        .input-with-icon input,
        .input-with-icon select,
        .premium-form-group textarea {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid #dfe5ec;
          border-radius: 9px;
          background: #fff;
          color: #1e293b;
          font-family: inherit;
          font-size: 0.78rem;
          outline: none;
          transition: all 0.18s ease;
        }

        .input-with-icon input,
        .input-with-icon select {
          height: 40px;
          padding: 0 11px 0 35px;
        }

        .premium-form-group textarea {
          min-height: 78px;
          padding: 11px;
          resize: vertical;
        }

        .input-with-icon input::placeholder,
        .premium-form-group textarea::placeholder {
          color: #b1bac7;
        }

        .input-with-icon input:focus,
        .input-with-icon select:focus,
        .premium-form-group textarea:focus {
          border-color: #f87171;
          box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.07);
        }

        .selected-blood {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 6px;
          color: #94a3b8;
          font-size: 0.62rem;
        }

        .selected-blood strong {
          color: #b91c1c;
          font-size: 0.67rem;
        }

        .blood-indicator {
          width: 19px;
          height: 19px;
          display: grid;
          place-items: center;
          border-radius: 5px;
          background: #fef2f2;
          color: #dc2626;
        }

        .field-hint {
          display: block;
          margin-top: 6px;
          color: #94a3b8;
          font-size: 0.62rem;
        }

        .urgency-options {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 9px;
        }

        .urgency-option {
          position: relative;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px;
          border: 1px solid #e2e8f0;
          border-radius: 9px;
          cursor: pointer;
          transition: all 0.18s ease;
        }

        .urgency-option:hover {
          border-color: #cbd5e1;
          background: #fafcff;
        }

        .urgency-option input {
          position: absolute;
          opacity: 0;
          pointer-events: none;
        }

        .urgency-option.selected {
          border-color: #fca5a5;
          background: #fffafa;
          box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.04);
        }

        .urgency-option.selected.urgent {
          border-color: #fdba74;
          background: #fffaf5;
        }

        .urgency-option.selected.critical {
          border-color: #fca5a5;
          background: #fff7f7;
        }

        .urgency-radio {
          width: 14px;
          height: 14px;
          flex: 0 0 14px;
          display: grid;
          place-items: center;
          border: 1.5px solid #cbd5e1;
          border-radius: 50%;
        }

        .urgency-option.selected .urgency-radio {
          border-color: #dc2626;
        }

        .urgency-option.selected .urgency-radio span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #dc2626;
        }

        .urgency-icon {
          width: 27px;
          height: 27px;
          display: grid;
          place-items: center;
          border-radius: 7px;
          background: #f8fafc;
          color: #64748b;
        }

        .urgency-option.selected.normal .urgency-icon {
          background: #f0fdf4;
          color: #16a34a;
        }

        .urgency-option.selected.urgent .urgency-icon {
          background: #fff7ed;
          color: #ea580c;
        }

        .urgency-option.selected.critical .urgency-icon {
          background: #fef2f2;
          color: #dc2626;
        }

        .urgency-text {
          min-width: 0;
        }

        .urgency-text strong {
          display: block;
          color: #334155;
          font-size: 0.7rem;
        }

        .urgency-text small {
          display: block;
          margin-top: 2px;
          color: #94a3b8;
          font-size: 0.57rem;
          white-space: nowrap;
        }

        .submit-area {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          padding: 16px 0 19px;
        }

        .secure-note {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #94a3b8;
          font-size: 0.63rem;
        }

        .secure-note svg {
          color: #16a34a;
          flex: 0 0 auto;
        }

        .submit-request-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          min-height: 40px;
          padding: 0 17px;
          border: 0;
          border-radius: 9px;
          background: linear-gradient(135deg, #dc2626, #b91c1c);
          color: #fff;
          font-size: 0.75rem;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 5px 13px rgba(220, 38, 38, 0.2);
          transition: all 0.2s ease;
        }

        .submit-request-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 7px 17px rgba(220, 38, 38, 0.26);
        }

        .submit-request-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .summary-card {
          padding: 17px;
        }

        .summary-header {
          display: flex;
          align-items: center;
          gap: 9px;
          padding-bottom: 14px;
          border-bottom: 1px solid #eef2f6;
        }

        .summary-icon {
          width: 35px;
          height: 35px;
          display: grid;
          place-items: center;
          border-radius: 9px;
          background: #fef2f2;
          color: #dc2626;
        }

        .summary-header h3 {
          margin: 0;
          color: #1e293b;
          font-size: 0.8rem;
          font-weight: 800;
        }

        .summary-header p {
          margin: 2px 0 0;
          color: #94a3b8;
          font-size: 0.62rem;
        }

        .summary-blood {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 15px 0;
          padding: 12px;
          border-radius: 10px;
          background: #fef2f2;
          border: 1px solid #fee2e2;
        }

        .large-blood-icon {
          width: 43px;
          height: 43px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: #fff;
          color: #dc2626;
          box-shadow: 0 2px 7px rgba(220, 38, 38, 0.08);
        }

        .summary-blood span {
          display: block;
          color: #991b1b;
          font-size: 0.6rem;
        }

        .summary-blood strong {
          display: block;
          margin-top: 2px;
          color: #b91c1c;
          font-size: 1.3rem;
          line-height: 1;
        }

        .summary-list {
          display: flex;
          flex-direction: column;
        }

        .summary-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 10px 0;
          border-bottom: 1px solid #f1f5f9;
        }

        .summary-item:last-child {
          border-bottom: 0;
        }

        .summary-item > span:first-child {
          color: #64748b;
          font-size: 0.67rem;
        }

        .summary-item > strong {
          max-width: 145px;
          overflow: hidden;
          color: #334155;
          font-size: 0.68rem;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: right;
        }

        .summary-urgency {
          padding: 4px 7px;
          border-radius: 6px;
          font-size: 0.59rem !important;
          font-weight: 800;
          text-transform: capitalize;
        }

        .summary-urgency.normal {
          background: #f0fdf4;
          color: #15803d;
        }

        .summary-urgency.urgent {
          background: #fff7ed;
          color: #c2410c;
        }

        .summary-urgency.critical {
          background: #fef2f2;
          color: #b91c1c;
        }

        .help-card {
          display: flex;
          gap: 9px;
          margin-top: 12px;
          padding: 13px;
          background: #fffbeb;
          border-color: #fde68a;
          box-shadow: none;
        }

        .help-icon {
          width: 29px;
          height: 29px;
          flex: 0 0 29px;
          display: grid;
          place-items: center;
          border-radius: 7px;
          background: #fef3c7;
          color: #d97706;
        }

        .help-card h4 {
          margin: 0;
          color: #92400e;
          font-size: 0.7rem;
        }

        .help-card p {
          margin: 3px 0 0;
          color: #a16207;
          font-size: 0.61rem;
          line-height: 1.5;
        }

        .spin {
          animation: request-blood-spin 0.9s linear infinite;
        }

        @keyframes request-blood-spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 850px) {
          .request-layout {
            grid-template-columns: 1fr;
          }

          .request-summary {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
          }

          .help-card {
            margin-top: 0;
          }
        }

        @media (max-width: 680px) {
          .request-blood-page {
            padding: 20px 12px 35px;
          }

          .request-page-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .back-btn {
            width: 100%;
            justify-content: center;
          }

          .premium-form-row {
            grid-template-columns: 1fr;
            gap: 0;
          }

          .urgency-options {
            grid-template-columns: 1fr;
          }

          .submit-area {
            align-items: stretch;
            flex-direction: column;
          }

          .submit-request-btn {
            width: 100%;
          }

          .secure-note {
            justify-content: center;
          }

          .request-summary {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 450px) {
          .request-blood-page {
            padding-left: 10px;
            padding-right: 10px;
          }

          form,
          .form-card-header {
            padding-left: 14px;
            padding-right: 14px;
          }

          .request-header-content h1 {
            font-size: 1.55rem;
          }
        }
      `}</style>
    </div>
  );
}