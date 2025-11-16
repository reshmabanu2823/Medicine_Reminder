import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Bell, 
  Clock, 
  Package, 
  AlertCircle, 
  CheckCircle, 
  Trash2,
  BellRing
} from 'lucide-react';
import BottomNav from './BottomNav';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';

interface Notification {
  id: number;
  type: 'reminder' | 'low-stock' | 'refill' | 'expiry';
  title: string;
  message: string;
  time: string;
  category: 'today' | 'this-week' | 'earlier';
  read: boolean;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Helper to schedule browser notification (demo: fires in 5s)
  function scheduleNotification(title: string, body: string, delayMs: number) {
    if ("Notification" in window && Notification.permission === "granted") {
      setTimeout(() => {
        new Notification(title, { body });
      }, delayMs);
    }
  }

  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
    // Load medicines from localStorage
    const meds = JSON.parse(localStorage.getItem('medicines') || '[]');
    const notifs: Notification[] = [];
    const now = new Date();
    meds.forEach((med: any) => {
      // Reminder notifications for each enabled time
      [
        { key: 'morning', label: 'Morning', time: med.morningTime },
        { key: 'afternoon', label: 'Afternoon', time: med.afternoonTime },
        { key: 'evening', label: 'Evening', time: med.eveningTime },
        { key: 'night', label: 'Night', time: med.nightTime }
      ].forEach(({ key, label, time }) => {
        if (med.reminderTimes?.[key]) {
          notifs.push({
            id: parseInt(med.id) + label.length,
            type: 'reminder',
            title: 'Medicine Reminder',
            message: `Take ${med.name} at ${time} (${label})`,
            time,
            category: 'today',
            read: false
          });
          // Schedule browser notification (demo: 5s after load)
          scheduleNotification(
            `Medicine Reminder: ${med.name}`,
            `Take your ${label.toLowerCase()} dose at ${time}`,
            5000
          );
        }
      });
      // Expiry notifications (5,4,3,2,1 days before expiry)
      if (med.expiryDate) {
        const expiry = new Date(med.expiryDate);
        for (let days = 5; days >= 1; days--) {
          const warnDate = new Date(expiry);
          warnDate.setDate(expiry.getDate() - days);
          if (warnDate > now) {
            notifs.push({
              id: parseInt(med.id) + 100 + days,
              type: 'expiry',
              title: 'Expiry Alert',
              message: `${med.name} expires in ${days} day(s) (${med.expiryDate})`,
              time: warnDate.toLocaleDateString(),
              category: 'this-week',
              read: false
            });
            // Schedule browser notification (demo: 7s after load)
            scheduleNotification(
              `Expiry Alert: ${med.name}`,
              `${med.name} expires in ${days} day(s) (${med.expiryDate})`,
              7000
            );
          }
        }
      }
      // Low stock notification (≤5)
      const qty = parseInt(med.quantity || '0', 10);
      if (qty > 0 && qty <= 5) {
        notifs.push({
          id: parseInt(med.id) + 200,
          type: 'low-stock',
          title: 'Low Stock Alert',
          message: `${med.name} stock is running low (${qty} units left)`,
          time: new Date().toLocaleTimeString(),
          category: 'today',
          read: false
        });
        scheduleNotification(
          `Low Stock: ${med.name}`,
          `${med.name} stock is running low (${qty} units left)`,
          6000
        );
      }
      if (qty === 0) {
        notifs.push({
          id: parseInt(med.id) + 201,
          type: 'low-stock',
          title: 'Out of Stock',
          message: `${med.name} is out of stock!`,
          time: new Date().toLocaleTimeString(),
          category: 'today',
          read: false
        });
        scheduleNotification(
          `Out of Stock: ${med.name}`,
          `${med.name} is out of stock!`,
          6000
        );
      }
    });
    setNotifications(notifs);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'reminder':
        return <Clock className="w-5 h-5" />;
      case 'low-stock':
        return <Package className="w-5 h-5" />;
      case 'refill':
        return <BellRing className="w-5 h-5" />;
      case 'expiry':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'reminder':
        return { bg: 'bg-blue-100', text: 'text-blue-600' };
      case 'low-stock':
        return { bg: 'bg-yellow-100', text: 'text-yellow-600' };
      case 'refill':
        return { bg: 'bg-purple-100', text: 'text-purple-600' };
      case 'expiry':
        return { bg: 'bg-red-100', text: 'text-red-600' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-600' };
    }
  };

  const handleMarkDone = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
    toast.success('Notification marked as done');
  };

  const handleSnooze = (id: number) => {
    toast.info('Notification snoozed for 1 hour');
  };

  const handleDelete = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
    toast.success('Notification deleted');
  };

  const groupedNotifications = {
    today: notifications.filter(n => n.category === 'today'),
    'this-week': notifications.filter(n => n.category === 'this-week'),
    earlier: notifications.filter(n => n.category === 'earlier'),
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#B9E5C9]/10 via-white to-[#3B82F6]/5 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#3B82F6] to-[#2563EB] text-white p-6 rounded-b-[2rem] shadow-lg">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-1">Notifications</h1>
              <p className="text-blue-100">
                {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <Bell className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto p-6">
        {Object.entries(groupedNotifications).map(([category, notifs]) => {
          if (notifs.length === 0) return null;

          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <h3 className="text-gray-900 mb-4 capitalize">
                {category === 'this-week' ? 'This Week' : category}
              </h3>

              <div className="space-y-3">
                {notifs.map((notification, index) => {
                  const colors = getColor(notification.type);
                  
                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`bg-white rounded-2xl p-4 shadow-sm border transition-all hover:shadow-md ${
                        notification.read 
                          ? 'border-gray-100' 
                          : 'border-[#3B82F6] border-l-4'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-3 rounded-xl ${colors.bg} ${colors.text}`}>
                          {getIcon(notification.type)}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-1">
                            <p className="text-gray-900">{notification.title}</p>
                            {!notification.read && (
                              <Badge className="bg-[#3B82F6] text-white ml-2">New</Badge>
                            )}
                          </div>
                          
                          <p className="text-gray-600 mb-2">{notification.message}</p>
                          
                          <div className="flex items-center justify-between">
                            <p className="text-gray-400 text-xs">{notification.time}</p>
                            
                            <div className="flex gap-2">
                              {!notification.read && notification.type === 'reminder' && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleMarkDone(notification.id)}
                                    className="text-green-600 hover:text-green-700 hover:bg-green-50 h-8 px-3 rounded-lg"
                                  >
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Done
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleSnooze(notification.id)}
                                    className="text-[#3B82F6] hover:text-[#2563EB] hover:bg-blue-50 h-8 px-3 rounded-lg"
                                  >
                                    <Clock className="w-4 h-4 mr-1" />
                                    Snooze
                                  </Button>
                                </>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDelete(notification.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 px-2 rounded-lg"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}

        {notifications.length === 0 && (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No notifications</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
