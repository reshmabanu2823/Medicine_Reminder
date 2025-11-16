import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Package, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import BottomNav from './BottomNav';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export default function StockOverview() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [medicines, setMedicines] = useState<any[]>([]);
  useEffect(() => {
    const meds = JSON.parse(localStorage.getItem('medicines') || '[]');
    // Add status and color based on quantity and expiry
    const now = new Date();
    const updated = meds.map((med: any) => {
      const qty = parseInt(med.quantity || '0', 10);
      let status = 'healthy', color = '#10B981';
      if (qty === 0) { status = 'out'; color = '#EF4444'; }
      else if (qty <= 5) { status = 'low'; color = '#F59E0B'; }
      // Expiry warning: within 5 days
      let expiryWarning = false;
      if (med.expiryDate) {
        const expiry = new Date(med.expiryDate);
        const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays <= 5 && diffDays >= 0) expiryWarning = true;
      }
      return {
        ...med,
        type: med.type || '',
        expiry: med.expiryDate || '',
        quantity: qty,
        status,
        color,
        expiryWarning
      };
    });
    setMedicines(updated);
  }, [filterStatus, searchQuery]);

  const filteredMedicines = medicines.filter(med => {
    const matchesSearch = med.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || med.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const statusCounts = {
    all: medicines.length,
    healthy: medicines.filter(m => m.status === 'healthy').length,
    low: medicines.filter(m => m.status === 'low').length,
    out: medicines.filter(m => m.status === 'out').length,
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'low':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'out':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge className="bg-green-100 text-green-700">In Stock</Badge>;
      case 'low':
        return <Badge className="bg-yellow-100 text-yellow-700">Low Stock</Badge>;
      case 'out':
        return <Badge className="bg-red-100 text-red-700">Out of Stock</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#B9E5C9]/10 via-white to-[#3B82F6]/5 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#3B82F6] to-[#2563EB] text-white p-6 rounded-b-[2rem] shadow-lg">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="mb-1">Stock Overview</h1>
              <p className="text-blue-100">Manage your medicine inventory</p>
            </div>
            <Link to="/add-medicine">
              <Button className="bg-white text-[#3B82F6] hover:bg-blue-50">
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
              <p className="text-xl mb-1">{statusCounts.all}</p>
              <p className="text-blue-100 text-xs">Total</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
              <p className="text-xl mb-1">{statusCounts.healthy}</p>
              <p className="text-blue-100 text-xs">Healthy</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
              <p className="text-xl mb-1">{statusCounts.low}</p>
              <p className="text-blue-100 text-xs">Low</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
              <p className="text-xl mb-1">{statusCounts.out}</p>
              <p className="text-blue-100 text-xs">Out</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto p-6">
        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6 space-y-3"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search medicine..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 rounded-xl border-gray-200"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            <Button
              variant={filterStatus === 'all' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('all')}
              className={`rounded-xl whitespace-nowrap ${
                filterStatus === 'all' 
                  ? 'bg-[#3B82F6] text-white' 
                  : ''
              }`}
            >
              All ({statusCounts.all})
            </Button>
            <Button
              variant={filterStatus === 'healthy' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('healthy')}
              className={`rounded-xl whitespace-nowrap ${
                filterStatus === 'healthy' 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : ''
              }`}
            >
              Healthy ({statusCounts.healthy})
            </Button>
            <Button
              variant={filterStatus === 'low' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('low')}
              className={`rounded-xl whitespace-nowrap ${
                filterStatus === 'low' 
                  ? 'bg-yellow-600 text-white hover:bg-yellow-700' 
                  : ''
              }`}
            >
              Low ({statusCounts.low})
            </Button>
            <Button
              variant={filterStatus === 'out' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('out')}
              className={`rounded-xl whitespace-nowrap ${
                filterStatus === 'out' 
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : ''
              }`}
            >
              Out ({statusCounts.out})
            </Button>
          </div>
        </motion.div>

        {/* Medicine List */}
        <div className="space-y-3">
          {filteredMedicines.map((med, index) => (
            <motion.div
              key={med.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all"
            >
                  <div className="flex items-start gap-4">
                    <div 
                      className="p-3 rounded-xl"
                      style={{ backgroundColor: `${med.color}20` }}
                    >
                      {getStatusIcon(med.status)}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-gray-900 mb-1 flex items-center gap-2">
                            {med.name}
                            {med.status === 'low' && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">Low Stock</span>}
                            {med.status === 'out' && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">Out of Stock</span>}
                            {med.expiryWarning && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">Expiring Soon</span>}
                          </p>
                          <p className="text-gray-500">{med.type}</p>
                        </div>
                        {getStatusBadge(med.status)}
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-gray-500 text-xs mb-1">Quantity</p>
                          <p className="text-gray-900">{med.quantity} units</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs mb-1">Expiry Date</p>
                          <p className={`text-gray-900 ${med.expiryWarning ? 'text-red-600 font-bold' : ''}`}>{new Date(med.expiry).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Link to={`/edit-medicine/${med.id}`} className="flex-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full rounded-xl"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl border-[#3B82F6] text-[#3B82F6] hover:bg-[#3B82F6] hover:text-white"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Stock
                        </Button>
                      </div>
                    </div>
                  </div>
            </motion.div>
          ))}
        </div>

        {filteredMedicines.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No medicines found</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
