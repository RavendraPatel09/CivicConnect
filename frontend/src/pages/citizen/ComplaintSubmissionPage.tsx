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
  ShieldCheck,
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
    { number: 1, title: 'Details', icon: <FileText className="w-3.5 h-3.5" /> },
    { number: 2, title: 'Location', icon: <MapPin className="w-3.5 h-3.5" /> },
    { number: 3, title: 'Evidence', icon: <Camera className="w-3.5 h-3.5" /> },
    { number: 4, title: 'Review', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  ];

  if (submittedTicketId) {
    return (
      <div className="min-h-screen bg-[#FAFAF7] dark:bg-[#0B1320] flex flex-col justify-center items-center py-12 px-4 sm:px-6 text-[#202B2A] dark:text-[#F1F5F9]">
        <div className="max-w-md w-full bg-white dark:bg-[#131E30] rounded-lg p-8 border border-[#E5E8E4] dark:border-[#22344D] shadow-subtle text-center space-y-5">
          <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-[#23845B] mx-auto flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <div>
            <span className="text-[11px] font-mono font-bold text-[#66736F] dark:text-slate-400 uppercase tracking-wider">
              Incident Registered
            </span>
            <h2 className="text-2xl font-bold font-mono text-[#183B3A] dark:text-[#3B8278] mt-1">
              {submittedTicketId}
            </h2>
            <p className="text-xs text-[#66736F] dark:text-slate-400 mt-2 leading-relaxed">
              Your grievance has been successfully entered into the municipal work registry. Algorithmic intake analysis has routed this case to the responsible department.
            </p>
          </div>

          <div className="bg-[#FAFAF7] dark:bg-[#0E1624] p-4 rounded-md border border-[#E5E8E4] dark:border-[#22344D] text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-[#66736F] dark:text-slate-400">Current Status:</span>
              <span className="font-semibold text-[#2563EB]">Acknowledged</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#66736F] dark:text-slate-400">Assigned Department:</span>
              <span className="font-semibold text-[#202B2A] dark:text-white">
                {CATEGORIES[formValues.category]?.department}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#66736F] dark:text-slate-400">Assessed Priority:</span>
              <span className="font-bold tabular-nums text-[#183B3A] dark:text-[#3B8278]">Score 88 / 100</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            <Button
              variant="primary"
              size="md"
              className="w-full"
              onClick={() => navigate(`/tickets/${submittedTicketId}`)}
            >
              View Case Record
            </Button>
            <Button
              variant="outline"
              size="md"
              className="w-full"
              onClick={() => navigate('/citizen')}
            >
              Citizen Portal
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7] dark:bg-[#0B1320] text-[#202B2A] dark:text-[#F1F5F9] flex flex-col">
      {/* Header */}
      <header className="h-16 border-b border-[#E5E8E4] dark:border-[#22344D] bg-white dark:bg-[#131E30] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
        <Link to="/" className="flex items-center">
          <Logo size="md" />
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            to="/citizen"
            className="text-xs font-semibold text-[#66736F] hover:text-[#202B2A] dark:hover:text-white"
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
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#E5E8E4] dark:bg-[#22344D] -translate-y-1/2 z-0" />
            {steps.map((st) => {
              const isComplete = currentStep > st.number;
              const isCurrent = currentStep === st.number;

              return (
                <div key={st.number} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isComplete
                        ? 'bg-[#183B3A] text-white dark:bg-[#2563EB]'
                        : isCurrent
                        ? 'bg-[#183B3A] text-white dark:bg-[#2563EB] ring-4 ring-[#183B3A]/10 dark:ring-white/10'
                        : 'bg-white dark:bg-[#131E30] text-[#66736F] border border-[#E5E8E4] dark:border-[#22344D]'
                    }`}
                  >
                    {isComplete ? <CheckCircle2 className="w-4 h-4" /> : st.number}
                  </div>
                  <span
                    className={`text-[11px] font-medium mt-1.5 hidden sm:block ${
                      isCurrent ? 'font-bold text-[#183B3A] dark:text-white' : 'text-[#66736F] dark:text-slate-400'
                    }`}
                  >
                    {st.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-[#131E30] rounded-lg border border-[#E5E8E4] dark:border-[#22344D] p-6 sm:p-8 shadow-subtle">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* STEP 1: ISSUE DETAILS */}
            {currentStep === 1 && (
              <div className="space-y-5">
                <div className="pb-3 border-b border-[#E5E8E4] dark:border-[#22344D]">
                  <h2 className="text-lg font-bold text-[#202B2A] dark:text-white">
                    Step 1: Incident Information
                  </h2>
                  <p className="text-xs text-[#66736F] dark:text-slate-400 mt-0.5">
                    Describe the civic infrastructure defect to inform field team assignment.
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
                  <label className="block text-xs font-semibold text-[#202B2A] dark:text-slate-200 mb-2">
                    Civic Category
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {(Object.keys(CATEGORIES) as ComplaintCategory[]).map((catKey) => {
                      const cat = CATEGORIES[catKey];
                      const isSelected = formValues.category === catKey;

                      return (
                        <button
                          key={catKey}
                          type="button"
                          onClick={() => setValue('category', catKey)}
                          className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'border-[#183B3A] bg-[#183B3A]/5 text-[#183B3A] dark:border-white dark:bg-white/10 dark:text-white font-semibold'
                              : 'border-[#E5E8E4] dark:border-[#22344D] hover:bg-[#FAFAF7] dark:hover:bg-[#111A29] text-[#202B2A] dark:text-slate-300'
                          }`}
                        >
                          <div className="text-xs font-semibold">{cat.name}</div>
                          <div className="text-[10px] text-[#66736F] dark:text-slate-400 truncate mt-0.5">
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
                  <label className="block text-xs font-semibold text-[#202B2A] dark:text-slate-200 mb-2">
                    Estimated Public Hazard Severity
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(['low', 'medium', 'high', 'critical'] as ComplaintSeverity[]).map((sev) => {
                      const isSelected = formValues.severity === sev;
                      return (
                        <button
                          key={sev}
                          type="button"
                          onClick={() => setValue('severity', sev)}
                          className={`py-2 px-3 rounded-md border text-xs font-semibold capitalize text-center transition-all ${
                            isSelected
                              ? 'border-[#183B3A] bg-[#183B3A] text-white dark:border-[#2563EB] dark:bg-[#2563EB]'
                              : 'border-[#E5E8E4] dark:border-[#22344D] hover:bg-[#FAFAF7] dark:hover:bg-[#111A29] text-[#202B2A] dark:text-slate-300'
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
              <div className="space-y-5">
                <div className="pb-3 border-b border-[#E5E8E4] dark:border-[#22344D]">
                  <h2 className="text-lg font-bold text-[#202B2A] dark:text-white">
                    Step 2: Incident Geolocation
                  </h2>
                  <p className="text-xs text-[#66736F] dark:text-slate-400 mt-0.5">
                    Click the map to drop a pin or enter the street address for field dispatch.
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
                  <label className="block text-xs font-semibold text-[#202B2A] dark:text-slate-200 mb-1.5">
                    Incident Map Location
                  </label>
                  <div className="rounded-lg overflow-hidden border border-[#E5E8E4] dark:border-[#22344D]">
                    <CivicMap
                      complaints={[]}
                      height="320px"
                      center={[formValues.lat || 37.7749, formValues.lng || -122.4194]}
                      selectableLocation={true}
                      onLocationSelected={handleMapLocationSelected}
                    />
                  </div>
                  <div className="mt-2 text-[11px] text-[#66736F] flex items-center justify-between">
                    <span className="tabular-nums">
                      Selected: {formValues.lat?.toFixed(5)}, {formValues.lng?.toFixed(5)}
                    </span>
                    <span className="text-[#2563EB] font-medium">Click map to adjust pin position</span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: PHOTO EVIDENCE */}
            {currentStep === 3 && (
              <div className="space-y-5">
                <div className="pb-3 border-b border-[#E5E8E4] dark:border-[#22344D]">
                  <h2 className="text-lg font-bold text-[#202B2A] dark:text-white">
                    Step 3: Photographic Documentation
                  </h2>
                  <p className="text-xs text-[#66736F] dark:text-slate-400 mt-0.5">
                    Visual evidence assists automated classification and helps municipal crews prepare appropriate repair equipment.
                  </p>
                </div>

                {/* Upload Zone */}
                <label className="border-2 border-dashed border-[#E5E8E4] dark:border-[#22344D] rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-[#183B3A] dark:hover:border-slate-500 transition-colors bg-[#FAFAF7] dark:bg-[#111A29]">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSimulatedImageUpload}
                    className="sr-only"
                  />
                  <div className="w-10 h-10 rounded-md bg-white dark:bg-[#131E30] border border-[#E5E8E4] dark:border-[#22344D] text-[#183B3A] dark:text-white flex items-center justify-center mb-2">
                    <Upload className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-[#202B2A] dark:text-white">
                    Click to attach photo evidence
                  </span>
                  <span className="text-[11px] text-[#66736F] dark:text-slate-400 mt-0.5">
                    PNG, JPG, or WEBP up to 10MB
                  </span>
                </label>

                {/* Uploaded Thumbnails Preview */}
                <div>
                  <label className="block text-xs font-semibold text-[#202B2A] dark:text-slate-200 mb-2">
                    Attached Images ({uploadedImages.length})
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {uploadedImages.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative rounded-lg overflow-hidden border border-[#E5E8E4] dark:border-[#22344D] group h-28"
                      >
                        <img
                          src={img}
                          alt={`Uploaded evidence ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1.5 right-1.5 p-1 rounded-md bg-black/60 text-white hover:bg-rose-600 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
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
              <div className="space-y-5">
                <div className="pb-3 border-b border-[#E5E8E4] dark:border-[#22344D]">
                  <h2 className="text-lg font-bold text-[#202B2A] dark:text-white">
                    Step 4: Final Verification
                  </h2>
                  <p className="text-xs text-[#66736F] dark:text-slate-400 mt-0.5">
                    Review grievance details before logging to the municipal intake registry.
                  </p>
                </div>

                <div className="bg-[#FAFAF7] dark:bg-[#0E1624] p-4.5 rounded-lg border border-[#E5E8E4] dark:border-[#22344D] space-y-3">
                  <div className="flex items-center justify-between border-b border-[#E5E8E4] dark:border-[#22344D] pb-2.5">
                    <span className="text-xs text-[#66736F] dark:text-slate-400">Incident Category</span>
                    <span className="text-xs font-bold text-[#183B3A] dark:text-white">
                      {CATEGORIES[formValues.category]?.name}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-[#E5E8E4] dark:border-[#22344D] pb-2.5">
                    <span className="text-xs text-[#66736F] dark:text-slate-400">Assigned Department</span>
                    <span className="text-xs font-semibold text-[#202B2A] dark:text-white">
                      {CATEGORIES[formValues.category]?.department}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-[#E5E8E4] dark:border-[#22344D] pb-2.5">
                    <span className="text-xs text-[#66736F] dark:text-slate-400">Hazard Severity</span>
                    <span className="text-xs font-bold uppercase text-[#202B2A] dark:text-white">
                      {formValues.severity}
                    </span>
                  </div>

                  <div className="space-y-1 border-b border-[#E5E8E4] dark:border-[#22344D] pb-2.5">
                    <span className="text-xs text-[#66736F] dark:text-slate-400">Title & Location</span>
                    <p className="text-xs font-bold text-[#202B2A] dark:text-white">
                      {formValues.title}
                    </p>
                    <p className="text-xs text-[#66736F] dark:text-slate-400">
                      {formValues.address} {formValues.landmark ? `(${formValues.landmark})` : ''}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs text-[#66736F] dark:text-slate-400">Description</span>
                    <p className="text-xs text-[#202B2A] dark:text-slate-300 leading-relaxed">
                      {formValues.description}
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-[#FAFAF7] dark:bg-[#0E1624] rounded-lg border border-[#E5E8E4] dark:border-[#22344D] flex items-center gap-2.5 text-xs text-[#66736F] dark:text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-[#2563EB] flex-shrink-0" />
                  <span>
                    Submitting logs this incident to the public municipal ledger and dispatches automated intake triage to the designated engineering team.
                  </span>
                </div>
              </div>
            )}

            {/* Stepper Navigation Buttons */}
            <div className="mt-8 pt-5 border-t border-[#E5E8E4] dark:border-[#22344D] flex items-center justify-between">
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
                  variant="primary"
                  size="md"
                  onClick={handleNextStep}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Next Step
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="primary"
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
