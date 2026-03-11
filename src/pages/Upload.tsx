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
    for (let i = 0; i < ANALYSIS_LINES.length; i++) {
      await new Promise((r) => setTimeout(r, 600));
      setAnalysisLines((prev) => [...prev, ANALYSIS_LINES[i]]);
    }

    try {
      // Upload files to storage
      const fileNames: string[] = [];
      for (const file of files) {
        const path = `${user.id}/${Date.now()}_${file.name}`;
        const { error } = await supabase.storage
          .from("syllabus-uploads")
          .upload(path, file);
        if (error) throw error;
        fileNames.push(path);
      }

      // Call edge function
      const { data, error } = await supabase.functions.invoke("analyze-syllabus", {
        body: { fileNames, userId: user.id },
      });

      if (error) throw error;

      // Wait for the slam effect
      await new Promise((r) => setTimeout(r, 400));

      navigate(`/dashboard/${data.id}`);
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