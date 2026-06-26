import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Building2, Settings, LogOut, Eye } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

const navItems = [
  { to: '/dashboard', label: 'Übersicht', icon: LayoutDashboard },
  { to: '/properties', label: 'Properties', icon: Building2 },
  { to: '/settings', label: 'Einstellungen', icon: Settings },
]

export default function Sidebar() {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <aside className="flex h-full w-56 flex-col border-r border-[#2d3447] bg-[#161b27]">
      {/* Logo */}
      <div className="flex items-center gap-2.5 border-b border-[#2d3447] px-4 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
          <Eye className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-[#e2e8f0]">STR Watchdog</p>
          <p className="text-xs text-[#5a6478]">Monitoring</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 px-3 py-4">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600/20 text-blue-400'
                  : 'text-[#8b98a9] hover:bg-[#212840] hover:text-[#e2e8f0]'
              }`
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Sign out */}
      <div className="border-t border-[#2d3447] p-3">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#8b98a9] transition-colors hover:bg-[#212840] hover:text-[#e2e8f0]"
        >
          <LogOut className="h-4 w-4" />
          Abmelden
        </button>
      </div>
    </aside>
  )
}
