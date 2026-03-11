import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BarChart3, Target, PieChart, BookOpen, ArrowRight } from "lucide-react";
import { demoResults } from "@/lib/demo-results";

const steps = [
{ num: "01", title: "Upload", desc: "Upload your syllabus and previous exam papers as PDF files." },
{ num: "02", title: "Analyze", desc: "AI extracts topics and calculates frequency across all papers." },
{ num: "03", title: "Strategize", desc: "Dashboard shows priority topics, coverage, and a study roadmap." }];


const features = [
{ icon: BarChart3, title: "Topic Frequency Analysis", desc: "Detects the most frequently appearing topics across exam papers." },
{ icon: Target, title: "Priority Topic Ranking", desc: "Ranks topics by exam importance — High, Medium, and Low." },
{ icon: PieChart, title: "Exam Coverage Estimator", desc: "Predicts how much of the exam is covered by studying top topics." },
{ icon: BookOpen, title: "AI Study Plan Generator", desc: "Creates an optimized day-by-day study roadmap." }];


const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border px-6 py-4 flex items-center justify-between">
        <span className="font-mono text-lg font-semibold tracking-tight text-foreground">SyllabiX</span>
        <Button variant="ghost" size="sm" onClick={() => navigate("/auth")} className="font-mono text-sm text-muted-foreground">
          Sign In
        </Button>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 py-24 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="font-mono text-4xl md:text-5xl font-bold text-foreground leading-tight mb-6">
            Turn Your Syllabus Into a<br />
            <span className="text-primary">Smart Study Strategy.</span>
          </h1>
          <p className="text-muted-foreground font-sans text-lg max-w-2xl mx-auto mb-10">
            SyllabiX analyzes syllabi and past exam papers to identify the most important topics and generate an intelligent study plan.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button onClick={() => navigate("/auth")} className="h-12 px-8 font-mono text-sm tracking-wider gold-glow">
              Analyze Your Syllabus <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })} className="h-12 px-8 font-mono text-sm">
              See How It Works
            </Button>
          </div>
        </motion.div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="max-w-4xl mx-auto px-4 py-20">
        <h2 className="font-mono text-2xl font-bold text-foreground mb-12 text-center">How It Works</h2>
        <div className="space-y-6">
          {steps.map((step, i) =>
          <motion.div
            key={step.num}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="panel-elevated rounded-lg p-6 flex items-start gap-6">
            
              <span className="font-mono text-2xl font-bold text-primary shrink-0">{step.num}</span>
              <div>
                <h3 className="font-mono text-lg font-semibold text-foreground mb-1">{step.title}</h3>
                <p className="text-muted-foreground font-sans text-sm">{step.desc}</p>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-4xl mx-auto px-4 py-20">
        <h2 className="font-mono text-2xl font-bold text-foreground mb-12 text-center">Core Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feat, i) =>
          <motion.div
            key={feat.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="panel-elevated rounded-lg p-6">
            
              <feat.icon className="h-6 w-6 text-primary mb-4" />
              <h3 className="font-mono text-base font-semibold text-foreground mb-2">{feat.title}</h3>
              <p className="text-muted-foreground font-sans text-sm">{feat.desc}</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Interactive Demo */}
      <section className="max-w-4xl mx-auto px-4 py-20">
        <h2 className="font-mono text-2xl font-bold text-foreground mb-4 text-center">Interactive Demo</h2>
        <p className="text-muted-foreground font-sans text-sm text-center mb-12">
          Here's a sample analysis output from SyllabiX.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Top Topics */}
          <div className="panel-elevated rounded-lg p-6">
            <h3 className="font-mono text-xs font-semibold text-primary mb-4 tracking-widest uppercase">Top Topics</h3>
            <div className="space-y-2">
              {demoResults.topics.slice(0, 4).map((t, i) =>
              <div key={i} className="flex items-center justify-between">
                  <span className="font-mono text-sm text-foreground">{t.name}</span>
                  <span className="font-mono text-xs text-muted-foreground">×{t.frequency}</span>
                </div>
              )}
            </div>
          </div>

          {/* Coverage */}
          <div className="panel-elevated rounded-lg p-6 flex flex-col items-center justify-center">
            <h3 className="font-mono text-xs font-semibold text-primary mb-4 tracking-widest uppercase">Coverage</h3>
            <span className="font-mono text-5xl font-bold text-primary">{demoResults.coverage}%</span>
            <p className="text-xs text-muted-foreground font-sans mt-2">Estimated Exam Coverage</p>
          </div>

          {/* Study Plan */}
          <div className="panel-elevated rounded-lg p-6">
            <h3 className="font-mono text-xs font-semibold text-primary mb-4 tracking-widest uppercase">Study Plan</h3>
            <div className="space-y-2">
              {demoResults.study_plan.map((d, i) =>
              <div key={i} className="flex items-center gap-3">
                  <span className="font-mono text-xs text-primary">D{d.day}</span>
                  <span className="font-mono text-sm text-foreground">{d.topic}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Why This Matters */}
      <section className="max-w-4xl mx-auto px-4 py-20">
        <div className="panel-elevated rounded-lg p-8 text-center">
          <h2 className="font-mono text-2xl font-bold text-foreground mb-4">Why This Matters</h2>
          <p className="text-muted-foreground font-sans max-w-2xl mx-auto mb-6">
            Students often study the entire syllabus without knowing which topics matter most.
            SyllabiX helps you focus on the <span className="text-primary font-semibold">20% of topics</span> that
            generate <span className="text-primary font-semibold">80% of exam questions</span>.
          </p>
          <div className="flex items-center justify-center gap-8 mt-8">
            <div>
              <div className="font-mono text-3xl font-bold text-primary">20%</div>
              <div className="text-xs text-muted-foreground font-sans mt-1">Topics to Study</div>
            </div>
            <div className="font-mono text-2xl text-muted-foreground">→</div>
            <div>
              <div className="font-mono text-3xl font-bold text-primary">80%</div>
              <div className="text-xs text-muted-foreground font-sans mt-1">Exam Questions Covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="max-w-4xl mx-auto px-4 py-20">
        <h2 className="font-mono text-2xl font-bold text-foreground mb-12 text-center">Team — CodersDuo</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-xl mx-auto">
          {[
          { name: "J Joshua Haniel", role: "AI & Full Stack Developer" },
          { name: "Eswaramuthu M", role: "Backend & Data Systems Engineer" }].
          map((member) =>
          <div key={member.name} className="panel-elevated rounded-lg p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-secondary mx-auto mb-4 flex items-center justify-center">
                <span className="font-mono text-xl text-primary">
                  {member.name[0]}
                </span>
              </div>
              <h3 className="font-mono text-sm font-semibold text-foreground">{member.name}</h3>
              <p className="text-xs text-muted-foreground font-sans mt-1">{member.role}</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-8">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center">
          <span className="font-mono text-sm text-foreground">SyllabiX</span>
          <span className="text-xs text-muted-foreground font-sans">CodeVerse 2026 Hackathon</span>
          <a href="#" className="text-xs text-muted-foreground font-sans hover:text-foreground transition-colors">
            GitHub Repository
          </a>
        </div>
      </footer>
    </div>);

};

export default Index;