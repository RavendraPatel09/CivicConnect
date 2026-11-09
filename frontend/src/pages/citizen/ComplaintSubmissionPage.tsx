import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { fullComplaintSchema, ComplaintFormData } from '../../schemas';
import { useAuth } from '../../contexts/AuthContext';
import ticketsApi from '../../services/api/tickets.api';
import CivicMap from '../../components/maps/CivicMap';
import Logo from '../../components/common/Logo';
import Input, { Textarea } from '../../components/forms/Input';
import Button from '../../components/ui/Button';
import ThemeToggle from '../../components/ui/ThemeToggle';
import { CATEGORIES } from '../../constants';
import { ComplaintCategory, ComplaintSeverity } from '../../types';
import {
  FileText,
  MapPin,
  Camera,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Upload,
  X,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export const ComplaintSubmissionPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [uploadedImages, setUploadedImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80',
  ]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedTicketId, setSubmittedTicketId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<ComplaintFormData>({
    resolver: zodResolver(fullComplaintSchema),
    defaultValues: {
      title: '',
      category: 'roads_potholes',
      severity: 'medium',
      description: '',
      address: '742 Market Street, Downtown District',
      landmark: 'Near Transit Center',
      lat: 37.7879,
      lng: -122.4075,
      images: [
        'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80',
      ],
    },
  });

  const formValues = watch();

  const handleNextStep = async () => {
    let isValid = false;
    if (currentStep === 1) {
      isValid = await trigger(['title', 'category', 'severity', 'description']);
    } else if (currentStep === 2) {
      isValid = await trigger(['address', 'lat', 'lng', 'landmark']);
    } else if (currentStep === 3) {
      setValue('images', uploadedImages);
      isValid = await trigger(['images']);
    }

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleMapLocationSelected = (lat: number, lng: number) => {
    setValue('lat', lat);
    setValue('lng', lng);
    // Reverse geocode mockup update
    setValue('address', `Location at ${lat.toFixed(4)}, ${lng.toFixed(4)} (Selected on map)`);
  };

  const handleSimulatedImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          const updated = [...uploadedImages, reader.result];
          setUploadedImages(updated);
          setValue('images', updated);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const updated = uploadedImages.filter((_, idx) => idx !== indexToRemove);
    setUploadedImages(updated);
    setValue('images', updated);
  };

  const onSubmit = async (data: ComplaintFormData) => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      const newTicket = await ticketsApi.createTicket(data, user);
      setSubmittedTicketId(newTicket.id);
      setIsSubmitting(false);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  const steps = [
    { number: 1, title: 'Issue Details', icon: <FileText className="w-4 h-4" /> },
    { number: 2, title: 'Location Pin', icon: <MapPin className="w-4 h-4" /> },
    { number: 3, title: 'Photo Evidence', icon: <Camera className="w-4 h-4" /> },
    { number: 4, title: 'Review & Submit', icon: <CheckCircle2 className="w-4 h-4" /> },
  ];

  if (submittedTicketId) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0B1320] flex flex-col justify-center items-center py-12 px-4 sm:px-6">
        <div className="max-w-md w-full bg-white dark:bg-[#131E30] rounded-2xl p-8 border border-slate-200/90 dark:border-[#22344D] shadow-xl text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div>
            <span className="text-xs font-mono font-bold text-slate-400">
              Complaint Registered
            </span>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {submittedTicketId}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Your grievance has been successfully logged and processed by AI Triage. Municipal teams have been assigned.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-[#0E1726] p-4 rounded-xl border border-slate-200/60 dark:border-slate-800 text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Status:</span>
              <span className="font-semibold text-blue-600">Acknowledged</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Assigned Department:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {CATEGORIES[formValues.category]?.department}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">AI Priority Score:</span>
              <span className="font-bold text-teal">High Priority (88/100)</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Button
              variant="civic"
              size="md"
              className="w-full"
              onClick={() => navigate(`/tickets/${submittedTicketId}`)}
            >
              View Complaint Details
            </Button>
            <Button
              variant="outline"
              size="md"
              className="w-full"
              onClick={() => navigate('/citizen')}
            >
              Return to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1320] text-slate-900 dark:text-white flex flex-col">
      {/* Header */}
      <header className="h-16 border-b border-slate-200/90 dark:border-[#22344D] bg-white dark:bg-[#131E30] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
        <Link to="/" className="flex items-center">
          <Logo size="md" />
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            to="/citizen"
            className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900"
          >
            Cancel
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-8 flex-1">
        {/* Step Progress Indicators */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 dark:bg-slate-700 -translate-y-1/2 z-0" />
            {steps.map((st) => {
              const isComplete = currentStep > st.number;
              const isCurrent = currentStep === st.number;

              return (
                <div key={st.number} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isComplete
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : isCurrent
                        ? 'bg-civic text-white ring-4 ring-blue-100 dark:ring-blue-950/60 shadow-xs'
                        : 'bg-white dark:bg-[#131E30] text-slate-400 border border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    {isComplete ? <CheckCircle2 className="w-4 h-4" /> : st.number}
                  </div>
                  <span
                    className={`text-[11px] font-semibold mt-1.5 hidden sm:block ${
                      isCurrent ? 'text-civic' : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {st.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Form Card */}
        <div className="bg-white dark:bg-[#131E30] rounded-2xl border border-slate-200/90 dark:border-[#22344D] p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* STEP 1: ISSUE DETAILS */}
            {currentStep === 1 && (
              <div className="space-y-5 animate-fadeIn">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Step 1: Incident Information
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Clearly describe the civic infrastructure defect so crews can bring the right tools.
                  </p>
                </div>

                <Input
                  label="Complaint Title"
                  placeholder="e.g. Deep Pothole in Left Traffic Lane"
                  error={errors.title?.message}
                  {...register('title')}
                />

                {/* Category Selection */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-2">
                    Civic Category
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {(Object.keys(CATEGORIES) as ComplaintCategory[]).map((catKey) => {
                      const cat = CATEGORIES[catKey];
                      const isSelected = formValues.category === catKey;

                      return (
                        <button
                          key={catKey}
                          type="button"
                          onClick={() => setValue('category', catKey)}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'border-civic bg-blue-50/50 dark:bg-blue-950/30 text-civic ring-1 ring-civic font-bold'
                              : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <div className="text-xs font-semibold">{cat.name}</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            {cat.department}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {errors.category && (
                    <p className="mt-1 text-xs text-rose-500">{errors.category.message}</p>
                  )}
                </div>

                {/* Severity Selection */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-2">
                    Estimated Public Hazard Severity
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {(['low', 'medium', 'high', 'critical'] as ComplaintSeverity[]).map((sev) => {
                      const isSelected = formValues.severity === sev;
                      return (
                        <button
                          key={sev}
                          type="button"
                          onClick={() => setValue('severity', sev)}
                          className={`py-2 px-3 rounded-lg border text-xs font-semibold capitalize text-center transition-all ${
                            isSelected
                              ? 'border-civic bg-civic text-white'
                              : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {sev}
                        </button>
                      );
                    })}
                  </div>
                  {errors.severity && (
                    <p className="mt-1 text-xs text-rose-500">{errors.severity.message}</p>
                  )}
                </div>

                <Textarea
                  label="Detailed Description"
                  rows={4}
                  placeholder="Provide exact observations (e.g., depth of defect, water volume, safety hazards, nearby traffic impacts)..."
                  error={errors.description?.message}
                  {...register('description')}
                />
              </div>
            )}

            {/* STEP 2: LOCATION */}
            {currentStep === 2 && (
              <div className="space-y-5 animate-fadeIn">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Step 2: Incident Geolocation
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Click the map to drop a pin or adjust the street address for field dispatch.
                  </p>
                </div>

                <Input
                  label="Street Address / Area"
                  placeholder="e.g. 742 Market Street, Downtown"
                  error={errors.address?.message}
                  {...register('address')}
                />

                <Input
                  label="Nearby Landmark (Optional)"
                  placeholder="e.g. In front of public library / opposite bus terminal"
                  error={errors.landmark?.message}
                  {...register('landmark')}
                />

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                    Click to Pin Location On Map
                  </label>
                  <CivicMap
                    complaints={[]}
                    height="320px"
                    center={[formValues.lat || 37.7749, formValues.lng || -122.4194]}
                    selectableLocation={true}
                    onLocationSelected={handleMapLocationSelected}
                  />
                  <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
                    <span>
                      Selected Coordinates: {formValues.lat?.toFixed(5)},{' '}
                      {formValues.lng?.toFixed(5)}
                    </span>
                    <span className="text-civic font-medium">Click map to relocate pin</span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: PHOTO EVIDENCE */}
            {currentStep === 3 && (
              <div className="space-y-5 animate-fadeIn">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Step 3: Photographic Evidence
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Visual proof allows AI classification and crew work orders to estimate materials accurately.
                  </p>
                </div>

                {/* Upload Zone */}
                <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-civic hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSimulatedImageUpload}
                    className="sr-only"
                  />
                  <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/50 text-civic flex items-center justify-center mb-3">
                    <Upload className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    Click to upload photo evidence
                  </span>
                  <span className="text-xs text-slate-400 mt-1">
                    PNG, JPG, or WEBP up to 10MB
                  </span>
                </label>

                {/* Uploaded Thumbnails Preview */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-2">
                    Attached Photographs ({uploadedImages.length})
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {uploadedImages.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 group h-32"
                      >
                        <img
                          src={img}
                          alt={`Uploaded evidence ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-2 right-2 p-1 rounded-full bg-slate-900/70 text-white hover:bg-rose-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  {errors.images && (
                    <p className="mt-1 text-xs text-rose-500 font-medium">{errors.images.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* STEP 4: REVIEW & SUBMIT */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Step 4: Final Verification
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Review your grievance details before publishing to the municipal intake registry.
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-[#0E1726] p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800 pb-3">
                    <span className="text-xs font-semibold text-slate-500">Incident Category</span>
                    <span className="text-xs font-bold text-civic">
                      {CATEGORIES[formValues.category]?.name}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800 pb-3">
                    <span className="text-xs font-semibold text-slate-500">Assigned Municipal Dept</span>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {CATEGORIES[formValues.category]?.department}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800 pb-3">
                    <span className="text-xs font-semibold text-slate-500">Hazard Severity</span>
                    <span className="text-xs font-bold uppercase text-amber-600">
                      {formValues.severity}
                    </span>
                  </div>

                  <div className="space-y-1 border-b border-slate-200/60 dark:border-slate-800 pb-3">
                    <span className="text-xs font-semibold text-slate-500">Title & Location</span>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {formValues.title}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {formValues.address} {formValues.landmark ? `(${formValues.landmark})` : ''}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-slate-500">Description</span>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {formValues.description}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-teal-50 dark:bg-teal-950/30 rounded-xl border border-teal-200 dark:border-teal-800 flex items-center gap-2.5 text-xs text-teal-800 dark:text-teal-200">
                  <Sparkles className="w-4 h-4 text-teal-600 flex-shrink-0" />
                  <span>
                    Submitting this form triggers automated AI semantic classification and generates a unique tracking token for municipal audit.
                  </span>
                </div>
              </div>
            )}

            {/* Stepper Navigation Buttons */}
            <div className="mt-8 pt-5 border-t border-slate-200/80 dark:border-[#22344D] flex items-center justify-between">
              {currentStep > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={handlePrevStep}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  Previous
                </Button>
              ) : (
                <div />
              )}

              {currentStep < 4 ? (
                <Button
                  type="button"
                  variant="civic"
                  size="md"
                  onClick={handleNextStep}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Next Step
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="civic"
                  size="md"
                  isLoading={isSubmitting}
                  rightIcon={<CheckCircle2 className="w-4 h-4" />}
                >
                  Confirm & Submit Grievance
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ComplaintSubmissionPage;
