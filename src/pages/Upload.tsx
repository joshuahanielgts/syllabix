import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Upload as UploadIcon, X, FileText, LogOut, History, Sparkles } from "lucide-react";
import { toast } from "sonner";

const ANALYSIS_LINES = [
  "INITIALIZING_ANALYSIS_ENGINE...",
  "PARSING_DOCUMENT_STRUCTURE...",
  "EXTRACTING_TOPIC_VECTORS...",
  "CROSS_REFERENCING_EXAM_PAPERS...",
  "CALCULATING_FREQUENCY_MATRIX...",
  "RANKING_TOPIC_PRIORITIES...",
  "ESTIMATING_EXAM_COVERAGE...",
  "GENERATING_STUDY_PLAN...",
  "COMPILING_RESULTS...",
];

const demoResults = {
  topics: [
    { name: "TCP Congestion Control", frequency: 9, priority: "High" },
    { name: "Routing Algorithms", frequency: 7, priority: "High" },
    { name: "OSI Model", frequency: 6, priority: "High" },
    { name: "Network Security", frequency: 5, priority: "Medium" },
    { name: "DNS & DHCP", frequency: 4, priority: "Medium" },
    { name: "Socket Programming", frequency: 3, priority: "Medium" },
    { name: "Error Detection & Correction", frequency: 2, priority: "Low" },
    { name: "Network Topologies", frequency: 2, priority: "Low" },
  ],
  coverage: 78,
  study_plan: [
    { day: 1, topic: "TCP Congestion Control" },
    { day: 2, topic: "Routing Algorithms" },
    { day: 3, topic: "OSI Model" },
    { day: 4, topic: "Network Security" },
    { day: 5, topic: "DNS & DHCP" },
  ],
  predicted_questions: [
    "Explain TCP congestion control mechanisms including slow start and congestion avoidance.",
    "Compare and contrast distance vector and link state routing algorithms.",
    "Describe the seven layers of the OSI model with examples.",
    "Discuss common network security threats and countermeasures.",
    "Explain the working of DNS resolution with a diagram.",
  ],
};

const readFileAsBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix to get just the base64 data
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const Upload = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisLines, setAnalysisLines] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = Array.from(e.dataTransfer.files).filter(
      (f) => f.type === "application/pdf" && f.size <= 10 * 1024 * 1024
    );
    setFiles((prev) => [...prev, ...dropped].slice(0, 5));
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files).filter(
      (f) => f.type === "application/pdf" && f.size <= 10 * 1024 * 1024
    );
    setFiles((prev) => [...prev, ...selected].slice(0, 5));
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const runAnalysis = async () => {
    if (files.length === 0 || !user) return;
    setAnalyzing(true);
    setAnalysisLines([]);

    // Animate analysis lines
    const animateLines = async () => {
      for (let i = 0; i < ANALYSIS_LINES.length; i++) {
        await new Promise((r) => setTimeout(r, 600));
        setAnalysisLines((prev) => [...prev, ANALYSIS_LINES[i]]);
      }
    };
    animateLines();

    try {
      let analysisResult = demoResults;
      const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
      console.log("Gemini API Key present:", !!geminiKey);

      if (geminiKey) {
        try {
          // Read files as base64
          console.log("Reading files...");
          const fileParts = await Promise.all(
            files.map(async (file) => ({
              inline_data: {
                mime_type: "application/pdf",
                data: await readFileAsBase64(file),
              },
            }))
          );
          console.log("Files read successfully, count:", fileParts.length);

          const prompt = `Analyze the following syllabus and exam question papers.

Tasks:
1. Extract important academic topics from the documents.
2. Count topic frequency in exam papers.
3. Rank topics by importance (High, Medium, Low).
4. Estimate exam coverage percentage if top topics are studied.
5. Generate a 5-day study plan focusing on high priority topics.
6. Predict 5 possible exam questions.

Return ONLY valid JSON in this exact format (no markdown, no code blocks):
{
  "topics": [{"name": "Topic Name", "frequency": 6, "priority": "High"}],
  "coverage": 78,
  "study_plan": [{"day": 1, "topic": "Topic Name"}],
  "predicted_questions": ["Question text"]
}`;

          // Try different models with retry - prioritize models with quota
          const models = ["gemini-2.5-flash", "gemini-2.5-pro", "gemini-1.5-flash"];
          let success = false;

          for (const model of models) {
            if (success) break;
            
            console.log(`Trying model: ${model}...`);
            
            try {
              const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    contents: [
                      {
                        parts: [
                          { text: prompt },
                          ...fileParts,
                        ],
                      },
                    ],
                    generationConfig: {
                      responseMimeType: "application/json",
                    },
                  }),
                }
              );

              const data = await response.json();
              console.log(`${model} response:`, data);

              if (data.error) {
                console.warn(`${model} error:`, data.error.message);
                if (data.error.code === 429) {
                  // Rate limited, try next model
                  continue;
                }
                throw new Error(data.error.message);
              }

              const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
              console.log("Response text:", responseText);

              if (responseText) {
                analysisResult = JSON.parse(responseText);
                console.log("Parsed analysis result:", analysisResult);
                success = true;
                toast.success(`Analysis complete using ${model}`);
              }
            } catch (modelError: any) {
              console.warn(`${model} failed:`, modelError.message);
            }
          }

          if (!success) {
            console.warn("All models failed, using demo results");
            toast.error("API quota exceeded. Using demo results. Wait a minute and try again.");
          }
        } catch (aiError) {
          console.error("AI analysis failed, using demo results:", aiError);
          toast.error("AI analysis failed, using demo results for testing.");
        }
      } else {
        console.warn("No Gemini API key found, using demo results");
        toast.error("No API key configured, using demo results.");
      }

      // Save results to database
      const { data: analysis, error: insertError } = await supabase
        .from("analyses")
        .insert({
          user_id: user.id,
          file_names: files.map((f) => f.name),
          topics: analysisResult.topics,
          coverage_percentage: analysisResult.coverage,
          study_plan: analysisResult.study_plan,
          predicted_questions: analysisResult.predicted_questions,
        })
        .select("id")
        .single();

      if (insertError) throw insertError;

      // Wait for animation to complete
      await new Promise((r) => setTimeout(r, 400));

      navigate(`/dashboard/${analysis.id}`);
    } catch (err: any) {
      console.error("Analysis failed:", err);
      toast.error("Analysis failed. Please try again.");
      setAnalyzing(false);
      setAnalysisLines([]);
    }
  };

  if (analyzing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-lg">
          <div className="font-mono text-sm space-y-1">
            {analysisLines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className={i === analysisLines.length - 1 ? "text-primary" : "text-muted-foreground"}
              >
                → {line}
              </motion.div>
            ))}
            {analysisLines.length < ANALYSIS_LINES.length && (
              <motion.div
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-primary"
              >
                █
              </motion.div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 px-6 py-4 flex items-center justify-between backdrop-blur-md bg-background/80">
        <div className="flex items-center gap-3">
          <Sparkles className="h-4 w-4 text-primary" />
          <h1 className="font-mono text-lg font-semibold text-foreground tracking-tight">SyllabiX</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/history")} className="text-muted-foreground font-mono text-xs">
            <History className="h-3.5 w-3.5 mr-1.5" /> History
          </Button>
          <Button variant="ghost" size="sm" onClick={signOut} className="text-muted-foreground">
            <LogOut className="h-4 w-4 mr-1" /> Sign Out
          </Button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="font-mono text-2xl font-bold text-foreground mb-2">Upload Documents</h2>
          <p className="text-muted-foreground font-sans text-sm mb-8">
            Upload your syllabus and previous exam papers (PDF, max 10MB each, up to 5 files).
          </p>

          {/* Drop Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer ${
              dragOver ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"
            }`}
            onClick={() => document.getElementById("file-input")?.click()}
          >
            <input
              id="file-input"
              type="file"
              accept=".pdf"
              multiple
              className="hidden"
              onChange={handleFileSelect}
            />
            <UploadIcon className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
            <p className="font-mono text-sm text-foreground mb-1">
              Drop PDFs here or click to browse
            </p>
            <p className="text-xs text-muted-foreground font-sans">
              PDF only · Max 10MB · Up to 5 files
            </p>
          </div>

          {/* File List */}
          <AnimatePresence>
            {files.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 space-y-2"
              >
                {files.map((file, i) => (
                  <motion.div
                    key={`${file.name}-${i}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex items-center justify-between panel-elevated rounded-md px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-primary" />
                      <span className="text-sm font-mono text-foreground truncate max-w-[300px]">
                        {file.name}
                      </span>
                      <span className="text-xs text-muted-foreground font-sans">
                        {(file.size / 1024 / 1024).toFixed(1)}MB
                      </span>
                    </div>
                    <button onClick={() => removeFile(i)} className="text-muted-foreground hover:text-foreground">
                      <X className="h-4 w-4" />
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Analyze Button */}
          <Button
            onClick={runAnalysis}
            disabled={files.length === 0}
            className="mt-8 w-full h-12 font-mono text-sm tracking-wider gold-glow"
          >
            RUN_ANALYSIS →
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Upload;