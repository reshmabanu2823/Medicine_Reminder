import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Pill, Clock, Package } from 'lucide-react';
import BottomNav from './BottomNav';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';

function AddMedicine() {
  const [showTimeInput, setShowTimeInput] = useState({
    morning: false,
    afternoon: false,
    evening: false,
    night: false
  });
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: '',
    type: 'tablet',
    dosage: '',
    frequency: 'daily',
    morningTime: '09:00',
    afternoonTime: '13:00',
    eveningTime: '18:00',
    nightTime: '21:00',
    reminderTimes: {
      morning: true,
      afternoon: false,
      evening: true,
      night: false
    },
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    notes: '',
    quantity: '',
    expiryDate: ''
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.dosage || !formData.quantity) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Save to localStorage
    const medicines = JSON.parse(localStorage.getItem('medicines') || '[]');
    if (isEditing) {
      // Update existing
      const idx = medicines.findIndex((m: any) => m.id === id);
      if (idx !== -1) medicines[idx] = { ...formData, id };
    } else {
      // Add new
      const newMed = { ...formData, id: Date.now().toString() };
      medicines.push(newMed);
    }
    localStorage.setItem('medicines', JSON.stringify(medicines));

    toast.success(isEditing ? 'Medicine updated successfully ✅' : 'Medicine added successfully ✅');
    navigate('/dashboard');
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
            <h1>{isEditing ? 'Edit Medicine' : 'Add Medicine'}</h1>
          </div>
          <p className="text-blue-100 ml-14">Create a new medicine reminder</p>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto p-6">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          onSubmit={handleSave}
          className="space-y-6"
        >
          {/* Basic Information */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <Pill className="w-5 h-5 text-[#3B82F6]" />
              <h3 className="text-gray-900">Basic Information</h3>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Medicine Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Paracetamol"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-2 h-12 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger className="mt-2 h-12 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tablet">Tablet</SelectItem>
                      <SelectItem value="syrup">Syrup</SelectItem>
                      <SelectItem value="injection">Injection</SelectItem>
                      <SelectItem value="drops">Drops</SelectItem>
                      <SelectItem value="capsule">Capsule</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="dosage">Dosage *</Label>
                  <Input
                    id="dosage"
                    placeholder="e.g., 500mg - 1 tablet"
                    value={formData.dosage}
                    onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                    className="mt-2 h-12 rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-[#3B82F6]" />
              <h3 className="text-gray-900">Schedule</h3>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="frequency">Frequency</Label>
                <Select value={formData.frequency} onValueChange={(value) => setFormData({ ...formData, frequency: value })}>
                  <SelectTrigger className="mt-2 h-12 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Reminder Times</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.reminderTimes.morning
                        ? 'border-[#3B82F6] bg-[#3B82F6]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-gray-900">Morning</p>
                      <Clock className="w-4 h-4 cursor-pointer text-blue-500" onClick={() => setShowTimeInput(s => ({ ...s, morning: !s.morning }))} />
                    </div>
                    {showTimeInput.morning && (
                      <Input
                        type="time"
                        value={formData.morningTime}
                        onChange={e => setFormData({ ...formData, morningTime: e.target.value })}
                        className="h-10 rounded-lg"
                        onBlur={() => setShowTimeInput(s => ({ ...s, morning: false }))}
                        autoFocus
                      />
                    )}
                    {!showTimeInput.morning && (
                      <div className="text-gray-700 text-sm select-none" onClick={() => setShowTimeInput(s => ({ ...s, morning: true }))}>
                        {formData.morningTime}
                      </div>
                    )}
                    <div className="mt-2">
                      <input
                        type="checkbox"
                        checked={formData.reminderTimes.morning}
                        onChange={() => setFormData({
                          ...formData,
                          reminderTimes: { ...formData.reminderTimes, morning: !formData.reminderTimes.morning }
                        })}
                        id="reminder-morning"
                      />
                      <label htmlFor="reminder-morning" className="ml-2 text-xs text-gray-500">Enable</label>
                    </div>
                  </div>

                  <div
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.reminderTimes.afternoon
                        ? 'border-[#3B82F6] bg-[#3B82F6]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-gray-900">Afternoon</p>
                      <Clock className="w-4 h-4 cursor-pointer text-blue-500" onClick={() => setShowTimeInput(s => ({ ...s, afternoon: !s.afternoon }))} />
                    </div>
                    {showTimeInput.afternoon && (
                      <Input
                        type="time"
                        value={formData.afternoonTime}
                        onChange={e => setFormData({ ...formData, afternoonTime: e.target.value })}
                        className="h-10 rounded-lg"
                        onBlur={() => setShowTimeInput(s => ({ ...s, afternoon: false }))}
                        autoFocus
                      />
                    )}
                    {!showTimeInput.afternoon && (
                      <div className="text-gray-700 text-sm select-none" onClick={() => setShowTimeInput(s => ({ ...s, afternoon: true }))}>
                        {formData.afternoonTime}
                      </div>
                    )}
                    <div className="mt-2">
                      <input
                        type="checkbox"
                        checked={formData.reminderTimes.afternoon}
                        onChange={() => setFormData({
                          ...formData,
                          reminderTimes: { ...formData.reminderTimes, afternoon: !formData.reminderTimes.afternoon }
                        })}
                        id="reminder-afternoon"
                      />
                      <label htmlFor="reminder-afternoon" className="ml-2 text-xs text-gray-500">Enable</label>
                    </div>
                  </div>

                  <div
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.reminderTimes.evening
                        ? 'border-[#3B82F6] bg-[#3B82F6]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-gray-900">Evening</p>
                      <Clock className="w-4 h-4 cursor-pointer text-blue-500" onClick={() => setShowTimeInput(s => ({ ...s, evening: !s.evening }))} />
                    </div>
                    {showTimeInput.evening && (
                      <Input
                        type="time"
                        value={formData.eveningTime}
                        onChange={e => setFormData({ ...formData, eveningTime: e.target.value })}
                        className="h-10 rounded-lg"
                        onBlur={() => setShowTimeInput(s => ({ ...s, evening: false }))}
                        autoFocus
                      />
                    )}
                    {!showTimeInput.evening && (
                      <div className="text-gray-700 text-sm select-none" onClick={() => setShowTimeInput(s => ({ ...s, evening: true }))}>
                        {formData.eveningTime}
                      </div>
                    )}
                    <div className="mt-2">
                      <input
                        type="checkbox"
                        checked={formData.reminderTimes.evening}
                        onChange={() => setFormData({
                          ...formData,
                          reminderTimes: { ...formData.reminderTimes, evening: !formData.reminderTimes.evening }
                        })}
                        id="reminder-evening"
                      />
                      <label htmlFor="reminder-evening" className="ml-2 text-xs text-gray-500">Enable</label>
                    </div>
                  </div>

                  <div
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.reminderTimes.night
                        ? 'border-[#3B82F6] bg-[#3B82F6]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-gray-900">Night</p>
                      <Clock className="w-4 h-4 cursor-pointer text-blue-500" onClick={() => setShowTimeInput(s => ({ ...s, night: !s.night }))} />
                    </div>
                    {showTimeInput.night && (
                      <Input
                        type="time"
                        value={formData.nightTime}
                        onChange={e => setFormData({ ...formData, nightTime: e.target.value })}
                        className="h-10 rounded-lg"
                        onBlur={() => setShowTimeInput(s => ({ ...s, night: false }))}
                        autoFocus
                      />
                    )}
                    {!showTimeInput.night && (
                      <div className="text-gray-700 text-sm select-none" onClick={() => setShowTimeInput(s => ({ ...s, night: true }))}>
                        {formData.nightTime}
                      </div>
                    )}
                    <div className="mt-2">
                      <input
                        type="checkbox"
                        checked={formData.reminderTimes.night}
                        onChange={() => setFormData({
                          ...formData,
                          reminderTimes: { ...formData.reminderTimes, night: !formData.reminderTimes.night }
                        })}
                        id="reminder-night"
                      />
                      <label htmlFor="reminder-night" className="ml-2 text-xs text-gray-500">Enable</label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="mt-2 h-12 rounded-xl"
                  />
                </div>

                <div>
                  <Label htmlFor="endDate">End Date (Optional)</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="mt-2 h-12 rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Stock Information */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-[#3B82F6]" />
              <h3 className="text-gray-900">Stock Information</h3>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantity">Quantity in Stock *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="e.g., 30"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="mt-2 h-12 rounded-xl"
                  />
                </div>

                <div>
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="mt-2 h-12 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional information..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="mt-2 rounded-xl min-h-24"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              className="flex-1 h-12 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 h-12 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-xl"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Medicine
            </Button>
          </div>
        </motion.form>
      </div>

      <BottomNav />
    </div>
  );
}

export default AddMedicine;
