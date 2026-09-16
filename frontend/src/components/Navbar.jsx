import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Activity,
  ChevronDown,
  ClipboardList,
  Droplets,
  HeartPulse,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  PlusCircle,
  UserRound,
  Users,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileOpen(false);
  };

  const isActive = path =>
    location.pathname === path ? 'active' : '';

  const closeMobile = () => setMobileOpen(false);

  const initials = user?.name
    ? user.name
        .split(' ')
        .slice(0, 2)
        .map(name => name.charAt(0))
        .join('')
        .toUpperCase()
    : 'U';

  const canDonate =
    user?.role === 'admin' ||
    user?.role === 'staff' ||
    user?.role === 'donor';

  const canViewDonors =
    user?.role === 'admin' ||
    user?.role === 'staff';

  const navItems = [
    {
      to: '/',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      to: '/inventory',
      label: 'Inventory',
      icon: Package,
    },
    {
      to: '/donations',
      label: 'Donations',
      icon: Droplets,
    },
    {
      to: '/requests',
      label: 'Requests',
      icon: ClipboardList,
    },
    {
      to: '/request-blood',
      label: 'Request Blood',
      icon: HeartPulse,
    },
  ];

  if (canDonate) {
    navItems.push({
      to: '/record-donation',
      label: 'Donate',
      icon: PlusCircle,
    });
  }

  if (canViewDonors) {
    navItems.push({
      to: '/donors',
      label: 'Donors',
      icon: Users,
    });
  }

  return (
    <>
      <nav className="premium-navbar">
        <div className="navbar-inner">

          {/* Brand */}
          <Link
            to="/"
            className="premium-brand"
            onClick={closeMobile}
          >
            <div className="brand-icon">
              <Droplets size={21} strokeWidth={2.4} />
            </div>

            <div className="brand-text">
              <strong>Blood<span>Bank</span></strong>
              <small>Management System</small>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="desktop-navigation">
            <ul className="premium-nav-list">
              {navItems.map(item => {
                const Icon = item.icon;
                const active = isActive(item.to);

                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className={`premium-nav-link ${active}`}
                    >
                      <Icon size={16} strokeWidth={2.2} />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* User Area */}
          <div className="navbar-user-area">

            <div className="user-profile">

              <div className="user-avatar">
                {initials}
              </div>

              <div className="user-info">
                <strong>{user?.name || 'User'}</strong>
                <span>
                  {user?.role
                    ? user.role.charAt(0).toUpperCase() +
                      user.role.slice(1)
                    : 'Member'}
                </span>
              </div>

              <ChevronDown
                size={14}
                className="user-chevron"
              />
            </div>

            <button
              type="button"
              className="logout-button"
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>

          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="mobile-menu-button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? (
              <X size={22} />
            ) : (
              <Menu size={22} />
            )}
          </button>

        </div>

        {/* Mobile Navigation */}
        <div
          className={`mobile-navigation ${
            mobileOpen ? 'open' : ''
          }`}
        >
          <div className="mobile-nav-inner">

            <div className="mobile-user-card">
              <div className="mobile-user-avatar">
                {initials}
              </div>

              <div>
                <strong>{user?.name || 'User'}</strong>
                <span>
                  {user?.role
                    ? user.role.charAt(0).toUpperCase() +
                      user.role.slice(1)
                    : 'Member'}
                </span>
              </div>
            </div>

            <div className="mobile-links">

              {navItems.map(item => {
                const Icon = item.icon;
                const active = isActive(item.to);

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={closeMobile}
                    className={`mobile-nav-link ${active}`}
                  >
                    <span className="mobile-nav-icon">
                      <Icon size={17} />
                    </span>

                    <span>{item.label}</span>
                  </Link>
                );
              })}

            </div>

            <button
              type="button"
              className="mobile-logout"
              onClick={handleLogout}
            >
              <LogOut size={17} />
              Logout
            </button>

          </div>
        </div>
      </nav>

      <style>{`
        .premium-navbar {
          position: sticky;
          top: 0;
          z-index: 1000;
          width: 100%;
          background: rgba(255, 255, 255, 0.96);
          border-bottom: 1px solid #e7ebf0;
          box-shadow: 0 3px 18px rgba(15, 23, 42, 0.055);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
        }

        .navbar-inner {
          width: 100%;
          max-width: 1180px;
          min-height: 68px;
          margin: 0 auto;
          padding: 0 18px;
          display: flex;
          align-items: center;
          gap: 18px;
        }

        /* =========================
           BRAND
        ========================= */

        .premium-brand {
          display: flex;
          align-items: center;
          gap: 9px;
          flex-shrink: 0;
          text-decoration: none;
        }

        .brand-icon {
          width: 39px;
          height: 39px;
          display: grid;
          place-items: center;
          border-radius: 11px;
          background: linear-gradient(
            135deg,
            #dc2626,
            #b91c1c
          );
          color: #fff;
          box-shadow:
            0 5px 13px rgba(220, 38, 38, 0.22);
        }

        .brand-text {
          display: flex;
          flex-direction: column;
          line-height: 1;
        }

        .brand-text strong {
          color: #111827;
          font-size: 0.96rem;
          font-weight: 850;
          letter-spacing: -0.035em;
        }

        .brand-text strong span {
          color: #dc2626;
        }

        .brand-text small {
          margin-top: 4px;
          color: #94a3b8;
          font-size: 0.56rem;
          font-weight: 650;
          letter-spacing: 0.035em;
        }

        /* =========================
           DESKTOP NAVIGATION
        ========================= */

        .desktop-navigation {
          flex: 1;
          min-width: 0;
        }

        .premium-nav-list {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2px;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .premium-nav-link {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          height: 38px;
          padding: 0 9px;
          border-radius: 8px;
          color: #64748b;
          font-size: 0.69rem;
          font-weight: 700;
          text-decoration: none;
          white-space: nowrap;
          transition:
            color 0.18s ease,
            background 0.18s ease,
            transform 0.18s ease;
        }

        .premium-nav-link svg {
          flex-shrink: 0;
        }

        .premium-nav-link:hover {
          color: #1e293b;
          background: #f8fafc;
        }

        .premium-nav-link.active {
          color: #b91c1c;
          background: #fef2f2;
        }

        .premium-nav-link.active::after {
          content: "";
          position: absolute;
          left: 10px;
          right: 10px;
          bottom: -15px;
          height: 2px;
          border-radius: 99px;
          background: #dc2626;
        }

        /* =========================
           USER AREA
        ========================= */

        .navbar-user-area {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 7px;
          min-width: 112px;
          padding: 4px 7px 4px 4px;
          border: 1px solid #e8edf2;
          border-radius: 10px;
          background: #f8fafc;
        }

        .user-avatar,
        .mobile-user-avatar {
          width: 31px;
          height: 31px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 8px;
          background: linear-gradient(
            135deg,
            #fee2e2,
            #fecaca
          );
          color: #b91c1c;
          font-size: 0.61rem;
          font-weight: 850;
        }

        .user-info {
          min-width: 0;
          display: flex;
          flex-direction: column;
        }

        .user-info strong {
          max-width: 78px;
          overflow: hidden;
          color: #334155;
          font-size: 0.65rem;
          font-weight: 800;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .user-info span {
          margin-top: 2px;
          color: #94a3b8;
          font-size: 0.55rem;
          font-weight: 650;
        }

        .user-chevron {
          color: #94a3b8;
        }

        .logout-button {
          height: 36px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 0 10px;
          border: 1px solid #fee2e2;
          border-radius: 8px;
          background: #fff;
          color: #b91c1c;
          font-family: inherit;
          font-size: 0.66rem;
          font-weight: 750;
          cursor: pointer;
          transition: all 0.18s ease;
        }

        .logout-button:hover {
          border-color: #fecaca;
          background: #fef2f2;
          transform: translateY(-1px);
        }

        /* =========================
           MOBILE
        ========================= */

        .mobile-menu-button {
          display: none;
          width: 38px;
          height: 38px;
          margin-left: auto;
          align-items: center;
          justify-content: center;
          border: 1px solid #e2e8f0;
          border-radius: 9px;
          background: #fff;
          color: #334155;
          cursor: pointer;
        }

        .mobile-navigation {
          display: none;
        }

        /* =========================
           TABLET
        ========================= */

        @media (max-width: 1050px) {
          .navbar-inner {
            gap: 10px;
          }

          .premium-nav-link {
            padding: 0 7px;
            font-size: 0.64rem;
          }

          .premium-nav-link span {
            display: none;
          }

          .premium-nav-link svg {
            width: 17px;
            height: 17px;
          }

          .premium-nav-link.active::after {
            left: 8px;
            right: 8px;
          }
        }

        /* =========================
           MOBILE NAV
        ========================= */

        @media (max-width: 760px) {
          .navbar-inner {
            min-height: 62px;
            padding: 0 14px;
          }

          .desktop-navigation,
          .navbar-user-area {
            display: none;
          }

          .mobile-menu-button {
            display: flex;
          }

          .mobile-navigation {
            display: block;
            max-height: 0;
            overflow: hidden;
            border-top: 1px solid transparent;
            background: #fff;
            transition:
              max-height 0.28s ease,
              border-color 0.28s ease;
          }

          .mobile-navigation.open {
            max-height: 620px;
            border-top-color: #eef2f6;
          }

          .mobile-nav-inner {
            max-width: 1180px;
            margin: 0 auto;
            padding: 13px 14px 16px;
          }

          .mobile-user-card {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 11px;
            margin-bottom: 10px;
            border: 1px solid #eef2f6;
            border-radius: 11px;
            background: #f8fafc;
          }

          .mobile-user-avatar {
            width: 35px;
            height: 35px;
            border-radius: 9px;
          }

          .mobile-user-card strong {
            display: block;
            color: #1e293b;
            font-size: 0.75rem;
            font-weight: 800;
          }

          .mobile-user-card span {
            display: block;
            margin-top: 2px;
            color: #94a3b8;
            font-size: 0.61rem;
          }

          .mobile-links {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 5px;
          }

          .mobile-nav-link {
            display: flex;
            align-items: center;
            gap: 8px;
            min-height: 41px;
            padding: 0 9px;
            border-radius: 8px;
            color: #64748b;
            font-size: 0.69rem;
            font-weight: 700;
            text-decoration: none;
          }

          .mobile-nav-link.active {
            background: #fef2f2;
            color: #b91c1c;
          }

          .mobile-nav-icon {
            width: 29px;
            height: 29px;
            display: grid;
            place-items: center;
            border-radius: 7px;
            background: #f8fafc;
          }

          .mobile-nav-link.active .mobile-nav-icon {
            background: #fee2e2;
          }

          .mobile-logout {
            width: 100%;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 7px;
            margin-top: 9px;
            border: 1px solid #fee2e2;
            border-radius: 8px;
            background: #fff;
            color: #b91c1c;
            font-family: inherit;
            font-size: 0.7rem;
            font-weight: 750;
            cursor: pointer;
          }
        }

        @media (max-width: 430px) {
          .brand-text small {
            display: none;
          }

          .brand-text strong {
            font-size: 0.9rem;
          }

          .brand-icon {
            width: 36px;
            height: 36px;
          }

          .mobile-links {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}