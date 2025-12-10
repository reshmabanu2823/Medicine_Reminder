import { useState, useEffect } from 'react';
// Helper to schedule a notification
function scheduleNotification(title: string, body: string, delayMs: number) {
  if ("Notification" in window && Notification.permission === "granted") {
    setTimeout(() => {
      new Notification(title, { body });
    }, delayMs);
  }
}
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Calendar, 
  Clock, 
  Pill, 
  Package, 
  AlertCircle,
  CheckCircle,
  BellRing,
  Plus,
  ChevronRight,
  Settings
} from 'lucide-react';
import BottomNav from './BottomNav';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

export default function Dashboard() {
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const [upcomingMeds, setUpcomingMeds] = useState<any[]>([]);

  // Load medicines from localStorage
  useEffect(() => {
    // Request notification permission on load
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    const meds = JSON.parse(localStorage.getItem('medicines') || '[]');
    // Flatten reminder times into dashboard entries
    const medEntries: any[] = [];
    const now = new Date();
    meds.forEach((med: any) => {
      // Schedule notifications for each enabled time (demo: fires in 5s)
      if (med.reminderTimes?.morning) {
        medEntries.push({
          id: med.id + '-morning',
          time: med.morningTime,
          name: med.name,
          dosage: med.dosage,
          taken: false,
          color: '#3B82F6',
          medId: med.id
        });
        scheduleNotification(
          `Medicine Reminder: ${med.name}`,
          `Take your morning dose at ${med.morningTime}`,
          5000 // For demo, 5 seconds from load
        );
      }
      if (med.reminderTimes?.afternoon) {
        medEntries.push({
          id: med.id + '-afternoon',
          time: med.afternoonTime,
          name: med.name,
          dosage: med.dosage,
          taken: false,
          color: '#10B981',
          medId: med.id
        });
        scheduleNotification(
          `Medicine Reminder: ${med.name}`,
          `Take your afternoon dose at ${med.afternoonTime}`,
          7000 // For demo, 7 seconds from load
        );
      }
      if (med.reminderTimes?.evening) {
        medEntries.push({
          id: med.id + '-evening',
          time: med.eveningTime,
          name: med.name,
          dosage: med.dosage,
          taken: false,
          color: '#F59E0B',
          medId: med.id
        });
        scheduleNotification(
          `Medicine Reminder: ${med.name}`,
          `Take your evening dose at ${med.eveningTime}`,
          9000 // For demo, 9 seconds from load
        );
      }
      if (med.reminderTimes?.night) {
        medEntries.push({
          id: med.id + '-night',
          time: med.nightTime,
          name: med.name,
          dosage: med.dosage,
          taken: false,
          color: '#8B5CF6',
          medId: med.id
        });
        scheduleNotification(
          `Medicine Reminder: ${med.name}`,
          `Take your night dose at ${med.nightTime}`,
          11000 // For demo, 11 seconds from load
        );
      }

      // Expiry notifications (5,4,3,2,1 days before expiry)
      if (med.expiryDate) {
        const expiry = new Date(med.expiryDate);
        for (let days = 5; days >= 1; days--) {
          const warnDate = new Date(expiry);
          warnDate.setDate(expiry.getDate() - days);
          if (warnDate > now) {
            const msUntilWarn = warnDate.getTime() - now.getTime();
            scheduleNotification(
              `Expiry Alert: ${med.name}`,
              `${med.name} expires in ${days} day(s) (${med.expiryDate})`,
              Math.max(1000, msUntilWarn)
            );
          }
        }
      }
    });
    setUpcomingMeds(medEntries);
  }, []);

  // Stock status from localStorage
  const [stockStatus, setStockStatus] = useState<any[]>([]);
  useEffect(() => {
    const meds = JSON.parse(localStorage.getItem('medicines') || '[]');
    const status = meds.map((med: any) => {
      const qty = parseInt(med.quantity || '0', 10);
      let s = 'healthy', color = 'bg-green-100 text-green-700';
      if (qty === 0) { s = 'out'; color = 'bg-red-100 text-red-700'; }
      else if (qty <= 5) { s = 'low'; color = 'bg-yellow-100 text-yellow-700'; }
      return { id: med.id, name: med.name, quantity: qty, status: s, color };
    });
    setStockStatus(status);
  }, [upcomingMeds]);

  const handleMarkTaken = (id: string) => {
    setUpcomingMeds(meds =>
      meds.map(med =>
        med.id === id ? { ...med, taken: true } : med
      )
    );
    // Find medicine by medId
    const medEntry = upcomingMeds.find(med => med.id === id);
    if (!medEntry) return;
    // Save intake history
    const history = JSON.parse(localStorage.getItem('intakeHistory') || '[]');
    const record = {
      medId: medEntry.medId,
      name: medEntry.name,
      time: medEntry.time,
      date: new Date().toISOString(),
    };
    history.push(record);
    localStorage.setItem('intakeHistory', JSON.stringify(history));
    // Decrement stock in medicines
    const medicines = JSON.parse(localStorage.getItem('medicines') || '[]');
    const idx = medicines.findIndex((m: any) => m.id === medEntry.medId);
    if (idx !== -1) {
      let qty = parseInt(medicines[idx].quantity || '0', 10);
      if (!isNaN(qty) && qty > 0) {
        medicines[idx].quantity = (qty - 1).toString();
        localStorage.setItem('medicines', JSON.stringify(medicines));
      }
    }
    toast.success('Medicine marked as taken ✓');
  };

  const handleSnooze = (name: string) => {
    toast.info(`${name} reminder snoozed for 15 minutes`);
  };

  const handleSkip = (name: string) => {
    toast.warning(`${name} dose skipped`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#B9E5C9]/10 via-white to-[#3B82F6]/5 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#3B82F6] to-[#2563EB] text-white p-6 rounded-b-[2rem] shadow-lg">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              {/* Icons from SplashScreen */}
              <div className="flex gap-2">
                <Pill className="w-8 h-8 text-[#3B82F6] bg-white/20 rounded-xl p-1" />
                <Clock className="w-8 h-8 text-[#10B981] bg-white/20 rounded-xl p-1" />
                <Package className="w-8 h-8 text-[#F59E0B] bg-white/20 rounded-xl p-1" />
                <AlertCircle className="w-8 h-8 text-[#EF4444] bg-white/20 rounded-xl p-1" />
              </div>
              <div>
                <h1 className="mb-1">Hello, Reshma 👋</h1>
                <p className="text-blue-100">{today}</p>
              </div>
            </div>
            <Link to="/settings">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <Settings className="w-6 h-6" />
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center"
            >
              <CheckCircle className="w-8 h-8 mx-auto mb-2" />
              <p className="text-2xl mb-1">4</p>
              <p className="text-blue-100 text-xs">Today's Doses</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center"
            >
              <Package className="w-8 h-8 mx-auto mb-2" />
              <p className="text-2xl mb-1">8</p>
              <p className="text-blue-100 text-xs">Active Meds</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center"
            >
              <BellRing className="w-8 h-8 mx-auto mb-2" />
              <p className="text-2xl mb-1">2</p>
              <p className="text-blue-100 text-xs">Alerts</p>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto p-6 space-y-6">
        {/* Upcoming Medicines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-900">Upcoming Medicines</h3>
            <Clock className="w-5 h-5 text-[#3B82F6]" />
          </div>

          <div className="space-y-3">
            {upcomingMeds.map((med, index) => (
              <motion.div
                key={med.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div 
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: `${med.color}20` }}
                  >
                    <Pill className="w-6 h-6" style={{ color: med.color }} />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <p className="text-gray-900">{med.name}</p>
                        <p className="text-gray-500">{med.dosage}</p>
                      </div>
                      <Badge variant="outline" className="border-[#3B82F6] text-[#3B82F6]">
                        {med.time}
                      </Badge>
                    </div>

                    {!med.taken ? (
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          onClick={() => handleMarkTaken(med.id)}
                          className="flex-1 bg-[#B9E5C9] text-[#059669] hover:bg-[#A8D4B8] rounded-xl"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Take
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSnooze(med.name)}
                          className="rounded-xl"
                        >
                          Snooze
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSkip(med.name)}
                          className="rounded-xl text-red-600 border-red-200 hover:bg-red-50"
                        >
                          Skip
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 mt-3 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span>Taken</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stock Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-900">Stock Status</h3>
            <Link to="/stock" className="flex items-center text-[#3B82F6] hover:text-[#2563EB] transition-colors">
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            {stockStatus.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    item.status === 'healthy' ? 'bg-green-500' :
                    item.status === 'low' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}></div>
                  <div>
                    <p className="text-gray-900">{item.name}</p>
                    <p className="text-gray-500">{item.quantity} units</p>
                  </div>
                </div>
                <Badge className={item.color}>
                  {item.status === 'healthy' ? 'In Stock' :
                   item.status === 'low' ? 'Low Stock' :
                   'Out of Stock'}
                </Badge>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="grid grid-cols-2 gap-4"
        >
          <Link to="/add-medicine">
            <div className="bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-2xl p-6 text-white hover:shadow-lg hover:scale-105 transition-all duration-200">
              <Plus className="w-8 h-8 mb-3" />
              <p>Add Medicine</p>
              <p className="text-blue-100 text-xs mt-1">Create new reminder</p>
            </div>
          </Link>

          <Link to="/reports">
            <div className="bg-gradient-to-br from-[#B9E5C9] to-[#A8D4B8] rounded-2xl p-6 text-gray-900 hover:shadow-lg hover:scale-105 transition-all duration-200">
              <Calendar className="w-8 h-8 mb-3" />
              <p>View Reports</p>
              <p className="text-gray-600 text-xs mt-1">Track your progress</p>
            </div>
          </Link>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}
