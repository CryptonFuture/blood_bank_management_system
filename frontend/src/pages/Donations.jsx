import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  Activity,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Droplets,
  Package,
  Plus,
  RefreshCw,
  ShieldCheck,
  Syringe,
} from 'lucide-react';

export default function Donations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/donations')
      .then(res => setDonations(res.data))
      .finally(() => setLoading(false));
  }, []);

  const totalUnits = useMemo(
    () =>
      donations.reduce(
        (sum, donation) => sum + Number(donation.units || 0),
        0
      ),
    [donations]
  );

  const activeDonations = useMemo(
    () =>
      donations.filter(
        donation =>
          donation.status?.toLowerCase() === 'available' ||
          donation.status?.toLowerCase() === 'active'
      ).length,
    [donations]
  );

  const uniqueDonors = useMemo(
    () =>
      new Set(
        donations
          .map(donation => donation.donor?._id || donation.donor?.name)
          .filter(Boolean)
      ).size,
    [donations]
  );

  const formatDate = date => {
    if (!date) return '-';

    return new Date(date).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusClass = status => {
    const value = status?.toLowerCase();

    if (
      value === 'available' ||
      value === 'active' ||
      value === 'approved'
    ) {
      return 'status-success';
    }

    if (
      value === 'expired' ||
      value === 'rejected' ||
      value === 'discarded'
    ) {
      return 'status-danger';
    }

    return 'status-warning';
  };

  const getBloodClass = bloodGroup => {
    if (!bloodGroup) return '';

    return bloodGroup.replace('+', 'pos').replace('-', 'neg');
  };

  return (
    <div className="donations-shell">
      <div className="donations-container">

        {/* Header */}
        <div className="donations-header">
          <div>
            <div className="donations-eyebrow">
              <span className="donations-dot" />
              BLOOD BANK MANAGEMENT
            </div>

            <h1>Donations</h1>

            <p>
              Track blood donations, donor information and
              inventory expiry status.
            </p>
          </div>

          <Link
            to="/record-donation"
            className="donation-primary-btn"
          >
            <Plus size={17} />
            Record Donation
          </Link>
        </div>

        {/* Summary */}
        <div className="donation-summary-grid">

          <div className="donation-summary-card">
            <div className="donation-summary-icon red">
              <Syringe size={20} />
            </div>

            <div>
              <span>Total Donations</span>
              <strong>
                {loading ? '—' : donations.length}
              </strong>
              <small>Recorded donations</small>
            </div>
          </div>

          <div className="donation-summary-card">
            <div className="donation-summary-icon blue">
              <Package size={20} />
            </div>

            <div>
              <span>Total Units</span>
              <strong>
                {loading ? '—' : totalUnits}
              </strong>
              <small>Blood units collected</small>
            </div>
          </div>

          <div className="donation-summary-card">
            <div className="donation-summary-icon green">
              <ShieldCheck size={20} />
            </div>

            <div>
              <span>Active Stock</span>
              <strong className="success-number">
                {loading ? '—' : activeDonations}
              </strong>
              <small>Currently available</small>
            </div>
          </div>

          <div className="donation-summary-card">
            <div className="donation-summary-icon purple">
              <Activity size={20} />
            </div>

            <div>
              <span>Unique Donors</span>
              <strong>
                {loading ? '—' : uniqueDonors}
              </strong>
              <small>Registered donors</small>
            </div>
          </div>

        </div>

        {/* Donations Table */}
        <section className="donations-card">

          <div className="donations-card-header">
            <div>
              <div className="section-label">
                <Droplets size={14} />
                DONATION RECORDS
              </div>

              <h2>Donation History</h2>

              <p>
                Complete overview of collected blood donations.
              </p>
            </div>

            <div className="record-count">
              <span>{donations.length}</span>
              Records
            </div>
          </div>

          {loading ? (
            <div className="donations-loading">
              <div className="donations-spinner" />
              <strong>Loading donations...</strong>
              <span>Please wait while records are fetched.</span>
            </div>
          ) : donations.length === 0 ? (
            <div className="donations-empty">
              <div className="empty-icon">
                <Droplets size={27} />
              </div>

              <strong>No donations recorded yet</strong>

              <span>
                Once a donation is recorded, it will appear
                here.
              </span>

              <Link
                to="/record-donation"
                className="empty-action"
              >
                <Plus size={15} />
                Record First Donation
              </Link>
            </div>
          ) : (
            <div className="premium-table-wrapper">
              <table className="premium-donations-table">
                <thead>
                  <tr>
                    <th>Bag ID</th>
                    <th>Donor</th>
                    <th>Blood Group</th>
                    <th>Units</th>
                    <th>Collection Date</th>
                    <th>Expiry Date</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {donations.map(donation => (
                    <tr key={donation._id}>

                      {/* Bag ID */}
                      <td>
                        <div className="bag-id">
                          <div className="bag-icon">
                            <Package size={14} />
                          </div>

                          <span>
                            {donation.bagId || '-'}
                          </span>
                        </div>
                      </td>

                      {/* Donor */}
                      <td>
                        <div className="donor-cell">
                          <div className="donor-avatar">
                            {donation.donor?.name
                              ?.charAt(0)
                              ?.toUpperCase() || 'D'}
                          </div>

                          <div>
                            <strong>
                              {donation.donor?.name || '-'}
                            </strong>

                            <span>Blood Donor</span>
                          </div>
                        </div>
                      </td>

                      {/* Blood Group */}
                      <td>
                        <div
                          className={`blood-group-pill ${getBloodClass(
                            donation.bloodGroup
                          )}`}
                        >
                          <Droplets size={13} />
                          {donation.bloodGroup || '-'}
                        </div>
                      </td>

                      {/* Units */}
                      <td>
                        <div className="units-cell">
                          <strong>
                            {donation.units || 0}
                          </strong>
                          <span>units</span>
                        </div>
                      </td>

                      {/* Collection */}
                      <td>
                        <div className="date-cell">
                          <CalendarDays size={14} />

                          <div>
                            <strong>
                              {formatDate(
                                donation.collectionDate
                              )}
                            </strong>

                            <span>Collected</span>
                          </div>
                        </div>
                      </td>

                      {/* Expiry */}
                      <td>
                        <div className="date-cell expiry">
                          <Clock3 size={14} />

                          <div>
                            <strong>
                              {formatDate(
                                donation.expiryDate
                              )}
                            </strong>

                            <span>Expiry</span>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td>
                        <span
                          className={`donation-status ${getStatusClass(
                            donation.status
                          )}`}
                        >
                          <span className="status-dot" />
                          {donation.status || 'Unknown'}
                        </span>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </section>
      </div>

      <style>{`
        .donations-shell {
          min-height: calc(100vh - 70px);
          padding: 30px 20px 50px;
          background:
            radial-gradient(
              circle at 12% 5%,
              rgba(220, 38, 38, .035),
              transparent 28%
            ),
            #f7f8fa;
        }

        .donations-container {
          width: 100%;
          max-width: 1180px;
          margin: 0 auto;
        }

        /* Header */

        .donations-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 25px;
          margin-bottom: 23px;
        }

        .donations-eyebrow {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #dc2626;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .12em;
          margin-bottom: 8px;
        }

        .donations-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #dc2626;
          box-shadow:
            0 0 0 5px rgba(220, 38, 38, .08);
        }

        .donations-header h1 {
          margin: 0;
          color: #111827;
          font-size: 30px;
          line-height: 1.15;
          font-weight: 800;
          letter-spacing: -.04em;
        }

        .donations-header p {
          margin: 7px 0 0;
          color: #8b929d;
          font-size: 12px;
        }

        .donation-primary-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 42px;
          padding: 0 15px;
          color: #fff;
          background: #16a34a;
          border-radius: 10px;
          text-decoration: none;
          font-size: 11px;
          font-weight: 800;
          box-shadow: 0 7px 18px rgba(22, 163, 74, .16);
          transition: .2s ease;
          white-space: nowrap;
        }

        .donation-primary-btn:hover {
          background: #15803d;
          transform: translateY(-1px);
        }

        /* Summary */

        .donation-summary-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 13px;
          margin-bottom: 17px;
        }

        .donation-summary-card {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 15px;
          background: #fff;
          border: 1px solid #e8eaee;
          border-radius: 14px;
          box-shadow: 0 5px 20px rgba(15,23,42,.04);
        }

        .donation-summary-icon {
          width: 40px;
          height: 40px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
        }

        .donation-summary-icon.red {
          color: #dc2626;
          background: #fef2f2;
        }

        .donation-summary-icon.blue {
          color: #2563eb;
          background: #eff6ff;
        }

        .donation-summary-icon.green {
          color: #16a34a;
          background: #f0fdf4;
        }

        .donation-summary-icon.purple {
          color: #7c3aed;
          background: #f5f3ff;
        }

        .donation-summary-card span {
          display: block;
          color: #9ca3af;
          font-size: 9px;
          font-weight: 700;
        }

        .donation-summary-card strong {
          display: block;
          margin-top: 2px;
          color: #111827;
          font-size: 22px;
          line-height: 1.1;
          font-weight: 800;
          letter-spacing: -.03em;
        }

        .donation-summary-card .success-number {
          color: #16a34a;
        }

        .donation-summary-card small {
          display: block;
          color: #b0b5bd;
          font-size: 8px;
          margin-top: 3px;
        }

        /* Main Card */

        .donations-card {
          background: rgba(255,255,255,.97);
          border: 1px solid #e8eaee;
          border-radius: 15px;
          padding: 20px;
          box-shadow: 0 5px 22px rgba(15,23,42,.045);
        }

        .donations-card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 18px;
        }

        .section-label {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #9ca3af;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: .12em;
          margin-bottom: 5px;
        }

        .donations-card-header h2 {
          margin: 0;
          color: #111827;
          font-size: 18px;
          font-weight: 800;
          letter-spacing: -.025em;
        }

        .donations-card-header p {
          margin: 4px 0 0;
          color: #9ca3af;
          font-size: 10px;
        }

        .record-count {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #9ca3af;
          font-size: 9px;
          white-space: nowrap;
        }

        .record-count span {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 24px;
          height: 24px;
          padding: 0 6px;
          color: #dc2626;
          background: #fef2f2;
          border-radius: 7px;
          font-size: 10px;
          font-weight: 800;
        }

        /* Table */

        .premium-table-wrapper {
          width: 100%;
          overflow-x: auto;
          border: 1px solid #edf0f2;
          border-radius: 12px;
        }

        .premium-donations-table {
          width: 100%;
          min-width: 900px;
          border-collapse: collapse;
        }

        .premium-donations-table thead {
          background: #fafbfc;
        }

        .premium-donations-table th {
          padding: 11px 13px;
          color: #8b929d;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: .06em;
          text-align: left;
          text-transform: uppercase;
          border-bottom: 1px solid #edf0f2;
          white-space: nowrap;
        }

        .premium-donations-table td {
          padding: 12px 13px;
          color: #374151;
          font-size: 10px;
          border-bottom: 1px solid #f0f1f3;
          vertical-align: middle;
        }

        .premium-donations-table tbody tr {
          transition: background .18s ease;
        }

        .premium-donations-table tbody tr:hover {
          background: #fffafa;
        }

        .premium-donations-table tbody tr:last-child td {
          border-bottom: 0;
        }

        /* Bag */

        .bag-id {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .bag-icon {
          width: 29px;
          height: 29px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6b7280;
          background: #f3f4f6;
          border-radius: 7px;
        }

        .bag-id span {
          color: #374151;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 9px;
          font-weight: 700;
          white-space: nowrap;
        }

        /* Donor */

        .donor-cell {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .donor-avatar {
          width: 31px;
          height: 31px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #991b1b;
          background: #fee2e2;
          border-radius: 9px;
          font-size: 11px;
          font-weight: 800;
        }

        .donor-cell strong {
          display: block;
          color: #374151;
          font-size: 10px;
          white-space: nowrap;
        }

        .donor-cell span {
          display: block;
          margin-top: 2px;
          color: #a1a7b0;
          font-size: 8px;
        }

        /* Blood */

        .blood-group-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 8px;
          color: #991b1b;
          background: #fef2f2;
          border: 1px solid #fee2e2;
          border-radius: 7px;
          font-size: 9px;
          font-weight: 800;
          white-space: nowrap;
        }

        /* Units */

        .units-cell {
          display: flex;
          align-items: baseline;
          gap: 4px;
        }

        .units-cell strong {
          color: #111827;
          font-size: 14px;
          font-weight: 800;
        }

        .units-cell span {
          color: #9ca3af;
          font-size: 8px;
        }

        /* Dates */

        .date-cell {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .date-cell > svg {
          flex-shrink: 0;
          color: #2563eb;
        }

        .date-cell.expiry > svg {
          color: #d97706;
        }

        .date-cell strong {
          display: block;
          color: #4b5563;
          font-size: 9px;
          font-weight: 700;
          white-space: nowrap;
        }

        .date-cell span {
          display: block;
          color: #a1a7b0;
          font-size: 7px;
          margin-top: 2px;
        }

        /* Status */

        .donation-status {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 8px;
          border-radius: 999px;
          font-size: 8px;
          font-weight: 800;
          text-transform: capitalize;
          white-space: nowrap;
        }

        .status-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
        }

        .status-success {
          color: #15803d;
          background: #dcfce7;
        }

        .status-success .status-dot {
          background: #16a34a;
        }

        .status-warning {
          color: #a16207;
          background: #fef3c7;
        }

        .status-warning .status-dot {
          background: #d97706;
        }

        .status-danger {
          color: #b91c1c;
          background: #fee2e2;
        }

        .status-danger .status-dot {
          background: #dc2626;
        }

        /* Loading */

        .donations-loading {
          min-height: 280px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 7px;
          color: #9ca3af;
          text-align: center;
        }

        .donations-loading strong {
          color: #4b5563;
          font-size: 12px;
        }

        .donations-loading span {
          font-size: 9px;
        }

        .donations-spinner {
          width: 28px;
          height: 28px;
          margin-bottom: 4px;
          border: 3px solid #fee2e2;
          border-top-color: #dc2626;
          border-radius: 50%;
          animation: donations-spin .8s linear infinite;
        }

        @keyframes donations-spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* Empty */

        .donations-empty {
          min-height: 280px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 7px;
          text-align: center;
        }

        .empty-icon {
          width: 54px;
          height: 54px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 5px;
          color: #dc2626;
          background: #fef2f2;
          border-radius: 15px;
        }

        .donations-empty strong {
          color: #374151;
          font-size: 13px;
        }

        .donations-empty > span {
          color: #9ca3af;
          font-size: 10px;
        }

        .empty-action {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 8px;
          padding: 8px 11px;
          color: #fff;
          background: #16a34a;
          border-radius: 8px;
          text-decoration: none;
          font-size: 9px;
          font-weight: 800;
        }

        @media (max-width: 1050px) {
          .donation-summary-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 650px) {
          .donations-shell {
            padding: 20px 13px 35px;
          }

          .donations-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .donation-primary-btn {
            width: 100%;
          }

          .donation-summary-grid {
            grid-template-columns: 1fr 1fr;
            gap: 9px;
          }

          .donation-summary-card {
            padding: 12px;
          }

          .donation-summary-icon {
            width: 35px;
            height: 35px;
          }

          .donations-card {
            padding: 14px;
          }

          .donations-card-header h2 {
            font-size: 16px;
          }

          .record-count {
            display: none;
          }

          .premium-table-wrapper {
            border-radius: 10px;
          }
        }

        @media (max-width: 430px) {
          .donations-header h1 {
            font-size: 26px;
          }

          .donation-summary-grid {
            grid-template-columns: 1fr;
          }

          .donation-summary-card {
            padding: 13px;
          }
        }
      `}</style>
    </div>
  );
}