import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Calendar, 
  TrendingUp, 
  Download, 
  CheckCircle, 
  XCircle,
  Clock
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import BottomNav from './BottomNav';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';

export default function Reports() {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');

  // Weekly adherence data
  const weeklyData = [
    { day: 'Mon', taken: 4, missed: 0 },
    { day: 'Tue', taken: 3, missed: 1 },
    { day: 'Wed', taken: 4, missed: 0 },
    { day: 'Thu', taken: 4, missed: 0 },
    { day: 'Fri', taken: 2, missed: 2 },
    { day: 'Sat', taken: 4, missed: 0 },
    { day: 'Sun', taken: 3, missed: 1 },
  ];

  // Overall statistics
  const pieData = [
    { name: 'Taken', value: 87, color: '#10B981' },
    { name: 'Missed', value: 8, color: '#EF4444' },
    { name: 'Skipped', value: 5, color: '#F59E0B' },
  ];

  // Calendar view data
  const calendarData = [
    { date: '2025-11-01', status: 'taken' },
    { date: '2025-11-02', status: 'taken' },
    { date: '2025-11-03', status: 'missed' },
    { date: '2025-11-04', status: 'taken' },
    { date: '2025-11-05', status: 'taken' },
    { date: '2025-11-06', status: 'taken' },
    { date: '2025-11-07', status: 'skipped' },
    { date: '2025-11-08', status: 'taken' },
    { date: '2025-11-09', status: 'taken' },
    { date: '2025-11-10', status: 'taken' },
    { date: '2025-11-11', status: 'missed' },
    { date: '2025-11-12', status: 'taken' },
    { date: '2025-11-13', status: 'taken' },
  ];

  const handleExportPDF = () => {
    toast.success('Exporting report as PDF...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#B9E5C9]/10 via-white to-[#3B82F6]/5 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#3B82F6] to-[#2563EB] text-white p-6 rounded-b-[2rem] shadow-lg">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-center gap-4 mb-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <div>
              <h1 className="mb-1">Health Reports</h1>
              <p className="text-blue-100">Track your medication adherence</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto p-6 space-y-6">
        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-3 gap-3"
        >
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
            <div className="flex justify-center mb-2">
              <div className="p-2 bg-green-100 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-2xl text-gray-900 mb-1">87%</p>
            <p className="text-gray-600 text-xs">Adherence</p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
            <div className="flex justify-center mb-2">
              <div className="p-2 bg-blue-100 rounded-xl">
                <TrendingUp className="w-6 h-6 text-[#3B82F6]" />
              </div>
            </div>
            <p className="text-2xl text-gray-900 mb-1">24</p>
            <p className="text-gray-600 text-xs">This Week</p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
            <div className="flex justify-center mb-2">
              <div className="p-2 bg-red-100 rounded-xl">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <p className="text-2xl text-gray-900 mb-1">4</p>
            <p className="text-gray-600 text-xs">Missed</p>
          </div>
        </motion.div>

        {/* Period Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="flex gap-2"
        >
          {(['week', 'month', 'year'] as const).map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? 'default' : 'outline'}
              onClick={() => setSelectedPeriod(period)}
              className={`flex-1 rounded-xl capitalize ${
                selectedPeriod === period 
                  ? 'bg-[#3B82F6] text-white' 
                  : ''
              }`}
            >
              {period}
            </Button>
          ))}
        </motion.div>

        {/* Weekly Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-900">Weekly Overview</h3>
            <Calendar className="w-5 h-5 text-[#3B82F6]" />
          </div>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '12px'
                }}
              />
              <Bar dataKey="taken" fill="#10B981" radius={[8, 8, 0, 0]} />
              <Bar dataKey="missed" fill="#EF4444" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <h3 className="text-gray-900 mb-4">Overall Statistics</h3>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>

          <div className="grid grid-cols-3 gap-3 mt-4">
            {pieData.map((item) => (
              <div key={item.name} className="text-center">
                <div className="w-3 h-3 rounded-full mx-auto mb-1" style={{ backgroundColor: item.color }}></div>
                <p className="text-gray-900">{item.value}%</p>
                <p className="text-gray-500 text-xs">{item.name}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Calendar View */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <h3 className="text-gray-900 mb-4">November 2025</h3>

          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <div key={day} className="text-center text-gray-500 text-xs">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {calendarData.map((item, index) => (
              <div
                key={index}
                className={`aspect-square rounded-xl flex items-center justify-center text-xs ${
                  item.status === 'taken' ? 'bg-green-100 text-green-700' :
                  item.status === 'missed' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}
              >
                {new Date(item.date).getDate()}
              </div>
            ))}
          </div>

          <div className="flex gap-4 justify-center mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-green-500"></div>
              <span className="text-gray-600 text-xs">Taken</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-red-500"></div>
              <span className="text-gray-600 text-xs">Missed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-yellow-500"></div>
              <span className="text-gray-600 text-xs">Skipped</span>
            </div>
          </div>
        </motion.div>

        {/* Export Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          <Button
            onClick={handleExportPDF}
            className="w-full h-12 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-xl"
          >
            <Download className="w-4 h-4 mr-2" />
            Export as PDF
          </Button>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}
