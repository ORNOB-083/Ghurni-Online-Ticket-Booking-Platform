'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Ticket, MapPin, ArrowRight, Bus, Train,
  Plane, Ship, DollarSign, Hash, Calendar,
  Clock, Tag, Upload, Loader2, CheckCircle,
  X, Link as LinkIcon, AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { createTicket } from '@/lib/actions/tickets';

const TRANSPORT_TYPES = [
  { value: 'bus', label: 'Bus', icon: Bus },
  { value: 'train', label: 'Train', icon: Train },
  { value: 'plane', label: 'Plane', icon: Plane },
  { value: 'launch', label: 'Launch', icon: Ship },
];

const PERKS = [
  'AC', 'WiFi', 'Breakfast', 'Lunch', 'Dinner',
  'Luggage', 'USB Charging', 'Recliner Seat',
  'Blanket & Pillow', 'Entertainment', 'Snacks', 'Water Bottle'
];

const getMinDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 5);
  return date.toISOString().split('T')[0];
};

export default function AddTicketClient({ user }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadLoading, setIsUploadLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageTab, setImageTab] = useState('upload');
  const [imageUrl, setImageUrl] = useState('');
  const [pendingImage, setPendingImage] = useState(null);
  const [isFraud, setIsFraud] = useState(false);
  const [isFraudChecking, setIsFraudChecking] = useState(true);

  const [form, setForm] = useState({
    ticketTitle: '',
    from: '',
    to: '',
    transportType: '',
    price: '',
    quantity: '',
    departureDate: '',
    departureTime: '',
    perks: [],
    image: '',
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    checkFraudStatus();
  }, []);

  const checkFraudStatus = async () => {
    setIsFraudChecking(true);
    try {
      const s = await authClient.getSession();
      const token = s?.data?.session?.token;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
        { headers: { authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setIsFraud(data?.isFraud === true);
    } catch {
    } finally {
      setIsFraudChecking(false);
    }
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleTransportType = (value) => {
    setForm(prev => ({ ...prev, transportType: value }));
  };

  const handlePerkToggle = (perk) => {
    setForm(prev => ({
      ...prev,
      perks: prev.perks.includes(perk)
        ? prev.perks.filter(p => p !== perk)
        : [...prev.perks, perk]
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Only image files allowed'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }
    setIsUploadLoading(true);
    try {
      toast.loading('Uploading image...', { id: 'img' });
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_KEY}`,
        { method: 'POST', body: formData }
      );
      const data = await res.json();
      const url = data.data.url;
      setPendingImage(url);
      setImagePreview(url);
      toast.success('Image ready! Click Save to apply.', { id: 'img' });
    } catch {
      toast.error('Image upload failed', { id: 'img' });
    } finally {
      setIsUploadLoading(false);
    }
  };

  const handleLinkPreview = () => {
    if (!imageUrl.trim()) { toast.error('Please enter an image URL'); return; }
    setPendingImage(imageUrl.trim());
    setImagePreview(imageUrl.trim());
    toast.success('Image preview ready!');
  };

  const handleSaveImage = () => {
    if (!pendingImage) { toast.error('Please upload or preview an image first'); return; }
    setForm(prev => ({ ...prev, image: pendingImage }));
    toast.success('Image saved!');
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setPendingImage(null);
    setImageUrl('');
    setForm(prev => ({ ...prev, image: '' }));
  };

  const handleSubmit = async () => {
    if (isFraud) { toast.error('Your account has been flagged. You cannot add tickets.'); return; }
    if (!form.ticketTitle.trim()) return toast.error('Ticket title is required');
    if (!form.from.trim()) return toast.error('From location is required');
    if (!form.to.trim()) return toast.error('To location is required');
    if (!form.transportType) return toast.error('Please select transport type');
    if (!form.price || isNaN(form.price)) return toast.error('Valid price is required');
    if (!form.quantity || isNaN(form.quantity)) return toast.error('Valid quantity is required');
    if (!form.departureDate) return toast.error('Departure date is required');
    if (!form.departureTime) return toast.error('Departure time is required');
    if (!form.image) return toast.error('Please save a ticket image first');

    setIsLoading(true);
    try {
      const ticketData = {
        ...form,
        price: parseFloat(form.price),
        quantity: parseInt(form.quantity),
        vendorName: user?.name,
        vendorEmail: user?.email,
      };

      const result = await createTicket(ticketData);

      if (result?.insertedId) {
        toast.success('Ticket submitted for approval!');
        router.push('/dashboard/vendor/my-tickets');
      } else {
        toast.error(result?.message || 'Failed to add ticket');
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const minDate = getMinDate();

  if (isFraudChecking) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (isFraud) {
    return (
      <div className="p-6 pt-8 max-w-3xl mx-auto mt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#1a1d24] rounded-2xl border border-red-200 dark:border-red-900/50 shadow-sm p-10 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Account Restricted
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm mx-auto mb-6">
            Your account has been flagged as fraud by an admin. You are no longer able to add new tickets to the platform.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-medium">
            <AlertTriangle className="w-4 h-4" />
            Contact support if you think this is a mistake
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 pt-8 max-w-3xl mx-auto space-y-6 mt-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Add New Ticket</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Fill in the details below. Your ticket will be reviewed by admin before going live.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-[#1a1d24] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 space-y-6"
      >
        <div>
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 block">Ticket Title</label>
          <div className="relative">
            <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              name="ticketTitle"
              value={form.ticketTitle}
              onChange={handleChange}
              placeholder="e.g. Dhaka to Cox's Bazar Express"
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 block">From</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                name="from"
                value={form.from}
                onChange={handleChange}
                placeholder="Departure city"
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 transition-all"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 block">To</label>
            <div className="relative">
              <ArrowRight className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                name="to"
                value={form.to}
                onChange={handleChange}
                placeholder="Destination city"
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 transition-all"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 block">Transport Type</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {TRANSPORT_TYPES.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => handleTransportType(value)}
                className={`flex flex-col items-center gap-2 py-3 rounded-xl border-2 text-sm font-medium transition-all ${form.transportType === value
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                  : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-emerald-300 hover:text-emerald-500'
                  }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 block">Price (per unit) ৳</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 transition-all"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 block">Ticket Quantity</label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                placeholder="e.g. 50"
                min="1"
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 block">Departure Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="date"
                name="departureDate"
                value={form.departureDate}
                onChange={handleChange}
                min={minDate}
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 transition-all"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">Must be at least 5 days from today</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 block">Departure Time</label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="time"
                name="departureTime"
                value={form.departureTime}
                onChange={handleChange}
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 transition-all"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 block">Perks & Amenities</label>
          <div className="flex flex-wrap gap-2">
            {PERKS.map((perk) => {
              const selected = form.perks.includes(perk);
              return (
                <button
                  key={perk}
                  onClick={() => handlePerkToggle(perk)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${selected
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                    : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-emerald-300'
                    }`}
                >
                  {selected ? <CheckCircle className="w-3 h-3" /> : <Tag className="w-3 h-3" />}
                  {perk}
                </button>
              );
            })}
          </div>
          {form.perks.length > 0 && (
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">
              {form.perks.length} perk{form.perks.length > 1 ? 's' : ''} selected
            </p>
          )}
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 block">Ticket Image</label>

          {imagePreview && (
            <div className="mb-3 flex flex-col items-center gap-2">
              <div className="relative w-full rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
                <button
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              {!form.image && (
                <div className="flex items-center gap-2 w-full">
                  <span className="text-xs text-amber-500 dark:text-amber-400 font-medium bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-lg border border-amber-100 dark:border-amber-800 flex-1 text-center">
                    Preview only — click Save Image to apply
                  </span>
                  <button
                    onClick={handleSaveImage}
                    className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-xs font-semibold"
                  >
                    Save Image
                  </button>
                </div>
              )}
              {form.image && (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-lg border border-emerald-100 dark:border-emerald-800 w-full text-center">
                  ✓ Image saved
                </span>
              )}
            </div>
          )}

          {!imagePreview && (
            <>
              <div className="flex gap-2 mb-3 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
                <button
                  onClick={() => setImageTab('upload')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${imageTab === 'upload'
                    ? 'bg-white dark:bg-[#1a1d24] text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400'
                    }`}
                >
                  <Upload className="w-4 h-4" />
                  Upload File
                </button>
                <button
                  onClick={() => setImageTab('link')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${imageTab === 'link'
                    ? 'bg-white dark:bg-[#1a1d24] text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400'
                    }`}
                >
                  <LinkIcon className="w-4 h-4" />
                  Image Link
                </button>
              </div>

              {imageTab === 'upload' ? (
                <label className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-emerald-400 dark:hover:border-emerald-600 rounded-xl p-8 cursor-pointer transition-all group">
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  {isUploadLoading
                    ? <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
                    : <Upload className="w-8 h-8 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                  }
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-emerald-600 transition-colors">
                      {isUploadLoading ? 'Uploading...' : 'Click to upload image'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 5MB</p>
                  </div>
                </label>
              ) : (
                <div className="space-y-3">
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 transition-all"
                    />
                  </div>
                  <button
                    onClick={handleLinkPreview}
                    className="w-full py-2 rounded-xl border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-sm font-medium hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                  >
                    Preview Image
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100 dark:border-gray-800">
          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 block">Vendor Name</label>
            <input
              type="text"
              value={user?.name || ''}
              readOnly
              className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-500 dark:text-gray-400 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 block">Vendor Email</label>
            <input
              type="text"
              value={user?.email || ''}
              readOnly
              className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-500 dark:text-gray-400 cursor-not-allowed"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isLoading || isUploadLoading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-semibold text-sm shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <><Loader2 className="w-4 h-4 animate-spin" />Submitting...</>
          ) : (
            <><Ticket className="w-4 h-4" />Add Ticket</>
          )}
        </button>
      </motion.div>
    </div>
  );
}