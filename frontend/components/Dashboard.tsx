import React, { useState, useMemo, useEffect, useRef } from 'react';
import { apiGet, apiPost } from '../api';

const ANTIBIOTICS_CSV = `Name,Family,Usage,Popular Brand Name
Amoxicillin,Penicillin,"Bacterial infections (ear, nose, throat, skin)","Amoxil, Trimox"
Ciprofloxacin,Fluoroquinolone,"Bacterial infections (UTI, respiratory)",Cipro
Doxycycline,Tetracycline,"Bacterial infections, acne, malaria prophylaxis","Vibramycin, Oracea"
Azithromycin,Macrolide,"Bacterial infections (respiratory, skin)","Zithromax, Z-Pak"
Cephalexin,Cephalosporin,"Bacterial infections (skin, bone, ear)",Keflex
Trimethoprim/Sulfamethoxazole,Sulfonamide,"UTIs, MRSA infections","Bactrim, Septra"
Levofloxacin,Fluoroquinolone,"Bacterial infections (pneumonia, UTI, skin)",Levaquin
Clindamycin,Lincosamide,"Bacterial infections (skin, soft tissue)",Cleocin
Metronidazole,Nitroimidazole,"Bacterial and protozoal infections (anaerobic bacteria, trichomoniasis)",Flagyl
Penicillin V,Penicillin,"Streptococcal infections (throat), pneumococcal infections",Veetids
Vancomycin,Glycopeptide,"MRSA infections, severe infections",Vancocin
Erythromycin,Macrolide,"Respiratory tract infections, syphilis",Erythrocin
Tetracycline,Tetracycline,"Acne, bacterial infections",Sumycin
Amikacin,Aminoglycoside,Severe hospital-acquired infections,Amikin
Gentamicin,Aminoglycoside,Severe hospital-acquired infections,Garamycin
Linezolid,Oxazolidinone,"MRSA infections, VRE infections",Zyvox
Nitrofurantoin,Nitrofuran,Urinary tract infections,"Macrobid, Furadantin"
Rifampin,Rifamycin,"Tuberculosis, leprosy",Rifadin
Tobramycin,Aminoglycoside,Severe hospital-acquired infections,Tobrex
Minocycline,Tetracycline,"Acne, bacterial infections",Minocin
Moxifloxacin,Fluoroquinolone,"Respiratory tract infections, conjunctivitis",Avelox
Daptomycin,Lipopeptide,"Skin infections, bloodstream infections",Cubicin
Tigecycline,Glycylcycline,Complicated skin and intra-abdominal infections,Tygacil
Fosfomycin,Phosphonic acid,UTIs,Monurol
Colistin,Polymyxin,Multi-drug resistant infections,"Colomycin, Polymyxin E"
Meropenem,Carbapenem,Severe bacterial infections,Merrem
Isoniazid,Antimycobacterial,Tuberculosis,Nydrazid
Ethambutol,Antimycobacterial,Tuberculosis,Myambutol
Piperacillin/Tazobactam,Penicillin,"Intra-abdominal infections, pneumonia",Zosyn
Ceftriaxone,Cephalosporin,"Bacterial infections, meningitis",Rocephin
Ceftazidime,Cephalosporin,"Bacterial infections, pneumonia","Fortaz, Tazicef"
Cftaroline,Cephalosporin,"Skin infections, pneumonia",Teflaro
Cefepime,Cephalosporin,Hospital-acquired infections,Maxipime
Imipenem/Cilastatin,Carbapenem,Severe bacterial infections,Primaxin
Aztreonam,Monobactam,Gram-negative bacterial infections,Azactam
Teicoplanin,Glycopeptide,"Skin infections, MRSA infections",Targocid
Cefuroxime,Cephalosporin,"Bacterial infections, UTIs","Ceftin, Zinacef"
Cefdinir,Cephalosporin,"Respiratory infections, skin infections",Omnicef
Cefixime,Cephalosporin,Bacterial infections,Suprax
Cefadroxil,Cephalosporin,Skin and throat infections,Duricef
Ceftobiprole,Cephalosporin,"MRSA infections, pneumonia",Zeftera
Dalbavancin,Lipoglycopeptide,Skin and soft tissue infections,Dalvance
Oritavancin,Lipoglycopeptide,Skin and soft tissue infections,Orbactiv
Telavancin,Lipoglycopeptide,Hospital-acquired pneumonia,Vibativ
Tedizolid,Oxazolidinone,Skin and soft tissue infections,Sivextro
Ceftolozane/Tazobactam,Cephalosporin,Complicated intra-abdominal infections,Zerbaxa
Ceftaroline Fosamil,Cephalosporin,"Skin and soft tissue infections, pneumonia",Teflaro
Ertapenem,Carbapenem,Bacterial infections,Invanz
Doripenem,Carbapenem,"Complicated UTIs, intra-abdominal infections",Doribax
Polymyxin B,Polymyxin,Severe bacterial infections,Polymyxin B
Streptomycin,Aminoglycoside,"Tuberculosis, plague",Streptomycin
Neomycin,Aminoglycoside,Topical infections,Neosporin
Bacitracin,Polypeptide,Skin infections,Bacitracin
Spectinomycin,Aminocyclitol,Gonorrhea,Trobicin
Amphotericin B,Polyene,Fungal infections,Fungizone
Nystatin,Polyene,Fungal infections,Nystatin
Ketoconazole,Azole,Fungal infections,Nizoral
Fluconazole,Azole,"Candidiasis, cryptococcal meningitis",Diflucan
Itraconazole,Azole,Fungal infections,Sporanox
Voriconazole,Azole,Fungal infections,Vfend
Clotrimazole,Azole,Fungal infections,Lotrimin
Miconazole,Azole,Fungal infections,Monistat
Terbinafine,Allylamine,Fungal skin infections,Lamisil
Caspofungin,Echinocandin,"Fungal infections, candidiasis",Cancidas
Micafungin,Echinocandin,"Fungal infections, candidiasis",Mycamine
Anidulafungin,Echinocandin,"Fungal infections, candidiasis",Eraxis
Griseofulvin,Antifungal,Fungal infections,Grifulvin V
Posaconazole,Azole,Fungal infections,Noxafil
Isavuconazole,Azole,Fungal infections,Cresemba
Natamycin,Polyene,Fungal eye infections,Natacyn
Rifaximin,Rifamycin,"Traveler's diarrhea, hepatic encephalopathy",Xifaxan
Fidaxomicin,Macrocyclic,C. difficile infections,Dificid
Quinupristin/Dalfopristin,Streptogramin,"Severe skin infections, MRSA",Synercid
Dapsone,Sulfone,"Leprosy, dermatitis herpetiformis",Dapsone
Rifabutin,Rifamycin,"Tuberculosis, MAC infections",Mycobutin
Colistimethate Sodium,Polymyxin,Multi-drug resistant infections,Colomycin
Fosfomycin Tromethamine,Phosphonic acid,UTIs,Monurol
Tinidazole,Nitroimidazole,Protozoal infections,Tindamax
Secnidazole,Nitroimidazole,Bacterial vaginosis,Solosec
Furazolidone,Nitrofuran,Gastrointestinal infections,Furoxone
Chloramphenicol,Amphenicol,"Bacterial infections, typhoid fever",Chloromycetin
Mupirocin,Monoxycarbolic acid,"Impetigo, MRSA nasal colonization",Bactroban
Fusidic Acid,Steroid antibiotic,"Skin infections, MRSA",Fucidin
Trimethoprim,Dihydrofolate reductase inhibitor,"UTIs, respiratory tract infections",Proloprim
Telithromycin,Ketolide,Community-acquired pneumonia,Ketek
Eravacycline,Tetracycline,Complicated intra-abdominal infections,Xerava
Omadacycline,Tetracycline,"Acute bacterial skin infections, community-acquired pneumonia",Nuzyra
Sarecycline,Tetracycline,Acne,Seysara
Lefamulin,Pleuromutilin,Community-acquired bacterial pneumonia,Xenleta
Solithromycin,Macrolide,Community-acquired bacterial pneumonia,Solithera`;

interface Antibiotic {
  name: string;
  family: string;
  usage: string;
  brand: string;
}

const parseCSV = (csv: string): Antibiotic[] => {
  const lines = csv.split('\n');
  const result: Antibiotic[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const parts = [];
    let current = '';
    let inQuotes = false;
    for (let char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        parts.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    parts.push(current.trim());
    if (parts.length >= 4) {
      result.push({
        name: parts[0],
        family: parts[1],
        usage: parts[2],
        brand: parts[3] || 'N/A'
      });
    }
  }
  return result.sort((a, b) => a.name.localeCompare(b.name));
};

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Dataset');

  const tabs = ['Dataset', 'Knowledge & Awareness', 'Risk Lab', 'Selective Pressure', 'Exposure Pathways', 'Tracker', 'Ethics'];

  const UserProfile = ({ onNavigate }: { onNavigate: (tab: string) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [userName, setUserName] = useState('User');
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const storedName = localStorage.getItem('user_name');
      if (storedName) {
        setUserName(storedName);
      }
    }, []);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-full transition-colors"
        >
          <div className="w-9 h-9 bg-[#0F4C75] text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
            {userName.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-bold text-[#0F4C75] hidden md:block">{userName}</span>
          <svg className={`w-4 h-4 text-[#547D9A] transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#E1E8ED] overflow-hidden z-50 animate-[fadeIn_0.2s_ease-out]">
            <div className="p-4 border-b border-[#E1E8ED] bg-[#F8FBFD]">
              <p className="text-sm font-bold text-[#0F4C75]">Welcome back!</p>
              <p className="text-xs text-[#547D9A]">Logged in as {userName}</p>
            </div>
            <div className="p-2">
              <button onClick={() => { onNavigate('Tracker'); setIsOpen(false); }} className="w-full text-left px-4 py-3 rounded-xl hover:bg-[#F0F7F9] text-sm font-semibold text-[#547D9A] hover:text-[#0FA3B1] transition-colors flex items-center gap-3">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                My Course Tracker
              </button>
              <button onClick={() => { onNavigate('Knowledge & Awareness'); setIsOpen(false); }} className="w-full text-left px-4 py-3 rounded-xl hover:bg-[#F0F7F9] text-sm font-semibold text-[#547D9A] hover:text-[#0FA3B1] transition-colors flex items-center gap-3">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                Antibiotic Knowledge
              </button>
              <button onClick={() => { onNavigate('Selective Pressure'); setIsOpen(false); }} className="w-full text-left px-4 py-3 rounded-xl hover:bg-[#F0F7F9] text-sm font-semibold text-[#547D9A] hover:text-[#0FA3B1] transition-colors flex items-center gap-3">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                Selective Pressure
              </button>
              <button onClick={() => { onNavigate('Exposure Pathways'); setIsOpen(false); }} className="w-full text-left px-4 py-3 rounded-xl hover:bg-[#F0F7F9] text-sm font-semibold text-[#547D9A] hover:text-[#0FA3B1] transition-colors flex items-center gap-3">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Exposure Pathways
              </button>
              <div className="h-px bg-[#E1E8ED] my-2"></div>
              <button onClick={() => window.location.reload()} className="w-full text-left px-4 py-3 rounded-xl hover:bg-red-50 text-sm font-bold text-red-500 hover:text-red-600 transition-colors flex items-center gap-3">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const DatasetContext = () => (
    <div className="animate-[fadeIn_0.3s_ease-out]">
      <div className="mb-10 border-b border-[#E1E8ED] pb-6">
        <h2 className="text-3xl font-bold text-[#0F4C75] mb-4">Dataset & Surveillance Context</h2>
        <p className="text-lg text-[#547D9A] max-w-3xl leading-relaxed">
          This initiative leverages global antimicrobial resistance surveillance frameworks (WHO GLASS) to foster data-driven decision-making in public health.
          <br /><span className="text-sm font-semibold mt-2 block">Data Source: WHO GLASS (2018–2023) • Later years are trend-based extrapolations.</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="bg-[#F8FBFD] p-8 rounded-2xl border border-[#E1E8ED] hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#0F4C75] rounded-lg flex items-center justify-center text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-[#0F4C75]">Why Acinetobacter spp.</h3>
          </div>
          <ul className="space-y-3 text-[#547D9A] list-disc pl-5">
            <li>Leading cause of complex hospital-acquired infections.</li>
            <li>Exhibits high levels of multidrug resistance (MDR).</li>
            <li>Classified as a <strong>Critical Priority Pathogen</strong> by the WHO.</li>
            <li>High clinical significance in intensive care (ICU) and surgical settings.</li>
          </ul>
        </div>

        <div className="bg-[#F8FBFD] p-8 rounded-2xl border border-[#E1E8ED] hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#0FA3B1] rounded-lg flex items-center justify-center text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-[#0F4C75]">Why Amikacin</h3>
          </div>
          <ul className="space-y-3 text-[#547D9A] list-disc pl-5">
            <li>A broad-spectrum aminoglycoside essential for treating Gram-negative bacilli.</li>
            <li>Often reserved as a critical option for severe or resistant infections.</li>
            <li>Resistance trends serve as vital indicators for clinical stewardship.</li>
          </ul>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-[#E1E8ED] mb-12">
        <h3 className="text-xl font-bold text-[#0F4C75] mb-4">Clinical & Analytical Justification</h3>
        <p className="text-[#547D9A] leading-relaxed mb-6">
          The selection of the <strong>Amikacin + Acinetobacter spp.</strong> pair is driven by clinical relevance and data robustness rather than arbitrary assumption.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex gap-4">
            <div className="w-2 h-2 rounded-full bg-[#0FA3B1] mt-2 shrink-0"></div>
            <p className="text-sm text-[#547D9A]"><strong>High Data Density:</strong> Strong representation across global surveillance platforms ensures statistical reliability.</p>
          </div>
          <div className="flex gap-4">
            <div className="w-2 h-2 rounded-full bg-[#0FA3B1] mt-2 shrink-0"></div>
            <p className="text-sm text-[#547D9A]"><strong>Consistent Reporting:</strong> Reliable year-wise reporting across multiple geographic regions enables trend analysis.</p>
          </div>
          <div className="flex gap-4">
            <div className="w-2 h-2 rounded-full bg-[#0FA3B1] mt-2 shrink-0"></div>
            <p className="text-sm text-[#547D9A]"><strong>Analytical Suitability:</strong> Ideal for evaluating the emergence of resistance patterns over time.</p>
          </div>
          <div className="flex gap-4">
            <div className="w-2 h-2 rounded-full bg-[#0FA3B1] mt-2 shrink-0"></div>
            <p className="text-sm text-[#547D9A]"><strong>Surveillance Relevance:</strong> Directly aligns with WHO Global Antimicrobial Resistance and Use Surveillance System (GLASS) priorities.</p>
          </div>
        </div>
      </div>
    </div>
  );

  const RiskLab = () => {
    const [countries, setCountries] = useState<string[]>([]);
    const [countriesLoading, setCountriesLoading] = useState(true);
    const [countriesError, setCountriesError] = useState<string | null>(null);
    const [country, setCountry] = useState('');
    const [year, setYear] = useState('2023');
    const [isCalculating, setIsCalculating] = useState(false);
    const [whyExpanded, setWhyExpanded] = useState(false);
    const [result, setResult] = useState<{
      assessment: string;
      color: string;
      bg: string;
      text: string;
      confidence: 'High' | 'Moderate';
    } | null>(null);

    useEffect(() => {
      console.log('[Risk Lab] Fetching countries...');
      setCountriesLoading(true);
      setCountriesError(null);
      apiGet<unknown>('/countries')
        .then((data) => {
          console.log('[Risk Lab] API data received:', data);
          const raw = Array.isArray(data) ? data : [];
          console.log('[Risk Lab] Is array:', Array.isArray(data), 'Length:', raw.length);
          const list = raw.filter((c): c is string => typeof c === 'string').map((s) => s.trim()).filter(Boolean);
          console.log('[Risk Lab] Processed countries list:', list);
          console.log('[Risk Lab] State set - countries count:', list.length);
          setCountries(list);
          setCountriesError(null);
        })
        .catch((err) => {
          console.error('[Risk Lab] Failed to load countries:', err);
          setCountriesError(err instanceof Error ? err.message : 'Failed to load countries');
          setCountries([]);
        })
        .finally(() => {
          console.log('[Risk Lab] Loading complete');
          setCountriesLoading(false);
        });
    }, []);

    const isExtrapolated = parseInt(year) >= 2024;

    const handleEstimate = async () => {
      if (!country) return;

      setIsCalculating(true);
      setResult(null);
      setWhyExpanded(false);

      try {
        const data = await apiPost<{
          assessment: string;
          explanation?: string;
        }>('/predict', { country, year: parseInt(year) });

        const confidence =
          country === "Global" || country === "United States"
            ? "High"
            : "Moderate";

        const map: Record<string, { color: string; bg: string; text: string }> = {
          "Lower selective pressure observed": {
            color: "#10B981",
            bg: "#ECFDF5",
            text:
              "Current surveillance patterns suggest limited selective pressure, reducing the survival advantage of resistant bacteria."
          },
          "Moderate selective pressure observed": {
            color: "#F59E0B",
            bg: "#FFFBEB",
            text:
              "Observed patterns indicate increasing selective pressure, allowing partially resistant strains to persist."
          },
          "Higher probability of resistant strains surviving": {
            color: "#EF4444",
            bg: "#FEF2F2",
            text:
              "Repeated exposure patterns increase the survival advantage of resistant bacterial strains over time."
          }
        };

        const entry = map[data.assessment] ?? {
          color: "#6B7280",
          bg: "#F3F4F6",
          text: data.explanation ?? "Assessment completed."
        };

        setResult({
          assessment: data.assessment,
          color: entry.color,
          bg: entry.bg,
          text: data.explanation ?? entry.text,
          confidence,
        });
      } catch (err) {
        console.error('[Risk Lab] Predict failed:', err);
        const msg = err instanceof Error ? err.message : "Failed to fetch resistance risk";
        alert(msg);
      } finally {
        setIsCalculating(false);
      }
    };

    return (
      <div className="animate-[fadeIn_0.3s_ease-out]">
        <div className="mb-8 border-b border-[#E1E8ED] pb-6">
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-3xl font-bold text-[#0F4C75]">Resistance Analysis Lab</h2>
            {isExtrapolated && (
              <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-widest rounded-full border border-amber-200 flex items-center gap-1.5 animate-pulse">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                Extrapolation (2024–2025)
              </span>
            )}
          </div>
          <p className="text-lg text-[#547D9A] max-w-2xl leading-relaxed">
            Estimate potential selective pressure levels using consolidated surveillance trends.
            <br />
            <span className="text-sm mt-3 inline-block group relative cursor-help border-b border-dashed border-[#547D9A]">
              Selected surveillance pair: Acinetobacter spp. + Amikacin
              <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-64 p-2 bg-[#0F4C75] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg text-center">
                Selection is based on data availability, not clinical importance.
              </span>
            </span>
            <span className="block mt-4 p-3 bg-blue-50 text-[#0F4C75] text-sm font-medium rounded-xl border border-blue-100 italic max-w-xl">
              This pathogen–antibiotic pair is shown because sufficient surveillance data is available for meaningful population-level analysis.
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#F8FBFD] p-6 rounded-2xl border border-[#E1E8ED]">
              <h3 className="text-sm font-bold text-[#0F4C75] uppercase tracking-wider mb-6">Configuration</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#547D9A] mb-2">Region / Country</label>
                  {countriesError && (
                    <p className="text-sm text-red-500 mb-2 font-medium">{countriesError}</p>
                  )}
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    disabled={countriesLoading}
                    className="w-full px-4 py-3 bg-white border border-[#E1E8ED] rounded-xl text-[#0F3C5C] focus:ring-2 focus:ring-[#0FA3B1] outline-none transition-all disabled:opacity-60"
                  >
                    <option value="">
                      {countriesLoading ? "Loading countries…" : countries.length === 0 && !countriesError ? "No countries available" : "Select country"}
                    </option>
                    {countries.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  {!countriesLoading && !countriesError && countries.length === 0 && (
                    <p className="text-sm text-amber-600 mt-2 font-medium">No countries available from API.</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#547D9A] mb-2">Surveillance Year</label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-[#E1E8ED] rounded-xl text-[#0F3C5C] focus:ring-2 focus:ring-[#0FA3B1] outline-none transition-all"
                  >
                    {['2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018'].map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-[#E1E8ED]">
                {/* Removed 'Coming Soon' section as requested */}
              </div>
              <button
                onClick={handleEstimate}
                disabled={!country || isCalculating}
                className={`w-full mt-8 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-3 ${!country || isCalculating
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-[#0F4C75] text-white hover:bg-[#1a5a85] shadow-lg shadow-[#0F4C75]/10 active:scale-[0.98]'
                  }`}
              >
                {isCalculating ? 'Processing...' : 'Generate Surveillance Insight'}
              </button>
            </div>
          </div>

          <div className="lg:col-span-7">
            {result ? (
              <div className="h-full bg-white rounded-[2.5rem] border border-[#E1E8ED] shadow-sm p-8 animate-[fadeIn_0.6s_ease-out]">
                <div className="flex justify-between items-start mb-6">
                  <h4 className="text-4xl font-black" style={{ color: result.color }}>{result.assessment}</h4>
                  <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full border ${result.confidence === 'High' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                    {result.confidence} Confidence
                  </span>
                </div>
                <p className="text-[#547D9A] mb-6 text-lg">{result.text}</p>

                <button
                  onClick={() => setWhyExpanded(!whyExpanded)}
                  className="text-sm font-bold text-[#0F4C75] flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity"
                >
                  <svg className={`w-4 h-4 transition-transform ${whyExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  Why this result?
                </button>

                {whyExpanded && (
                  <div className="p-5 bg-[#F8FBFD] rounded-2xl border border-[#E1E8ED] mb-6 animate-[fadeIn_0.3s_ease-out]">
                    <p className="text-sm text-[#547D9A] leading-relaxed">
                      This estimate is based on the interaction between <strong>Acinetobacter spp.</strong> and <strong>Amikacin</strong> in the selected region ({country}).
                      Historical surveillance data from 2018–2023 indicates patterns consistent with
                      <strong> {result.assessment.toLowerCase()}</strong>.
                      {isExtrapolated && ' Since you selected a future year, this result reflects a statistical projection based on past trends.'}
                    </p>
                  </div>
                )}

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-xs text-[#547D9A]">
                  Disclaimer: Educational research indicator; not for clinical diagnosis. Not medical advice.
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[400px] border-2 border-dashed border-[#E1E8ED] rounded-[2.5rem] flex items-center justify-center text-center p-10">
                <p className="text-[#547D9A]">Select region and year to generate risk estimate.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const TrackerSection = () => {
    const [log, setLog] = useState<{
      name: string;
      startDate: string;
      duration: number;
      status: string;
      reason: string;
      doseTiming: string[];
      checkedDoses: Record<string, boolean>;
    }>({
      name: '',
      startDate: new Date().toISOString().split('T')[0],
      duration: 7,
      status: 'Not started',
      reason: '',
      doseTiming: [],
      checkedDoses: {}
    });
    const [savedLog, setSavedLog] = useState<any>(null);

    useEffect(() => {
      const stored = localStorage.getItem('amr_atlas_course_tracker');
      if (stored) {
        setSavedLog(JSON.parse(stored));
      }
    }, []);

    const handleSave = () => {
      localStorage.setItem('amr_atlas_course_tracker', JSON.stringify(log));
      setSavedLog(log);
    };

    const calculateProgress = () => {
      if (!savedLog) return 0;
      if (savedLog.status === 'Completed') return 100;

      if (savedLog.doseTiming && savedLog.doseTiming.length > 0) {
        const totalDoses = savedLog.duration * savedLog.doseTiming.length;
        const taken = Object.values(savedLog.checkedDoses || {}).filter(Boolean).length;
        if (totalDoses === 0) return 0;
        return Math.round((taken / totalDoses) * 100);
      }

      if (savedLog.status === 'Not started') return 0;

      const start = new Date(savedLog.startDate);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      const progress = Math.min(100, Math.max(0, (diffDays / savedLog.duration) * 100));
      return Math.round(progress);
    };

    const progress = calculateProgress();

    return (
      <div className="animate-[fadeIn_0.3s_ease-out]">
        <div className="mb-8 border-b border-[#E1E8ED] pb-6">
          <h2 className="text-3xl font-bold text-[#0F4C75] mb-4">Antibiotic Course Tracker</h2>
          <p className="text-lg text-[#547D9A] max-w-2xl leading-relaxed">
            Monitor and reflect on your antibiotic courses for stewardship awareness. Responsible completion is vital for preventing the emergence of resistant bacteria.
            <span className="block mt-2 text-sm italic font-medium">Personal awareness tool; not a clinical reminder system.</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Input Side */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#F8FBFD] p-8 rounded-[2.5rem] border border-[#E1E8ED] shadow-sm">
              <h3 className="text-sm font-bold text-[#0F4C75] uppercase tracking-wider mb-6">Course Log</h3>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-[#547D9A] uppercase mb-2">Antibiotic Name</label>
                  <input
                    type="text"
                    value={log.name}
                    onChange={e => setLog({ ...log, name: e.target.value })}
                    placeholder="e.g., Amoxicillin"
                    className="w-full px-5 py-3.5 bg-white border border-[#E1E8ED] rounded-2xl outline-none focus:ring-2 focus:ring-[#0FA3B1] text-[#0F3C5C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#547D9A] uppercase mb-2">Reason for taking</label>
                  <input
                    type="text"
                    value={log.reason}
                    onChange={e => setLog({ ...log, reason: e.target.value })}
                    placeholder="e.g., Strep Throat"
                    className="w-full px-5 py-3.5 bg-white border border-[#E1E8ED] rounded-2xl outline-none focus:ring-2 focus:ring-[#0FA3B1] text-[#0F3C5C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#547D9A] uppercase mb-2">Dose Timing</label>
                  <div className="flex flex-wrap gap-3">
                    {['Morning', 'Afternoon', 'Night'].map(t => (
                      <label key={t} className="flex items-center gap-2 cursor-pointer bg-white px-4 py-2 rounded-xl border border-[#E1E8ED]">
                        <input
                          type="checkbox"
                          checked={log.doseTiming?.includes(t)}
                          onChange={e => {
                            const current = log.doseTiming || [];
                            const newTimings = e.target.checked
                              ? [...current, t]
                              : current.filter(x => x !== t);
                            setLog({ ...log, doseTiming: newTimings });
                          }}
                          className="w-4 h-4 text-[#0F4C75] rounded focus:ring-[#0FA3B1]"
                        />
                        <span className="text-sm font-bold text-[#547D9A]">{t}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#547D9A] uppercase mb-2">Start Date</label>
                    <input
                      type="date"
                      value={log.startDate}
                      onChange={e => setLog({ ...log, startDate: e.target.value })}
                      className="w-full px-5 py-3.5 bg-white border border-[#E1E8ED] rounded-2xl outline-none focus:ring-2 focus:ring-[#0FA3B1] text-[#0F3C5C]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#547D9A] uppercase mb-2">Duration (Days)</label>
                    <input
                      type="number"
                      value={log.duration}
                      onChange={e => setLog({ ...log, duration: parseInt(e.target.value) || 0 })}
                      className="w-full px-5 py-3.5 bg-white border border-[#E1E8ED] rounded-2xl outline-none focus:ring-2 focus:ring-[#0FA3B1] text-[#0F3C5C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#547D9A] uppercase mb-2">Current Status</label>
                  <div className="flex flex-wrap gap-2">
                    {['Not started', 'In progress', 'Stopped early', 'Completed'].map(s => (
                      <button
                        key={s}
                        onClick={() => setLog({ ...log, status: s })}
                        className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${log.status === s
                          ? 'bg-[#0F4C75] text-white border-[#0F4C75]'
                          : 'bg-white text-[#547D9A] border-[#E1E8ED] hover:border-[#0FA3B1]'
                          }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleSave}
                  className="w-full py-4 bg-[#0FA3B1] text-white font-bold rounded-2xl shadow-xl shadow-[#0FA3B1]/20 hover:bg-[#12B4C3] transition-all"
                >
                  Save Tracker Log
                </button>
              </div>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-[#E1E8ED] shadow-sm mt-6">
              <h3 className="text-sm font-bold text-[#0F4C75] uppercase tracking-wider mb-4">Your Antibiotic Use Patterns</h3>
              <div className="space-y-3">
                {/* Mock logic for "stopped early" - in real app would aggregate history */}
                {log.status === 'Stopped early' && (
                  <p className="text-sm text-[#0F4C75] font-medium">You have stopped 1 antibiotic course(s) before completion.</p>
                )}
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                  <p className="text-xs text-amber-800 font-medium">Incomplete antibiotic exposure increases the survival advantage of resistant bacteria.</p>
                </div>
                {log.status === 'Completed' && (
                  <div className="p-3 bg-green-50 rounded-xl border border-green-100">
                    <p className="text-xs text-green-800 font-medium" title="Insight derived from observed antibiotic use patterns.">Completing full courses reduces the survival window for resistant bacterial strains.</p>
                  </div>
                )}
                <div className="p-3 bg-red-50 rounded-xl border border-red-100">
                  <p className="text-xs text-red-800 font-medium" title="Insight derived from observed antibiotic use patterns.">Repeated incomplete courses increase selective pressure over time, even without immediate symptoms.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Visualization Side */}
          <div className="lg:col-span-7">
            {savedLog ? (
              <div className="h-full bg-white rounded-[3rem] border border-[#E1E8ED] shadow-sm p-10 flex flex-col animate-[fadeIn_0.6s_ease-out]">
                <div className="flex justify-between items-start mb-12">
                  <div>
                    <span className="text-[10px] font-bold text-[#547D9A] uppercase tracking-widest block mb-2">Active Course Reflection</span>
                    <h4 className="text-5xl font-black text-[#0F4C75] tracking-tight">{savedLog.name || 'Untitled Course'}</h4>
                  </div>
                  <div className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-tighter border ${savedLog.status === 'Completed' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                    }`}>
                    {savedLog.status}
                  </div>
                </div>

                <div className="flex-grow space-y-12">
                  <div>
                    <div className="flex justify-between items-end mb-3">
                      <h5 className="text-sm font-bold text-[#0F4C75] uppercase tracking-widest">Course Progress</h5>
                      <span className="text-3xl font-black text-[#0FA3B1]">{progress}%</span>
                    </div>
                    <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden border border-gray-100 shadow-inner">
                      <div
                        className="h-full bg-gradient-to-r from-[#0F4C75] to-[#0FA3B1] transition-all duration-1000 ease-out"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="p-6 bg-[#F8FBFD] rounded-3xl border border-[#E1E8ED]">
                      <p className="text-[10px] font-bold text-[#547D9A] uppercase mb-2">Initiated</p>
                      <p className="text-xl font-bold text-[#0F4C75]">{savedLog.startDate}</p>
                    </div>
                    <div className="p-6 bg-[#F8FBFD] rounded-3xl border border-[#E1E8ED]">
                      <p className="text-[10px] font-bold text-[#547D9A] uppercase mb-2">Total Duration</p>
                      <p className="text-xl font-bold text-[#0F4C75]">{savedLog.duration} Days</p>
                    </div>
                  </div>

                  {savedLog.doseTiming && savedLog.doseTiming.length > 0 && (
                    <div className="bg-[#F8FBFD] p-6 rounded-3xl border border-[#E1E8ED]">
                      <h5 className="text-sm font-bold text-[#0F4C75] uppercase mb-4">Dose Checklist</h5>
                      <div className="max-h-60 overflow-y-auto custom-scrollbar pr-2">
                        {Array.from({ length: savedLog.duration }).map((_, dayIdx) => (
                          <div key={dayIdx} className="mb-4 last:mb-0">
                            <p className="text-xs font-bold text-[#547D9A] mb-2">Day {dayIdx + 1}</p>
                            <div className="flex flex-wrap gap-2">
                              {savedLog.doseTiming.map((timing: string) => {
                                const key = `d${dayIdx}-${timing}`;
                                const isChecked = savedLog.checkedDoses?.[key] || false;
                                return (
                                  <button
                                    key={key}
                                    onClick={() => {
                                      const newChecks = { ...(savedLog.checkedDoses || {}), [key]: !isChecked };
                                      const newLog = { ...savedLog, checkedDoses: newChecks };
                                      setSavedLog(newLog);
                                      localStorage.setItem('amr_atlas_course_tracker', JSON.stringify(newLog));
                                    }}
                                    className={`flex-1 py-2 px-3 rounded-lg border text-xs font-bold transition-all ${isChecked
                                      ? 'bg-[#0FA3B1] text-white border-[#0FA3B1]'
                                      : 'bg-white text-[#547D9A] border-[#E1E8ED] hover:border-[#0FA3B1]'
                                      }`}
                                  >
                                    {isChecked ? '✓' : ''} {timing}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 mt-6">
                    <p className="text-sm text-[#547D9A] font-medium leading-relaxed">
                      {(progress < 100 && progress > 0) || savedLog.status === 'Stopped early'
                        ? "Skipping doses allows partially resistant bacteria to recover and multiply."
                        : savedLog.status === 'Completed'
                          ? "Completion reduces the opportunity for resistant bacteria to survive."
                          : "Track your course to see determining factors for resistance selection."}
                    </p>
                  </div>
                  <div className="mt-8">
                    <h3 className="text-sm font-bold text-[#0F4C75] uppercase tracking-wider mb-3">How your behavior affects bacterial survival</h3>
                    <p className="text-sm text-[#547D9A] leading-relaxed bg-[#F8FBFD] p-4 rounded-xl border border-[#E1E8ED]">
                      {(savedLog.status === 'Stopped early' || progress < 100)
                        ? "Incomplete exposure allows partially resistant bacteria to survive and dominate future infections."
                        : "Completion reduces the survival window for resistant strains, limiting future treatment difficulty."}
                    </p>
                  </div>
                </div>

                <div className="mt-10 pt-6 border-t border-[#E1E8ED] flex justify-between items-center">
                  <p className="text-[10px] text-[#547D9A] font-medium leading-relaxed italic max-w-xs">
                    Disclaimer: This tracker is for personal awareness only and does not replace professional medical advice.
                  </p>
                  <button
                    onClick={() => {
                      localStorage.removeItem('amr_atlas_course_tracker');
                      setSavedLog(null);
                    }}
                    className="text-[10px] font-bold text-red-400 uppercase tracking-widest hover:text-red-600 transition-colors"
                  >
                    Clear History
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[500px] border-2 border-dashed border-[#E1E8ED] rounded-[3rem] flex flex-col items-center justify-center text-center p-12">
                <div className="w-24 h-24 bg-[#F0F7F9] rounded-full flex items-center justify-center mb-6">
                  <svg className="w-12 h-12 text-[#0FA3B1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <h4 className="text-2xl font-bold text-[#0F4C75] mb-4">No Active Course</h4>
                <p className="text-[#547D9A] max-w-sm leading-relaxed">
                  Log your prescribed antibiotic course in the section to the left to visualize your completion progress and awareness data.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const ExplorerSection = () => {
    const antibiotics = useMemo(() => parseCSV(ANTIBIOTICS_CSV), []);
    const [selectedName, setSelectedName] = useState('');
    const selectedAntibiotic = useMemo(() => antibiotics.find(a => a.name === selectedName), [selectedName, antibiotics]);

    return (
      <div className="animate-[fadeIn_0.3s_ease-out]">
        <div className="mb-8 border-b border-[#E1E8ED] pb-6">
          <div className="mb-8 border-b border-[#E1E8ED] pb-6">
            <h2 className="text-3xl font-bold text-[#0F4C75] mb-4">Explore Antibiotics</h2>
            <p className="text-lg text-[#547D9A] max-w-2xl leading-relaxed">
              Educational reference tool for understanding antibiotic classifications.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-[#F8FBFD] p-6 rounded-2xl border border-[#E1E8ED]">
              <label className="block text-sm font-bold text-[#0F4C75] uppercase tracking-wider mb-4">Select Antibiotic</label>
              <select value={selectedName} onChange={(e) => setSelectedName(e.target.value)} className="w-full px-4 py-4 bg-white border border-[#E1E8ED] rounded-xl text-[#0F3C5C] font-semibold focus:ring-2 focus:ring-[#0FA3B1] outline-none shadow-sm">
                <option value="">— Search metadata —</option>
                {antibiotics.map(a => <option key={a.name} value={a.name}>{a.name}</option>)}
              </select>
            </div>
          </div>
          <div className="lg:col-span-7">
            {selectedAntibiotic ? (
              <div className="h-full bg-white rounded-[2.5rem] border border-[#E1E8ED] shadow-sm p-10 flex flex-col overflow-hidden animate-[fadeIn_0.4s_ease-out]">
                <h4 className="text-5xl font-black text-[#0F4C75] mb-10 tracking-tight">{selectedAntibiotic.name}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                  <div className="p-6 bg-[#F8FBFD] rounded-2xl border border-[#E1E8ED]">
                    <h5 className="text-[10px] font-bold text-[#547D9A] uppercase mb-2 tracking-widest">Family</h5>
                    <p className="text-xl font-bold text-[#0F4C75]">{selectedAntibiotic.family}</p>
                  </div>
                  <div className="p-6 bg-[#F8FBFD] rounded-2xl border border-[#E1E8ED]">
                    <h5 className="text-[10px] font-bold text-[#547D9A] uppercase mb-2 tracking-widest">Brand</h5>
                    <p className="text-xl font-bold text-[#0FA3B1]">{selectedAntibiotic.brand}</p>
                  </div>
                </div>
                <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100 flex-grow">
                  <h5 className="text-[10px] font-bold text-[#0F4C75] uppercase mb-4 tracking-widest">General Clinical Usage</h5>
                  <p className="text-[#547D9A] leading-relaxed text-lg italic mb-4">"{selectedAntibiotic.usage}"</p>
                  <p className="text-[10px] text-[#547D9A] font-medium border-t border-gray-200 pt-4">Disclaimer: Educational reference only.</p>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[500px] border-2 border-dashed border-[#E1E8ED] rounded-[2.5rem] flex flex-col items-center justify-center text-center p-12">
                <h4 className="text-2xl font-bold text-[#0F4C75] mb-4">Knowledge Explorer</h4>
                <p className="text-[#547D9A] max-w-sm leading-relaxed">Select an antibiotic from the library to view its scientific profile.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };


  const AwarenessSection = () => {
    const [answers, setAnswers] = useState<Record<number, string | null>>({});
    const [showResults, setShowResults] = useState(false);

    const questions = [
      { id: 1, text: "Have you ever stopped an antibiotic course early?", options: ["Yes", "No", "Prefer not to say"] },
      { id: 2, text: "Do you sometimes skip doses when symptoms improve?", options: ["Yes", "No", "Prefer not to say"] },
      { id: 3, text: "Have you reused leftover antibiotics?", options: ["Yes", "No", "Prefer not to say"] }
    ];

    const handleAnswer = (qId: number, ans: string) => {
      setAnswers(prev => ({ ...prev, [qId]: ans }));
    };

    const isAllAnswered = questions.every(q => answers[q.id]);

    return (
      <div className="animate-[fadeIn_0.3s_ease-out]">
        <div className="mb-8 border-b border-[#E1E8ED] pb-6">
          <h2 className="text-3xl font-bold text-[#0F4C75] mb-4">Reflect on Your Antibiotic Use</h2>
          <p className="text-lg text-[#547D9A] max-w-2xl leading-relaxed">
            Behavioral Survey
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-6">
              {questions.map((q, idx) => (
                <div key={q.id} className="p-6 bg-white border border-[#E1E8ED] rounded-[2rem] shadow-sm transition-all hover:border-[#0FA3B1]/30">
                  <p className="text-base font-semibold text-[#0F4C75] leading-relaxed mb-4">{q.text}</p>
                  <div className="flex gap-3">
                    {q.options.map(choice => (
                      <button
                        key={choice}
                        onClick={() => handleAnswer(q.id, choice)}
                        className={`px-6 py-2 rounded-full text-xs font-bold border transition-all ${answers[q.id] === choice ? 'bg-[#0FA3B1] text-white border-[#0FA3B1]' : 'bg-white text-[#547D9A] border-[#E1E8ED]'
                          }`}
                      >
                        {choice}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {isAllAnswered ? (
              <div className="p-6 bg-[#0FA3B1] rounded-2xl text-white shadow-lg animate-[fadeIn_0.3s_ease-out]">
                <p className="text-lg font-bold leading-relaxed">
                  {Object.values(answers).filter(a => a === 'Yes').length >= 2
                    ? "Repeated interruptions in antibiotic use increase the likelihood of resistant bacteria surviving over time."
                    : "Consistent antibiotic use reduces opportunities for resistance selection."}
                </p>
              </div>
            ) : (
              <p className="text-sm text-[#547D9A] italic">Complete all questions to submit.</p>
            )}
          </div>
          <div className="hidden lg:block lg:col-span-5">
            <div className="h-full bg-[#E0F2F5] rounded-[3rem] opacity-30"></div>
          </div>
        </div>
      </div>
    );
  };

  const SelectivePressureLab = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filterBreadth, setFilterBreadth] = useState<'All' | 'Narrow' | 'Moderate' | 'Broad'>('All');
    const [showGroupingInfo, setShowGroupingInfo] = useState(false);

    useEffect(() => {
      console.log('[Selective Pressure] Fetching data...');
      setLoading(true);
      setError(null);
      apiGet<unknown>('/selective-pressure')
        .then((res) => {
          console.log('[Selective Pressure] Raw API response:', res);
          console.log('[Selective Pressure] Response type:', typeof res, 'Is array:', Array.isArray(res));
          const arr = Array.isArray(res) ? res : [];
          console.log('[Selective Pressure] Parsed array length:', arr.length);
          console.log('[Selective Pressure] First item sample:', arr.length > 0 ? arr[0] : 'empty');
          console.log('[Selective Pressure] State set - data count:', arr.length);
          setData(arr);
          setError(null);
        })
        .catch((err) => {
          console.error('[Selective Pressure] Failed to load:', err);
          setError(err instanceof Error ? err.message : 'Failed to load selective pressure data');
          setData([]);
        })
        .finally(() => {
          console.log('[Selective Pressure] Loading complete, loading state set to false');
          setLoading(false);
        });
    }, []);

    const exposureMap: Record<string, string> = {
      "All": "all",
      "Narrow": "narrow_exposure",
      "Moderate": "moderate_exposure",
      "Broad": "broad_exposure",
    };

    const grouped = useMemo(() => {
      console.log('[Selective Pressure] Computing grouped data, input data length:', data.length, 'filter:', filterBreadth);
      const target = exposureMap[filterBreadth];
      const filteredData = filterBreadth === 'All'
        ? data
        : data.filter((d: any) => {
            const cluster = d.exposure_cluster != null ? String(d.exposure_cluster) : '';
            return cluster === target;
          });

      console.log('[Selective Pressure] Filtered data length:', filteredData.length);

      const map: Record<string, string[]> = {};
      filteredData.forEach((d: any) => {
        const cluster = d.exposure_cluster != null ? String(d.exposure_cluster) : 'unknown';
        const name = (d.PathogenName != null ? String(d.PathogenName) : 'Unknown').trim();
        if (!name) return;
        if (!map[cluster]) map[cluster] = [];
        map[cluster].push(name);
      });
      console.log('[Selective Pressure] Grouped map keys:', Object.keys(map), 'Total groups:', Object.keys(map).length);
      return map;
    }, [data, filterBreadth]);

    // Render-time state check
    console.log('[Selective Pressure] Render - loading:', loading, 'error:', error, 'data length:', data.length, 'grouped keys:', Object.keys(grouped).length);

    return (
      <div className="animate-[fadeIn_0.3s_ease-out]">
        <div className="mb-8 border-b border-[#E1E8ED] pb-6">
          <h2 className="text-3xl font-bold text-[#0F4C75] mb-4">Selective Pressure Lab</h2>
          <p className="text-lg text-[#547D9A] max-w-2xl leading-relaxed">
            Population-level insights into how exposure contexts shape bacterial survival advantages.
          </p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <p className="text-xs text-[#547D9A] font-medium italic">
            Only pathogens with sufficient reported exposure data are shown to ensure meaningful population-level grouping.
          </p>
          <div className="relative">
            <select
              value={filterBreadth}
              onChange={(e) => setFilterBreadth(e.target.value as any)}
              className="px-4 py-2 bg-white border border-[#E1E8ED] rounded-xl text-sm font-bold text-[#0F4C75] focus:outline-none focus:ring-2 focus:ring-[#0FA3B1] shadow-sm cursor-pointer"
            >
              <option value="All">Filter by exposure breadth: All</option>
              <option value="Narrow">Narrow exposure</option>
              <option value="Moderate">Moderate exposure</option>
              <option value="Broad">Broad exposure</option>
            </select>
          </div>
        </div>

        {error ? (
          <div className="p-12 text-center border-2 border-dashed border-red-200 rounded-[2.5rem] bg-red-50">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        ) : loading ? (
          <div className="p-12 text-center border-2 border-dashed border-[#E1E8ED] rounded-[2.5rem]">
            <p className="text-[#547D9A]">Loading selective pressure data…</p>
          </div>
        ) : Object.keys(grouped).length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(grouped).map(([category, items]: [string, any], idx: number) => (
              <div key={idx} className="bg-[#F8FBFD] p-6 rounded-2xl border border-[#E1E8ED] hover:shadow-md transition-shadow group/card relative">
                <div className="flex items-center gap-3 mb-4 cursor-help" title="Represents exposure breadth observed across multiple treatment contexts.">
                  <div className={`w-3 h-3 rounded-full ${category.toLowerCase().includes('broad') ? 'bg-red-400' : category.toLowerCase().includes('moderate') ? 'bg-amber-400' : 'bg-green-400'}`}></div>
                  <h3 className="text-xl font-bold text-[#0F4C75]">{category.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</h3>
                </div>
                <p className="text-xs text-[#547D9A] font-medium mb-3 italic">This grouping reflects repeated antibiotic exposure contexts observed in surveillance data.</p>
                <ul className="space-y-3">
                  {items.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-[#547D9A] text-sm font-medium bg-white p-3 rounded-xl border border-[#E1E8ED] hover:border-[#0FA3B1] transition-colors cursor-help" title="Grouped based on repeated exposure environments.">
                      <span>•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center border-2 border-dashed border-[#E1E8ED] rounded-[2.5rem]">
            <p className="text-[#547D9A]">No selective pressure data available.</p>
          </div>
        )}

        <div className="mt-8">
          <button
            onClick={() => setShowGroupingInfo(!showGroupingInfo)}
            className="flex items-center gap-2 text-xs font-bold text-[#547D9A] hover:text-[#0FA3B1] transition-colors"
          >
            <svg className={`w-4 h-4 transition-transform ${showGroupingInfo ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            How are these groupings formed?
          </button>
          {showGroupingInfo && (
            <div className="mt-4 p-4 bg-[#F0F7F9] rounded-xl border border-[#E1E8ED] text-xs text-[#547D9A] leading-relaxed animate-[fadeIn_0.3s_ease-out]">
              Clusters are derived from aggregated exposure patterns observed across surveillance records, not individual outcomes.
            </div>
          )}
        </div>
      </div >
    );
  };

  const ExposurePathwaysExplorer = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<'most' | 'least'>('most');

    useEffect(() => {
      console.log('[Exposure Pathways] Fetching data...');
      setLoading(true);
      setError(null);
      apiGet<unknown>('/exposure-pathways')
        .then((res) => {
          console.log('[Exposure Pathways] Raw API response:', res);
          console.log('[Exposure Pathways] Response type:', typeof res, 'Is array:', Array.isArray(res));
          const raw = Array.isArray(res) ? res : [];
          console.log('[Exposure Pathways] Parsed array length:', raw.length);
          console.log('[Exposure Pathways] First item sample:', raw.length > 0 ? raw[0] : 'empty');
          console.log('[Exposure Pathways] State set - data count:', raw.length);
          setData(raw);
          setError(null);
        })
        .catch((err) => {
          console.error('[Exposure Pathways] Failed to load:', err);
          setError(err instanceof Error ? err.message : 'Failed to load exposure pathways');
          setData([]);
        })
        .finally(() => {
          console.log('[Exposure Pathways] Loading complete, loading state set to false');
          setLoading(false);
        });
    }, []);

    const sortedData = useMemo(() => {
      console.log('[Exposure Pathways] Computing sorted data, input length:', data.length, 'sort order:', sortOrder);
      const sorted = [...data].sort((a, b) => {
        const sa = Number((a as any).exposure_score) || 0;
        const sb = Number((b as any).exposure_score) || 0;
        return sortOrder === 'most' ? sb - sa : sa - sb;
      });
      console.log('[Exposure Pathways] Sorted data length:', sorted.length);
      return sorted;
    }, [data, sortOrder]);

    // Render-time state check
    console.log('[Exposure Pathways] Render - loading:', loading, 'error:', error, 'data length:', data.length, 'sorted length:', sortedData.length);

    return (
      <div className="animate-[fadeIn_0.3s_ease-out]">
        <div className="mb-8 border-b border-[#E1E8ED] pb-6">
          <h2 className="text-3xl font-bold text-[#0F4C75] mb-4">Exposure Pathways Explorer</h2>
          <p className="text-lg text-[#547D9A] max-w-2xl leading-relaxed">
            Visualizing frequent pathogen–antibiotic exposure routes in surveillance records.
          </p>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-[#E1E8ED] p-8 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-[#0F4C75] uppercase tracking-wider">Observed Exposure Frequency</h3>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'most' | 'least')}
              className="text-xs font-bold text-[#0F4C75] bg-[#F8FBFD] border border-[#E1E8ED] rounded-lg px-3 py-1 outline-none focus:ring-2 focus:ring-[#0FA3B1] cursor-pointer"
            >
              <option value="most">Sort pathways by: Most frequent</option>
              <option value="least">Sort pathways by: Least frequent</option>
            </select>
          </div>
          <div className="space-y-4">
            {error ? (
              <div className="py-12 text-center rounded-2xl bg-red-50 border border-red-200">
                <p className="text-red-600 font-medium">{error}</p>
              </div>
            ) : loading ? (
              <p className="text-[#547D9A] text-center py-12">Loading exposure pathways…</p>
            ) : sortedData.length === 0 ? (
              <div className="py-12 text-center rounded-2xl border-2 border-dashed border-[#E1E8ED]">
                <p className="text-[#547D9A] font-medium">No exposure pathways data available.</p>
              </div>
            ) : (
              sortedData.map((pathway: any, idx: number) => {
                const pathogen = pathway.PathogenName ?? 'Unknown';
                const antibiotic = pathway.AntibioticName ?? 'Unknown';
                const score = Number(pathway.exposure_score) || 0;
                return (
                  <div key={idx} className="relative group hover:bg-[#F0F7F9] p-2 rounded-xl transition-colors cursor-help" title="Observed repeatedly across surveillance reports.">
                    <div className="flex justify-between items-center mb-2 z-10 relative">
                      <div className="flex items-center gap-4">
                        <span className="w-6 h-6 rounded-full bg-[#0F4C75] text-white flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                        <span className="text-base font-bold text-[#0F4C75]">{pathogen} <span className="text-[#547D9A] mx-2">→</span> {antibiotic}</span>
                      </div>
                      <span className="text-sm font-bold text-[#0FA3B1]">{Math.round(score * 100)}%</span>
                    </div>
                    <div className="h-2 bg-[#F8FBFD] rounded-full w-full overflow-hidden">
                      <div className="h-full bg-[#0FA3B1] rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, Math.round(score * 100))}%` }}></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="mt-8 text-center pt-4 border-t border-[#E1E8ED]">
            <p className="text-xs text-[#547D9A] font-medium block mb-1">Observed frequency reflects reported exposure patterns.</p>
            <p className="text-xs text-[#547D9A] font-medium block mt-2">Frequent exposure pathways increase selective pressure by repeatedly favoring bacteria that survive antibiotic environments.</p>
            <p className="text-[10px] text-[#547D9A] opacity-70 mt-2">Frequency does not imply resistance or treatment failure.</p>
          </div>
        </div>
      </div>
    );
  };

  const AntibioticResistanceSimulation = () => {
    const [stage, setStage] = useState(0); // 0: Init, 1: Enter, 2: Eliminate, 3: Survive, 4: Regrowth/Stop, 5: Future
    const [userDecision, setUserDecision] = useState<'none' | 'complete' | 'stop_early'>('none');
    const [particles, setParticles] = useState<any[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const requestRef = useRef<number>();

    const initializeParticles = () => {
      const initParticles = [];
      const count = 40; // Increased count
      for (let i = 0; i < count; i++) {
        // 20% resistant (red), 80% susceptible (green)
        const isResistant = i < count * 0.2;
        initParticles.push({
          id: i,
          type: isResistant ? 'resistant' : 'susceptible',
          x: 20 + Math.random() * 60,
          y: 20 + Math.random() * 60,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          status: 'alive',
          opacity: 1,
          scale: 0.5 + Math.random() * 0.5,
          pulseOffset: Math.random() * 100,
        });
      }
      setParticles(initParticles);
    };

    // Initialize on mount
    useEffect(() => {
      initializeParticles();
    }, []);

    // Animation Loop
    useEffect(() => {
      const animate = () => {
        setParticles(prev => prev.map(p => {
          if (p.status === 'dead') return p;

          let newX = p.x + p.vx;
          let newY = p.y + p.vy;

          // Soft Boundary (bounce)
          if (newX <= 5 || newX >= 95) p.vx *= -1;
          if (newY <= 5 || newY >= 95) p.vy *= -1;

          // Jitter / Brownian motion
          newX += (Math.random() - 0.5) * 0.05;
          newY += (Math.random() - 0.5) * 0.05;

          // Stage logic impacts
          let newStatus = p.status;
          let newOpacity = p.opacity;
          let newScale = p.scale;

          if (stage >= 2 && p.type === 'susceptible' && p.status === 'alive') {
            // Die off in stage 2
            if (Math.random() < 0.04) {
              newStatus = 'dying';
            }
          }

          if (newStatus === 'dying') {
            newOpacity -= 0.02;
            newScale += 0.01; // Swell before popping
            if (newOpacity <= 0) {
              newStatus = 'dead';
              newOpacity = 0;
            }
          }

          return { ...p, x: newX, y: newY, vx: p.vx, vy: p.vy, status: newStatus, opacity: newOpacity, scale: newScale };
        }));
        requestRef.current = requestAnimationFrame(animate);
      };

      requestRef.current = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(requestRef.current!);
    }, [stage]);

    // Regrowth Effect
    useEffect(() => {
      if (stage === 4 && userDecision === 'stop_early') {
        const interval = setInterval(() => {
          setParticles(prev => {
            const deadIdx = prev.findIndex(p => p.status === 'dead');
            if (deadIdx !== -1) {
              const newParticles = [...prev];
              newParticles[deadIdx] = {
                ...newParticles[deadIdx],
                status: 'alive',
                type: 'resistant',
                opacity: 1,
                scale: 0.8,
                vx: (Math.random() - 0.5) * 0.8,
                vy: (Math.random() - 0.5) * 0.8
              };
              return newParticles;
            }
            return prev;
          });
        }, 150);
        return () => clearInterval(interval);
      }
    }, [stage, userDecision]);

    const handleStart = () => {
      setStage(1);
      setTimeout(() => setStage(2), 2500);
      setTimeout(() => setStage(3), 7500);
    };

    const handleReset = () => {
      setStage(0);
      setUserDecision('none');
      initializeParticles(); // Explicit re-init
    };

    const handleDecision = (decision: 'complete' | 'stop_early') => {
      setUserDecision(decision);
      if (decision === 'stop_early') {
        setStage(4);
        setTimeout(() => setStage(5), 4000);
      } else {
        setStage(4);
        setTimeout(() => setStage(5), 4000);
      }
    };

    return (
      <div className="animate-[fadeIn_0.3s_ease-out] mb-16">
        <div className="mb-10 border-b border-[#E1E8ED] pb-6">
          <h2 className="text-4xl font-black text-[#0F4C75] mb-4">Interactive Simulation: The Resistance Mechanism</h2>
          <p className="text-xl text-[#547D9A] max-w-3xl leading-relaxed">
            Experience why completing your antibiotic course is critical. Watch how resistant bacteria survive and thrive when treatment is interrupted.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-[3rem] border border-[#E1E8ED] p-10 shadow-lg">
          {/* Left Panel: Context & Controls */}
          <div className="relative bg-[#F0F7F9] rounded-[2rem] p-8 min-h-[500px] flex flex-col justify-between overflow-hidden border border-[#E1E8ED] shadow-inner transition-all duration-500">

            {/* Dynamic Background Pulse */}
            <div className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${stage >= 1 && stage < 4 ? 'opacity-100' : 'opacity-0'}`}>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-blue-100/30 rounded-full animate-pulse blur-3xl"></div>
            </div>

            <div className="z-10 relative">
              <div className="inline-block px-4 py-1.5 bg-white rounded-full text-[#547D9A] text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
                Stage {stage === 0 ? '0' : stage}/5
              </div>

              <h3 className="text-3xl font-bold text-[#0F4C75] mb-6 leading-tight min-h-[4rem]">
                {stage === 0 && "Bacterial Population"}
                {stage === 1 && "Antibiotics Entering System"}
                {stage === 2 && "Eliminating Susceptible Bacteria"}
                {stage === 3 && "Survival of Resistant Strains"}
                {stage === 4 && userDecision === 'stop_early' && "RAPID Regrowth Detected"}
                {stage === 4 && userDecision === 'complete' && "Suppressing Regrowth"}
                {stage === 5 && userDecision === 'stop_early' && "Dominance of Resistance"}
                {stage === 5 && userDecision === 'complete' && "Successful Eradication"}
              </h3>

              <p className="text-xl text-[#547D9A] leading-relaxed font-medium">
                {stage === 0 && "This is a colony of bacteria causing an infection. Most are susceptible (Green), but a few random mutations are naturally resistant (Red)."}
                {stage === 1 && "The antibiotic treatment begins. The medication floods the system, targeting the bacterial cell walls."}
                {stage === 2 && "The antibiotic works! Bacteria without defense mechanisms (Susceptible) are being destroyed rapidly."}
                {stage === 3 && "Wait! The resistant bacteria (Red) are still alive. They have shields or pumps that pump the medicine out."}
                {stage === 4 && userDecision === 'stop_early' && "By stopping now, the surviving resistant bacteria have no competition. They multiply aggressively!"}
                {stage === 4 && userDecision === 'complete' && "Continuing the course keeps the pressure on, preventing the resistant bacteria from multiplying freely."}
                {stage === 5 && userDecision === 'stop_early' && "The infection returns, but now it's untreatable by the same antibiotic. You have bred a superbug."}
                {stage === 5 && userDecision === 'complete' && "The infection is cleared. Your immune system cleaned up the weakened stragglers. No resistance spread."}
              </p>
            </div>

            <div className="z-10 mt-12">
              {stage === 0 && (
                <button onClick={handleStart} className="w-full py-5 bg-[#0F4C75] text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-900/10 hover:shadow-blue-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Start Treatment Simulation
                </button>
              )}

              {stage === 3 && userDecision === 'none' && (
                <div className="space-y-4 animate-[fadeIn_0.5s_ease-out]">
                  <div className="p-4 bg-white/80 backdrop-blur rounded-2xl border border-blue-100 shadow-lg">
                    <p className="text-base font-bold text-[#0F4C75] text-center mb-4">
                      You feel 90% better. The symptoms are gone. <br />What do you do?
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <button onClick={() => handleDecision('complete')} className="py-4 bg-[#0FA3B1] text-white rounded-xl font-bold hover:bg-[#12b4c3] transition-all shadow-lg shadow-teal-500/20 hover:-translate-y-1">
                        ✅ Complete Full Course
                      </button>
                      <button onClick={() => handleDecision('stop_early')} className="py-4 bg-[#EF4444] text-white rounded-xl font-bold hover:bg-[#f87171] transition-all shadow-lg shadow-red-500/20 hover:-translate-y-1">
                        ❌ Stop Early
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {stage === 5 && (
                <button onClick={handleReset} className="w-full py-4 bg-white text-[#547D9A] border-2 border-[#E1E8ED] rounded-2xl font-bold hover:bg-[#F8FBFD] hover:text-[#0F4C75] transition-all flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  Reset Simulation
                </button>
              )}
            </div>
          </div>

          {/* Right Panel: Visualization */}
          <div className="relative bg-[#1A2634] rounded-[2rem] p-6 lg:min-h-[500px] flex flex-col items-center justify-center overflow-hidden shadow-inner border border-[#2C3E50]" ref={containerRef}>

            {/* Legend */}
            <div className="absolute top-6 right-6 flex flex-col gap-2 z-20 bg-[#2C3E50]/80 backdrop-blur p-3 rounded-xl border border-white/10">
              <div className="flex items-center gap-3 text-white/90">
                <span className="w-3 h-3 rounded-full bg-[#4ADE80] shadow-[0_0_10px_#4ADE80]"></span>
                <span className="text-xs font-bold uppercase tracking-wider">Susceptible</span>
              </div>
              <div className="flex items-center gap-3 text-white/90">
                <span className="w-3 h-3 rounded-full bg-[#EF4444] shadow-[0_0_10px_#EF4444]"></span>
                <span className="text-xs font-bold uppercase tracking-wider">Resistant</span>
              </div>
            </div>

            {/* Petri Dish Effect */}
            <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-full border-4 border-white/5 bg-[#0F172A] shadow-[inset_0_0_60px_rgba(0,0,0,0.8)] backdrop-blur-sm overflow-hidden flex items-center justify-center">

              {/* Grid/Context lines */}
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

              {particles.map(p => (
                <div
                  key={p.id}
                  className={`absolute rounded-full transition-all duration-300 ease-out flex items-center justify-center ${p.type === 'resistant' ? 'z-10' : 'z-0'}`}
                  style={{
                    left: `${p.x}%`,
                    top: `${p.y}%`,
                    width: p.type === 'resistant' ? '14px' : '10px',
                    height: p.type === 'resistant' ? '14px' : '10px',
                    opacity: p.opacity,
                    transform: `scale(${p.scale})`
                  }}
                >
                  <div className={`w-full h-full rounded-full ${p.type === 'resistant' ? 'bg-[#EF4444] shadow-[0_0_15px_#EF4444]' : 'bg-[#4ADE80] shadow-[0_0_8px_#4ADE80]'}`}></div>
                  {/* Nucleus for visual detail */}
                  <div className="w-[30%] h-[30%] bg-white/40 rounded-full"></div>
                </div>
              ))}

              {/* Center Label for Stage 5 */}
              {stage === 5 && userDecision === 'stop_early' && (
                <div className="absolute inset-0 flex items-center justify-center bg-red-900/20 backdrop-blur-[2px] animate-[fadeIn_1s_ease-out]">
                  <h4 className="text-3xl font-black text-red-500 uppercase tracking-widest rotate-[-15deg] border-4 border-red-500 px-6 py-2 rounded-xl mix-blend-screen">FAILURE</h4>
                </div>
              )}
              {stage === 5 && userDecision === 'complete' && (
                <div className="absolute inset-0 flex items-center justify-center bg-green-900/20 backdrop-blur-[2px] animate-[fadeIn_1s_ease-out]">
                  <h4 className="text-3xl font-black text-green-500 uppercase tracking-widest border-4 border-green-500 px-6 py-2 rounded-xl mix-blend-screen">CLEARED</h4>
                </div>
              )}
            </div>
          </div>
        </div>
        <p className="text-center text-xs font-medium text-[#547D9A] mt-8 opacity-70">
          This simulation uses a simplified probabilistic model to demonstrate selective pressure mechanisms. It is for educational purposes only.
        </p>
      </div>
    );
  };


  const SimulatorSection = () => {
    const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

    return (
      <div className="animate-[fadeIn_0.4s_ease-out]">

        <div className="bg-white p-6 rounded-[2.5rem] border border-[#E1E8ED] shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#0F4C75]">Scenario Explorer</h2>
              <p className="text-sm text-[#547D9A]">Explore hypothetical antibiotic use scenarios.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div onClick={() => setSelectedScenario("skipped")} className={`p-4 rounded-2xl border transition-all cursor-pointer group hover:shadow-md ${selectedScenario === 'skipped' ? 'bg-[#E0F2F5] border-[#0FA3B1]' : 'bg-[#F8FBFD] border-[#E1E8ED]'}`} title="Illustrative scenario for learning purposes.">
              <h4 className="text-base font-bold text-[#0F4C75] mb-1 group-hover:text-[#0FA3B1] transition-colors">Skipped Doses</h4>
              <p className="text-xs text-[#547D9A]">Visualize how irregular dosing creates windows for bacterial recovery.</p>
            </div>
            <div onClick={() => setSelectedScenario("early")} className={`p-4 rounded-2xl border transition-all cursor-pointer group hover:shadow-md ${selectedScenario === 'early' ? 'bg-[#E0F2F5] border-[#0FA3B1]' : 'bg-[#F8FBFD] border-[#E1E8ED]'}`} title="Illustrative scenario for learning purposes.">
              <h4 className="text-base font-bold text-[#0F4C75] mb-1 group-hover:text-[#0FA3B1] transition-colors">Premature Stop</h4>
              <p className="text-xs text-[#547D9A]">See the population rebound effect when treatment ends too early.</p>
            </div>
          </div>
          <div className="w-full h-32 bg-[#F0F7F9] rounded-xl flex items-center justify-center border-2 border-dashed border-[#E1E8ED] p-6 text-center">
            {selectedScenario === "skipped" && (
              <p className="text-sm font-bold text-[#0F4C75] animate-[fadeIn_0.3s_ease-out]">
                Irregular dosing creates recovery windows where partially resistant bacteria can repopulate.
              </p>
            )}

            {selectedScenario === "early" && (
              <p className="text-sm font-bold text-[#0F4C75] animate-[fadeIn_0.3s_ease-out]">
                Ending treatment early allows surviving bacteria to expand rapidly.
              </p>
            )}

            {!selectedScenario && <p className="text-xs text-[#547D9A] font-medium">Select a scenario to view the simulation curve</p>}
          </div>
          <div className="mt-4 text-[10px] text-[#547D9A] font-medium text-center opacity-70">
            This simulation is illustrative and does not predict real outcomes.
          </div>
        </div>
      </div>
    );
  };

  const AnonymousUsageInsights = () => (
    <div className="mt-16 p-8 bg-[#F8FBFD] rounded-[2.5rem] border border-[#E1E8ED]">
      <h3 className="text-xl font-bold text-[#0F4C75] mb-6">Anonymous Usage Insights</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-[#E1E8ED]">
          <p className="text-3xl font-black text-[#0FA3B1] mb-2">42%</p>
          <p className="text-sm text-[#547D9A] font-medium">of users report stopping courses early.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[#E1E8ED]">
          <p className="text-3xl font-black text-[#0FA3B1] mb-2">Day 3–4</p>
          <p className="text-sm text-[#547D9A] font-medium">Most commonly skipped day.</p>
        </div>
      </div>
      <p className="text-center text-[10px] text-[#547D9A] mt-8 uppercase tracking-widest">Aggregated insights are anonymous and educational.</p>
    </div>
  );

  const KnowledgeAwarenessSection = () => (
    <div className="space-y-12 animate-[fadeIn_0.3s_ease-out]">
      <AntibioticResistanceSimulation />
      <div className="space-y-12">
        <div title="Used to reflect common usage patterns.">
          <AwarenessSection />
        </div>
        <div title="Classification based on chemical structure.">
          <ExplorerSection />
        </div>
      </div>
      <SimulatorSection />
      <AnonymousUsageInsights />
    </div>
  );

  const EthicsSection = () => (
    <div className="animate-[fadeIn_0.3s_ease-out]">
      <div className="mb-8 border-b border-[#E1E8ED] pb-6">
        <h2 className="text-3xl font-bold text-[#0F4C75] mb-4">Ethics & Disclaimer</h2>
      </div>
      <div className="bg-white p-10 rounded-[2.5rem] border border-[#E1E8ED] shadow-sm space-y-6">
        <div className="space-y-4">
          <p className="text-lg text-[#547D9A] leading-relaxed font-medium">Platform Purpose</p>
          <p className="text-base text-[#547D9A] leading-relaxed">This platform is strictly for education and awareness regarding antimicrobial resistance trends.</p>
        </div>

        <div className="h-px bg-[#E1E8ED]"></div>

        <div className="space-y-4">
          <p className="text-lg text-[#547D9A] leading-relaxed font-medium">Data Limitations</p>
          <p className="text-base text-[#547D9A] leading-relaxed">Insights are based on historical surveillance data (WHO GLASS/Kaggle) and do not reflect real-time hospital statuses. Future-dated results are statistical extrapolations.</p>
        </div>

        <div className="h-px bg-[#E1E8ED]"></div>

        <div className="space-y-4">
          <p className="text-lg text-[#547D9A] leading-relaxed font-medium">Medical Disclaimer</p>
          <p className="text-base text-[#547D9A] leading-relaxed">
            This platform does <strong>not</strong> provide medical advice, diagnosis, or treatment.
            The calculated "Surveillance-based indicators" and "Misuse Impacts" are educational simulations.
            Users should always consult qualified healthcare professionals for medical decisions.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F0F4F7]">
      <nav className="bg-white border-b border-[#E1E8ED] sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          <div className="flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
            {tabs.map((item) => (
              <button
                key={item}
                onClick={() => setActiveTab(item)}
                className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === item
                  ? 'bg-[#0FA3B1] text-white shadow-lg shadow-[#0FA3B1]/20'
                  : 'text-[#547D9A] hover:bg-[#F0F7F9] hover:text-[#0FA3B1]'
                  }`}
              >
                {item}
              </button>
            ))}
          </div>

          <UserProfile onNavigate={(tab) => setActiveTab(tab)} />
        </div>
      </nav>

      <div className="container mx-auto p-6 md:p-10">
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-[#E1E8ED]">
          {activeTab === 'Dataset' && <DatasetContext />}
          {activeTab === 'Risk Lab' && <RiskLab />}
          {activeTab === 'Selective Pressure' && <SelectivePressureLab />}
          {activeTab === 'Exposure Pathways' && <ExposurePathwaysExplorer />}
          {activeTab === 'Knowledge & Awareness' && <KnowledgeAwarenessSection />}
          {activeTab === 'Tracker' && <TrackerSection />}
          {activeTab === 'Ethics' && <EthicsSection />}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(15, 163, 177, 0.3);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
