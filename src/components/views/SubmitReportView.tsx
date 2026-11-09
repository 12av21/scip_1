// SCIP Citizen Portal - Submit Report with Real-Time AI Suggestion & Validation
// Indian Government Portal Aesthetic with verifiable records and official citizen cards
import React, { useState, useEffect } from 'react';
import { api } from '../../services/apiClient';
import { Report, ReportCategory, UrgencyLevel, AIAnalysis } from '../../types/scip';
import { classifyReport, extractEntities, determineSeverity } from '../../ai/classifier';
import {
  FileText,
  MapPin,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Send,
  Layers,
  Camera,
  Trash2,
  Building2,
  Info
} from 'lucide-react';

interface SubmitReportViewProps {
  onReportCreated?: (report: Report, analysis: AIAnalysis) => void;
  onNavigateToMyReports?: () => void;
}

const PRESET_LOCATIONS = [
  { name: 'Sector 4 Market Entrance', lat: 28.6142, lng: 77.2091 },
  { name: 'Sector 4 Market Gate 2', lat: 28.6145, lng: 77.2094 },
  { name: 'West Boulevard Transformer 14', lat: 28.6253, lng: 77.2184 },
  { name: 'North Industrial Expressway Ramp B', lat: 28.6380, lng: 77.2300 },
  { name: 'Central Plaza Food Street', lat: 28.6100, lng: 77.2050 },
  { name: 'Riverfront Canal Footbridge', lat: 28.6180, lng: 77.2120 }
];

export const SubmitReportView: React.FC<SubmitReportViewProps> = ({
  onReportCreated,
  onNavigateToMyReports
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ReportCategory>('Water & Drainage');
  const [locationName, setLocationName] = useState('Sector 4 Market Entrance');
  const [latitude, setLatitude] = useState(28.6142);
  const [longitude, setLongitude] = useState(77.2091);
  const [urgency, setUrgency] = useState<UrgencyLevel>('medium');
  const [images, setImages] = useState<string[]>([]);

  const [aiSuggestion, setAiSuggestion] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedResult, setSubmittedResult] = useState<{ report: Report; analysis: AIAnalysis } | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (images.length + files.length > 4) {
      setErrorMessage('Maximum 4 photographs allowed per report.');
      return;
    }

    Array.from(files).forEach(file => {
      if (!['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.type)) {
        setErrorMessage('Only JPG, PNG, and WebP images are supported.');
        return;
      }
      if (file.size > 2.5 * 1024 * 1024) {
        setErrorMessage('Image size must be under 2.5 MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages(prev => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // Live real-time AI classification preview as the user types description
  useEffect(() => {
    const text = `${title} ${description}`;
    if (text.trim().length > 10) {
      const cls = classifyReport(text);
      const ent = extractEntities(text);
      const sev = determineSeverity(text, urgency);
      setAiSuggestion({
        predictedCategory: cls.predictedCategory,
        confidence: cls.confidence,
        entities: ent,
        severity: sev
      });
    } else {
      setAiSuggestion(null);
    }
  }, [title, description, urgency]);

  const handleApplyAiCategory = () => {
    if (aiSuggestion?.predictedCategory) {
      setCategory(aiSuggestion.predictedCategory);
    }
  };

  const handleLocationPreset = (preset: typeof PRESET_LOCATIONS[0]) => {
    setLocationName(preset.name);
    setLatitude(preset.lat);
    setLongitude(preset.lng);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (title.trim().length < 5) {
      setErrorMessage('Please provide a descriptive title (at least 5 characters).');
      return;
    }
    if (description.trim().length < 10) {
      setErrorMessage('Please provide more detail in the description (at least 10 characters).');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.createReport({
        title,
        description,
        category,
        locationName,
        latitude,
        longitude,
        urgency,
        images
      });

      setSubmittedResult(res);
      onReportCreated?.(res.report, res.analysis);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit report to municipal server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setTitle('');
    setDescription('');
    setCategory('Water & Drainage');
    setLocationName('Sector 4 Market Entrance');
    setLatitude(28.6142);
    setLongitude(77.2091);
    setUrgency('medium');
    setImages([]);
    setSubmittedResult(null);
    setErrorMessage('');
  };

  if (submittedResult) {
    const { report, analysis } = submittedResult;
    return (
      <div className="max-w-3xl mx-auto py-6 space-y-6 text-[#253443]">
        <div className="bg-[#EBF7EE] border border-[#A7E0B8] rounded-xl p-6 text-[#1A532C] space-y-3">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-[#28834A]" />
            <div>
              <h2 className="text-base font-bold text-[#1A532C]">
                Official Grievance Registered Successfully
              </h2>
              <div className="text-xs text-[#28834A] font-mono mt-0.5">
                Reference ID: <span className="font-bold">{report.id}</span> · Status: {report.status}
              </div>
            </div>
          </div>
          <p className="text-xs text-[#1A532C] leading-relaxed">
            Your observation has been permanently recorded in the municipal database and routed through automated TF-IDF classification and clustering analysis.
          </p>
        </div>

        {/* AI Analysis Summary Card */}
        <div className="bg-white border border-[#DCE3EA] rounded-xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#DCE3EA] pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#E89B36]" />
              <h3 className="font-bold text-[#153E63] text-sm">Automated AI Pipeline Findings</h3>
            </div>
            <span className="text-xs font-mono text-[#1F5F91] font-semibold tabular-nums">
              Confidence: {(analysis.categoryConfidence * 100).toFixed(0)}%
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-[#F5F7FA] rounded-lg border border-[#DCE3EA]">
              <span className="text-[#657586] text-[11px]">Predicted Category:</span>
              <div className="font-bold text-[#153E63] mt-0.5">{analysis.categoryPredicted}</div>
            </div>
            <div className="p-3 bg-[#F5F7FA] rounded-lg border border-[#DCE3EA]">
              <span className="text-[#657586] text-[11px]">Calculated Risk Score:</span>
              <div className="font-bold text-[#1F5F91] font-mono mt-0.5 tabular-nums">
                {analysis.riskScore}/100 ({analysis.severityIndicator.toUpperCase()})
              </div>
            </div>
            <div className="p-3 bg-[#F5F7FA] rounded-lg border border-[#DCE3EA]">
              <span className="text-[#657586] text-[11px]">Extracted Keywords:</span>
              <div className="font-medium text-[#253443] mt-0.5">
                {analysis.keywords.slice(0, 4).join(', ') || 'N/A'}
              </div>
            </div>
            <div className="p-3 bg-[#F5F7FA] rounded-lg border border-[#DCE3EA]">
              <span className="text-[#657586] text-[11px]">Cluster / Incident Linkage:</span>
              <div className="font-medium text-[#253443] mt-0.5">
                {analysis.possibleIncident
                  ? 'Linked to potential incident cluster'
                  : 'Logged as standalone observation'}
              </div>
            </div>
          </div>

          {analysis.topSimilarReports.length > 0 && (
            <div className="border-t border-[#DCE3EA] pt-3 text-xs space-y-2">
              <span className="text-[#657586] font-semibold">Similar Observations in Proximity:</span>
              <ul className="space-y-1.5">
                {analysis.topSimilarReports.slice(0, 2).map(sim => (
                  <li key={sim.reportId} className="p-2.5 rounded-lg bg-[#F5F7FA] border border-[#DCE3EA] flex items-center justify-between">
                    <div>
                      <span className="font-mono text-[#1F5F91] font-bold mr-2">{sim.reportId}</span>
                      <span className="text-[#253443]">{sim.reportTitle}</span>
                    </div>
                    <span className="text-[#657586] font-mono text-[11px] tabular-nums">
                      {sim.distanceMeters}m away
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateToMyReports}
            className="px-5 py-2.5 text-xs font-bold text-white bg-[#1F5F91] hover:bg-[#153E63] rounded-lg transition-colors shadow-xs"
          >
            View in My Reports
          </button>
          <button
            onClick={handleReset}
            className="px-5 py-2.5 text-xs font-bold text-[#153E63] bg-[#EAF2F8] hover:bg-[#dbeafe] border border-[#DCE3EA] rounded-lg transition-colors"
          >
            Submit Another Report
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-2 space-y-6 text-[#253443]">
      {/* Title */}
      <div className="border-b border-[#DCE3EA] pb-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#1F5F91]">
          <span className="w-2 h-2 rounded-full bg-[#E89B36]" />
          <span>Public Service Grievance Intake</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#153E63] mt-1">
          Submit Community Observation
        </h1>
        <p className="text-xs text-[#657586] font-medium mt-0.5">
          Report municipal issues like water logging, drainage obstruction, broken roads, or electrical hazards.
        </p>
      </div>

      {errorMessage && (
        <div className="p-3.5 bg-[#FEF2F2] border border-[#FCA5A5] text-[#991B1B] rounded-xl text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-[#B42318] shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 bg-white border border-[#DCE3EA] rounded-xl p-6 sm:p-8 shadow-xs">
        {/* Title Field */}
        <div>
          <label className="block text-xs font-bold text-[#153E63] mb-1">
            Grievance / Observation Title <span className="text-[#B42318]">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Severe water accumulation and blocked storm drain"
            className="w-full px-3.5 py-2.5 text-xs text-[#253443] bg-[#F5F7FA] focus:bg-white border border-[#DCE3EA] focus:border-[#1F5F91] rounded-lg focus:outline-hidden transition-colors"
          />
        </div>

        {/* Description Field */}
        <div>
          <label className="block text-xs font-bold text-[#153E63] mb-1">
            Detailed Ground Observation Notes <span className="text-[#B42318]">*</span>
          </label>
          <textarea
            required
            rows={4}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe what you observed: severity of water/damage, landmarks, blocked culverts, traffic impact..."
            className="w-full px-3.5 py-2.5 text-xs text-[#253443] bg-[#F5F7FA] focus:bg-white border border-[#DCE3EA] focus:border-[#1F5F91] rounded-lg focus:outline-hidden leading-relaxed transition-colors"
          />
        </div>

        {/* Live AI Assistant Suggestion Callout */}
        {aiSuggestion && (
          <div className="p-4 bg-[#EAF2F8] border border-[#DCE3EA] rounded-lg text-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-[#153E63]">
                <Sparkles className="w-4 h-4 text-[#E89B36]" />
                <span>AI Categorization Suggestion</span>
              </div>
              <span className="font-mono text-[11px] text-[#1F5F91] font-bold tabular-nums">
                {(aiSuggestion.confidence * 100).toFixed(0)}% Match
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 text-[#253443]">
              <span>
                Based on your description, this best matches category: <strong className="text-[#153E63]">{aiSuggestion.predictedCategory}</strong>
              </span>
              {category !== aiSuggestion.predictedCategory && (
                <button
                  type="button"
                  onClick={handleApplyAiCategory}
                  className="px-3 py-1 text-[11px] font-bold bg-[#1F5F91] hover:bg-[#153E63] text-white rounded transition-colors shadow-xs cursor-pointer"
                >
                  Apply Suggested Category
                </button>
              )}
            </div>
          </div>
        )}

        {/* Category & Urgency Pickers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#153E63] mb-1">
              Municipal Category
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as ReportCategory)}
              className="w-full px-3.5 py-2.5 text-xs text-[#253443] bg-[#F5F7FA] focus:bg-white border border-[#DCE3EA] focus:border-[#1F5F91] rounded-lg focus:outline-hidden transition-colors"
            >
              <option value="Water & Drainage">Water & Drainage</option>
              <option value="Roads & Traffic">Roads & Traffic</option>
              <option value="Public Sanitation">Public Sanitation</option>
              <option value="Power & Lighting">Power & Lighting</option>
              <option value="Parks & Environment">Parks & Environment</option>
              <option value="Structural Safety">Structural Safety</option>
              <option value="Public Health">Public Health</option>
              <option value="Noise & Disturbance">Noise & Disturbance</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#153E63] mb-1">
              Perceived Urgency Level
            </label>
            <select
              value={urgency}
              onChange={e => setUrgency(e.target.value as UrgencyLevel)}
              className="w-full px-3.5 py-2.5 text-xs text-[#253443] bg-[#F5F7FA] focus:bg-white border border-[#DCE3EA] focus:border-[#1F5F91] rounded-lg focus:outline-hidden transition-colors"
            >
              <option value="low">Low (Standard civic maintenance)</option>
              <option value="medium">Medium (Requires attention within 72h)</option>
              <option value="high">High (Disrupting traffic or transit)</option>
              <option value="critical">Critical (Immediate public danger - 24h SLA)</option>
            </select>
          </div>
        </div>

        {/* Location Name & Preset Selection */}
        <div>
          <label className="block text-xs font-bold text-[#153E63] mb-1">
            Civic Landmark / Location Description <span className="text-[#B42318]">*</span>
          </label>
          <input
            type="text"
            required
            value={locationName}
            onChange={e => setLocationName(e.target.value)}
            className="w-full px-3.5 py-2.5 text-xs text-[#253443] bg-[#F5F7FA] focus:bg-white border border-[#DCE3EA] focus:border-[#1F5F91] rounded-lg focus:outline-hidden transition-colors"
          />

          {/* Quick Municipal Location Presets */}
          <div className="mt-2.5 text-xs text-[#657586]">
            <span className="text-[11px] font-semibold text-[#153E63]">Verified Civic Presets:</span>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {PRESET_LOCATIONS.map(p => (
                <button
                  type="button"
                  key={p.name}
                  onClick={() => handleLocationPreset(p)}
                  className={`px-2.5 py-1 rounded text-[11px] border transition-colors cursor-pointer ${
                    locationName === p.name
                      ? 'bg-[#1F5F91] border-[#1F5F91] text-white font-bold'
                      : 'bg-[#F5F7FA] border-[#DCE3EA] text-[#253443] hover:bg-[#EAF2F8]'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* GPS Coordinates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-medium text-[#657586] mb-1">Latitude</label>
            <input
              type="number"
              step="0.0001"
              value={latitude}
              onChange={e => setLatitude(parseFloat(e.target.value))}
              className="w-full px-3.5 py-2 text-xs font-mono tabular-nums text-[#253443] bg-[#F5F7FA] border border-[#DCE3EA] rounded-lg focus:bg-white focus:outline-hidden"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-[#657586] mb-1">Longitude</label>
            <input
              type="number"
              step="0.0001"
              value={longitude}
              onChange={e => setLongitude(parseFloat(e.target.value))}
              className="w-full px-3.5 py-2 text-xs font-mono tabular-nums text-[#253443] bg-[#F5F7FA] border border-[#DCE3EA] rounded-lg focus:bg-white focus:outline-hidden"
            />
          </div>
        </div>

        {/* Supporting Evidence / Photographs */}
        <div>
          <label className="block text-xs font-bold text-[#153E63] mb-1">
            Supporting Photographs (Optional Ground Evidence)
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <label className="cursor-pointer flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-[#153E63] bg-[#EAF2F8] hover:bg-[#dbeafe] border border-[#DCE3EA] rounded-lg transition-colors">
              <Camera className="w-4 h-4 text-[#1F5F91]" />
              <span>Attach Photos</span>
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            <span className="text-[11px] text-[#657586]">Max 4 images (JPG, PNG, WebP up to 2.5MB each)</span>
          </div>

          {images.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative w-20 h-20 rounded-lg border border-[#DCE3EA] overflow-hidden group shadow-xs">
                  <img src={img} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 p-1 bg-[#B42318] hover:bg-rose-700 text-white rounded shadow-xs transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="border-t border-[#DCE3EA] pt-5 flex items-center justify-between">
          <span className="text-[11px] text-[#657586]">
            All submissions are recorded in municipal audit ledger
          </span>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 text-xs font-bold text-white bg-[#1F5F91] hover:bg-[#153E63] disabled:opacity-50 rounded-lg shadow-xs flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Registering with Municipal Engine...' : 'Submit Grievance'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
