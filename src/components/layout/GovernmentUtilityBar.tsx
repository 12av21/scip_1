// SCIP Government Portal - Top Utility Strip
// Follows Indian Government & MyGov.in Accessibility & Information Architecture Standards
import React, { useState } from 'react';
import { Volume2, PhoneCall, HelpCircle, Globe, Eye } from 'lucide-react';

interface GovernmentUtilityBarProps {
  fontSizeLevel: number;
  onAdjustFontSize: (delta: number) => void;
  onResetFontSize: () => void;
  highContrast: boolean;
  onToggleHighContrast: () => void;
  language: 'EN' | 'HI';
  onToggleLanguage: () => void;
  onNavigateHelp?: () => void;
}

export const GovernmentUtilityBar: React.FC<GovernmentUtilityBarProps> = ({
  fontSizeLevel,
  onAdjustFontSize,
  onResetFontSize,
  highContrast,
  onToggleHighContrast,
  language,
  onToggleLanguage,
  onNavigateHelp
}) => {
  return (
    <div className="w-full bg-[#112E4A] text-slate-200 text-[11px] border-b border-[#1A456E]">
      {/* Tricolor Subtle Top Line */}
      <div className="h-[3px] w-full bg-gradient-to-r from-[#E89B36] via-white to-[#28834A]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-1.5 flex flex-wrap items-center justify-between gap-2">
        {/* Left: National Digital Service Indicator */}
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-[#E89B36]" />
          <span className="font-medium text-slate-300 tracking-wide">
            {language === 'HI' ? 'स्मार्ट कम्युनिटी इंटेलिजेंस प्लेटफॉर्म' : 'Smart Community Intelligence Platform'}
          </span>
          <span className="hidden md:inline text-slate-500">|</span>
          <span className="hidden md:inline text-slate-400">
            {language === 'HI' ? 'नागरिक सेवा एवं शिकायत निवारण पोर्टल' : 'Citizen Engagement & Municipal Decision Support Portal'}
          </span>
        </div>

        {/* Right: Accessibility, Language & Helpline Controls */}
        <div className="flex items-center gap-3 sm:gap-4 divide-x divide-[#1E4E7A] text-slate-300">
          {/* Skip to Content */}
          <a
            href="#main-content"
            className="hover:text-white transition-colors underline-offset-2 focus:underline"
          >
            {language === 'HI' ? 'मुख्य सामग्री पर जाएं' : 'Skip to main content'}
          </a>

          {/* Text Size Controls */}
          <div className="pl-3 flex items-center gap-1">
            <span className="text-[10px] text-slate-400 mr-1 hidden sm:inline">Text:</span>
            <button
              onClick={() => onAdjustFontSize(-1)}
              title="Decrease Font Size"
              disabled={fontSizeLevel <= -1}
              className="px-1 py-0.5 hover:text-white disabled:opacity-40 font-bold"
            >
              A-
            </button>
            <button
              onClick={onResetFontSize}
              title="Normal Font Size"
              className={`px-1 py-0.5 hover:text-white font-bold ${fontSizeLevel === 0 ? 'text-[#E89B36]' : ''}`}
            >
              A
            </button>
            <button
              onClick={() => onAdjustFontSize(1)}
              title="Increase Font Size"
              disabled={fontSizeLevel >= 2}
              className="px-1 py-0.5 hover:text-white disabled:opacity-40 font-bold"
            >
              A+
            </button>
          </div>

          {/* Screen Reader Access badge */}
          <div className="pl-3 hidden lg:flex items-center gap-1 text-slate-400 hover:text-slate-200">
            <Volume2 className="w-3 h-3 text-[#28834A]" />
            <span className="text-[10px]">Screen Reader Access</span>
          </div>

          {/* High Contrast Toggle */}
          <button
            onClick={onToggleHighContrast}
            className={`pl-3 flex items-center gap-1 hover:text-white transition-colors cursor-pointer ${highContrast ? 'text-[#E89B36]' : ''}`}
            title="Toggle High Contrast Display"
          >
            <Eye className="w-3 h-3" />
            <span className="hidden sm:inline text-[10px]">
              {highContrast ? 'Normal' : 'High Contrast'}
            </span>
          </button>

          {/* Language Switcher */}
          <button
            onClick={onToggleLanguage}
            className="pl-3 flex items-center gap-1 font-semibold hover:text-[#E89B36] transition-colors cursor-pointer"
            title="Switch Language"
          >
            <Globe className="w-3 h-3 text-[#E89B36]" />
            <span>{language === 'EN' ? 'हिन्दी' : 'English'}</span>
          </button>

          {/* Civic Helpline 1912 */}
          <div className="pl-3 flex items-center gap-1 text-[#E89B36] font-semibold">
            <PhoneCall className="w-3 h-3 shrink-0" />
            <span className="hidden sm:inline text-slate-400 font-normal">Helpline:</span>
            <span className="tracking-wider">1912</span>
          </div>
        </div>
      </div>
    </div>
  );
};
