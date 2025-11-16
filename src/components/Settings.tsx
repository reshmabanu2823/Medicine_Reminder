import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Moon, 
  Volume2, 
  Bell, 
  Database, 
  Download, 
  Upload,
  ChevronRight,
  Check
} from 'lucide-react';
import BottomNav from './BottomNav';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { toast } from 'sonner@2.0.3';

export default function Settings() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    darkMode: false,
    soundEnabled: true,
    notificationSound: 'chime',
    vibration: true,
    volume: [75],
    reminderBefore: '15',
    autoSnooze: false,
    snoozeInterval: '15'
  });

  const handleBackup = () => {
    toast.success('Backup created successfully');
  };

  const handleRestore = () => {
    toast.success('Data restored successfully');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#B9E5C9]/10 via-white to-[#3B82F6]/5 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#3B82F6] to-[#2563EB] text-white p-6 rounded-b-[2rem] shadow-lg">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <div>
              <h1 className="mb-1">Settings</h1>
              <p className="text-blue-100">Customize your experience</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto p-6 space-y-6">
        {/* Appearance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Moon className="w-5 h-5 text-[#3B82F6]" />
              <h3 className="text-gray-900">Appearance</h3>
            </div>
          </div>

        </motion.div>

        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#3B82F6]" />
              <h3 className="text-gray-900">Notifications</h3>
            </div>
          </div>

          <div className="p-4 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="vibration" className="text-gray-900">Vibration</Label>
                <p className="text-gray-500 text-xs mt-1">Vibrate on notifications</p>
              </div>
              <Switch
                id="vibration"
                checked={settings.vibration}
                onCheckedChange={(checked) => 
                  setSettings({ ...settings, vibration: checked })
                }
              />
            </div>

            <div>
              <Label htmlFor="reminder-before" className="text-gray-900 mb-2 block">
                Remind me before
              </Label>
              <Select
                value={settings.reminderBefore}
                onValueChange={(value) => setSettings({ ...settings, reminderBefore: value })}
              >
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="10">10 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-snooze" className="text-gray-900">Auto Snooze</Label>
                <p className="text-gray-500 text-xs mt-1">Snooze after missed reminder</p>
              </div>
              <Switch
                id="auto-snooze"
                checked={settings.autoSnooze}
                onCheckedChange={(checked) => 
                  setSettings({ ...settings, autoSnooze: checked })
                }
              />
            </div>

            {settings.autoSnooze && (
              <div>
                <Label htmlFor="snooze-interval" className="text-gray-900 mb-2 block">
                  Snooze interval
                </Label>
                <Select
                  value={settings.snoozeInterval}
                  onValueChange={(value) => setSettings({ ...settings, snoozeInterval: value })}
                >
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 minutes</SelectItem>
                    <SelectItem value="10">10 minutes</SelectItem>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </motion.div>

        {/* Sound Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-[#3B82F6]" />
              <h3 className="text-gray-900">Sound</h3>
            </div>
          </div>

          <div className="p-4 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="sound-enabled" className="text-gray-900">Enable Sound</Label>
                <p className="text-gray-500 text-xs mt-1">Play sound on notifications</p>
              </div>
              <Switch
                id="sound-enabled"
                checked={settings.soundEnabled}
                onCheckedChange={(checked) => 
                  setSettings({ ...settings, soundEnabled: checked })
                }
              />
            </div>

            {settings.soundEnabled && (
              <>
                <div>
                  <Label htmlFor="notification-sound" className="text-gray-900 mb-2 block">
                    Notification Sound
                  </Label>
                  <Select
                    value={settings.notificationSound}
                    onValueChange={(value) => setSettings({ ...settings, notificationSound: value })}
                  >
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="chime">Chime</SelectItem>
                      <SelectItem value="bell">Bell</SelectItem>
                      <SelectItem value="beep">Beep</SelectItem>
                      <SelectItem value="melody">Melody</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-gray-900">Volume</Label>
                    <span className="text-gray-600">{settings.volume[0]}%</span>
                  </div>
                  <Slider
                    value={settings.volume}
                    onValueChange={(value) => setSettings({ ...settings, volume: value })}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* Data Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-[#3B82F6]" />
              <h3 className="text-gray-900">Data Management</h3>
            </div>
          </div>

          <div className="p-4 space-y-3">
            <button
              onClick={handleBackup}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors border border-gray-100"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-xl">
                  <Download className="w-5 h-5 text-[#3B82F6]" />
                </div>
                <div className="text-left">
                  <p className="text-gray-900">Backup Data</p>
                  <p className="text-gray-500 text-xs">Save your data locally</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button
              onClick={handleRestore}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors border border-gray-100"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-xl">
                  <Upload className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-left">
                  <p className="text-gray-900">Restore Data</p>
                  <p className="text-gray-500 text-xs">Load your backed up data</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </motion.div>

        {/* App Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="bg-gradient-to-br from-[#B9E5C9] to-[#A8D4B8] rounded-2xl p-6 text-center"
        >
          <p className="text-gray-900 mb-1">MediTrack+ v1.0.0</p>
          <p className="text-gray-600 text-xs">Stay Healthy. Stay On Time.</p>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}
