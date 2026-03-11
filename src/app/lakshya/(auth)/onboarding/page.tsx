'use client';

import { useState, useEffect, useRef, useCallback, DragEvent, ChangeEvent, KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { createClient } from '@/lib/lakshya/supabase-client';
import { ANIMESH_STORIES } from '@/lib/lakshya/story-seeds';
import { ANIMESH_EMAIL } from '@/lib/lakshya/animesh-profile';

// ─── Types ────────────────────────────────────────────────────────────────────

interface UserLike {
  id: string;
  email: string;
  user_metadata: Record<string, string>;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ROLE_OPTIONS = [
  'Lead Frontend Engineer',
  'Staff Frontend Engineer',
  'Principal Frontend Engineer',
  'Engineering Manager',
  'Other',
];

const LOCATION_OPTIONS = ['Remote', 'Delhi NCR', 'Hybrid', 'Mumbai', 'Bangalore', 'Any'];

const DOMAIN_OPTIONS = [
  'Fintech',
  'SaaS',
  'Consumer Tech',
  'Dev Tools',
  'AI/ML',
  'Gaming',
  'Healthcare',
  'E-commerce',
];

const TECH_PRESETS = [
  'React',
  'Next.js',
  'TypeScript',
  'JavaScript',
  'Node.js',
  'Vue',
  'Angular',
  'Python',
  'GraphQL',
  'React Native',
  'PostgreSQL',
  'MongoDB',
  'Docker',
  'AWS',
  'GCP',
  'Webpack',
  'Vite',
];

const STEP_TITLES = [
  'Upload Your Resume',
  'Target Role',
  'Job Preferences',
  'Tech Stack',
  'Apify Setup',
];

// ─── Styles ───────────────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  background: 'var(--lk-surface-2)',
  border: '1px solid var(--lk-border)',
  color: 'var(--lk-text)',
  padding: '10px 14px',
  borderRadius: '8px',
  width: '100%',
  fontSize: '14px',
  fontFamily: 'var(--lk-font)',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s',
};

const labelStyle: React.CSSProperties = {
  color: 'var(--lk-text-2)',
  fontSize: '13px',
  fontWeight: 500,
  marginBottom: '6px',
  display: 'block',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProgressBar({ step }: { step: number }) {
  return (
    <div style={{ display: 'flex', gap: '6px', marginBottom: '24px' }}>
      {Array.from({ length: 5 }, (_, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: '4px',
            borderRadius: '99px',
            background: i < step ? 'var(--lk-gradient)' : 'var(--lk-border)',
            transition: 'background 0.3s',
          }}
        />
      ))}
    </div>
  );
}

function ToggleChip({
  label,
  selected,
  onClick,
  onRemove,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  onRemove?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 12px',
        borderRadius: '99px',
        fontSize: '13px',
        fontFamily: 'var(--lk-font)',
        cursor: 'pointer',
        transition: 'all 0.15s',
        background: selected ? 'var(--lk-cyan-dim)' : 'rgba(255,255,255,0.05)',
        border: selected ? '1px solid var(--lk-cyan)' : '1px solid rgba(255,255,255,0.08)',
        color: selected ? 'var(--lk-cyan)' : 'var(--lk-text-2)',
        fontWeight: selected ? 600 : 400,
      }}
    >
      {label}
      {onRemove && selected && (
        <span
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            fontSize: '10px',
            lineHeight: 1,
            cursor: 'pointer',
            background: 'rgba(34,211,238,0.2)',
            color: 'var(--lk-cyan)',
          }}
        >
          ×
        </span>
      )}
    </button>
  );
}

function FocusInput({
  value,
  onChange,
  placeholder,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement>) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      {...rest}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        ...inputStyle,
        border: focused ? '1px solid var(--lk-cyan)' : '1px solid var(--lk-border)',
      }}
    />
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter();

  // Auth
  const [user, setUser] = useState<UserLike | null>(null);

  // Navigation
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1 — Resume
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [parseError, setParseError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [isParsing, setIsParsing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step 2 — Target Role
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [yearsExp, setYearsExp] = useState(7);
  const [currentCompany, setCurrentCompany] = useState('');
  const [currentRole, setCurrentRole] = useState('');

  // Step 3 — Job Preferences
  const [salaryMin, setSalaryMin] = useState(50);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);

  // Step 4 — Tech Stack
  const [selectedStack, setSelectedStack] = useState<string[]>([]);
  const [customTagInput, setCustomTagInput] = useState('');

  // Step 5 — Apify
  const [apifyKey, setApifyKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [apifyFocused, setApifyFocused] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user as unknown as UserLike));
  }, []);

  // ─── PDF Parsing ─────────────────────────────────────────────────────────

  const parsePdf = useCallback(async (f: File) => {
    setIsParsing(true);
    setParseError(null);
    setExtractedText('');
    setCharCount(0);

    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const pdfjsLib = await import('pdfjs-dist' as any);
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

      const arrayBuffer = await f.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        fullText += textContent.items
          .map((item: any) => ('str' in item ? item.str : ''))
          .join(' ') + '\n';
      }

      const trimmed = fullText.trim() || 'Resume uploaded — manual entry mode';
      setExtractedText(trimmed);
      setCharCount(trimmed.length);
    } catch {
      const fallback = 'Resume uploaded — manual entry mode';
      setExtractedText(fallback);
      setCharCount(fallback.length);
    } finally {
      setIsParsing(false);
    }
  }, []);

  const handleFileAccepted = useCallback(
    (f: File) => {
      if (f.type !== 'application/pdf') {
        setParseError('Only PDF files are accepted.');
        return;
      }
      if (f.size > 5 * 1024 * 1024) {
        setParseError('File is too large. Maximum size is 5MB.');
        return;
      }
      setFile(f);
      setParseError(null);
      parsePdf(f);
    },
    [parsePdf]
  );

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFileAccepted(f);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFileAccepted(f);
  };

  // ─── Toggle Helpers ───────────────────────────────────────────────────────

  function toggle<T>(arr: T[], value: T): T[] {
    return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
  }

  // ─── Validation ───────────────────────────────────────────────────────────

  function validateStep(): string | null {
    if (step === 1) {
      if (!extractedText) return 'Please upload and parse your resume before continuing.';
    }
    if (step === 2) {
      if (selectedRoles.length === 0) return 'Please select at least one target role.';
    }
    if (step === 3) {
      if (selectedLocations.length === 0) return 'Please select at least one location.';
      if (selectedDomains.length === 0) return 'Please select at least one domain.';
    }
    if (step === 4) {
      if (selectedStack.length < 3) return 'Please select at least 3 technologies.';
    }
    return null;
  }

  // ─── Submit ───────────────────────────────────────────────────────────────

  async function handleSubmit() {
    if (!user) return;
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      // 1. Upload PDF to Supabase Storage
      let publicUrl: string | null = null;
      if (file) {
        const storagePath = `${user.id}/resume.pdf`;
        const { error: uploadError } = await supabase.storage
          .from('lakshya-resumes')
          .upload(storagePath, file, { upsert: true });

        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from('lakshya-resumes')
            .getPublicUrl(storagePath);
          publicUrl = urlData?.publicUrl ?? null;
        }
      }

      // 2. Upsert profile
      const profileData = {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || null,
        avatar_url: user.user_metadata?.avatar_url || null,
        resume_text: extractedText,
        resume_url: publicUrl,
        target_roles: selectedRoles,
        target_salary_min: salaryMin,
        target_locations: selectedLocations,
        preferred_domains: selectedDomains,
        tech_stack: selectedStack,
        years_experience: yearsExp,
        current_company: currentCompany || null,
        current_role: currentRole || null,
        apify_key: apifyKey || null,
        scraping_enabled: !!apifyKey,
        scrape_portals: ['linkedin', 'naukri', 'wellfound'],
        scrape_keywords: selectedRoles.map((r) => r.toLowerCase()),
        min_match_score: 50,
        onboarding_complete: true,
      };

      const { error: upsertError } = await supabase
        .from('lakshya_profiles')
        .upsert(profileData);

      if (upsertError) throw upsertError;

      // 3. Seed stories for Animesh
      if (user.email === ANIMESH_EMAIL) {
        const { data: existingStories } = await supabase
          .from('lakshya_stories')
          .select('id')
          .eq('user_id', user.id);

        if (!existingStories || existingStories.length === 0) {
          const storiesToInsert = ANIMESH_STORIES.map((s) => ({
            user_id: user.id,
            company: s.company,
            title: s.title,
            situation: s.situation,
            task: s.task,
            action: s.action,
            result: s.result,
            tags: s.tags,
          }));
          await supabase.from('lakshya_stories').insert(storiesToInsert);
        }
      }

      // 4. Redirect to dashboard
      router.push('/lakshya/dashboard');
    } catch (err) {
      console.error('Onboarding submit error:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setIsLoading(false);
    }
  }

  // ─── Navigation ───────────────────────────────────────────────────────────

  function handleContinue() {
    const validationError = validateStep();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    if (step === 5) {
      handleSubmit();
    } else {
      setStep((s) => s + 1);
    }
  }

  function handleBack() {
    setError(null);
    setStep((s) => Math.max(1, s - 1));
  }

  // ─── Custom tag input ─────────────────────────────────────────────────────

  function handleCustomTagKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      const tag = customTagInput.trim();
      if (tag && !selectedStack.includes(tag)) {
        setSelectedStack((prev) => [...prev, tag]);
      }
      setCustomTagInput('');
    }
  }

  // ─── Slider fill helper ───────────────────────────────────────────────────

  function sliderFill(value: number, min: number, max: number): string {
    const pct = ((value - min) / (max - min)) * 100;
    return `linear-gradient(to right, var(--lk-cyan) ${pct}%, var(--lk-surface-2) ${pct}%)`;
  }

  // ─── Render steps ─────────────────────────────────────────────────────────

  function renderStep1() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Upload zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          style={{
            border: isDragging ? '2px dashed var(--lk-cyan)' : '2px dashed var(--lk-border)',
            borderRadius: '8px',
            padding: '32px',
            textAlign: 'center',
            cursor: 'pointer',
            background: isDragging ? 'var(--lk-cyan-dim)' : 'transparent',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLDivElement).style.border =
              '2px dashed var(--lk-cyan)')
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLDivElement).style.border = isDragging
              ? '2px dashed var(--lk-cyan)'
              : '2px dashed var(--lk-border)')
          }
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            style={{ display: 'none' }}
            onChange={handleFileInput}
          />
          <div style={{ marginBottom: '8px', fontSize: '32px', lineHeight: 1 }}>📄</div>
          {file ? (
            <>
              <p style={{ color: 'var(--lk-cyan)', fontWeight: 600, margin: '0 0 4px' }}>
                {file.name}
              </p>
              <p style={{ color: 'var(--lk-text-muted)', fontSize: '13px', margin: 0 }}>
                Click or drag to replace
              </p>
            </>
          ) : (
            <>
              <p style={{ color: 'var(--lk-text-2)', fontWeight: 500, margin: '0 0 4px' }}>
                Drop your resume here or click to browse
              </p>
              <p style={{ color: 'var(--lk-text-muted)', fontSize: '13px', margin: 0 }}>
                PDF only · Max 5MB
              </p>
            </>
          )}
        </div>

        {/* Parsing indicator */}
        {isParsing && (
          <p style={{ color: 'var(--lk-text-muted)', fontSize: '13px', margin: 0 }}>
            Parsing PDF...
          </p>
        )}

        {/* Parse error */}
        {parseError && (
          <p
            style={{
              color: 'var(--lk-red)',
              fontSize: '13px',
              margin: 0,
              padding: '10px 14px',
              background: 'rgba(239,68,68,0.08)',
              borderRadius: '8px',
              border: '1px solid rgba(239,68,68,0.2)',
            }}
          >
            {parseError}
          </p>
        )}

        {/* Extracted text preview */}
        {extractedText && (
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px',
              }}
            >
              <span style={{ ...labelStyle, margin: 0 }}>Extracted Text</span>
              <span
                style={{
                  fontFamily: 'var(--lk-font-mono)',
                  fontSize: '11px',
                  color: 'var(--lk-text-muted)',
                }}
              >
                {charCount.toLocaleString()} chars
              </span>
            </div>
            <div
              style={{
                background: 'var(--lk-surface-2)',
                borderRadius: '8px',
                padding: '12px',
                maxHeight: '200px',
                overflowY: 'auto',
                fontFamily: 'var(--lk-font-mono)',
                fontSize: '12px',
                color: 'var(--lk-text-muted)',
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {extractedText}
            </div>
          </div>
        )}
      </div>
    );
  }

  function renderStep2() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Role toggles */}
        <div>
          <label style={labelStyle}>Target Roles</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {ROLE_OPTIONS.map((role) => (
              <ToggleChip
                key={role}
                label={role}
                selected={selectedRoles.includes(role)}
                onClick={() => setSelectedRoles((prev) => toggle(prev, role))}
              />
            ))}
          </div>
        </div>

        {/* Years experience slider */}
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px',
            }}
          >
            <label style={{ ...labelStyle, margin: 0 }}>Years of Experience</label>
            <span
              style={{
                fontFamily: 'var(--lk-font-mono)',
                fontSize: '13px',
                color: 'var(--lk-cyan)',
                fontWeight: 600,
              }}
            >
              {yearsExp} {yearsExp === 1 ? 'year' : 'years'}
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={15}
            value={yearsExp}
            onChange={(e) => setYearsExp(Number(e.target.value))}
            style={{
              width: '100%',
              accentColor: 'var(--lk-cyan)',
              background: sliderFill(yearsExp, 1, 15),
              height: '4px',
              borderRadius: '99px',
              outline: 'none',
              cursor: 'pointer',
              appearance: 'none',
              WebkitAppearance: 'none',
            }}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '4px',
            }}
          >
            <span style={{ fontSize: '11px', color: 'var(--lk-text-muted)' }}>1 yr</span>
            <span style={{ fontSize: '11px', color: 'var(--lk-text-muted)' }}>15 yrs</span>
          </div>
        </div>

        {/* Current Company */}
        <div>
          <label style={labelStyle}>Current Company</label>
          <FocusInput
            value={currentCompany}
            onChange={(e) => setCurrentCompany(e.target.value)}
            placeholder="e.g. Airtel Digital"
          />
        </div>

        {/* Current Role */}
        <div>
          <label style={labelStyle}>Current Role</label>
          <FocusInput
            value={currentRole}
            onChange={(e) => setCurrentRole(e.target.value)}
            placeholder="e.g. Lead Frontend Engineer"
          />
        </div>
      </div>
    );
  }

  function renderStep3() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Salary slider */}
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px',
            }}
          >
            <label style={{ ...labelStyle, margin: 0 }}>Minimum Target Salary</label>
            <span
              style={{
                fontFamily: 'var(--lk-font-mono)',
                fontSize: '13px',
                color: 'var(--lk-cyan)',
                fontWeight: 600,
              }}
            >
              ₹{salaryMin} LPA
            </span>
          </div>
          <input
            type="range"
            min={10}
            max={200}
            step={5}
            value={salaryMin}
            onChange={(e) => setSalaryMin(Number(e.target.value))}
            style={{
              width: '100%',
              accentColor: 'var(--lk-cyan)',
              background: sliderFill(salaryMin, 10, 200),
              height: '4px',
              borderRadius: '99px',
              outline: 'none',
              cursor: 'pointer',
              appearance: 'none',
              WebkitAppearance: 'none',
            }}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '4px',
            }}
          >
            <span style={{ fontSize: '11px', color: 'var(--lk-text-muted)' }}>₹10 LPA</span>
            <span style={{ fontSize: '11px', color: 'var(--lk-text-muted)' }}>₹200 LPA</span>
          </div>
        </div>

        {/* Location chips */}
        <div>
          <label style={labelStyle}>Preferred Locations</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {LOCATION_OPTIONS.map((loc) => (
              <ToggleChip
                key={loc}
                label={loc}
                selected={selectedLocations.includes(loc)}
                onClick={() => setSelectedLocations((prev) => toggle(prev, loc))}
              />
            ))}
          </div>
        </div>

        {/* Domain chips */}
        <div>
          <label style={labelStyle}>Preferred Domains</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {DOMAIN_OPTIONS.map((domain) => (
              <ToggleChip
                key={domain}
                label={domain}
                selected={selectedDomains.includes(domain)}
                onClick={() => setSelectedDomains((prev) => toggle(prev, domain))}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  function renderStep4() {
    const unselectedPresets = TECH_PRESETS.filter((t) => !selectedStack.includes(t));

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Selected stack */}
        {selectedStack.length > 0 && (
          <div>
            <label style={labelStyle}>Selected ({selectedStack.length})</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {selectedStack.map((tag) => (
                <ToggleChip
                  key={tag}
                  label={tag}
                  selected={true}
                  onClick={() => setSelectedStack((prev) => prev.filter((t) => t !== tag))}
                  onRemove={() => setSelectedStack((prev) => prev.filter((t) => t !== tag))}
                />
              ))}
            </div>
          </div>
        )}

        {/* Preset options */}
        {unselectedPresets.length > 0 && (
          <div>
            <label style={labelStyle}>Suggested Technologies</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {unselectedPresets.map((tag) => (
                <ToggleChip
                  key={tag}
                  label={tag}
                  selected={false}
                  onClick={() => setSelectedStack((prev) => [...prev, tag])}
                />
              ))}
            </div>
          </div>
        )}

        {/* Custom tag input */}
        <div>
          <label style={labelStyle}>Add Custom Technology</label>
          <FocusInput
            value={customTagInput}
            onChange={(e) => setCustomTagInput(e.target.value)}
            onKeyDown={handleCustomTagKeyDown}
            placeholder="Type a technology and press Enter"
          />
          <p style={{ fontSize: '12px', color: 'var(--lk-text-muted)', margin: '6px 0 0' }}>
            Press Enter to add
          </p>
        </div>

        {selectedStack.length < 3 && (
          <p style={{ fontSize: '13px', color: 'var(--lk-text-muted)', margin: 0 }}>
            Select at least 3 technologies to continue.
          </p>
        )}
      </div>
    );
  }

  function renderStep5() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Info card */}
        <div
          style={{
            borderLeft: '3px solid var(--lk-cyan)',
            background: 'var(--lk-cyan-dim)',
            padding: '16px',
            borderRadius: '8px',
          }}
        >
          <p style={{ color: 'var(--lk-text-2)', fontSize: '14px', margin: '0 0 12px', lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--lk-cyan)' }}>Apify</strong> powers daily job
            scraping from LinkedIn, Naukri, and Wellfound. Create a free account and paste your
            API key below to enable automated job discovery.
          </p>
          <a
            href="https://apify.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'var(--lk-cyan)',
              fontSize: '14px',
              fontWeight: 600,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.textDecoration = 'underline')
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.textDecoration = 'none')
            }
          >
            Create free Apify account →
          </a>
        </div>

        {/* API Key input */}
        <div>
          <label style={labelStyle}>Apify API Key</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showApiKey ? 'text' : 'password'}
              value={apifyKey}
              onChange={(e) => setApifyKey(e.target.value)}
              placeholder="apify_api_xxxxxxxxxxxxxxxxxxxx"
              onFocus={() => setApifyFocused(true)}
              onBlur={() => setApifyFocused(false)}
              style={{
                ...inputStyle,
                border: apifyFocused ? '1px solid var(--lk-cyan)' : '1px solid var(--lk-border)',
                paddingRight: '44px',
              }}
            />
            <button
              type="button"
              onClick={() => setShowApiKey((prev) => !prev)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--lk-text-muted)',
                display: 'flex',
                alignItems: 'center',
                padding: 0,
              }}
            >
              {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Skip link */}
        <p
          onClick={handleSubmit}
          style={{
            color: 'var(--lk-text-muted)',
            fontSize: '13px',
            cursor: 'pointer',
            margin: 0,
            userSelect: 'none',
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLParagraphElement).style.color = 'var(--lk-text-2)')
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLParagraphElement).style.color = 'var(--lk-text-muted)')
          }
        >
          Skip for now — you can add this later in settings
        </p>
      </div>
    );
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        fontFamily: 'var(--lk-font)',
        padding: '48px 16px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '560px',
          background: 'var(--lk-surface)',
          border: '1px solid var(--lk-border)',
          borderRadius: 'var(--lk-radius)',
          padding: '32px',
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: '8px' }}>
          <h1
            style={{
              fontFamily: 'var(--lk-font-mono)',
              color: 'var(--lk-cyan)',
              fontSize: '20px',
              fontWeight: 500,
              margin: '0 0 4px',
              letterSpacing: '-0.5px',
            }}
          >
            लक्ष्य Lakshya
          </h1>
          <p
            style={{
              fontFamily: 'var(--lk-font-mono)',
              color: 'var(--lk-text-muted)',
              fontSize: '12px',
              margin: 0,
            }}
          >
            Step {step} of 5
          </p>
        </div>

        {/* Progress bar */}
        <ProgressBar step={step} />

        {/* Step title */}
        <h2
          style={{
            color: 'var(--lk-text)',
            fontSize: '20px',
            fontWeight: 700,
            margin: '0 0 24px',
          }}
        >
          {STEP_TITLES[step - 1]}
        </h2>

        {/* Step content */}
        <div style={{ marginBottom: '32px' }}>
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
          {step === 5 && renderStep5()}
        </div>

        {/* Error message */}
        {error && (
          <div
            style={{
              color: 'var(--lk-red)',
              fontSize: '13px',
              padding: '10px 14px',
              background: 'rgba(239,68,68,0.08)',
              borderRadius: '8px',
              border: '1px solid rgba(239,68,68,0.2)',
              marginBottom: '16px',
            }}
          >
            {error}
          </div>
        )}

        {/* Navigation buttons */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            justifyContent: step > 1 ? 'space-between' : 'flex-end',
          }}
        >
          {step > 1 && (
            <button
              type="button"
              onClick={handleBack}
              disabled={isLoading}
              style={{
                background: 'transparent',
                color: 'var(--lk-text-2)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '50px',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: 500,
                fontFamily: 'var(--lk-font)',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.5 : 1,
              }}
            >
              Back
            </button>
          )}

          <button
            type="button"
            onClick={handleContinue}
            disabled={isLoading || isParsing}
            style={{
              background: '#ffffff',
              color: '#000000',
              border: 'none',
              borderRadius: '50px',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: 800,
              fontFamily: 'var(--lk-font)',
              cursor: isLoading || isParsing ? 'not-allowed' : 'pointer',
              opacity: isLoading || isParsing ? 0.7 : 1,
              minWidth: '120px',
              transition: 'opacity 0.15s',
            }}
          >
            {isLoading
              ? 'Saving...'
              : isParsing
              ? 'Parsing...'
              : step === 5
              ? 'Complete Setup'
              : 'Continue →'}
          </button>
        </div>
      </div>
    </div>
  );
}
