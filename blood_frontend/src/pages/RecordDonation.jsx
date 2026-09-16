import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  ArrowLeft,
  CheckCircle2,
  Droplets,
  FileText,
  HeartPulse,
  Hospital,
  Loader2,
  ShieldCheck,
  Stethoscope,
  UserRound,
  Weight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function RecordDonation() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [donors, setDonors] = useState([]);
  const [form, setForm] = useState({
    donorId: user?.role === 'donor' ? user._id : '',
    bloodGroup: user?.bloodGroup || 'O+',
    units: 1,
    volume: 450,
    hemoglobin: '',
    bloodPressure: '',
    notes: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.role === 'admin' || user?.role === 'staff') {
      api
        .get('/donors')
        .then(res => setDonors(res.data))
        .catch(() => {});
    }
  }, [user]);

  const handleChange = e => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const payload = {
        ...form,
        units: Number(form.units),
        volume: Number(form.volume),
        hemoglobin: form.hemoglobin
          ? Number(form.hemoglobin)
          : undefined,
        donorId: form.donorId || user._id,
      };

      const res = await api.post('/donations', payload);

      setSuccess(
        `Donation recorded! Bag ID: ${res.data.bagId}`
      );

      setTimeout(() => navigate('/donations'), 1500);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to record donation'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="record-donation-page">
      <div className="record-donation-shell">

        {/* Header */}
        <div className="donation-page-header">

          <div>
            <div className="donation-eyebrow">
              <Droplets size={15} />
              Blood Bank Management
            </div>

            <h1>Record Blood Donation</h1>

            <p>
              Register a donor's blood collection and health
              information securely.
            </p>
          </div>

          <button
            type="button"
            className="donation-back-btn"
            onClick={() => navigate('/donations')}
          >
            <ArrowLeft size={16} />
            Back to Donations
          </button>

        </div>

        {/* Messages */}
        {error && (
          <div className="donation-alert error">
            <div className="donation-alert-icon">
              <Activity size={18} />
            </div>

            <div>
              <strong>Unable to record donation</strong>
              <p>{error}</p>
            </div>

            <button
              type="button"
              onClick={() => setError('')}
            >
              ×
            </button>
          </div>
        )}

        {success && (
          <div className="donation-alert success">
            <div className="donation-alert-icon">
              <CheckCircle2 size={18} />
            </div>

            <div>
              <strong>Donation recorded successfully</strong>
              <p>{success}</p>
            </div>
          </div>
        )}

        <div className="donation-layout">

          {/* Main Form */}
          <div className="donation-form-card">

            <div className="donation-card-header">
              <div className="donation-title-icon">
                <HeartPulse size={20} />
              </div>

              <div>
                <h2>Donation Details</h2>
                <p>
                  Complete the information below to record the
                  blood donation.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>

              {/* Donor */}
              {(user?.role === 'admin' ||
                user?.role === 'staff') && (
                <div className="donation-section">

                  <div className="section-title">
                    <div className="section-icon blue">
                      <UserRound size={16} />
                    </div>

                    <div>
                      <h3>Donor Information</h3>
                      <p>Select the donor providing blood.</p>
                    </div>
                  </div>

                  <div className="donation-field">
                    <label>
                      Select Donor <span>*</span>
                    </label>

                    <div className="donation-input-icon">
                      <UserRound size={17} />

                      <select
                        name="donorId"
                        value={form.donorId}
                        onChange={handleChange}
                        required
                      >
                        <option value="">
                          Select donor...
                        </option>

                        {donors.map(d => (
                          <option
                            key={d._id}
                            value={d._id}
                          >
                            {d.name} (
                            {d.bloodGroup || 'N/A'}) —{' '}
                            {d.phone}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                </div>
              )}

              {/* Blood Collection */}
              <div className="donation-section">

                <div className="section-title">
                  <div className="section-icon red">
                    <Droplets size={16} />
                  </div>

                  <div>
                    <h3>Blood Collection</h3>
                    <p>
                      Enter the collected blood group and
                      quantity.
                    </p>
                  </div>
                </div>

                <div className="donation-form-row">

                  <div className="donation-field">
                    <label>
                      Blood Group <span>*</span>
                    </label>

                    <div className="donation-input-icon">
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

                    <div className="blood-selected">
                      <span>
                        <Droplets size={12} />
                      </span>

                      <strong>{form.bloodGroup}</strong>
                      <small>Selected blood group</small>
                    </div>
                  </div>

                  <div className="donation-field">
                    <label>Units</label>

                    <div className="donation-input-icon">
                      <Weight size={17} />

                      <input
                        type="number"
                        name="units"
                        min="1"
                        max="2"
                        value={form.units}
                        onChange={handleChange}
                      />
                    </div>

                    <small className="field-hint">
                      Maximum 2 units per donation.
                    </small>
                  </div>

                </div>

                <div className="donation-form-row">

                  <div className="donation-field">
                    <label>Volume (ml)</label>

                    <div className="donation-input-icon">
                      <Droplets size={17} />

                      <input
                        type="number"
                        name="volume"
                        value={form.volume}
                        onChange={handleChange}
                        placeholder="450"
                      />
                    </div>
                  </div>

                  <div className="donation-field">
                    <label>Hemoglobin (g/dL)</label>

                    <div className="donation-input-icon">
                      <Activity size={17} />

                      <input
                        type="number"
                        step="0.1"
                        name="hemoglobin"
                        value={form.hemoglobin}
                        onChange={handleChange}
                        placeholder="e.g. 13.5"
                      />
                    </div>
                  </div>

                </div>

              </div>

              {/* Health Information */}
              <div className="donation-section">

                <div className="section-title">
                  <div className="section-icon green">
                    <Stethoscope size={16} />
                  </div>

                  <div>
                    <h3>Health Information</h3>
                    <p>
                      Add basic donor health information.
                    </p>
                  </div>
                </div>

                <div className="donation-field">
                  <label>Blood Pressure</label>

                  <div className="donation-input-icon">
                    <HeartPulse size={17} />

                    <input
                      name="bloodPressure"
                      value={form.bloodPressure}
                      onChange={handleChange}
                      placeholder="e.g. 120/80"
                    />
                  </div>
                </div>

              </div>

              {/* Notes */}
              <div className="donation-section last">

                <div className="section-title">
                  <div className="section-icon purple">
                    <FileText size={16} />
                  </div>

                  <div>
                    <h3>Additional Notes</h3>
                    <p>
                      Add any relevant information about the
                      donation.
                    </p>
                  </div>
                </div>

                <div className="donation-field">
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
              <div className="donation-submit-area">

                <div className="donation-secure-note">
                  <ShieldCheck size={16} />

                  <span>
                    Donation data is securely recorded in the
                    blood bank system.
                  </span>
                </div>

                <button
                  type="submit"
                  className="record-donation-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2
                        size={17}
                        className="donation-spin"
                      />
                      Recording...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={17} />
                      Record Donation
                    </>
                  )}
                </button>

              </div>

            </form>
          </div>

          {/* Summary */}
          <aside className="donation-sidebar">

            <div className="donation-summary-card">

              <div className="summary-top">
                <div className="summary-top-icon">
                  <Droplets size={19} />
                </div>

                <div>
                  <h3>Donation Summary</h3>
                  <p>Current collection details</p>
                </div>
              </div>

              <div className="blood-summary">

                <div className="blood-summary-icon">
                  <Droplets size={27} />
                </div>

                <div>
                  <span>Blood Group</span>
                  <strong>{form.bloodGroup}</strong>
                </div>

              </div>

              <div className="summary-details">

                <div>
                  <span>Units</span>
                  <strong>{form.units}</strong>
                </div>

                <div>
                  <span>Volume</span>
                  <strong>{form.volume} ml</strong>
                </div>

                <div>
                  <span>Hemoglobin</span>
                  <strong>
                    {form.hemoglobin
                      ? `${form.hemoglobin} g/dL`
                      : 'Not provided'}
                  </strong>
                </div>

                <div>
                  <span>Blood Pressure</span>
                  <strong>
                    {form.bloodPressure || 'Not provided'}
                  </strong>
                </div>

              </div>

            </div>

            <div className="donation-info-card">

              <div className="info-card-icon">
                <ShieldCheck size={18} />
              </div>

              <div>
                <h4>Donation Safety</h4>

                <p>
                  Make sure the donor information and health
                  details are accurate before recording.
                </p>
              </div>

            </div>

            <div className="donation-stat-card">

              <div className="mini-stat-icon">
                <Hospital size={17} />
              </div>

              <div>
                <span>Collection Volume</span>
                <strong>{form.volume || 0} ml</strong>
              </div>

            </div>

          </aside>

        </div>
      </div>

      <style>{`
        .record-donation-page {
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

        .record-donation-shell {
          width: 100%;
          max-width: 1080px;
          margin: 0 auto;
        }

        .donation-page-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 22px;
        }

        .donation-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          margin-bottom: 7px;
          color: #dc2626;
          font-size: 0.73rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .donation-page-header h1 {
          margin: 0;
          color: #0f172a;
          font-size: clamp(1.7rem, 3vw, 2.1rem);
          font-weight: 800;
          letter-spacing: -0.04em;
        }

        .donation-page-header p {
          margin: 7px 0 0;
          color: #64748b;
          font-size: 0.88rem;
        }

        .donation-back-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
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

        .donation-back-btn:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
          transform: translateY(-1px);
        }

        .donation-alert {
          display: flex;
          align-items: center;
          gap: 11px;
          margin-bottom: 18px;
          padding: 12px 14px;
          border-radius: 11px;
        }

        .donation-alert.error {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #991b1b;
        }

        .donation-alert.success {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          color: #166534;
        }

        .donation-alert-icon {
          width: 34px;
          height: 34px;
          flex: 0 0 34px;
          display: grid;
          place-items: center;
          border-radius: 8px;
        }

        .donation-alert.error .donation-alert-icon {
          background: #fee2e2;
          color: #dc2626;
        }

        .donation-alert.success .donation-alert-icon {
          background: #dcfce7;
          color: #16a34a;
        }

        .donation-alert strong {
          display: block;
          font-size: 0.77rem;
        }

        .donation-alert p {
          margin: 2px 0 0;
          font-size: 0.7rem;
        }

        .donation-alert > button {
          margin-left: auto;
          border: 0;
          background: transparent;
          color: inherit;
          font-size: 1.2rem;
          cursor: pointer;
        }

        .donation-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 285px;
          gap: 18px;
          align-items: start;
        }

        .donation-form-card,
        .donation-summary-card,
        .donation-info-card,
        .donation-stat-card {
          background: #fff;
          border: 1px solid #e5eaf0;
          border-radius: 15px;
          box-shadow: 0 5px 22px rgba(15, 23, 42, 0.05);
        }

        .donation-form-card {
          overflow: hidden;
        }

        .donation-card-header {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 18px 20px;
          border-bottom: 1px solid #eef2f6;
        }

        .donation-title-icon {
          width: 39px;
          height: 39px;
          flex: 0 0 39px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: #fef2f2;
          color: #dc2626;
        }

        .donation-card-header h2 {
          margin: 0;
          color: #172033;
          font-size: 0.98rem;
          font-weight: 800;
        }

        .donation-card-header p {
          margin: 3px 0 0;
          color: #94a3b8;
          font-size: 0.72rem;
        }

        .donation-form-card form {
          padding: 0 20px;
        }

        .donation-section {
          padding: 20px 0;
          border-bottom: 1px solid #eef2f6;
        }

        .donation-section.last {
          border-bottom: 0;
          padding-bottom: 18px;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 15px;
        }

        .section-icon {
          width: 31px;
          height: 31px;
          flex: 0 0 31px;
          display: grid;
          place-items: center;
          border-radius: 8px;
        }

        .section-icon.blue {
          background: #eff6ff;
          color: #2563eb;
        }

        .section-icon.red {
          background: #fef2f2;
          color: #dc2626;
        }

        .section-icon.green {
          background: #f0fdf4;
          color: #16a34a;
        }

        .section-icon.purple {
          background: #faf5ff;
          color: #9333ea;
        }

        .section-title h3 {
          margin: 0;
          color: #1e293b;
          font-size: 0.82rem;
          font-weight: 800;
        }

        .section-title p {
          margin: 2px 0 0;
          color: #94a3b8;
          font-size: 0.67rem;
        }

        .donation-form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 13px;
        }

        .donation-field {
          margin-bottom: 13px;
        }

        .donation-field:last-child {
          margin-bottom: 0;
        }

        .donation-field label {
          display: block;
          margin-bottom: 6px;
          color: #334155;
          font-size: 0.7rem;
          font-weight: 750;
        }

        .donation-field label span {
          color: #dc2626;
        }

        .donation-input-icon {
          position: relative;
        }

        .donation-input-icon > svg {
          position: absolute;
          top: 50%;
          left: 11px;
          z-index: 1;
          color: #94a3b8;
          pointer-events: none;
          transform: translateY(-50%);
        }

        .donation-input-icon input,
        .donation-input-icon select,
        .donation-field textarea {
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

        .donation-input-icon input,
        .donation-input-icon select {
          height: 40px;
          padding: 0 11px 0 35px;
        }

        .donation-field textarea {
          min-height: 78px;
          padding: 11px;
          resize: vertical;
        }

        .donation-input-icon input::placeholder,
        .donation-field textarea::placeholder {
          color: #b1bac7;
        }

        .donation-input-icon input:focus,
        .donation-input-icon select:focus,
        .donation-field textarea:focus {
          border-color: #f87171;
          box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.07);
        }

        .blood-selected {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 6px;
        }

        .blood-selected > span {
          width: 19px;
          height: 19px;
          display: grid;
          place-items: center;
          border-radius: 5px;
          background: #fef2f2;
          color: #dc2626;
        }

        .blood-selected strong {
          color: #b91c1c;
          font-size: 0.67rem;
        }

        .blood-selected small {
          color: #94a3b8;
          font-size: 0.61rem;
        }

        .field-hint {
          display: block;
          margin-top: 6px;
          color: #94a3b8;
          font-size: 0.61rem;
        }

        .donation-submit-area {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          padding: 16px 0 19px;
        }

        .donation-secure-note {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #94a3b8;
          font-size: 0.63rem;
        }

        .donation-secure-note svg {
          flex: 0 0 auto;
          color: #16a34a;
        }

        .record-donation-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          min-height: 40px;
          padding: 0 17px;
          border: 0;
          border-radius: 9px;
          background: linear-gradient(
            135deg,
            #16a34a,
            #15803d
          );
          color: #fff;
          font-size: 0.75rem;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 5px 13px rgba(22, 163, 74, 0.2);
          transition: all 0.2s ease;
        }

        .record-donation-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 7px 17px rgba(22, 163, 74, 0.27);
        }

        .record-donation-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .donation-summary-card {
          padding: 17px;
        }

        .summary-top {
          display: flex;
          align-items: center;
          gap: 9px;
          padding-bottom: 14px;
          border-bottom: 1px solid #eef2f6;
        }

        .summary-top-icon {
          width: 35px;
          height: 35px;
          display: grid;
          place-items: center;
          border-radius: 9px;
          background: #fef2f2;
          color: #dc2626;
        }

        .summary-top h3 {
          margin: 0;
          color: #1e293b;
          font-size: 0.8rem;
          font-weight: 800;
        }

        .summary-top p {
          margin: 2px 0 0;
          color: #94a3b8;
          font-size: 0.62rem;
        }

        .blood-summary {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 15px 0;
          padding: 12px;
          border: 1px solid #fee2e2;
          border-radius: 10px;
          background: #fef2f2;
        }

        .blood-summary-icon {
          width: 43px;
          height: 43px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: #fff;
          color: #dc2626;
          box-shadow: 0 2px 7px rgba(220, 38, 38, 0.08);
        }

        .blood-summary span {
          display: block;
          color: #991b1b;
          font-size: 0.6rem;
        }

        .blood-summary strong {
          display: block;
          margin-top: 2px;
          color: #b91c1c;
          font-size: 1.3rem;
          line-height: 1;
        }

        .summary-details {
          display: flex;
          flex-direction: column;
        }

        .summary-details > div {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 10px 0;
          border-bottom: 1px solid #f1f5f9;
        }

        .summary-details > div:last-child {
          border-bottom: 0;
        }

        .summary-details span {
          color: #64748b;
          font-size: 0.67rem;
        }

        .summary-details strong {
          max-width: 135px;
          overflow: hidden;
          color: #334155;
          font-size: 0.68rem;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: right;
        }

        .donation-info-card {
          display: flex;
          gap: 9px;
          margin-top: 12px;
          padding: 13px;
          background: #f0fdf4;
          border-color: #bbf7d0;
          box-shadow: none;
        }

        .info-card-icon {
          width: 29px;
          height: 29px;
          flex: 0 0 29px;
          display: grid;
          place-items: center;
          border-radius: 7px;
          background: #dcfce7;
          color: #15803d;
        }

        .donation-info-card h4 {
          margin: 0;
          color: #166534;
          font-size: 0.7rem;
        }

        .donation-info-card p {
          margin: 3px 0 0;
          color: #4d7c5b;
          font-size: 0.61rem;
          line-height: 1.5;
        }

        .donation-stat-card {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-top: 12px;
          padding: 12px 13px;
          box-shadow: none;
        }

        .mini-stat-icon {
          width: 30px;
          height: 30px;
          display: grid;
          place-items: center;
          border-radius: 8px;
          background: #eff6ff;
          color: #2563eb;
        }

        .donation-stat-card span {
          display: block;
          color: #94a3b8;
          font-size: 0.6rem;
        }

        .donation-stat-card strong {
          display: block;
          margin-top: 2px;
          color: #1e293b;
          font-size: 0.82rem;
        }

        .donation-spin {
          animation: donation-spin 0.9s linear infinite;
        }

        @keyframes donation-spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 850px) {
          .donation-layout {
            grid-template-columns: 1fr;
          }

          .donation-sidebar {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
          }

          .donation-info-card,
          .donation-stat-card {
            margin-top: 0;
          }
        }

        @media (max-width: 680px) {
          .record-donation-page {
            padding: 20px 12px 35px;
          }

          .donation-page-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .donation-back-btn {
            width: 100%;
          }

          .donation-form-row {
            grid-template-columns: 1fr;
            gap: 0;
          }

          .donation-submit-area {
            align-items: stretch;
            flex-direction: column;
          }

          .donation-secure-note {
            justify-content: center;
            text-align: center;
          }

          .record-donation-btn {
            width: 100%;
          }

          .donation-sidebar {
            grid-template-columns: 1fr;
          }

          .donation-info-card,
          .donation-stat-card {
            margin-top: 0;
          }
        }

        @media (max-width: 450px) {
          .record-donation-page {
            padding-left: 10px;
            padding-right: 10px;
          }

          .donation-form-card form,
          .donation-card-header {
            padding-left: 14px;
            padding-right: 14px;
          }

          .donation-page-header h1 {
            font-size: 1.55rem;
          }
        }
      `}</style>
    </div>
  );
}