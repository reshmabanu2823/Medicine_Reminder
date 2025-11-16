import { Link, useLocation } from 'react-router-dom';
import { Home, Package, Plus, Bell, User } from 'lucide-react';

export default function BottomNav() {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Home' },
    { path: '/stock', icon: Package, label: 'Stock' },
    { path: '/add-medicine', icon: Plus, label: 'Add', isSpecial: true },
    { path: '/notifications', icon: Bell, label: 'Notifications' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            if (item.isSpecial) {
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex flex-col items-center group -mt-8"
                >
                  <div className="bg-gradient-to-br from-[#3B82F6] to-[#2563EB] p-4 rounded-2xl shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-200">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs mt-2 text-gray-600">{item.label}</span>
                </Link>
              );
            }

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'text-[#3B82F6]' 
                    : 'text-gray-500 hover:text-[#3B82F6]'
                }`}
              >
                <div className={`p-2 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-[#B9E5C9]' 
                    : 'group-hover:bg-gray-100'
                }`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
                </div>
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
