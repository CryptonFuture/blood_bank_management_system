import { useEffect, useState } from 'react';
import {
  CalendarDays,
  CheckCircle2,
  Droplets,
  Filter,
  MapPin,
  Phone,
  RefreshCw,
  Search,
  ShieldCheck,
  UserRound,
  Users,
  XCircle,
} from 'lucide-react';
import api from '../services/api';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function Donors() {
  const [donors, setDonors] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = filter
      ? `/donors/search?bloodGroup=${filter}`
      : '/donors';

    setLoading(true);

    api
      .get(url)
      .then(res => setDonors(res.data))
      .finally(() => setLoading(false));
  }, [filter]);

  const eligibleCount = donors.filter(d => d.isEligible).length;
  const unavailableCount = donors.filter(d => !d.isEligible).length;

  const getInitials = name => {
    if (!name) return 'D';

    return name
      .split(' ')
      .slice(0, 2)
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  const getBloodClass = bloodGroup => {
    if (!bloodGroup) return 'unknown';

    return `blood-${bloodGroup
      .replace('+', 'pos')
      .replace('-', 'neg')}`;
  };

  return (
    <div className="donors-page">
      <div className="donors-shell">

        {/* Header */}
        <div className="donors-header">

          <div>
            <div className="donors-eyebrow">
              <Droplets size={15} />
              Blood Bank Management
            </div>

            <h1>Donors</h1>

            <p>
              Manage registered blood donors and check their
              donation eligibility.
            </p>
          </div>

          <div className="donor-filter">

            <div className="filter-label">
              <Filter size={13} />
              Blood Group
            </div>

            <div className="filter-select">
              <Search size={15} />

              <select
                value={filter}
                onChange={e => setFilter(e.target.value)}
              >
                <option value="">All Blood Groups</option>

                {BLOOD_GROUPS.map(bg => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* Stats */}
        <div className="donor-stats">

          <div className="donor-stat-card">
            <div className="donor-stat-icon blue">
              <Users size={20} />
            </div>

            <div>
              <span>Total Donors</span>
              <strong>{donors.length}</strong>
            </div>
          </div>

          <div className="donor-stat-card">
            <div className="donor-stat-icon green">
              <CheckCircle2 size={20} />
            </div>

            <div>
              <span>Eligible</span>
              <strong>{eligibleCount}</strong>
            </div>
          </div>

          <div className="donor-stat-card">
            <div className="donor-stat-icon red">
              <XCircle size={20} />
            </div>

            <div>
              <span>Not Eligible</span>
              <strong>{unavailableCount}</strong>
            </div>
          </div>

          <div className="donor-stat-card">
            <div className="donor-stat-icon purple">
              <Droplets size={20} />
            </div>

            <div>
              <span>Filter</span>
              <strong>{filter || 'All'}</strong>
            </div>
          </div>

        </div>

        {/* Main Card */}
        <div className="donors-card">

          <div className="donors-card-header">

            <div>
              <h2>
                <Users size={19} />
                Donor Directory
              </h2>

              <p>
                Registered donors available in the blood bank
                network.
              </p>
            </div>

            <div className="donor-count">
              {donors.length}{' '}
              {donors.length === 1 ? 'Donor' : 'Donors'}
            </div>

          </div>

          {loading ? (
            <div className="donors-loading">
              <RefreshCw size={27} className="donor-spin" />
              <span>Loading donors...</span>
            </div>
          ) : donors.length === 0 ? (
            <div className="donors-empty">

              <div className="empty-donor-icon">
                <Users size={30} />
              </div>

              <h3>No donors found</h3>

              <p>
                No donors are available for the selected
                blood group.
              </p>

              {filter && (
                <button
                  type="button"
                  className="clear-filter-btn"
                  onClick={() => setFilter('')}
                >
                  Clear Filter
                </button>
              )}

            </div>
          ) : (
            <div className="donors-table-wrapper">

              <table className="premium-donors-table">

                <thead>
                  <tr>
                    <th>Donor</th>
                    <th>Blood Group</th>
                    <th>Phone</th>
                    <th>City</th>
                    <th>Last Donation</th>
                    <th>Eligibility</th>
                  </tr>
                </thead>

                <tbody>
                  {donors.map(d => (
                    <tr key={d._id}>

                      {/* Donor */}
                      <td>
                        <div className="donor-person">

                          <div className="donor-avatar">
                            {getInitials(d.name)}
                          </div>

                          <div>
                            <strong>
                              {d.name || 'Unknown Donor'}
                            </strong>

                            <small>
                              Registered Donor
                            </small>
                          </div>

                        </div>
                      </td>

                      {/* Blood */}
                      <td>
                        <div className="blood-group-wrapper">

                          <span
                            className={`blood-icon ${getBloodClass(
                              d.bloodGroup
                            )}`}
                          >
                            <Droplets size={14} />
                          </span>

                          <span className="blood-group">
                            {d.bloodGroup || '-'}
                          </span>

                        </div>
                      </td>

                      {/* Phone */}
                      <td>
                        <div className="donor-contact">

                          <Phone size={15} />

                          <span>
                            {d.phone || '-'}
                          </span>

                        </div>
                      </td>

                      {/* City */}
                      <td>
                        <div className="donor-contact">

                          <MapPin size={15} />

                          <span>
                            {d.city || '-'}
                          </span>

                        </div>
                      </td>

                      {/* Last Donation */}
                      <td>
                        <div className="donation-date">

                          <CalendarDays size={15} />

                          <div>
                            <span>
                              {d.lastDonationDate
                                ? new Date(
                                    d.lastDonationDate
                                  ).toLocaleDateString()
                                : 'Never'}
                            </span>

                            {!d.lastDonationDate && (
                              <small>
                                No previous donation
                              </small>
                            )}
                          </div>

                        </div>
                      </td>

                      {/* Eligibility */}
                      <td>
                        {d.isEligible ? (
                          <span className="eligible-badge">
                            <CheckCircle2 size={14} />
                            Eligible
                          </span>
                        ) : (
                          <span className="not-eligible-badge">
                            <XCircle size={14} />
                            Not Eligible
                          </span>
                        )}
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}

        </div>

        {!loading && donors.length > 0 && (
          <div className="donors-footer-note">
            <ShieldCheck size={15} />
            Donor eligibility information is maintained by the
            blood bank system.
          </div>
        )}

      </div>

      <style>{`
        .donors-page {
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

        .donors-shell {
          width: 100%;
          max-width: 1150px;
          margin: 0 auto;
        }

        .donors-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 20px;
        }

        .donors-eyebrow {
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

        .donors-header h1 {
          margin: 0;
          color: #0f172a;
          font-size: clamp(1.7rem, 3vw, 2.1rem);
          font-weight: 800;
          letter-spacing: -0.04em;
        }

        .donors-header p {
          margin: 7px 0 0;
          color: #64748b;
          font-size: 0.88rem;
        }

        .donor-filter {
          min-width: 190px;
        }

        .filter-label {
          display: flex;
          align-items: center;
          gap: 5px;
          margin-bottom: 6px;
          color: #64748b;
          font-size: 0.67rem;
          font-weight: 750;
        }

        .filter-select {
          position: relative;
        }

        .filter-select > svg {
          position: absolute;
          top: 50%;
          left: 11px;
          color: #94a3b8;
          pointer-events: none;
          transform: translateY(-50%);
        }

        .filter-select select {
          width: 100%;
          height: 40px;
          padding: 0 10px 0 33px;
          border: 1px solid #dfe5ec;
          border-radius: 9px;
          background: #fff;
          color: #334155;
          font-family: inherit;
          font-size: 0.75rem;
          font-weight: 650;
          outline: none;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.035);
        }

        .filter-select select:focus {
          border-color: #f87171;
          box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.07);
        }

        .donor-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-bottom: 18px;
        }

        .donor-stat-card {
          display: flex;
          align-items: center;
          gap: 11px;
          min-height: 78px;
          padding: 13px;
          background: #fff;
          border: 1px solid #e8edf3;
          border-radius: 13px;
          box-shadow: 0 3px 14px rgba(15, 23, 42, 0.045);
        }

        .donor-stat-icon {
          width: 39px;
          height: 39px;
          flex: 0 0 39px;
          display: grid;
          place-items: center;
          border-radius: 10px;
        }

        .donor-stat-icon.blue {
          background: #eff6ff;
          color: #2563eb;
        }

        .donor-stat-icon.green {
          background: #f0fdf4;
          color: #16a34a;
        }

        .donor-stat-icon.red {
          background: #fef2f2;
          color: #dc2626;
        }

        .donor-stat-icon.purple {
          background: #faf5ff;
          color: #9333ea;
        }

        .donor-stat-card span {
          display: block;
          margin-bottom: 3px;
          color: #64748b;
          font-size: 0.68rem;
          font-weight: 600;
        }

        .donor-stat-card strong {
          color: #0f172a;
          font-size: 1.25rem;
          font-weight: 800;
          line-height: 1;
        }

        .donors-card {
          overflow: hidden;
          background: #fff;
          border: 1px solid #e5eaf0;
          border-radius: 15px;
          box-shadow: 0 5px 22px rgba(15, 23, 42, 0.055);
        }

        .donors-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 18px 20px;
          border-bottom: 1px solid #eef2f6;
        }

        .donors-card-header h2 {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0;
          color: #172033;
          font-size: 1rem;
          font-weight: 800;
        }

        .donors-card-header h2 svg {
          color: #dc2626;
        }

        .donors-card-header p {
          margin: 4px 0 0;
          color: #94a3b8;
          font-size: 0.72rem;
        }

        .donor-count {
          padding: 6px 10px;
          border: 1px solid #e2e8f0;
          border-radius: 7px;
          background: #f8fafc;
          color: #475569;
          font-size: 0.7rem;
          font-weight: 750;
          white-space: nowrap;
        }

        .donors-table-wrapper {
          width: 100%;
          overflow-x: auto;
        }

        .premium-donors-table {
          width: 100%;
          min-width: 850px;
          border-collapse: collapse;
        }

        .premium-donors-table th {
          padding: 11px 14px;
          border-bottom: 1px solid #e8edf3;
          background: #f8fafc;
          color: #64748b;
          font-size: 0.67rem;
          font-weight: 800;
          text-align: left;
          text-transform: uppercase;
          letter-spacing: 0.055em;
          white-space: nowrap;
        }

        .premium-donors-table td {
          padding: 13px 14px;
          border-bottom: 1px solid #f1f5f9;
          color: #334155;
          font-size: 0.77rem;
          vertical-align: middle;
        }

        .premium-donors-table tbody tr {
          transition: background 0.18s ease;
        }

        .premium-donors-table tbody tr:hover {
          background: #fafcff;
        }

        .premium-donors-table tbody tr:last-child td {
          border-bottom: 0;
        }

        .donor-person {
          display: flex;
          align-items: center;
          gap: 9px;
          min-width: 155px;
        }

        .donor-avatar {
          width: 34px;
          height: 34px;
          flex: 0 0 34px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: linear-gradient(
            135deg,
            #fef2f2,
            #fee2e2
          );
          color: #b91c1c;
          font-size: 0.65rem;
          font-weight: 850;
        }

        .donor-person strong {
          display: block;
          max-width: 145px;
          overflow: hidden;
          color: #1e293b;
          font-size: 0.78rem;
          font-weight: 750;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .donor-person small {
          display: block;
          margin-top: 2px;
          color: #94a3b8;
          font-size: 0.61rem;
        }

        .blood-group-wrapper {
          display: inline-flex;
          align-items: center;
          gap: 7px;
        }

        .blood-icon {
          width: 27px;
          height: 27px;
          display: grid;
          place-items: center;
          border-radius: 7px;
        }

        .blood-Apos,
        .blood-Bpos,
        .blood-ABpos,
        .blood-Opos {
          background: #fef2f2;
          color: #dc2626;
        }

        .blood-Aneg,
        .blood-Bneg,
        .blood-ABneg,
        .blood-Oneg {
          background: #fff7ed;
          color: #ea580c;
        }

        .blood-icon.unknown {
          background: #f1f5f9;
          color: #64748b;
        }

        .blood-group {
          color: #b91c1c;
          font-size: 0.8rem;
          font-weight: 800;
        }

        .donor-contact {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #64748b;
        }

        .donor-contact svg {
          flex: 0 0 auto;
          color: #94a3b8;
        }

        .donation-date {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .donation-date > svg {
          flex: 0 0 auto;
          color: #94a3b8;
        }

        .donation-date span {
          display: block;
          color: #475569;
        }

        .donation-date small {
          display: block;
          margin-top: 2px;
          color: #94a3b8;
          font-size: 0.58rem;
        }

        .eligible-badge,
        .not-eligible-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 8px;
          border-radius: 7px;
          font-size: 0.65rem;
          font-weight: 800;
          white-space: nowrap;
        }

        .eligible-badge {
          background: #f0fdf4;
          color: #15803d;
        }

        .not-eligible-badge {
          background: #fef2f2;
          color: #b91c1c;
        }

        .donors-loading {
          min-height: 250px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 9px;
          color: #64748b;
          font-size: 0.8rem;
        }

        .donors-loading svg {
          color: #dc2626;
        }

        .donor-spin {
          animation: donor-spin 0.9s linear infinite;
        }

        @keyframes donor-spin {
          to {
            transform: rotate(360deg);
          }
        }

        .donors-empty {
          min-height: 250px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 30px;
          text-align: center;
        }

        .empty-donor-icon {
          width: 58px;
          height: 58px;
          display: grid;
          place-items: center;
          margin-bottom: 12px;
          border-radius: 15px;
          background: #f8fafc;
          color: #94a3b8;
        }

        .donors-empty h3 {
          margin: 0;
          color: #334155;
          font-size: 0.95rem;
        }

        .donors-empty p {
          margin: 5px 0 13px;
          color: #94a3b8;
          font-size: 0.74rem;
        }

        .clear-filter-btn {
          padding: 7px 11px;
          border: 1px solid #e2e8f0;
          border-radius: 7px;
          background: #fff;
          color: #475569;
          font-size: 0.67rem;
          font-weight: 700;
          cursor: pointer;
        }

        .clear-filter-btn:hover {
          background: #f8fafc;
        }

        .donors-footer-note {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-top: 12px;
          color: #94a3b8;
          font-size: 0.65rem;
        }

        .donors-footer-note svg {
          color: #16a34a;
        }

        @media (max-width: 850px) {
          .donor-stats {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 650px) {
          .donors-page {
            padding: 20px 12px 35px;
          }

          .donors-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .donor-filter {
            width: 100%;
          }

          .donor-stats {
            grid-template-columns: 1fr 1fr;
          }

          .donors-card-header {
            align-items: flex-start;
            flex-direction: column;
            padding: 15px;
          }

          .donor-count {
            align-self: flex-start;
          }
        }

        @media (max-width: 430px) {
          .donor-stats {
            grid-template-columns: 1fr;
          }

          .donors-header h1 {
            font-size: 1.55rem;
          }
        }
      `}</style>
    </div>
  );
}