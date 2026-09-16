import { useEffect, useState } from 'react';
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Droplets,
  Hospital,
  Inbox,
  Loader2,
  RefreshCw,
  ShieldCheck,
  UserRound,
  XCircle,
  Zap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Requests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  const load = () => {
    setLoading(true);

    api
      .get('/requests')
      .then(res => setRequests(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const process = async (id, status, unitsToFulfill) => {
    try {
      await api.put(`/requests/${id}/process`, {
        status,
        unitsToFulfill,
      });

      setMsg(`Request ${status}`);
      load();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Action failed');
    }
  };

  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const fulfilledCount = requests.filter(r => r.status === 'fulfilled').length;
  const urgentCount = requests.filter(
    r => r.urgency === 'urgent' || r.urgency === 'critical'
  ).length;

  const totalRequested = requests.reduce(
    (sum, r) => sum + Number(r.unitsRequested || 0),
    0
  );

  const getUrgencyClass = urgency => {
    if (urgency === 'critical') return 'request-badge critical';
    if (urgency === 'urgent') return 'request-badge urgent';
    if (urgency === 'high') return 'request-badge high';
    return 'request-badge normal';
  };

  const getStatusClass = status => {
    if (status === 'fulfilled') return 'request-badge fulfilled';
    if (status === 'rejected') return 'request-badge rejected';
    if (status === 'pending') return 'request-badge pending';
    return 'request-badge';
  };

  const getStatusIcon = status => {
    if (status === 'fulfilled') return <CheckCircle2 size={14} />;
    if (status === 'rejected') return <XCircle size={14} />;
    if (status === 'pending') return <Clock3 size={14} />;
    return <ShieldCheck size={14} />;
  };

  const getProgress = request => {
    const requested = Number(request.unitsRequested || 0);
    const fulfilled = Number(request.unitsFulfilled || 0);

    if (!requested) return 0;

    return Math.min((fulfilled / requested) * 100, 100);
  };

  return (
    <div className="requests-page">
      <div className="requests-shell">

        {/* Header */}
        <div className="requests-header">
          <div>
            <div className="requests-eyebrow">
              <Droplets size={15} />
              Blood Bank Management
            </div>

            <h1>Blood Requests</h1>

            <p>
              Monitor incoming blood requests and manage fulfillment
              efficiently.
            </p>
          </div>

          <button
            type="button"
            className="refresh-btn"
            onClick={load}
            disabled={loading}
          >
            <RefreshCw
              size={16}
              className={loading ? 'spin' : ''}
            />
            Refresh
          </button>
        </div>

        {/* Message */}
        {msg && (
          <div className="request-message">
            <CheckCircle2 size={18} />
            <span>{msg}</span>

            <button
              type="button"
              onClick={() => setMsg('')}
              aria-label="Close message"
            >
              ×
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="request-stats">

          <div className="request-stat-card">
            <div className="request-stat-icon blue">
              <Inbox size={20} />
            </div>

            <div>
              <span>Total Requests</span>
              <strong>{requests.length}</strong>
            </div>
          </div>

          <div className="request-stat-card">
            <div className="request-stat-icon orange">
              <Clock3 size={20} />
            </div>

            <div>
              <span>Pending</span>
              <strong>{pendingCount}</strong>
            </div>
          </div>

          <div className="request-stat-card">
            <div className="request-stat-icon green">
              <CheckCircle2 size={20} />
            </div>

            <div>
              <span>Fulfilled</span>
              <strong>{fulfilledCount}</strong>
            </div>
          </div>

          <div className="request-stat-card">
            <div className="request-stat-icon red">
              <Zap size={20} />
            </div>

            <div>
              <span>Urgent</span>
              <strong>{urgentCount}</strong>
            </div>
          </div>

          <div className="request-stat-card">
            <div className="request-stat-icon purple">
              <Droplets size={20} />
            </div>

            <div>
              <span>Units Requested</span>
              <strong>{totalRequested}</strong>
            </div>
          </div>

        </div>

        {/* Main Card */}
        <div className="requests-card">

          <div className="requests-card-header">
            <div>
              <h2>
                <Inbox size={19} />
                Request Queue
              </h2>

              <p>
                Review patient requirements and process pending requests.
              </p>
            </div>

            <div className="request-count">
              {requests.length} {requests.length === 1 ? 'Request' : 'Requests'}
            </div>
          </div>

          {loading ? (
            <div className="requests-loading">
              <Loader2 size={28} className="spin" />
              <span>Loading blood requests...</span>
            </div>
          ) : requests.length === 0 ? (
            <div className="requests-empty">
              <div className="empty-icon">
                <Inbox size={30} />
              </div>

              <h3>No requests yet</h3>
              <p>
                Blood requests will appear here when they are submitted.
              </p>
            </div>
          ) : (
            <div className="requests-table-wrapper">
              <table className="premium-requests-table">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Blood</th>
                    <th>Units</th>
                    <th>Urgency</th>
                    <th>Hospital</th>
                    <th>Status</th>
                    <th>Date</th>

                    {(user?.role === 'admin' ||
                      user?.role === 'staff') && (
                      <th>Actions</th>
                    )}
                  </tr>
                </thead>

                <tbody>
                  {requests.map(r => {
                    const progress = getProgress(r);

                    return (
                      <tr key={r._id}>

                        {/* Patient */}
                        <td>
                          <div className="patient-cell">
                            <div className="patient-avatar">
                              <UserRound size={17} />
                            </div>

                            <div>
                              <strong>
                                {r.patientName ||
                                  r.requester?.name ||
                                  'Unknown Patient'}
                              </strong>

                              {r.requester?.email && (
                                <small>{r.requester.email}</small>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Blood */}
                        <td>
                          <div className="blood-group-cell">
                            <span className="blood-drop">
                              <Droplets size={15} />
                            </span>

                            <strong>{r.bloodGroup}</strong>
                          </div>
                        </td>

                        {/* Units */}
                        <td>
                          <div className="units-cell">
                            <strong>
                              {r.unitsFulfilled || 0}
                              <span>
                                / {r.unitsRequested || 0}
                              </span>
                            </strong>

                            <div className="units-progress">
                              <span
                                style={{
                                  width: `${progress}%`,
                                }}
                              />
                            </div>

                            <small>{Math.round(progress)}% fulfilled</small>
                          </div>
                        </td>

                        {/* Urgency */}
                        <td>
                          <span className={getUrgencyClass(r.urgency)}>
                            {r.urgency === 'critical' && (
                              <AlertCircle size={14} />
                            )}

                            {r.urgency === 'urgent' && (
                              <Zap size={14} />
                            )}

                            {r.urgency || 'normal'}
                          </span>
                        </td>

                        {/* Hospital */}
                        <td>
                          <div className="hospital-cell">
                            <Hospital size={16} />

                            <span>
                              {r.hospitalName ||
                                r.requester?.hospitalName ||
                                '-'}
                            </span>
                          </div>
                        </td>

                        {/* Status */}
                        <td>
                          <span className={getStatusClass(r.status)}>
                            {getStatusIcon(r.status)}
                            {r.status?.replace('_', ' ') || 'Unknown'}
                          </span>
                        </td>

                        {/* Date */}
                        <td>
                          <div className="date-cell">
                            <CalendarDays size={15} />

                            <span>
                              {r.createdAt
                                ? new Date(
                                    r.createdAt
                                  ).toLocaleDateString()
                                : '-'}
                            </span>
                          </div>
                        </td>

                        {/* Actions */}
                        {(user?.role === 'admin' ||
                          user?.role === 'staff') && (
                          <td>
                            {r.status === 'pending' ? (
                              <div className="request-actions">

                                <button
                                  type="button"
                                  className="action-btn fulfill"
                                  onClick={() =>
                                    process(
                                      r._id,
                                      'fulfilled',
                                      r.unitsRequested
                                    )
                                  }
                                  title="Fulfill request"
                                >
                                  <CheckCircle2 size={15} />
                                  Fulfill
                                </button>

                                <button
                                  type="button"
                                  className="action-btn reject"
                                  onClick={() =>
                                    process(
                                      r._id,
                                      'rejected'
                                    )
                                  }
                                  title="Reject request"
                                >
                                  <XCircle size={15} />
                                  Reject
                                </button>

                              </div>
                            ) : (
                              <span className="no-action">
                                Completed
                              </span>
                            )}
                          </td>
                        )}

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer Hint */}
        {!loading && requests.length > 0 && (
          <div className="requests-footer-note">
            <ShieldCheck size={16} />
            <span>
              Only authorized admin and staff members can process blood
              requests.
            </span>
          </div>
        )}

      </div>

      <style>{`
        .requests-page {
          min-height: calc(100vh - 70px);
          background:
            radial-gradient(circle at top left, rgba(220, 38, 38, 0.035), transparent 30%),
            #f8fafc;
          padding: 28px 20px 45px;
        }

        .requests-shell {
          width: 100%;
          max-width: 1180px;
          margin: 0 auto;
        }

        .requests-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 22px;
        }

        .requests-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: #dc2626;
          font-size: 0.76rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 7px;
        }

        .requests-header h1 {
          margin: 0;
          color: #0f172a;
          font-size: clamp(1.65rem, 3vw, 2.1rem);
          font-weight: 800;
          letter-spacing: -0.035em;
        }

        .requests-header p {
          margin: 7px 0 0;
          color: #64748b;
          font-size: 0.91rem;
        }

        .refresh-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: 1px solid #e2e8f0;
          background: #fff;
          color: #334155;
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 0.84rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
        }

        .refresh-btn:hover {
          border-color: #cbd5e1;
          background: #f8fafc;
          transform: translateY(-1px);
        }

        .refresh-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
          transform: none;
        }

        .spin {
          animation: request-spin 0.9s linear infinite;
        }

        @keyframes request-spin {
          to {
            transform: rotate(360deg);
          }
        }

        .request-message {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 18px;
          padding: 11px 14px;
          border: 1px solid #bbf7d0;
          border-radius: 11px;
          background: #f0fdf4;
          color: #166534;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .request-message button {
          margin-left: auto;
          border: 0;
          background: transparent;
          color: #64748b;
          font-size: 1.2rem;
          line-height: 1;
          cursor: pointer;
        }

        .request-stats {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
          margin-bottom: 18px;
        }

        .request-stat-card {
          display: flex;
          align-items: center;
          gap: 11px;
          min-height: 82px;
          padding: 14px;
          background: #fff;
          border: 1px solid #e8edf3;
          border-radius: 13px;
          box-shadow: 0 3px 14px rgba(15, 23, 42, 0.045);
        }

        .request-stat-icon {
          width: 39px;
          height: 39px;
          flex: 0 0 39px;
          display: grid;
          place-items: center;
          border-radius: 10px;
        }

        .request-stat-icon.blue {
          background: #eff6ff;
          color: #2563eb;
        }

        .request-stat-icon.orange {
          background: #fff7ed;
          color: #ea580c;
        }

        .request-stat-icon.green {
          background: #f0fdf4;
          color: #16a34a;
        }

        .request-stat-icon.red {
          background: #fef2f2;
          color: #dc2626;
        }

        .request-stat-icon.purple {
          background: #faf5ff;
          color: #9333ea;
        }

        .request-stat-card span {
          display: block;
          color: #64748b;
          font-size: 0.7rem;
          font-weight: 600;
          margin-bottom: 3px;
        }

        .request-stat-card strong {
          color: #0f172a;
          font-size: 1.35rem;
          line-height: 1;
          font-weight: 800;
        }

        .requests-card {
          background: #fff;
          border: 1px solid #e5eaf0;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 5px 22px rgba(15, 23, 42, 0.055);
        }

        .requests-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 18px 20px;
          border-bottom: 1px solid #eef2f6;
        }

        .requests-card-header h2 {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0;
          color: #172033;
          font-size: 1rem;
          font-weight: 800;
        }

        .requests-card-header h2 svg {
          color: #dc2626;
        }

        .requests-card-header p {
          margin: 4px 0 0;
          color: #94a3b8;
          font-size: 0.76rem;
        }

        .request-count {
          padding: 6px 10px;
          border-radius: 7px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #475569;
          font-size: 0.72rem;
          font-weight: 700;
          white-space: nowrap;
        }

        .requests-table-wrapper {
          width: 100%;
          overflow-x: auto;
        }

        .premium-requests-table {
          width: 100%;
          min-width: 1050px;
          border-collapse: collapse;
        }

        .premium-requests-table th {
          padding: 11px 13px;
          background: #f8fafc;
          color: #64748b;
          border-bottom: 1px solid #e8edf3;
          font-size: 0.68rem;
          font-weight: 800;
          text-align: left;
          text-transform: uppercase;
          letter-spacing: 0.055em;
          white-space: nowrap;
        }

        .premium-requests-table td {
          padding: 13px;
          border-bottom: 1px solid #f1f5f9;
          color: #334155;
          font-size: 0.78rem;
          vertical-align: middle;
        }

        .premium-requests-table tbody tr {
          transition: background 0.18s ease;
        }

        .premium-requests-table tbody tr:hover {
          background: #fafcff;
        }

        .premium-requests-table tbody tr:last-child td {
          border-bottom: 0;
        }

        .patient-cell {
          display: flex;
          align-items: center;
          gap: 9px;
          min-width: 150px;
        }

        .patient-avatar {
          width: 32px;
          height: 32px;
          display: grid;
          place-items: center;
          flex: 0 0 32px;
          border-radius: 9px;
          background: #fef2f2;
          color: #dc2626;
        }

        .patient-cell strong {
          display: block;
          color: #1e293b;
          font-size: 0.78rem;
          font-weight: 750;
        }

        .patient-cell small {
          display: block;
          max-width: 145px;
          margin-top: 2px;
          color: #94a3b8;
          font-size: 0.64rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .blood-group-cell {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: #b91c1c;
        }

        .blood-group-cell strong {
          font-size: 0.82rem;
        }

        .blood-drop {
          width: 27px;
          height: 27px;
          display: grid;
          place-items: center;
          border-radius: 7px;
          background: #fef2f2;
          color: #dc2626;
        }

        .units-cell {
          min-width: 92px;
        }

        .units-cell strong {
          display: block;
          color: #1e293b;
          font-size: 0.78rem;
        }

        .units-cell strong span {
          color: #94a3b8;
          font-weight: 600;
        }

        .units-progress {
          width: 75px;
          height: 4px;
          margin-top: 5px;
          overflow: hidden;
          border-radius: 99px;
          background: #e2e8f0;
        }

        .units-progress span {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: #dc2626;
          transition: width 0.3s ease;
        }

        .units-cell small {
          display: block;
          margin-top: 3px;
          color: #94a3b8;
          font-size: 0.58rem;
        }

        .request-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 8px;
          border-radius: 7px;
          font-size: 0.65rem;
          font-weight: 800;
          text-transform: capitalize;
          white-space: nowrap;
        }

        .request-badge.critical {
          background: #fef2f2;
          color: #b91c1c;
        }

        .request-badge.urgent {
          background: #fff7ed;
          color: #c2410c;
        }

        .request-badge.high {
          background: #fffbeb;
          color: #a16207;
        }

        .request-badge.normal {
          background: #f1f5f9;
          color: #64748b;
        }

        .request-badge.pending {
          background: #fff7ed;
          color: #c2410c;
        }

        .request-badge.fulfilled {
          background: #f0fdf4;
          color: #15803d;
        }

        .request-badge.rejected {
          background: #fef2f2;
          color: #b91c1c;
        }

        .hospital-cell,
        .date-cell {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #64748b;
        }

        .hospital-cell svg,
        .date-cell svg {
          color: #94a3b8;
          flex: 0 0 auto;
        }

        .hospital-cell span {
          max-width: 130px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .request-actions {
          display: flex;
          align-items: center;
          gap: 5px;
          flex-wrap: wrap;
        }

        .action-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          min-height: 30px;
          padding: 6px 9px;
          border-radius: 7px;
          border: 1px solid transparent;
          font-size: 0.66rem;
          font-weight: 750;
          cursor: pointer;
          transition: all 0.18s ease;
        }

        .action-btn.fulfill {
          background: #f0fdf4;
          border-color: #bbf7d0;
          color: #15803d;
        }

        .action-btn.fulfill:hover {
          background: #dcfce7;
          border-color: #86efac;
          transform: translateY(-1px);
        }

        .action-btn.reject {
          background: #fef2f2;
          border-color: #fecaca;
          color: #b91c1c;
        }

        .action-btn.reject:hover {
          background: #fee2e2;
          border-color: #fca5a5;
          transform: translateY(-1px);
        }

        .no-action {
          color: #94a3b8;
          font-size: 0.66rem;
          font-weight: 600;
        }

        .requests-loading {
          min-height: 250px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          color: #64748b;
          font-size: 0.82rem;
        }

        .requests-loading svg {
          color: #dc2626;
        }

        .requests-empty {
          min-height: 250px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 30px;
        }

        .empty-icon {
          width: 58px;
          height: 58px;
          display: grid;
          place-items: center;
          margin-bottom: 12px;
          border-radius: 15px;
          background: #f8fafc;
          color: #94a3b8;
        }

        .requests-empty h3 {
          margin: 0;
          color: #334155;
          font-size: 0.95rem;
        }

        .requests-empty p {
          margin: 5px 0 0;
          color: #94a3b8;
          font-size: 0.76rem;
        }

        .requests-footer-note {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          margin-top: 12px;
          color: #94a3b8;
          font-size: 0.68rem;
        }

        .requests-footer-note svg {
          color: #16a34a;
        }

        @media (max-width: 1050px) {
          .request-stats {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 700px) {
          .requests-page {
            padding: 20px 12px 35px;
          }

          .requests-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .refresh-btn {
            width: 100%;
            justify-content: center;
          }

          .request-stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .requests-card-header {
            align-items: flex-start;
            flex-direction: column;
            padding: 15px;
          }

          .request-count {
            align-self: flex-start;
          }

          .requests-footer-note {
            text-align: center;
          }
        }

        @media (max-width: 450px) {
          .request-stats {
            grid-template-columns: 1fr;
          }

          .request-stat-card {
            min-height: 70px;
          }

          .requests-header h1 {
            font-size: 1.55rem;
          }
        }
      `}</style>
    </div>
  );
}