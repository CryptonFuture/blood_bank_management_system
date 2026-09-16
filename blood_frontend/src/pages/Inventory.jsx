import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Activity,
  AlertCircle,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  Droplets,
  Minus,
  Package,
  Plus,
  RefreshCw,
  Settings2,
  ShieldCheck,
  TrendingDown,
  XCircle,
} from 'lucide-react';

export default function Inventory() {
  const { user } = useAuth();

  const [inventory, setInventory] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adjust, setAdjust] = useState({
    bloodGroup: '',
    units: 0,
    operation: 'add',
  });
  const [msg, setMsg] = useState('');

  const load = () => {
    setLoading(true);

    api
      .get('/inventory')
      .then((res) => {
        setInventory(res.data.inventory || []);
        setAnalytics(res.data.analytics);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdjust = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/inventory/${adjust.bloodGroup}`, {
        units: Number(adjust.units),
        operation: adjust.operation,
      });

      setMsg('Stock updated successfully');

      setAdjust({
        bloodGroup: '',
        units: 0,
        operation: 'add',
      });

      load();

      setTimeout(() => {
        setMsg('');
      }, 3500);
    } catch (err) {
      setMsg(
        err.response?.data?.message || 'Update failed'
      );
    }
  };

  const totalUnits = useMemo(
    () =>
      inventory.reduce(
        (sum, item) => sum + Number(item.units || 0),
        0
      ),
    [inventory]
  );

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

  const maxUnits = useMemo(() => {
    if (!inventory.length) return 10;

    return Math.max(
      ...inventory.map((item) =>
        Number(item.units || 0)
      ),
      10
    );
  }, [inventory]);

  const getStockInfo = (units) => {
    const value = Number(units || 0);

    if (value < 5) {
      return {
        label: 'Critical',
        className: 'inventory-critical',
        colorClass: 'critical-text',
      };
    }

    if (value < 10) {
      return {
        label: 'Low Stock',
        className: 'inventory-low',
        colorClass: 'low-text',
      };
    }

    return {
      label: 'Healthy',
      className: 'inventory-healthy',
      colorClass: 'healthy-text',
    };
  };

  const status = analytics?.status || 'healthy';

  const statusConfig = {
    critical: {
      label: 'Critical',
      icon: XCircle,
      className: 'status-critical',
    },
    warning: {
      label: 'Warning',
      icon: AlertCircle,
      className: 'status-warning',
    },
    healthy: {
      label: 'Healthy',
      icon: CheckCircle2,
      className: 'status-healthy',
    },
  };

  const currentStatus =
    statusConfig[status] || statusConfig.healthy;

  const StatusIcon = currentStatus.icon;

  return (
    <div className="inventory-shell">
      <div className="inventory-container">

        {/* Header */}
        <div className="inventory-header">
          <div>
            <div className="inventory-eyebrow">
              <span className="inventory-dot" />
              INVENTORY MANAGEMENT
            </div>

            <h1>Blood Inventory</h1>

            <p>
              Monitor blood availability and manage stock
              levels across all blood groups.
            </p>
          </div>

          <div className="inventory-header-status">
            <div className="header-status-icon">
              <StatusIcon size={17} />
            </div>

            <div>
              <span>Overall Status</span>
              <strong className={currentStatus.className}>
                {currentStatus.label}
              </strong>
            </div>
          </div>
        </div>

        {/* Message */}
        {msg && (
          <div
            className={`inventory-message ${
              msg.toLowerCase().includes('failed')
                ? 'message-error'
                : 'message-success'
            }`}
          >
            {msg.toLowerCase().includes('failed') ? (
              <XCircle size={17} />
            ) : (
              <CheckCircle2 size={17} />
            )}

            <span>{msg}</span>

            <button
              type="button"
              onClick={() => setMsg('')}
              className="message-close"
            >
              ×
            </button>
          </div>
        )}

        {/* Summary */}
        <div className="inventory-summary-grid">

          <div className="inventory-summary-card">
            <div className="summary-icon red">
              <Package size={20} />
            </div>

            <div>
              <span>Total Units</span>
              <strong>
                {loading ? '—' : totalUnits}
              </strong>
              <small>Available inventory</small>
            </div>
          </div>

          <div className="inventory-summary-card">
            <div className="summary-icon orange">
              <TrendingDown size={20} />
            </div>

            <div>
              <span>Low Stock</span>
              <strong className="low-text">
                {loading ? '—' : lowGroups.length}
              </strong>
              <small>Groups need attention</small>
            </div>
          </div>

          <div className="inventory-summary-card">
            <div className="summary-icon red">
              <AlertCircle size={20} />
            </div>

            <div>
              <span>Critical</span>
              <strong className="critical-text">
                {loading ? '—' : criticalGroups.length}
              </strong>
              <small>Urgent collection required</small>
            </div>
          </div>

          <div className="inventory-summary-card">
            <div className="summary-icon green">
              <ShieldCheck size={20} />
            </div>

            <div>
              <span>Healthy Groups</span>
              <strong className="healthy-text">
                {loading ? '—' : healthyGroups.length}
              </strong>
              <small>Good availability</small>
            </div>
          </div>

        </div>

        {/* Inventory */}
        <section className="inventory-card">

          <div className="inventory-card-header">
            <div>
              <div className="section-label">
                <Droplets size={14} />
                BLOOD STOCK
              </div>

              <h2>Current Blood Availability</h2>

              <p>
                Real-time inventory by blood group
              </p>
            </div>

            <button
              type="button"
              className="refresh-btn"
              onClick={load}
              title="Refresh inventory"
            >
              <RefreshCw
                size={15}
                className={loading ? 'refresh-spin' : ''}
              />
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="inventory-loading">
              <div className="inventory-spinner" />
              <span>Loading blood inventory...</span>
            </div>
          ) : inventory.length === 0 ? (
            <div className="inventory-empty">
              <Droplets size={32} />
              <strong>No inventory available</strong>
              <span>
                Blood stock information is currently empty.
              </span>
            </div>
          ) : (
            <div className="inventory-grid">
              {inventory.map((item) => {
                const units = Number(item.units || 0);
                const stock = getStockInfo(units);

                const percentage = Math.min(
                  100,
                  Math.max(
                    5,
                    (units / maxUnits) * 100
                  )
                );

                return (
                  <div
                    key={item.bloodGroup}
                    className={`inventory-stock-card ${stock.className}`}
                  >
                    <div className="stock-card-header">
                      <div className="blood-type-badge">
                        {item.bloodGroup}
                      </div>

                      <span className="stock-status">
                        {stock.label}
                      </span>
                    </div>

                    <div className="stock-value">
                      <strong>{units}</strong>
                      <span>units</span>
                    </div>

                    <div className="stock-progress">
                      <div
                        className="stock-progress-value"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>

                    <div className="stock-footer">
                      <span>Available</span>

                      {units < 5 ? (
                        <span className="urgent-label">
                          Urgent
                        </span>
                      ) : units < 10 ? (
                        <span className="low-label">
                          Refill soon
                        </span>
                      ) : (
                        <span className="healthy-label">
                          Good
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!loading && inventory.length > 0 && (
            <div className="inventory-legend">
              <div>
                <span className="legend green" />
                Healthy
                <b>{healthyGroups.length}</b>
              </div>

              <div>
                <span className="legend orange" />
                Low
                <b>{lowGroups.length}</b>
              </div>

              <div>
                <span className="legend red" />
                Critical
                <b>{criticalGroups.length}</b>
              </div>
            </div>
          )}
        </section>

        {/* Adjust Stock */}
        {(user?.role === 'admin' ||
          user?.role === 'staff') && (
          <section className="inventory-card adjust-card">

            <div className="inventory-card-header">
              <div>
                <div className="section-label">
                  <Settings2 size={14} />
                  STOCK CONTROL
                </div>

                <h2>Adjust Inventory</h2>

                <p>
                  Add, subtract or set an exact stock
                  quantity.
                </p>
              </div>

              <div className="adjust-icon">
                <Package size={18} />
              </div>
            </div>

            <form
              onSubmit={handleAdjust}
              className="adjust-form"
            >

              <div className="premium-form-group">
                <label>Blood Group</label>

                <div className="premium-select">
                  <Droplets size={16} />

                  <select
                    value={adjust.bloodGroup}
                    onChange={(e) =>
                      setAdjust({
                        ...adjust,
                        bloodGroup: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">
                      Select blood group
                    </option>

                    {inventory.map((item) => (
                      <option
                        key={item.bloodGroup}
                        value={item.bloodGroup}
                      >
                        {item.bloodGroup}
                      </option>
                    ))}
                  </select>

                  <ChevronDown size={15} />
                </div>
              </div>

              <div className="premium-form-group">
                <label>Operation</label>

                <div className="operation-options">

                  <button
                    type="button"
                    className={
                      adjust.operation === 'add'
                        ? 'operation-btn active add'
                        : 'operation-btn'
                    }
                    onClick={() =>
                      setAdjust({
                        ...adjust,
                        operation: 'add',
                      })
                    }
                  >
                    <Plus size={15} />
                    Add
                  </button>

                  <button
                    type="button"
                    className={
                      adjust.operation === 'subtract'
                        ? 'operation-btn active subtract'
                        : 'operation-btn'
                    }
                    onClick={() =>
                      setAdjust({
                        ...adjust,
                        operation: 'subtract',
                      })
                    }
                  >
                    <Minus size={15} />
                    Subtract
                  </button>

                  <button
                    type="button"
                    className={
                      adjust.operation === 'set'
                        ? 'operation-btn active set'
                        : 'operation-btn'
                    }
                    onClick={() =>
                      setAdjust({
                        ...adjust,
                        operation: 'set',
                      })
                    }
                  >
                    <RefreshCw size={14} />
                    Set
                  </button>

                </div>
              </div>

              <div className="premium-form-group units-group">
                <label>Units</label>

                <div className="units-input">
                  <Activity size={16} />

                  <input
                    type="number"
                    min="0"
                    value={adjust.units}
                    onChange={(e) =>
                      setAdjust({
                        ...adjust,
                        units: e.target.value,
                      })
                    }
                    required
                  />

                  <span>units</span>
                </div>
              </div>

              <button
                type="submit"
                className="update-stock-btn"
              >
                <CheckCircle2 size={17} />
                Update Stock
              </button>

            </form>
          </section>
        )}

        {/* Analytics */}
        {analytics && (
          <section className="inventory-card analytics-card">

            <div className="inventory-card-header">
              <div>
                <div className="section-label analytics-label">
                  <BarChart3 size={14} />
                  PYTHON ANALYTICS
                </div>

                <h2>Inventory Analytics</h2>

                <p>
                  Stock analysis generated by the Python
                  service.
                </p>
              </div>

              <div
                className={`analytics-status ${currentStatus.className}`}
              >
                <StatusIcon size={14} />
                {currentStatus.label}
              </div>
            </div>

            <div className="analytics-grid">

              <div className="analytics-stat">
                <span>Total Units</span>
                <strong>
                  {analytics.total_units ?? 0}
                </strong>
                <small>
                  Current inventory
                </small>
              </div>

              <div className="analytics-stat">
                <span>Low Stock Groups</span>
                <strong className="low-text">
                  {analytics.low_stock?.length || 0}
                </strong>
                <small>
                  Below healthy level
                </small>
              </div>

              <div className="analytics-stat">
                <span>Critical Groups</span>
                <strong className="critical-text">
                  {analytics.critical?.length || 0}
                </strong>
                <small>
                  Urgent attention
                </small>
              </div>

            </div>

            {analytics.low_stock?.length > 0 && (
              <div className="analytics-list-block">
                <div className="analytics-list-title">
                  <TrendingDown size={15} />
                  Low Stock
                </div>

                <div className="analytics-tags">
                  {analytics.low_stock.map((item) => (
                    <span
                      key={item.bloodGroup}
                      className="analytics-tag low"
                    >
                      <strong>
                        {item.bloodGroup}
                      </strong>
                      {item.units} units
                    </span>
                  ))}
                </div>
              </div>
            )}

            {analytics.critical?.length > 0 && (
              <div className="analytics-list-block critical-block">
                <div className="analytics-list-title">
                  <AlertCircle size={15} />
                  Critical Stock
                </div>

                <div className="analytics-tags">
                  {analytics.critical.map((item) => (
                    <span
                      key={item.bloodGroup}
                      className="analytics-tag critical"
                    >
                      <strong>
                        {item.bloodGroup}
                      </strong>
                      {item.units} units
                    </span>
                  ))}
                </div>
              </div>
            )}

          </section>
        )}
      </div>

      <style>{`
        .inventory-shell {
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

        .inventory-container {
          width: 100%;
          max-width: 1180px;
          margin: 0 auto;
        }

        .inventory-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 25px;
          margin-bottom: 23px;
        }

        .inventory-eyebrow {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #dc2626;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .12em;
          margin-bottom: 8px;
        }

        .inventory-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #dc2626;
          box-shadow: 0 0 0 5px rgba(220, 38, 38, .08);
        }

        .inventory-header h1 {
          margin: 0;
          color: #111827;
          font-size: 30px;
          line-height: 1.15;
          font-weight: 800;
          letter-spacing: -.04em;
        }

        .inventory-header p {
          margin: 7px 0 0;
          color: #8b929d;
          font-size: 12px;
        }

        .inventory-header-status {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 9px 13px;
          background: #fff;
          border: 1px solid #e7e9ed;
          border-radius: 11px;
          box-shadow: 0 4px 15px rgba(15,23,42,.035);
        }

        .header-status-icon {
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #16a34a;
          background: #f0fdf4;
          border-radius: 9px;
        }

        .inventory-header-status span {
          display: block;
          color: #9ca3af;
          font-size: 8px;
          text-transform: uppercase;
          letter-spacing: .06em;
          font-weight: 700;
        }

        .inventory-header-status strong {
          display: block;
          font-size: 11px;
          margin-top: 2px;
        }

        .status-critical,
        .critical-text {
          color: #dc2626 !important;
        }

        .status-warning,
        .low-text {
          color: #d97706 !important;
        }

        .status-healthy,
        .healthy-text {
          color: #16a34a !important;
        }

        .inventory-message {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 11px 13px;
          margin-bottom: 16px;
          border-radius: 11px;
          font-size: 11px;
          font-weight: 600;
        }

        .message-success {
          color: #166534;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
        }

        .message-error {
          color: #991b1b;
          background: #fef2f2;
          border: 1px solid #fecaca;
        }

        .message-close {
          margin-left: auto;
          border: 0;
          background: transparent;
          color: inherit;
          font-size: 19px;
          line-height: 1;
          cursor: pointer;
          opacity: .6;
        }

        .inventory-summary-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 13px;
          margin-bottom: 17px;
        }

        .inventory-summary-card {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 15px;
          background: #fff;
          border: 1px solid #e8eaee;
          border-radius: 14px;
          box-shadow: 0 5px 20px rgba(15,23,42,.04);
        }

        .summary-icon {
          width: 40px;
          height: 40px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
        }

        .summary-icon.red {
          color: #dc2626;
          background: #fef2f2;
        }

        .summary-icon.orange {
          color: #d97706;
          background: #fffbeb;
        }

        .summary-icon.green {
          color: #16a34a;
          background: #f0fdf4;
        }

        .inventory-summary-card span {
          display: block;
          color: #9ca3af;
          font-size: 9px;
          font-weight: 700;
        }

        .inventory-summary-card strong {
          display: block;
          margin-top: 2px;
          color: #111827;
          font-size: 22px;
          line-height: 1.1;
          font-weight: 800;
          letter-spacing: -.03em;
        }

        .inventory-summary-card small {
          display: block;
          color: #b0b5bd;
          font-size: 8px;
          margin-top: 3px;
        }

        .inventory-card {
          background: rgba(255,255,255,.97);
          border: 1px solid #e8eaee;
          border-radius: 15px;
          padding: 20px;
          margin-bottom: 17px;
          box-shadow: 0 5px 22px rgba(15,23,42,.045);
        }

        .inventory-card-header {
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

        .inventory-card-header h2 {
          margin: 0;
          color: #111827;
          font-size: 18px;
          font-weight: 800;
          letter-spacing: -.025em;
        }

        .inventory-card-header p {
          margin: 4px 0 0;
          color: #9ca3af;
          font-size: 10px;
        }

        .refresh-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 10px;
          color: #6b7280;
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 9px;
          font-weight: 700;
          cursor: pointer;
          transition: .2s ease;
        }

        .refresh-btn:hover {
          color: #dc2626;
          border-color: #fecaca;
          background: #fffafa;
        }

        .refresh-spin {
          animation: inventory-spin .8s linear infinite;
        }

        @keyframes inventory-spin {
          to {
            transform: rotate(360deg);
          }
        }

        .inventory-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }

        .inventory-stock-card {
          padding: 13px;
          border: 1px solid #edf0f2;
          border-radius: 12px;
          background: #fbfbfc;
          transition: .2s ease;
        }

        .inventory-stock-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 18px rgba(15,23,42,.07);
        }

        .inventory-stock-card.inventory-critical {
          border-color: #fecaca;
          background: #fffafa;
        }

        .inventory-stock-card.inventory-low {
          border-color: #fde68a;
          background: #fffdf8;
        }

        .inventory-stock-card.inventory-healthy {
          background: #fbfffc;
        }

        .stock-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 6px;
        }

        .blood-type-badge {
          width: 39px;
          height: 39px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #991b1b;
          background: #fee2e2;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 900;
        }

        .stock-status {
          padding: 4px 7px;
          border-radius: 999px;
          color: #6b7280;
          background: #f1f3f5;
          font-size: 7px;
          font-weight: 800;
          text-transform: uppercase;
        }

        .inventory-critical .stock-status {
          color: #b91c1c;
          background: #fee2e2;
        }

        .inventory-low .stock-status {
          color: #a16207;
          background: #fef3c7;
        }

        .inventory-healthy .stock-status {
          color: #15803d;
          background: #dcfce7;
        }

        .stock-value {
          display: flex;
          align-items: baseline;
          gap: 5px;
          margin-top: 13px;
        }

        .stock-value strong {
          color: #111827;
          font-size: 24px;
          line-height: 1;
          font-weight: 800;
          letter-spacing: -.04em;
        }

        .stock-value span {
          color: #9ca3af;
          font-size: 9px;
        }

        .stock-progress {
          height: 5px;
          overflow: hidden;
          margin-top: 12px;
          background: #edf0f2;
          border-radius: 999px;
        }

        .stock-progress-value {
          height: 100%;
          border-radius: inherit;
          background: #16a34a;
        }

        .inventory-critical .stock-progress-value {
          background: #dc2626;
        }

        .inventory-low .stock-progress-value {
          background: #d97706;
        }

        .stock-footer {
          display: flex;
          justify-content: space-between;
          margin-top: 7px;
          color: #9ca3af;
          font-size: 8px;
        }

        .urgent-label {
          color: #dc2626;
          font-weight: 800;
        }

        .low-label {
          color: #d97706;
          font-weight: 800;
        }

        .healthy-label {
          color: #16a34a;
          font-weight: 800;
        }

        .inventory-legend {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-top: 17px;
          padding-top: 13px;
          border-top: 1px solid #f0f1f3;
        }

        .inventory-legend > div {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #9ca3af;
          font-size: 9px;
        }

        .inventory-legend b {
          color: #4b5563;
        }

        .legend {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .legend.green {
          background: #16a34a;
        }

        .legend.orange {
          background: #d97706;
        }

        .legend.red {
          background: #dc2626;
        }

        .inventory-loading,
        .inventory-empty {
          min-height: 190px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 8px;
          color: #9ca3af;
          font-size: 10px;
        }

        .inventory-empty strong {
          color: #4b5563;
          font-size: 12px;
        }

        .inventory-spinner {
          width: 27px;
          height: 27px;
          border: 3px solid #fee2e2;
          border-top-color: #dc2626;
          border-radius: 50%;
          animation: inventory-spin .8s linear infinite;
        }

        .adjust-card {
          overflow: hidden;
        }

        .adjust-icon {
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #dc2626;
          background: #fef2f2;
          border-radius: 10px;
        }

        .adjust-form {
          display: grid;
          grid-template-columns: 1.1fr 1.35fr .75fr auto;
          gap: 11px;
          align-items: end;
        }

        .premium-form-group {
          min-width: 0;
        }

        .premium-form-group > label {
          display: block;
          margin-bottom: 6px;
          color: #4b5563;
          font-size: 9px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: .05em;
        }

        .premium-select,
        .units-input {
          height: 42px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 11px;
          background: #fafbfc;
          border: 1px solid #e5e7eb;
          border-radius: 9px;
          color: #9ca3af;
        }

        .premium-select:focus-within,
        .units-input:focus-within {
          border-color: #fca5a5;
          box-shadow: 0 0 0 3px rgba(220,38,38,.07);
          background: #fff;
        }

        .premium-select select {
          width: 100%;
          height: 100%;
          border: 0;
          outline: 0;
          appearance: none;
          background: transparent;
          color: #374151;
          font-size: 11px;
          cursor: pointer;
        }

        .premium-select svg:last-child {
          flex-shrink: 0;
        }

        .units-input input {
          width: 100%;
          min-width: 0;
          border: 0;
          outline: 0;
          background: transparent;
          color: #111827;
          font-size: 13px;
          font-weight: 700;
        }

        .units-input span {
          color: #9ca3af;
          font-size: 9px;
          white-space: nowrap;
        }

        .operation-options {
          display: flex;
          gap: 5px;
          height: 42px;
          padding: 4px;
          background: #f7f8fa;
          border: 1px solid #e5e7eb;
          border-radius: 9px;
        }

        .operation-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          min-width: 0;
          border: 0;
          border-radius: 6px;
          background: transparent;
          color: #8b929d;
          font-size: 9px;
          font-weight: 700;
          cursor: pointer;
          transition: .2s ease;
        }

        .operation-btn.active.add {
          color: #15803d;
          background: #dcfce7;
        }

        .operation-btn.active.subtract {
          color: #b91c1c;
          background: #fee2e2;
        }

        .operation-btn.active.set {
          color: #2563eb;
          background: #dbeafe;
        }

        .update-stock-btn {
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 0 15px;
          color: #fff;
          background: #dc2626;
          border: 0;
          border-radius: 9px;
          font-size: 10px;
          font-weight: 800;
          cursor: pointer;
          white-space: nowrap;
          box-shadow: 0 7px 17px rgba(220,38,38,.15);
          transition: .2s ease;
        }

        .update-stock-btn:hover {
          background: #b91c1c;
          transform: translateY(-1px);
        }

        .analytics-label {
          color: #2563eb;
        }

        .analytics-status {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 9px;
          border-radius: 999px;
          background: #f0fdf4;
          font-size: 9px;
          font-weight: 800;
        }

        .analytics-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-bottom: 16px;
        }

        .analytics-stat {
          padding: 13px;
          background: #fafbfc;
          border: 1px solid #edf0f2;
          border-radius: 10px;
        }

        .analytics-stat span {
          display: block;
          color: #9ca3af;
          font-size: 9px;
          font-weight: 700;
        }

        .analytics-stat strong {
          display: block;
          margin-top: 5px;
          color: #111827;
          font-size: 22px;
          line-height: 1;
          font-weight: 800;
        }

        .analytics-stat small {
          display: block;
          margin-top: 5px;
          color: #b0b5bd;
          font-size: 8px;
        }

        .analytics-list-block {
          padding-top: 13px;
          border-top: 1px solid #f0f1f3;
        }

        .analytics-list-block + .analytics-list-block {
          margin-top: 13px;
        }

        .critical-block {
          border-top-color: #fee2e2;
        }

        .analytics-list-title {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 9px;
          color: #6b7280;
          font-size: 10px;
          font-weight: 800;
        }

        .critical-block .analytics-list-title {
          color: #dc2626;
        }

        .analytics-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .analytics-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 9px;
          border-radius: 8px;
          font-size: 8px;
        }

        .analytics-tag.low {
          color: #92400e;
          background: #fffbeb;
          border: 1px solid #fde68a;
        }

        .analytics-tag.critical {
          color: #991b1b;
          background: #fef2f2;
          border: 1px solid #fecaca;
        }

        .analytics-tag strong {
          font-size: 9px;
        }

        @media (max-width: 1050px) {
          .inventory-summary-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .inventory-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .adjust-form {
            grid-template-columns: 1fr 1fr;
          }

          .update-stock-btn {
            width: 100%;
          }
        }

        @media (max-width: 650px) {
          .inventory-shell {
            padding: 20px 13px 35px;
          }

          .inventory-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .inventory-header-status {
            width: 100%;
            box-sizing: border-box;
          }

          .inventory-summary-grid {
            grid-template-columns: 1fr 1fr;
            gap: 9px;
          }

          .inventory-summary-card {
            padding: 12px;
          }

          .summary-icon {
            width: 35px;
            height: 35px;
          }

          .inventory-card {
            padding: 14px;
          }

          .inventory-card-header {
            align-items: flex-start;
          }

          .inventory-card-header h2 {
            font-size: 16px;
          }

          .inventory-grid {
            grid-template-columns: 1fr 1fr;
          }

          .adjust-form {
            grid-template-columns: 1fr;
          }

          .operation-options {
            width: 100%;
          }

          .analytics-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 430px) {
          .inventory-header h1 {
            font-size: 26px;
          }

          .inventory-grid {
            gap: 8px;
          }

          .inventory-stock-card {
            padding: 10px;
          }

          .blood-type-badge {
            width: 34px;
            height: 34px;
            font-size: 10px;
          }

          .stock-status {
            font-size: 6px;
            padding: 3px 5px;
          }

          .inventory-legend {
            flex-wrap: wrap;
            gap: 8px 15px;
          }

          .refresh-btn {
            padding: 7px;
          }

          .refresh-btn {
            font-size: 0;
          }
        }
      `}</style>
    </div>
  );
}