"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  PhoneCall,
  PhoneOff,
  Sparkles,
  HelpCircle,
  Clock,
  Radio,
} from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { interviewer } from "@/constants";
import { createFeedback } from "@/lib/actions/general.action";
import { Button } from "@/components/ui/button";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

const Agent = ({
  userName,
  userId,
  interviewId,
  feedbackId,
  type,
  questions = [],
}: AgentProps) => {
  const router = useRouter();

  // Mode: "interactive" (default for interviews) or "vapi" (voice call)
  const [mode, setMode] = useState<"interactive" | "vapi">(
    type === "generate" ? "vapi" : "interactive"
  );

  // --- Interactive Interview State ---
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeakingQuestion, setIsSpeakingQuestion] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);

  // Recognition ref
  const recognitionRef = useRef<any>(null);

  // --- Vapi State ---
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>("");

  const qList = questions && questions.length > 0
    ? questions
    : [
        "Tell me about yourself and your background in software engineering.",
        "What are the biggest technical challenges you faced in your most recent project?",
        "How do you approach debugging complex production issues?",
      ];

  // Timer for interactive interview
  useEffect(() => {
    let interval: any;
    if (mode === "interactive" && !isSubmitting) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [mode, isSubmitting]);

  // Vapi Event Listeners
  useEffect(() => {
    const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
    const onCallEnd = () => setCallStatus(CallStatus.FINISHED);

    const onMessage = (message: any) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage: SavedMessage = {
          role: message.role,
          content: message.transcript,
        };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);
    const onError = (error: Error) => console.log("Vapi Error:", error);

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  // Handle Vapi Feedback submission on call end
  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }

    const handleGenerateFeedback = async (vapiMsgs: SavedMessage[]) => {
      setIsSubmitting(true);
      const res = await createFeedback({
        interviewId: interviewId!,
        userId: userId!,
        transcript: vapiMsgs,
        feedbackId,
      });

      if (res.success) {
        toast.success("Feedback analysis complete!");
        router.push(`/interview/${interviewId}/feedback`);
      } else {
        toast.error("Error generating feedback");
        router.push("/");
      }
    };

    if (callStatus === CallStatus.FINISHED) {
      if (type === "generate") {
        router.push("/");
      } else if (mode === "vapi") {
        handleGenerateFeedback(messages);
      }
    }
  }, [messages, callStatus, feedbackId, interviewId, router, type, userId, mode]);

  // Read current question aloud via SpeechSynthesis
  const speakCurrentQuestion = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      toast.info("Speech synthesis not supported in this browser.");
      return;
    }

    if (isSpeakingQuestion) {
      window.speechSynthesis.cancel();
      setIsSpeakingQuestion(false);
      return;
    }

    const currentText = qList[currentIdx];
    const utterance = new SpeechSynthesisUtterance(currentText);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeakingQuestion(true);
    utterance.onend = () => setIsSpeakingQuestion(false);
    utterance.onerror = () => setIsSpeakingQuestion(false);

    window.speechSynthesis.speak(utterance);
  };

  // Web Speech API speech-to-text
  const toggleSpeechRecognition = () => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.info("Speech recognition is not supported in this browser. You can type your answer.");
      return;
    }

    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsRecording(true);
        toast.info("Listening... Speak your answer.");
      };

      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript + " ";
        }
        setCurrentAnswer((prev) => {
          const base = userAnswers[currentIdx] || "";
          return base ? `${base} ${transcript.trim()}` : transcript.trim();
        });
      };

      recognition.onerror = (err: any) => {
        console.error("Speech recognition error:", err);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (err) {
      console.error(err);
      setIsRecording(false);
    }
  };

  // Save current answer & navigate
  const handleSaveCurrentAnswer = () => {
    if (currentAnswer.trim()) {
      setUserAnswers((prev) => ({
        ...prev,
        [currentIdx]: currentAnswer.trim(),
      }));
    }
  };

  const handleNextQuestion = () => {
    handleSaveCurrentAnswer();
    if (currentIdx < qList.length - 1) {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      setCurrentAnswer(userAnswers[nextIdx] || "");
      if (isSpeakingQuestion && typeof window !== "undefined") {
        window.speechSynthesis.cancel();
        setIsSpeakingQuestion(false);
      }
    }
  };

  const handlePrevQuestion = () => {
    handleSaveCurrentAnswer();
    if (currentIdx > 0) {
      const prevIdx = currentIdx - 1;
      setCurrentIdx(prevIdx);
      setCurrentAnswer(userAnswers[prevIdx] || "");
      if (isSpeakingQuestion && typeof window !== "undefined") {
        window.speechSynthesis.cancel();
        setIsSpeakingQuestion(false);
      }
    }
  };

  // Submit all answers and generate AI evaluation
  const handleSubmitInteractiveInterview = async () => {
    // Save latest text
    const finalAnswers = {
      ...userAnswers,
      [currentIdx]: currentAnswer.trim(),
    };
    setUserAnswers(finalAnswers);

    // Build transcript
    const transcript: SavedMessage[] = [];
    qList.forEach((q, idx) => {
      transcript.push({ role: "assistant", content: q });
      const ans = finalAnswers[idx] || "No response provided.";
      transcript.push({ role: "user", content: ans });
    });

    setIsSubmitting(true);
    toast.info("Submitting interview for AI evaluation...");

    try {
      const res = await createFeedback({
        interviewId: interviewId || "intv-frontend-lead",
        userId: userId || "anonymous",
        transcript,
        feedbackId,
      });

      if (res.success) {
        toast.success("Feedback report generated successfully!");
        router.push(`/interview/${interviewId}/feedback`);
      } else {
        toast.error("Could not generate feedback. Redirecting...");
        router.push(`/interview/${interviewId}/feedback`);
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Error creating feedback");
      setIsSubmitting(false);
    }
  };

  // Vapi handlers
  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);

    if (type === "generate") {
      await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
        variableValues: {
          username: userName,
          userid: userId,
        },
      });
    } else {
      let formattedQuestions = "";
      if (qList) {
        formattedQuestions = qList
          .map((question) => `- ${question}`)
          .join("\n");
      }

      await vapi.start(interviewer, {
        variableValues: {
          questions: formattedQuestions,
        },
      });
    }
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
      {/* If taking an interview, allow switching between Interactive Mode and Vapi Call */}
      {type === "interview" && (
        <div className="flex items-center justify-between gap-4 p-2 rounded-2xl bg-dark-200 border border-white/10">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMode("interactive")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-medium transition-all ${
                mode === "interactive"
                  ? "bg-primary-200 text-dark-100 shadow"
                  : "text-light-100/70 hover:text-light-100"
              }`}
            >
              <Sparkles className="size-4" />
              <span>Interactive Mock Interview</span>
            </button>

            <button
              type="button"
              onClick={() => setMode("vapi")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-medium transition-all ${
                mode === "vapi"
                  ? "bg-primary-200 text-dark-100 shadow"
                  : "text-light-100/70 hover:text-light-100"
              }`}
            >
              <Radio className="size-4" />
              <span>Vapi Voice Call</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-light-100/60 px-3">
            <Clock className="size-3.5 text-primary-200" />
            <span>{formatTimer(timerSeconds)}</span>
          </div>
        </div>
      )}

      {/* MODE 1: Interactive Interview (Default & Full Featured) */}
      {mode === "interactive" && type === "interview" ? (
        <div className="flex flex-col gap-6">
          {/* Progress Header */}
          <div className="card-border w-full">
            <div className="card p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between text-xs text-light-100/70">
                <span className="font-semibold uppercase tracking-wider text-primary-200">
                  Question {currentIdx + 1} of {qList.length}
                </span>
                <span>
                  {Math.round(((currentIdx + 1) / qList.length) * 100)}% Complete
                </span>
              </div>
              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-200 to-emerald-400 transition-all duration-300"
                  style={{
                    width: `${((currentIdx + 1) / qList.length) * 100}%`,
                  }}
                />
              </div>

              {/* Question Card */}
              <div className="flex items-start gap-4 pt-2">
                <div className="relative shrink-0">
                  <Image
                    src="/ai-avatar.png"
                    alt="AI Interviewer"
                    width={56}
                    height={56}
                    className="rounded-full border border-primary-200/40"
                  />
                  {isSpeakingQuestion && (
                    <span className="absolute -top-1 -right-1 size-3 rounded-full bg-emerald-400 animate-ping" />
                  )}
                </div>

                <div className="flex-1 flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs text-light-100/60 font-medium">AI Interviewer</p>
                    <button
                      type="button"
                      onClick={speakCurrentQuestion}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
                        isSpeakingQuestion
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                          : "bg-white/5 text-light-100/80 border-white/10 hover:border-white/20"
                      }`}
                    >
                      {isSpeakingQuestion ? (
                        <>
                          <VolumeX className="size-3.5" /> Stop Voice
                        </>
                      ) : (
                        <>
                          <Volume2 className="size-3.5 text-primary-200" /> Listen
                        </>
                      )}
                    </button>
                  </div>
                  <h3 className="text-xl md:text-2xl font-semibold text-primary-100 leading-snug">
                    {qList[currentIdx]}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* Candidate Answer Box */}
          <div className="card-border w-full">
            <div className="card p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Image
                    src="/profile.svg"
                    alt="Candidate"
                    width={28}
                    height={28}
                    className="rounded-full size-7"
                  />
                  <span className="text-sm font-medium text-light-100">
                    Your Response ({userName})
                  </span>
                </div>

                {/* Voice Input Toggle Button */}
                <button
                  type="button"
                  onClick={toggleSpeechRecognition}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                    isRecording
                      ? "bg-rose-500/20 text-rose-400 border-rose-500/50 animate-pulse"
                      : "bg-white/5 text-light-100/80 border-white/10 hover:border-white/20"
                  }`}
                >
                  {isRecording ? (
                    <>
                      <MicOff className="size-3.5" /> Stop Mic
                    </>
                  ) : (
                    <>
                      <Mic className="size-3.5 text-primary-200" /> Dictate with Voice
                    </>
                  )}
                </button>
              </div>

              <textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Type or speak your answer here... Explain your thoughts clearly, describe real-world context, trade-offs, and architecture."
                className="w-full min-h-40 p-4 rounded-xl bg-dark-100 border border-white/10 text-light-100 text-sm leading-relaxed focus:outline-none focus:border-primary-200/50 resize-y"
              />

              <div className="flex items-center justify-between text-xs text-light-100/50">
                <span>
                  Words: {currentAnswer.trim() ? currentAnswer.trim().split(/\s+/).length : 0}
                </span>
                <span>Press Next to record your response</span>
              </div>

              {/* Navigation & Submission Controls */}
              <div className="flex items-center justify-between gap-4 pt-2 border-t border-white/10">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handlePrevQuestion}
                  disabled={currentIdx === 0}
                  className="rounded-xl flex items-center gap-2"
                >
                  <ArrowLeft className="size-4" /> Previous
                </Button>

                <div className="flex items-center gap-3">
                  {currentIdx < qList.length - 1 ? (
                    <Button
                      type="button"
                      onClick={handleNextQuestion}
                      className="btn-primary rounded-xl flex items-center gap-2 px-6"
                    >
                      <span>Next Question</span>
                      <ArrowRight className="size-4" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={handleSubmitInteractiveInterview}
                      disabled={isSubmitting}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl flex items-center gap-2 px-6 font-semibold"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          <span>Evaluating Answers...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="size-4" />
                          <span>Finish & Generate Feedback</span>
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* MODE 2: Vapi Voice Call Mode */
        <>
          <div className="call-view">
            {/* AI Interviewer Card */}
            <div className="card-interviewer">
              <div className="avatar">
                <Image
                  src="/ai-avatar.png"
                  alt="profile-image"
                  width={65}
                  height={54}
                  className="object-cover"
                />
                {isSpeaking && <span className="animate-speak" />}
              </div>
              <h3>AI Interviewer</h3>
            </div>

            {/* User Profile Card */}
            <div className="card-border">
              <div className="card-content">
                <Image
                  src="/profile.svg"
                  alt="profile-image"
                  width={539}
                  height={539}
                  className="rounded-full object-cover size-30"
                />
                <h3>{userName}</h3>
              </div>
            </div>
          </div>

          {messages.length > 0 && (
            <div className="transcript-border">
              <div className="transcript">
                <p
                  key={lastMessage}
                  className={cn(
                    "transition-opacity duration-500 opacity-0",
                    "animate-fadeIn opacity-100",
                  )}
                >
                  {lastMessage}
                </p>
              </div>
            </div>
          )}

          <div className="w-full flex justify-center mt-2">
            {callStatus !== "ACTIVE" ? (
              <button
                className="relative btn-call flex items-center justify-center gap-2"
                onClick={() => handleCall()}
                disabled={callStatus === CallStatus.CONNECTING}
              >
                <span
                  className={cn(
                    "absolute animate-ping rounded-full opacity-75",
                    callStatus !== "CONNECTING" && "hidden",
                  )}
                />
                <PhoneCall className="size-5" />
                <span className="relative">
                  {callStatus === "INACTIVE" || callStatus === "FINISHED"
                    ? "Start Voice Call"
                    : "Connecting..."}
                </span>
              </button>
            ) : (
              <button
                className="btn-disconnect flex items-center justify-center gap-2"
                onClick={() => handleDisconnect()}
              >
                <PhoneOff className="size-5" />
                <span>End Call & Submit</span>
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Agent;
