"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Bot,
  Mic,
  Code2,
  Briefcase,
  Layers,
  HelpCircle,
  Check,
  Plus,
  X,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateInterviewAction } from "@/lib/actions/general.action";
import Agent from "@/components/Agent";

const POPULAR_ROLES = [
  "Frontend Developer",
  "Backend Engineer",
  "Full Stack Developer",
  "DevOps Engineer",
  "AI & ML Engineer",
  "Mobile Developer",
  "System Architect",
];

const POPULAR_TECHS = [
  "React",
  "TypeScript",
  "Next.js",
  "Node.js",
  "Python",
  "Docker",
  "AWS",
  "PostgreSQL",
  "GraphQL",
  "Tailwind CSS",
  "Redis",
];

const EXPERIENCE_LEVELS = [
  { id: "Junior", label: "Junior (0-2 yrs)", desc: "Core fundamentals & syntax" },
  { id: "Mid", label: "Mid-Level (3-5 yrs)", desc: "Practical problem solving & frameworks" },
  { id: "Senior", label: "Senior (5+ yrs)", desc: "Architecture, trade-offs & scaling" },
  { id: "Lead", label: "Lead / Principal (8+ yrs)", desc: "Strategy, mentorship & system design" },
];

const INTERVIEW_TYPES = [
  { id: "Technical", label: "Technical Focus", desc: "Code, algorithms & architecture" },
  { id: "Mixed", label: "Mixed (Balanced)", desc: "Blend of tech & behavioral" },
  { id: "Behavioral", label: "Behavioral & Leadership", desc: "STAR method, teamwork & conflict" },
];

interface Props {
  user: User;
}

export default function InterviewGeneratorForm({ user }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"form" | "voice">("form");

  const [role, setRole] = useState("Frontend Developer");
  const [level, setLevel] = useState("Mid");
  const [type, setType] = useState("Mixed");
  const [company, setCompany] = useState("");
  const [amount, setAmount] = useState(5);
  const [selectedTechs, setSelectedTechs] = useState<string[]>([
    "React",
    "TypeScript",
    "Next.js",
  ]);
  const [customTech, setCustomTech] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleTech = (t: string) => {
    if (selectedTechs.includes(t)) {
      setSelectedTechs(selectedTechs.filter((item) => item !== t));
    } else {
      setSelectedTechs([...selectedTechs, t]);
    }
  };

  const addCustomTech = () => {
    const trimmed = customTech.trim();
    if (trimmed && !selectedTechs.includes(trimmed)) {
      setSelectedTechs([...selectedTechs, trimmed]);
      setCustomTech("");
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role.trim()) {
      toast.error("Please enter a job role.");
      return;
    }

    setIsGenerating(true);
    try {
      const res = await generateInterviewAction({
        role,
        level,
        techstack: selectedTechs.length > 0 ? selectedTechs : ["General Software Engineering"],
        type,
        amount,
        userId: user.id,
        company: company || undefined,
      });

      if (res.success && res.interviewId) {
        toast.success("Interview created successfully!");
        router.push(`/interview/${res.interviewId}`);
      } else {
        toast.error("Failed to generate interview. Please try again.");
        setIsGenerating(false);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(`Generation error: ${err?.message || err}`);
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto">
      {/* Mode Switcher Tabs */}
      <div className="flex items-center gap-3 p-1.5 rounded-2xl bg-dark-200 border border-white/10 w-fit">
        <button
          type="button"
          onClick={() => setActiveTab("form")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === "form"
              ? "bg-primary-200 text-dark-100 shadow-md"
              : "text-light-100/70 hover:text-light-100"
          }`}
        >
          <Sparkles className="size-4" />
          <span>Interactive AI Setup</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("voice")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === "voice"
              ? "bg-primary-200 text-dark-100 shadow-md"
              : "text-light-100/70 hover:text-light-100"
          }`}
        >
          <Mic className="size-4" />
          <span>Vapi Voice Call</span>
        </button>
      </div>

      {activeTab === "voice" ? (
        <div className="card-border w-full">
          <div className="card flex flex-col gap-6 p-8">
            <div>
              <h3 className="text-2xl text-primary-100 flex items-center gap-2">
                <Bot className="size-6 text-primary-200" /> Voice Interview Assistant
              </h3>
              <p className="text-light-100/70 mt-1">
                Have a conversational voice call with our AI agent to dynamically configure your interview.
              </p>
            </div>
            <Agent userName={user.name} userId={user.id} type="generate" />
          </div>
        </div>
      ) : (
        <form onSubmit={handleGenerate} className="flex flex-col gap-8">
          {/* Section 1: Role & Company */}
          <div className="card-border w-full">
            <div className="card flex flex-col gap-6 p-6 md:p-8">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary-200/20 text-primary-200 border border-primary-200/30">
                  <Briefcase className="size-5" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-primary-100">Target Role & Company</h4>
                  <p className="text-xs text-light-100/60">What position are you preparing for?</p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-sm font-medium text-light-100">Job Title / Role</label>
                <Input
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer"
                  className="bg-dark-100 border-white/10"
                  required
                />
                <div className="flex flex-wrap gap-2 mt-1">
                  {POPULAR_ROLES.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                        role === r
                          ? "bg-primary-200/20 border-primary-200 text-primary-100"
                          : "border-white/10 bg-white/5 text-light-100/70 hover:border-white/20"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-light-100">
                  Target Company or Industry (Optional)
                </label>
                <Input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Google, Stripe, High-growth SaaS, FinTech"
                  className="bg-dark-100 border-white/10"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Experience Level & Focus */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Experience Level */}
            <div className="card-border w-full">
              <div className="card flex flex-col gap-4 p-6">
                <div className="flex items-center gap-2">
                  <Layers className="size-4 text-primary-200" />
                  <h4 className="font-semibold text-primary-100">Experience Level</h4>
                </div>
                <div className="flex flex-col gap-2">
                  {EXPERIENCE_LEVELS.map((lvl) => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setLevel(lvl.id)}
                      className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                        level === lvl.id
                          ? "border-primary-200 bg-primary-200/10 text-primary-100"
                          : "border-white/10 bg-white/5 text-light-100/70 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-medium text-sm">{lvl.label}</span>
                        {level === lvl.id && <Check className="size-4 text-primary-200" />}
                      </div>
                      <span className="text-xs text-light-100/60 mt-0.5">{lvl.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Interview Focus */}
            <div className="card-border w-full">
              <div className="card flex flex-col gap-4 p-6">
                <div className="flex items-center gap-2">
                  <Code2 className="size-4 text-primary-200" />
                  <h4 className="font-semibold text-primary-100">Interview Focus</h4>
                </div>
                <div className="flex flex-col gap-2">
                  {INTERVIEW_TYPES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setType(t.id)}
                      className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                        type === t.id
                          ? "border-primary-200 bg-primary-200/10 text-primary-100"
                          : "border-white/10 bg-white/5 text-light-100/70 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-medium text-sm">{t.label}</span>
                        {type === t.id && <Check className="size-4 text-primary-200" />}
                      </div>
                      <span className="text-xs text-light-100/60 mt-0.5">{t.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Tech Stack */}
          <div className="card-border w-full">
            <div className="card flex flex-col gap-5 p-6 md:p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code2 className="size-4 text-primary-200" />
                  <h4 className="font-semibold text-primary-100">Tech Stack & Tools</h4>
                </div>
                <span className="text-xs text-light-100/60">
                  {selectedTechs.length} selected
                </span>
              </div>

              {/* Selected Pills */}
              <div className="flex flex-wrap gap-2 min-h-10 p-3 rounded-xl bg-dark-100 border border-white/10">
                {selectedTechs.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary-200/20 text-primary-100 text-xs font-medium border border-primary-200/30"
                  >
                    {t}
                    <button
                      type="button"
                      onClick={() => toggleTech(t)}
                      className="hover:text-destructive-100"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
                {selectedTechs.length === 0 && (
                  <span className="text-xs text-light-100/40 italic">
                    Select technologies below or type custom ones...
                  </span>
                )}
              </div>

              {/* Popular Techs Grid */}
              <div className="flex flex-wrap gap-2">
                {POPULAR_TECHS.map((tech) => {
                  const isSelected = selectedTechs.includes(tech);
                  return (
                    <button
                      key={tech}
                      type="button"
                      onClick={() => toggleTech(tech)}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                        isSelected
                          ? "bg-primary-200 text-dark-100 font-semibold border-primary-200"
                          : "border-white/10 bg-white/5 text-light-100/70 hover:border-white/20"
                      }`}
                    >
                      {tech}
                    </button>
                  );
                })}
              </div>

              {/* Add Custom Tech */}
              <div className="flex items-center gap-2 max-w-sm mt-1">
                <Input
                  value={customTech}
                  onChange={(e) => setCustomTech(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCustomTech();
                    }
                  }}
                  placeholder="Add custom tech..."
                  className="bg-dark-100 border-white/10 text-xs h-9"
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={addCustomTech}
                  className="h-9 px-3 text-xs"
                >
                  <Plus className="size-3.5 mr-1" /> Add
                </Button>
              </div>
            </div>
          </div>

          {/* Section 4: Question Count & Submit */}
          <div className="card-border w-full">
            <div className="card flex flex-col md:flex-row items-center justify-between gap-6 p-6">
              <div className="flex items-center gap-3">
                <HelpCircle className="size-5 text-primary-200" />
                <div>
                  <h4 className="font-semibold text-primary-100">Number of Questions</h4>
                  <p className="text-xs text-light-100/60">Choose your practice duration</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {[3, 5, 7, 10].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setAmount(num)}
                    className={`size-10 rounded-xl font-bold text-sm border transition-all ${
                      amount === num
                        ? "bg-primary-200 text-dark-100 border-primary-200"
                        : "border-white/10 bg-white/5 text-light-100/70 hover:border-white/20"
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>

              <Button
                type="submit"
                disabled={isGenerating}
                className="btn-primary px-8 py-6 rounded-xl flex items-center gap-2 max-md:w-full font-semibold shadow-lg text-base"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    <span>Generating Questions...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="size-5" />
                    <span>Generate AI Interview</span>
                    <ArrowRight className="size-4 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
