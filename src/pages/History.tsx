import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { LogOut, ArrowRight, Plus, FileText, Calendar, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface AnalysisSummary {
  id: string;
  created_at: string;
  file_names: string[];
  coverage_percentage: number | null;
  topics: { name: string; priority: string }[] | null;
}

const History = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState<AnalysisSummary[]>([]);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data, error } = await supabase
        .from("analyses")
        .select("id, created_at, file_names, coverage_percentage, topics")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setAnalyses(data as unknown as AnalysisSummary[]);
      }
      setLoading(false);
    };
    fetch();
  }, [user]);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    const { error } = await supabase.from("analyses").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete analysis");
    } else {
      setAnalyses((prev) => prev.filter((a) => a.id !== id));
      toast.success("Analysis deleted");
    }
    setDeleting(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/50 px-6 py-4 flex items-center justify-between backdrop-blur-md bg-background/80">
        <div className="flex items-center gap-3">
          <Sparkles className="h-4 w-4 text-primary" />
          <h1 className="font-mono text-lg font-semibold text-foreground tracking-tight">SyllabiX</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => navigate("/upload")} className="font-mono text-xs">
            <Plus className="h-3.5 w-3.5 mr-1.5" /> New Analysis
          </Button>
          <Button variant="ghost" size="sm" onClick={signOut} className="text-muted-foreground">
            <LogOut className="h-4 w-4 mr-1" /> Sign Out
          </Button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h2 className="font-mono text-2xl font-bold text-foreground mb-2">Analysis History</h2>
          <p className="text-muted-foreground font-sans text-sm mb-10">All your past syllabus analyses in one place.</p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="font-mono text-muted-foreground animate-pulse text-sm">LOADING_HISTORY...</div>
          </div>
        ) : analyses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="panel-elevated rounded-lg p-12 text-center"
          >
            <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-mono text-lg font-semibold text-foreground mb-2">No analyses yet</h3>
            <p className="text-muted-foreground font-sans text-sm mb-6">Upload your first syllabus to get started.</p>
            <Button onClick={() => navigate("/upload")} className="font-mono text-sm gold-glow">
              Upload Syllabus <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {analyses.map((a, i) => {
              const topicCount = a.topics?.length ?? 0;
              const highPriority = a.topics?.filter(t => t.priority === "High").length ?? 0;

              return (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  layout
                  className="w-full text-left panel-elevated rounded-lg p-5 hover:border-primary/20 transition-colors duration-300 group cursor-pointer"
                  onClick={() => navigate(`/dashboard/${a.id}`)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <FileText className="h-4 w-4 text-primary shrink-0" />
                        <span className="font-mono text-sm font-semibold text-foreground truncate">
                          {a.file_names.length > 0 ? a.file_names.join(", ") : "Untitled Analysis"}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3 w-3" />
                          {formatDate(a.created_at)} · {formatTime(a.created_at)}
                        </span>
                        {topicCount > 0 && (
                          <span>{topicCount} topics</span>
                        )}
                        {highPriority > 0 && (
                          <span className="text-primary">{highPriority} high priority</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {a.coverage_percentage != null && (
                        <div className="text-right">
                          <div className="font-mono text-lg font-bold text-primary">{a.coverage_percentage}%</div>
                          <div className="font-mono text-[10px] text-muted-foreground">coverage</div>
                        </div>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(a.id);
                        }}
                        disabled={deleting === a.id}
                        className="p-2 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete analysis"
                      >
                        <Trash2 className={`h-4 w-4 ${deleting === a.id ? "animate-pulse" : ""}`} />
                      </button>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
