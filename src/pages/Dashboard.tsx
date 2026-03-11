import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { LogOut, ArrowLeft, History, Sparkles, Download } from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
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

const DashboardSkeleton = () => (
  <div className="max-w-6xl mx-auto px-4 py-8">
    <Skeleton className="h-8 w-48 mb-8" />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Chart skeleton */}
      <div className="panel-elevated rounded-lg p-6 lg:col-span-2">
        <Skeleton className="h-4 w-32 mb-4" />
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-5 flex-1" style={{ maxWidth: `${90 - i * 10}%` }} />
            </div>
          ))}
        </div>
      </div>
      {/* Priority skeleton */}
      <div className="panel-elevated rounded-lg p-6">
        <Skeleton className="h-4 w-28 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-5 w-14 rounded" />
            </div>
          ))}
        </div>
      </div>
      {/* Coverage skeleton */}
      <div className="panel-elevated rounded-lg p-6 flex flex-col items-center py-10">
        <Skeleton className="h-4 w-36 mb-6" />
        <Skeleton className="h-32 w-32 rounded-full" />
        <Skeleton className="h-3 w-48 mt-4" />
      </div>
      {/* Study plan skeleton */}
      <div className="panel-elevated rounded-lg p-6">
        <Skeleton className="h-4 w-28 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-px flex-1" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>
      </div>
      {/* Questions skeleton */}
      <div className="panel-elevated rounded-lg p-6">
        <Skeleton className="h-4 w-40 mb-4" />
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-4 w-6" />
              <Skeleton className="h-4 flex-1" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

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
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 border-b border-border/50 px-6 py-4 flex items-center justify-between backdrop-blur-md bg-background/80">
          <div className="flex items-center gap-3">
            <Sparkles className="h-4 w-4 text-primary" />
            <h1 className="font-mono text-lg font-semibold text-foreground tracking-tight">SyllabiX</h1>
          </div>
        </header>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
          <DashboardSkeleton />
        </motion.div>
      </div>
    );
  }

  if (!data) return null;

  const chartData = data.topics
    .sort((a, b) => b.frequency - a.frequency)
    .map((t) => ({ name: t.name, frequency: t.frequency }));

  const exportPDF = () => {
    const doc = new jsPDF();
    const gold = [244, 191, 79] as const;
    const dark = [10, 10, 12] as const;

    // Header
    doc.setFillColor(...dark);
    doc.rect(0, 0, 210, 30, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(...gold);
    doc.text("SyllabiX — Analysis Results", 14, 20);

    // Coverage
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    doc.text(`Exam Coverage Estimate: ${data.coverage_percentage}%`, 14, 40);

    // Topics table
    doc.setFontSize(13);
    doc.setTextColor(30, 30, 30);
    doc.text("Topic Frequency & Priority", 14, 52);

    autoTable(doc, {
      startY: 56,
      head: [["Topic", "Frequency", "Priority"]],
      body: data.topics
        .sort((a, b) => b.frequency - a.frequency)
        .map((t) => [t.name, String(t.frequency), t.priority]),
      headStyles: { fillColor: [244, 191, 79], textColor: [10, 10, 12], fontStyle: "bold" },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      styles: { fontSize: 10, font: "helvetica" },
    });

    let y = (doc as any).lastAutoTable.finalY + 12;

    // Study Plan
    doc.setFontSize(13);
    doc.setTextColor(30, 30, 30);
    doc.text("Smart Study Plan", 14, y);
    y += 6;

    autoTable(doc, {
      startY: y,
      head: [["Day", "Topic"]],
      body: data.study_plan.map((d) => [`Day ${d.day}`, d.topic]),
      headStyles: { fillColor: [244, 191, 79], textColor: [10, 10, 12], fontStyle: "bold" },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      styles: { fontSize: 10 },
    });

    y = (doc as any).lastAutoTable.finalY + 12;

    // Predicted Questions
    if (y > 250) { doc.addPage(); y = 20; }
    doc.setFontSize(13);
    doc.setTextColor(30, 30, 30);
    doc.text("Predicted Exam Questions", 14, y);
    y += 6;

    autoTable(doc, {
      startY: y,
      head: [["#", "Question"]],
      body: data.predicted_questions.map((q, i) => [String(i + 1), q]),
      headStyles: { fillColor: [244, 191, 79], textColor: [10, 10, 12], fontStyle: "bold" },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      styles: { fontSize: 10 },
      columnStyles: { 0: { cellWidth: 12 }, 1: { cellWidth: "auto" } },
    });

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`SyllabiX — Generated ${new Date().toLocaleDateString()}`, 14, 290);
      doc.text(`Page ${i} of ${pageCount}`, 190, 290, { align: "right" });
    }

    doc.save("syllabix-analysis.pdf");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 px-6 py-4 flex items-center justify-between backdrop-blur-md bg-background/80">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/history")} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </button>
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

      <div className="max-w-6xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-mono text-2xl font-bold text-foreground">Analysis Results</h2>
            <Button variant="outline" size="sm" onClick={exportPDF} className="font-mono text-xs gap-1.5">
              <Download className="h-3.5 w-3.5" /> Export PDF
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Topic Frequency Chart */}
            <div className="panel-elevated rounded-lg p-4 md:p-6 lg:col-span-2">
              <h3 className="font-mono text-sm font-semibold text-foreground mb-4 tracking-wide uppercase">
                Topic Frequency
              </h3>
              <div className="h-[250px] md:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" margin={{ left: 80, right: 10 }}>
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