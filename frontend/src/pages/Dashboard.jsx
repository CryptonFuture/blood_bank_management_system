import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Activity,
  AlertCircle,
  ArrowRight,
  BarChart3,
  BellRing,
  CheckCircle2,
  Droplets,
  HeartPulse,
  Package,
  Plus,
  RefreshCw,
  ShieldCheck,
  TrendingDown,
  Users,
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();

  const [inventory, setInventory] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/inventory'),
      api.get('/requests'),
    ])
      .then(([invRes, reqRes]) => {
        setInventory(invRes.data.inventory || []);
        setAnalytics(invRes.data.analytics);
        setRequests(reqRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalUnits = inventory.reduce(
    (sum, item) => sum + Number(item.units || 0),
    0
  );

  const pendingRequests = requests.filter(
    (request) => request.status === 'pending'
  ).length;

  const criticalGroups = inventory.filter(
    (item) => Number(item.units || 0) < 5
  );

  const lowGroups = inventory.filter(
    (item) =>
      Number(item.units || 0) >= 5 &&
      Number(item.units || 0) < 10
  );

  const healthyGroups = inventory.filter(
    (item) => Number(item.units || 0) >= 10
  );

  const stockStatus = analytics?.status || 'healthy';

  const statusConfig = {
    critical: {
      label: 'Critical',
      icon: AlertCircle,
      className: 'status-critical',
    },
    warning: {
      label: 'Warning',
      icon: TrendingDown,
      className: 'status-warning',
    },
    healthy: {
      label: 'Healthy',
      icon: CheckCircle2,
      className: 'status-healthy',
    },
  };

  const currentStatus =
    statusConfig[stockStatus] || statusConfig.healthy;

  const StatusIcon = currentStatus.icon;

  const maxUnits = useMemo(() => {
    if (!inventory.length) return 10;
    return Math.max(
      ...inventory.map((item) => Number(item.units || 0)),
      10
    );
  }, [inventory]);

  const getStockState = (units) => {
    const value = Number(units || 0);

    if (value < 5) {
      return {
        label: 'Critical',
        className: 'stock-critical',
      };
    }

    if (value < 10) {
      return {
        label: 'Low',
        className: 'stock-low',
      };
    }

    return {
      label: 'Healthy',
      className: 'stock-healthy',
    };
  };

  return (
    <div className="dashboard-shell">
      <div className="dashboard-container">

        {/* Header */}
        <header className="dashboard-header">
          <div className="welcome-area">
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              Blood Bank Management
            </div>

            <h1>
              Welcome back,{' '}
              <span>{user?.name || 'User'}</span>
            </h1>

            <p>
              Monitor blood inventory, requests and donation activity
              from one place.
            </p>
          </div>

          <div className="header-actions">
            <Link
              to="/request-blood"
              className="dashboard-btn dashboard-btn-primary"
            >
              <Droplets size={17} />
              Request Blood
              <ArrowRight size={15} />
            </Link>

            {(user?.role === 'admin' ||
              user?.role === 'staff' ||
              user?.role === 'donor') && (
              <Link
                to="/record-donation"
                className="dashboard-btn dashboard-btn-success"
              >
                <Plus size={17} />
                Record Donation
              </Link>
            )}
          </div>
        </header>

        {/* KPI Cards */}
        <section className="kpi-grid">

          <div className="kpi-card">
            <div className="kpi-top">
              <div className="kpi-icon kpi-red">
                <Package size={20} />
              </div>

              <span className="kpi-mini-label">
                Inventory
              </span>
            </div>

            <div className="kpi-value">
              {loading ? '—' : totalUnits}
            </div>

            <div className="kpi-bottom">
              <span>Total blood units</span>
              <div className="kpi-indicator">
                <Activity size={13} />
                Live
              </div>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-top">
              <div className="kpi-icon kpi-orange">
                <BellRing size={20} />
              </div>

              <span className="kpi-mini-label">
                Requests
              </span>
            </div>

            <div className="kpi-value">
              {loading ? '—' : pendingRequests}
            </div>

            <div className="kpi-bottom">
              <span>Pending requests</span>

              <div className="kpi-indicator orange">
                <RefreshCw size={13} />
                Pending
              </div>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-top">
              <div
                className={`kpi-icon ${
                  criticalGroups.length
                    ? 'kpi-red'
                    : 'kpi-green'
                }`}
              >
                <HeartPulse size={20} />
              </div>

              <span className="kpi-mini-label">
                Attention
              </span>
            </div>

            <div
              className={`kpi-value ${
                criticalGroups.length
                  ? 'danger-value'
                  : 'success-value'
              }`}
            >
              {loading ? '—' : criticalGroups.length}
            </div>

            <div className="kpi-bottom">
              <span>Critical blood groups</span>

              <div
                className={`kpi-indicator ${
                  criticalGroups.length
                    ? 'red'
                    : 'green'
                }`}
              >
                {criticalGroups.length ? (
                  <>
                    <AlertCircle size={13} />
                    Action needed
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={13} />
                    All good
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-top">
              <div className="kpi-icon kpi-blue">
                <ShieldCheck size={20} />
              </div>

              <span className="kpi-mini-label">
                Overall
              </span>
            </div>

            <div className={`stock-status-big ${currentStatus.className}`}>
              <StatusIcon size={18} />
              {currentStatus.label}
            </div>

            <div className="kpi-bottom">
              <span>Current stock status</span>

              <div className="kpi-indicator blue">
                <BarChart3 size={13} />
                Analytics
              </div>
            </div>
          </div>
        </section>

        {/* Critical Alert */}
        {criticalGroups.length > 0 && (
          <div className="critical-alert">
            <div className="critical-alert-icon">
              <AlertCircle size={21} />
            </div>

            <div className="critical-alert-content">
              <strong>Critical stock alert</strong>

              <p>
                The following blood groups require urgent
                attention:{' '}
                <b>
                  {criticalGroups
                    .map(
                      (group) =>
                        `${group.bloodGroup} (${group.units} units)`
                    )
                    .join(', ')}
                </b>
              </p>
            </div>

            <Link
              to="/record-donation"
              className="alert-action"
            >
              Arrange Donation
              <ArrowRight size={15} />
            </Link>
          </div>
        )}

        {/* Main Content */}
        <div className="dashboard-main-grid">

          {/* Blood Stock */}
          <section className="dashboard-card stock-section">
            <div className="card-heading">
              <div>
                <div className="section-label">
                  <Droplets size={15} />
                  INVENTORY
                </div>

                <h2>Blood Stock Overview</h2>

                <p>
                  Current availability by blood group
                </p>
              </div>

              <div className="stock-summary">
                <span className="summary-number">
                  {totalUnits}
                </span>
                <span>Total Units</span>
              </div>
            </div>

            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner" />
                <span>Loading inventory...</span>
              </div>
            ) : inventory.length === 0 ? (
              <div className="empty-state">
                <Droplets size={30} />
                <strong>No inventory data</strong>
                <span>
                  Blood stock information is currently unavailable.
                </span>
              </div>
            ) : (
              <div className="blood-grid-premium">
                {inventory.map((item) => {
                  const units = Number(item.units || 0);
                  const state = getStockState(units);
                  const percentage = Math.min(
                    100,
                    Math.max(
                      4,
                      (units / maxUnits) * 100
                    )
                  );

                  return (
                    <div
                      key={item.bloodGroup}
                      className={`blood-stock-card ${state.className}`}
                    >
                      <div className="blood-card-top">
                        <div className="blood-type">
                          {item.bloodGroup}
                        </div>

                        <span className="stock-badge">
                          {state.label}
                        </span>
                      </div>

                      <div className="blood-units-row">
                        <strong>{units}</strong>
                        <span>units</span>
                      </div>

                      <div className="stock-progress">
                        <div
                          className="stock-progress-fill"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />
                      </div>

                      <div className="stock-card-footer">
                        <span>Available</span>
                        {units < 5 && (
                          <span className="urgent-text">
                            Urgent
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {!loading && inventory.length > 0 && (
              <div className="inventory-footer">
                <div className="legend-item">
                  <span className="legend-dot legend-green" />
                  Healthy ({healthyGroups.length})
                </div>

                <div className="legend-item">
                  <span className="legend-dot legend-orange" />
                  Low ({lowGroups.length})
                </div>

                <div className="legend-item">
                  <span className="legend-dot legend-red" />
                  Critical ({criticalGroups.length})
                </div>
              </div>
            )}
          </section>

          {/* Side Panel */}
          <aside className="dashboard-side">

            {/* Quick Actions */}
            <div className="dashboard-card quick-card">
              <div className="side-card-heading">
                <div>
                  <div className="section-label">
                    <Activity size={14} />
                    ACTIONS
                  </div>
                  <h3>Quick Actions</h3>
                </div>
              </div>

              <Link
                to="/request-blood"
                className="quick-action"
              >
                <div className="quick-action-icon red">
                  <Droplets size={18} />
                </div>

                <div>
                  <strong>Request Blood</strong>
                  <span>Create a new blood request</span>
                </div>

                <ArrowRight size={16} />
              </Link>

              {(user?.role === 'admin' ||
                user?.role === 'staff' ||
                user?.role === 'donor') && (
                <Link
                  to="/record-donation"
                  className="quick-action"
                >
                  <div className="quick-action-icon green">
                    <Plus size={18} />
                  </div>

                  <div>
                    <strong>Record Donation</strong>
                    <span>Add a new donation record</span>
                  </div>

                  <ArrowRight size={16} />
                </Link>
              )}

              <Link
                to="/requests"
                className="quick-action"
              >
                <div className="quick-action-icon blue">
                  <Users size={18} />
                </div>

                <div>
                  <strong>View Requests</strong>
                  <span>Manage blood requests</span>
                </div>

                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Priority Collection */}
            {analytics?.priority_collection && (
              <div className="dashboard-card priority-card">
                <div className="side-card-heading">
                  <div>
                    <div className="section-label warning-label">
                      <TrendingDown size={14} />
                      PRIORITY
                    </div>

                    <h3>Collection Priority</h3>
                  </div>
                </div>

                <div className="priority-list">
                  {analytics.priority_collection.map(
                    (item, index) => (
                      <div
                        key={item.bloodGroup}
                        className={`priority-item ${
                          index === 0
                            ? 'priority-first'
                            : ''
                        }`}
                      >
                        <div className="priority-rank">
                          {index + 1}
                        </div>

                        <div className="priority-info">
                          <strong>
                            {item.bloodGroup}
                          </strong>
                          <span>
                            {item.units} units available
                          </span>
                        </div>

                        {index === 0 && (
                          <span className="priority-urgent">
                            Urgent
                          </span>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

          </aside>
        </div>

        {/* Request Summary */}
        <section className="dashboard-card request-summary-card">
          <div className="request-summary-left">
            <div className="request-summary-icon">
              <Users size={21} />
            </div>

            <div>
              <div className="section-label">
                REQUEST MANAGEMENT
              </div>

              <h3>Blood Request Activity</h3>

              <p>
                Keep track of incoming blood requests and
                their current status.
              </p>
            </div>
          </div>

          <div className="request-summary-stats">
            <div>
              <strong>{requests.length}</strong>
              <span>Total Requests</span>
            </div>

            <div className="summary-divider" />

            <div>
              <strong className="pending-number">
                {pendingRequests}
              </strong>
              <span>Pending</span>
            </div>

            <Link
              to="/requests"
              className="view-requests-btn"
            >
              View Requests
              <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      </div>

      <style>{`
        .dashboard-shell {
          min-height: calc(100vh - 70px);
          background:
            radial-gradient(
              circle at 15% 5%,
              rgba(220, 38, 38, 0.035),
              transparent 28%
            ),
            #f7f8fa;
          padding: 30px 20px 50px;
        }

        .dashboard-container {
          width: 100%;
          max-width: 1180px;
          margin: 0 auto;
        }

        .dashboard-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 26px;
        }

        .welcome-area {
          min-width: 0;
        }

        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #dc2626;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: .11em;
          text-transform: uppercase;
          margin-bottom: 9px;
        }

        .eyebrow-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #dc2626;
          box-shadow: 0 0 0 5px rgba(220,38,38,.08);
        }

        .welcome-area h1 {
          margin: 0;
          color: #111827;
          font-size: clamp(25px, 3vw, 34px);
          line-height: 1.15;
          letter-spacing: -.035em;
          font-weight: 800;
        }

        .welcome-area h1 span {
          color: #dc2626;
        }

        .welcome-area p {
          margin: 8px 0 0;
          color: #6b7280;
          font-size: 13px;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 9px;
          flex-shrink: 0;
        }

        .dashboard-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 42px;
          padding: 0 15px;
          border-radius: 10px;
          text-decoration: none;
          font-size: 12px;
          font-weight: 700;
          transition: .2s ease;
        }

        .dashboard-btn:hover {
          transform: translateY(-1px);
        }

        .dashboard-btn-primary {
          color: white;
          background: #dc2626;
          box-shadow: 0 7px 18px rgba(220,38,38,.17);
        }

        .dashboard-btn-primary:hover {
          background: #b91c1c;
        }

        .dashboard-btn-success {
          color: #166534;
          background: #ecfdf3;
          border: 1px solid #bbf7d0;
        }

        .dashboard-btn-success:hover {
          background: #dcfce7;
        }

        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin-bottom: 17px;
        }

        .kpi-card {
          position: relative;
          overflow: hidden;
          background: rgba(255,255,255,.96);
          border: 1px solid #e9ebef;
          border-radius: 15px;
          padding: 17px;
          box-shadow: 0 5px 20px rgba(15,23,42,.045);
        }

        .kpi-card::after {
          content: "";
          position: absolute;
          width: 70px;
          height: 70px;
          border-radius: 50%;
          right: -32px;
          bottom: -35px;
          background: rgba(220,38,38,.035);
        }

        .kpi-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 13px;
        }

        .kpi-icon {
          width: 39px;
          height: 39px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 11px;
        }

        .kpi-red {
          color: #dc2626;
          background: #fef2f2;
        }

        .kpi-orange {
          color: #d97706;
          background: #fffbeb;
        }

        .kpi-green {
          color: #16a34a;
          background: #f0fdf4;
        }

        .kpi-blue {
          color: #2563eb;
          background: #eff6ff;
        }

        .kpi-mini-label {
          color: #9ca3af;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .06em;
          text-transform: uppercase;
        }

        .kpi-value {
          color: #111827;
          font-size: 28px;
          line-height: 1;
          font-weight: 800;
          letter-spacing: -.04em;
          margin-bottom: 12px;
        }

        .danger-value {
          color: #dc2626;
        }

        .success-value {
          color: #16a34a;
        }

        .stock-status-big {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 20px;
          font-weight: 800;
          line-height: 1;
          margin: 4px 0 15px;
        }

        .status-critical {
          color: #dc2626;
        }

        .status-warning {
          color: #d97706;
        }

        .status-healthy {
          color: #16a34a;
        }

        .kpi-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 7px;
          color: #9ca3af;
          font-size: 10px;
          position: relative;
          z-index: 1;
        }

        .kpi-indicator {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: #16a34a;
          font-weight: 700;
        }

        .kpi-indicator.orange {
          color: #d97706;
        }

        .kpi-indicator.red {
          color: #dc2626;
        }

        .kpi-indicator.green {
          color: #16a34a;
        }

        .kpi-indicator.blue {
          color: #2563eb;
        }

        .critical-alert {
          display: flex;
          align-items: center;
          gap: 13px;
          padding: 13px 15px;
          margin-bottom: 17px;
          background: #fffafa;
          border: 1px solid #fecaca;
          border-radius: 13px;
          box-shadow: 0 4px 14px rgba(220,38,38,.045);
        }

        .critical-alert-icon {
          flex: 0 0 38px;
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #dc2626;
          background: #fee2e2;
          border-radius: 10px;
        }

        .critical-alert-content {
          flex: 1;
          min-width: 0;
        }

        .critical-alert-content strong {
          display: block;
          color: #991b1b;
          font-size: 12px;
          margin-bottom: 3px;
        }

        .critical-alert-content p {
          margin: 0;
          color: #7f1d1d;
          font-size: 11px;
          line-height: 1.5;
        }

        .alert-action {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #b91c1c;
          font-size: 11px;
          font-weight: 800;
          text-decoration: none;
          white-space: nowrap;
        }

        .dashboard-main-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.7fr) minmax(280px, .8fr);
          gap: 17px;
          align-items: start;
        }

        .dashboard-card {
          background: rgba(255,255,255,.97);
          border: 1px solid #e8eaee;
          border-radius: 15px;
          box-shadow: 0 5px 22px rgba(15,23,42,.045);
        }

        .stock-section {
          padding: 20px;
        }

        .card-heading {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 19px;
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

        .card-heading h2,
        .side-card-heading h3,
        .request-summary-left h3 {
          margin: 0;
          color: #111827;
          font-weight: 800;
          letter-spacing: -.025em;
        }

        .card-heading h2 {
          font-size: 18px;
        }

        .card-heading p {
          margin: 4px 0 0;
          color: #9ca3af;
          font-size: 11px;
        }

        .stock-summary {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          color: #9ca3af;
          font-size: 9px;
          white-space: nowrap;
        }

        .summary-number {
          color: #111827;
          font-size: 20px;
          font-weight: 800;
          line-height: 1.1;
        }

        .blood-grid-premium {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }

        .blood-stock-card {
          padding: 13px;
          border-radius: 12px;
          background: #fafafa;
          border: 1px solid #edf0f2;
          transition: transform .2s ease, box-shadow .2s ease;
        }

        .blood-stock-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 18px rgba(15,23,42,.07);
        }

        .stock-critical {
          background: #fffafa;
          border-color: #fecaca;
        }

        .stock-low {
          background: #fffdf8;
          border-color: #fde68a;
        }

        .stock-healthy {
          background: #fbfffc;
        }

        .blood-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 6px;
        }

        .blood-type {
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          color: #991b1b;
          background: #fee2e2;
          font-size: 12px;
          font-weight: 900;
        }

        .stock-badge {
          padding: 4px 7px;
          border-radius: 999px;
          color: #6b7280;
          background: #f3f4f6;
          font-size: 8px;
          font-weight: 800;
          text-transform: uppercase;
        }

        .stock-critical .stock-badge {
          color: #b91c1c;
          background: #fee2e2;
        }

        .stock-low .stock-badge {
          color: #a16207;
          background: #fef3c7;
        }

        .stock-healthy .stock-badge {
          color: #15803d;
          background: #dcfce7;
        }

        .blood-units-row {
          display: flex;
          align-items: baseline;
          gap: 5px;
          margin-top: 13px;
        }

        .blood-units-row strong {
          color: #111827;
          font-size: 23px;
          line-height: 1;
          font-weight: 800;
          letter-spacing: -.04em;
        }

        .blood-units-row span {
          color: #9ca3af;
          font-size: 9px;
        }

        .stock-progress {
          height: 5px;
          overflow: hidden;
          background: #edf0f2;
          border-radius: 999px;
          margin-top: 12px;
        }

        .stock-progress-fill {
          height: 100%;
          border-radius: inherit;
          background: #16a34a;
        }

        .stock-critical .stock-progress-fill {
          background: #dc2626;
        }

        .stock-low .stock-progress-fill {
          background: #d97706;
        }

        .stock-card-footer {
          display: flex;
          justify-content: space-between;
          margin-top: 7px;
          color: #9ca3af;
          font-size: 8px;
        }

        .urgent-text {
          color: #dc2626;
          font-weight: 800;
        }

        .inventory-footer {
          display: flex;
          align-items: center;
          gap: 17px;
          margin-top: 17px;
          padding-top: 13px;
          border-top: 1px solid #f0f1f3;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #9ca3af;
          font-size: 9px;
        }

        .legend-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .legend-green {
          background: #16a34a;
        }

        .legend-orange {
          background: #d97706;
        }

        .legend-red {
          background: #dc2626;
        }

        .loading-state {
          min-height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 9px;
          color: #9ca3af;
          font-size: 11px;
        }

        .loading-spinner {
          width: 26px;
          height: 26px;
          border: 3px solid #fee2e2;
          border-top-color: #dc2626;
          border-radius: 50%;
          animation: dashboard-spin .8s linear infinite;
        }

        @keyframes dashboard-spin {
          to {
            transform: rotate(360deg);
          }
        }

        .empty-state {
          min-height: 190px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 7px;
          color: #9ca3af;
          text-align: center;
        }

        .empty-state strong {
          color: #4b5563;
          font-size: 12px;
        }

        .empty-state span {
          font-size: 10px;
        }

        .dashboard-side {
          display: flex;
          flex-direction: column;
          gap: 17px;
        }

        .quick-card,
        .priority-card {
          padding: 18px;
        }

        .side-card-heading {
          margin-bottom: 13px;
        }

        .side-card-heading h3 {
          font-size: 15px;
        }

        .quick-action {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 11px 0;
          color: inherit;
          text-decoration: none;
          border-bottom: 1px solid #f1f2f4;
        }

        .quick-action:last-child {
          border-bottom: 0;
        }

        .quick-action > svg {
          color: #cbd0d7;
          flex-shrink: 0;
        }

        .quick-action-icon {
          flex: 0 0 35px;
          width: 35px;
          height: 35px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 9px;
        }

        .quick-action-icon.red {
          color: #dc2626;
          background: #fef2f2;
        }

        .quick-action-icon.green {
          color: #16a34a;
          background: #f0fdf4;
        }

        .quick-action-icon.blue {
          color: #2563eb;
          background: #eff6ff;
        }

        .quick-action div:nth-child(2) {
          flex: 1;
          min-width: 0;
        }

        .quick-action strong {
          display: block;
          color: #374151;
          font-size: 10px;
          margin-bottom: 2px;
        }

        .quick-action span {
          display: block;
          color: #9ca3af;
          font-size: 9px;
        }

        .warning-label {
          color: #d97706;
        }

        .priority-list {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .priority-item {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 9px;
          border-radius: 10px;
          background: #fafafa;
        }

        .priority-first {
          background: #fff7f7;
          border: 1px solid #fee2e2;
        }

        .priority-rank {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 7px;
          color: #6b7280;
          background: #f1f3f5;
          font-size: 9px;
          font-weight: 800;
        }

        .priority-first .priority-rank {
          color: #dc2626;
          background: #fee2e2;
        }

        .priority-info {
          flex: 1;
          min-width: 0;
        }

        .priority-info strong {
          display: block;
          color: #374151;
          font-size: 11px;
        }

        .priority-info span {
          display: block;
          color: #9ca3af;
          font-size: 8px;
          margin-top: 2px;
        }

        .priority-urgent {
          color: #dc2626;
          background: #fee2e2;
          padding: 4px 6px;
          border-radius: 999px;
          font-size: 7px;
          font-weight: 800;
        }

        .request-summary-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 25px;
          margin-top: 17px;
          padding: 18px 20px;
        }

        .request-summary-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .request-summary-icon {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #2563eb;
          background: #eff6ff;
          border-radius: 10px;
        }

        .request-summary-left h3 {
          font-size: 14px;
        }

        .request-summary-left p {
          margin: 3px 0 0;
          color: #9ca3af;
          font-size: 10px;
        }

        .request-summary-stats {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .request-summary-stats > div:not(.summary-divider) {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .request-summary-stats strong {
          color: #111827;
          font-size: 19px;
          line-height: 1;
        }

        .request-summary-stats span {
          color: #9ca3af;
          font-size: 8px;
          margin-top: 4px;
        }

        .pending-number {
          color: #d97706 !important;
        }

        .summary-divider {
          width: 1px;
          height: 30px;
          background: #e5e7eb;
        }

        .view-requests-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 11px;
          color: #374151;
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 9px;
          text-decoration: none;
          font-size: 9px;
          font-weight: 800;
          white-space: nowrap;
          transition: .2s ease;
        }

        .view-requests-btn:hover {
          color: #dc2626;
          border-color: #fecaca;
          background: #fffafa;
        }

        @media (max-width: 1050px) {
          .kpi-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .blood-grid-premium {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 850px) {
          .dashboard-main-grid {
            grid-template-columns: 1fr;
          }

          .dashboard-side {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 700px) {
          .dashboard-shell {
            padding: 20px 13px 35px;
          }

          .dashboard-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .header-actions {
            width: 100%;
          }

          .dashboard-btn {
            flex: 1;
          }

          .critical-alert {
            align-items: flex-start;
            flex-wrap: wrap;
          }

          .alert-action {
            margin-left: 51px;
          }

          .request-summary-card {
            align-items: flex-start;
            flex-direction: column;
          }

          .request-summary-stats {
            width: 100%;
            justify-content: space-between;
          }
        }

        @media (max-width: 560px) {
          .kpi-grid {
            grid-template-columns: 1fr 1fr;
            gap: 9px;
          }

          .kpi-card {
            padding: 13px;
          }

          .kpi-value {
            font-size: 23px;
          }

          .stock-status-big {
            font-size: 16px;
          }

          .dashboard-side {
            grid-template-columns: 1fr;
          }

          .blood-grid-premium {
            grid-template-columns: repeat(2, 1fr);
          }

          .inventory-footer {
            flex-wrap: wrap;
            gap: 9px 14px;
          }

          .request-summary-left p {
            display: none;
          }

          .request-summary-stats {
            gap: 10px;
          }
        }

        @media (max-width: 400px) {
          .header-actions {
            flex-direction: column;
          }

          .dashboard-btn {
            width: 100%;
          }

          .blood-grid-premium {
            grid-template-columns: 1fr 1fr;
          }

          .stock-section {
            padding: 14px;
          }
        }
      `}</style>
    </div>
  );
}