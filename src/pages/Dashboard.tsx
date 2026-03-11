import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { LogOut, ArrowLeft, History, Sparkles } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

interface Topic {
  name: string;
  frequency: number;
  priority: string;
}

interface StudyDay {
  day: number;
  topic: string;
}

interface AnalysisData {
  topics: Topic[];
  coverage_percentage: number;
  study_plan: StudyDay[];
  predicted_questions: string[];
}

const priorityColor = (p: string) => {
  if (p === "High") return "text-primary";
  if (p === "Medium") return "text-foreground";
  return "text-muted-foreground";
};

const priorityBg = (p: string) => {
  if (p === "High") return "bg-primary/15 border-primary/30 text-primary";
  if (p === "Medium") return "bg-secondary border-border text-foreground";
  return "bg-secondary border-border text-muted-foreground";
};

const barColor = (index: number, total: number) => {
  const ratio = 1 - index / total;
  if (ratio > 0.6) return "hsl(42, 88%, 63%)";
  if (ratio > 0.3) return "hsl(42, 40%, 45%)";
  return "hsl(0, 0%, 35%)";
};

const Dashboard = () => {
  const { id } = useParams<{ id: string }>();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || !user) return;
    const fetchAnalysis = async () => {
      const { data: analysis, error } = await supabase
        .from("analyses")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !analysis) {
        navigate("/upload", { replace: true });
        return;
      }

      setData({
        topics: (analysis.topics as any) || [],
        coverage_percentage: analysis.coverage_percentage || 0,
        study_plan: (analysis.study_plan as any) || [],
        predicted_questions: (analysis.predicted_questions as any) || [],
      });
      setLoading(false);
    };
    fetchAnalysis();
  }, [id, user, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="font-mono text-muted-foreground animate-pulse">LOADING_RESULTS...</div>
      </div>
    );
  }

  if (!data) return null;

  const chartData = data.topics
    .sort((a, b) => b.frequency - a.frequency)
    .map((t) => ({ name: t.name, frequency: t.frequency }));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/upload")} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="font-mono text-lg font-semibold text-foreground tracking-tight">
            SyllabiX
          </h1>
        </div>
        <Button variant="ghost" size="sm" onClick={signOut} className="text-muted-foreground">
          <LogOut className="h-4 w-4 mr-1" /> Sign Out
        </Button>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="font-mono text-2xl font-bold text-foreground mb-8">Analysis Results</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Topic Frequency Chart */}
            <div className="panel-elevated rounded-lg p-6 lg:col-span-2">
              <h3 className="font-mono text-sm font-semibold text-foreground mb-4 tracking-wide uppercase">
                Topic Frequency
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" margin={{ left: 140 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 6%, 18%)" />
                    <XAxis type="number" tick={{ fill: "hsl(0, 0%, 50%)", fontSize: 12, fontFamily: "IBM Plex Mono" }} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fill: "hsl(0, 0%, 70%)", fontSize: 12, fontFamily: "IBM Plex Mono" }}
                      width={130}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(240, 8%, 8%)",
                        border: "1px solid hsl(240, 6%, 18%)",
                        borderRadius: "6px",
                        fontFamily: "IBM Plex Mono",
                        fontSize: 12,
                      }}
                    />
                    <Bar dataKey="frequency" radius={[0, 4, 4, 0]}>
                      {chartData.map((_, index) => (
                        <Cell key={index} fill={barColor(index, chartData.length)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Priority Topics */}
            <div className="panel-elevated rounded-lg p-6">
              <h3 className="font-mono text-sm font-semibold text-foreground mb-4 tracking-wide uppercase">
                Priority Topics
              </h3>
              <div className="space-y-3">
                {data.topics.sort((a, b) => {
                  const order = { High: 0, Medium: 1, Low: 2 };
                  return (order[a.priority as keyof typeof order] ?? 3) - (order[b.priority as keyof typeof order] ?? 3);
                }).map((topic, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className={`font-mono text-sm ${priorityColor(topic.priority)}`}>
                      {topic.name}
                    </span>
                    <span className={`text-xs font-mono px-2 py-0.5 rounded border ${priorityBg(topic.priority)}`}>
                      {topic.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Exam Coverage */}
            <div className="panel-elevated rounded-lg p-6">
              <h3 className="font-mono text-sm font-semibold text-foreground mb-4 tracking-wide uppercase">
                Exam Coverage Estimate
              </h3>
              <div className="flex flex-col items-center justify-center py-6">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(240, 6%, 18%)" strokeWidth="8" />
                    <motion.circle
                      cx="50" cy="50" r="42" fill="none"
                      stroke="hsl(42, 88%, 63%)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 42}`}
                      initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - data.coverage_percentage / 100) }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-mono text-2xl font-bold text-primary">
                      {data.coverage_percentage}%
                    </span>
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground font-sans text-center">
                  Study top {data.study_plan.length} topics to cover ~{data.coverage_percentage}% of exam questions
                </p>
              </div>
            </div>

            {/* Study Plan */}
            <div className="panel-elevated rounded-lg p-6">
              <h3 className="font-mono text-sm font-semibold text-foreground mb-4 tracking-wide uppercase">
                Smart Study Plan
              </h3>
              <div className="space-y-3">
                {data.study_plan.map((day, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <span className="font-mono text-xs text-primary w-12 shrink-0">
                      DAY {day.day}
                    </span>
                    <div className="h-px flex-1 bg-border" />
                    <span className="font-mono text-sm text-foreground">
                      {day.topic}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Predicted Questions */}
            <div className="panel-elevated rounded-lg p-6">
              <h3 className="font-mono text-sm font-semibold text-foreground mb-4 tracking-wide uppercase">
                Predicted Exam Questions
              </h3>
              <div className="space-y-4">
                {data.predicted_questions.map((q, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="font-mono text-xs text-primary shrink-0 mt-0.5">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-sm text-panel-foreground font-sans leading-relaxed">
                      {q}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;