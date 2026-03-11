import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { BarChart3, Target, PieChart, BookOpen, ArrowRight, Sparkles } from "lucide-react";
import { demoResults } from "@/lib/demo-results";
import { useRef } from "react";

const steps = [
  { num: "01", title: "Upload", desc: "Upload your syllabus and previous exam papers as PDF files." },
  { num: "02", title: "Analyze", desc: "AI extracts topics and calculates frequency across all papers." },
  { num: "03", title: "Strategize", desc: "Dashboard shows priority topics, coverage, and a study roadmap." },
];

const features = [
  { icon: BarChart3, title: "Topic Frequency Analysis", desc: "Detects the most frequently appearing topics across exam papers." },
  { icon: Target, title: "Priority Topic Ranking", desc: "Ranks topics by exam importance — High, Medium, and Low." },
  { icon: PieChart, title: "Exam Coverage Estimator", desc: "Predicts how much of the exam is covered by studying top topics." },
  { icon: BookOpen, title: "AI Study Plan Generator", desc: "Creates an optimized day-by-day study roadmap." },
];

const priorityColor = (p: string) =>
  p === "High" ? "text-primary" : p === "Medium" ? "text-foreground" : "text-muted-foreground";

const priorityBg = (p: string) =>
  p === "High" ? "bg-primary/20 border-primary/30" : p === "Medium" ? "bg-secondary border-border" : "bg-muted border-border";

const Index = () => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Ambient gradient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[50%] translate-x-[-50%] w-[800px] h-[600px] rounded-full bg-primary/[0.04] blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/[0.03] blur-[100px]" />
      </div>

      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border/50 px-6 py-4 flex items-center justify-between backdrop-blur-md bg-background/80">
        <span className="font-mono text-lg font-semibold tracking-tight text-foreground">
          <Sparkles className="inline h-4 w-4 text-primary mr-2 -mt-0.5" />
          SyllabiX
        </span>
        <Button variant="ghost" size="sm" onClick={() => navigate("/auth")} className="font-mono text-sm text-muted-foreground hover:text-primary transition-colors">
          Sign In
        </Button>
      </nav>

      {/* Hero */}
      <section ref={heroRef} className="relative max-w-5xl mx-auto px-4 pt-16 md:pt-28 pb-16 md:pb-20 text-center">
        <motion.div style={{ opacity: heroOpacity, y: heroY }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 mb-8">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <span className="font-mono text-xs text-primary tracking-wider">AI-POWERED EXAM INTELLIGENCE</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-mono text-3xl sm:text-4xl md:text-6xl font-bold text-foreground leading-[1.1] mb-6"
          >
            Turn Your Syllabus Into a
            <br />
            <span className="text-primary relative">
              Smart Study Strategy.
              <motion.span
                className="absolute -bottom-2 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-muted-foreground font-sans text-base md:text-lg max-w-2xl mx-auto mb-10 md:mb-12 px-2"
          >
            SyllabiX analyzes syllabi and past exam papers to identify the most important topics and generate an intelligent study plan.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          >
            <Button onClick={() => navigate("/auth")} className="h-12 px-8 font-mono text-sm tracking-wider gold-glow group w-full sm:w-auto">
              Analyze Your Syllabus
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              variant="outline"
              onClick={() => document.getElementById("dashboard-preview")?.scrollIntoView({ behavior: "smooth" })}
              className="h-12 px-8 font-mono text-sm border-border/50 hover:border-primary/30 transition-colors w-full sm:w-auto"
            >
              See Demo
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="max-w-4xl mx-auto px-4 py-16 md:py-24">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-mono text-xl md:text-2xl font-bold text-foreground mb-10 md:mb-14 text-center"
        >
          How It Works
        </motion.h2>
        <div className="relative">
          {/* Vertical connector line */}
          <div className="absolute left-[23px] top-8 bottom-8 w-px bg-gradient-to-b from-primary/40 via-primary/20 to-transparent hidden md:block" />
          <div className="space-y-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="panel-elevated rounded-lg p-4 md:p-6 flex items-start gap-4 md:gap-6 hover:border-primary/20 transition-colors duration-300"
              >
                <span className="font-mono text-2xl font-bold text-primary shrink-0 relative z-10">{step.num}</span>
                <div>
                  <h3 className="font-mono text-lg font-semibold text-foreground mb-1">{step.title}</h3>
                  <p className="text-muted-foreground font-sans text-sm">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-4xl mx-auto px-4 py-16 md:py-24">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-mono text-xl md:text-2xl font-bold text-foreground mb-10 md:mb-14 text-center"
        >
          Core Features
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="panel-elevated rounded-lg p-5 md:p-6 group hover:border-primary/20 transition-all duration-300"
            >
              <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                <feat.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-mono text-base font-semibold text-foreground mb-2">{feat.title}</h3>
              <p className="text-muted-foreground font-sans text-sm leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Dashboard Mockup Preview */}
      <section id="dashboard-preview" className="max-w-5xl mx-auto px-4 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="font-mono text-2xl font-bold text-foreground mb-4">Dashboard Preview</h2>
          <p className="text-muted-foreground font-sans text-sm max-w-lg mx-auto">
            A sample analysis output from SyllabiX — this is what your results look like.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          {/* Glow behind dashboard */}
          <div className="absolute inset-0 bg-primary/[0.03] rounded-2xl blur-xl -m-4" />

          <div className="relative rounded-xl border border-border/60 bg-card/80 backdrop-blur-sm overflow-hidden">
            {/* Fake window bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border/40 bg-card">
              <div className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
              <div className="h-2.5 w-2.5 rounded-full bg-primary/40" />
              <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground/20" />
              <span className="ml-3 font-mono text-[10px] text-muted-foreground tracking-wider">SYLLABIX — ANALYSIS DASHBOARD</span>
            </div>

            <div className="p-3 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5">
                {/* Topic Frequency Chart */}
                <div className="md:col-span-7 panel-elevated rounded-lg p-4 md:p-5">
                  <h3 className="font-mono text-xs font-semibold text-primary mb-5 tracking-widest uppercase">Topic Frequency</h3>
                  <div className="space-y-3">
                    {demoResults.topics.map((t, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scaleX: 0 }}
                        whileInView={{ opacity: 1, scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        style={{ transformOrigin: "left" }}
                        className="flex items-center gap-3"
                      >
                        <span className="font-mono text-[10px] sm:text-[11px] text-foreground w-[120px] sm:w-[180px] shrink-0 truncate">{t.name}</span>
                        <div className="flex-1 h-5 bg-muted/50 rounded-sm overflow-hidden relative">
                          <motion.div
                            className="h-full rounded-sm"
                            style={{
                              background: `linear-gradient(90deg, hsl(42 88% 63%) ${100 - (t.frequency / 9) * 80}%, hsl(42 88% 63% / 0.3))`,
                              width: `${(t.frequency / 9) * 100}%`,
                            }}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${(t.frequency / 9) * 100}%` }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 + i * 0.06, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                          />
                        </div>
                        <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded border shrink-0 hidden sm:inline ${priorityBg(t.priority)} ${priorityColor(t.priority)}`}>
                          {t.priority}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Right column */}
                <div className="md:col-span-5 flex flex-col gap-4 md:gap-5">
                  {/* Coverage */}
                  <div className="panel-elevated rounded-lg p-5 flex flex-col items-center justify-center">
                    <h3 className="font-mono text-xs font-semibold text-primary mb-3 tracking-widest uppercase">Exam Coverage</h3>
                    <div className="relative w-28 h-28 flex items-center justify-center">
                      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                        <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(240 6% 18%)" strokeWidth="6" />
                        <motion.circle
                          cx="50" cy="50" r="42" fill="none"
                          stroke="hsl(42 88% 63%)"
                          strokeWidth="6"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 42}`}
                          initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                          whileInView={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - demoResults.coverage / 100) }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </svg>
                      <span className="absolute font-mono text-2xl font-bold text-primary">{demoResults.coverage}%</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground font-sans mt-2">Estimated from top topics</p>
                  </div>

                  {/* Study Plan */}
                  <div className="panel-elevated rounded-lg p-5 flex-1">
                    <h3 className="font-mono text-xs font-semibold text-primary mb-4 tracking-widest uppercase">Study Plan</h3>
                    <div className="space-y-2.5">
                      {demoResults.study_plan.map((d, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: 10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 + i * 0.08 }}
                          className="flex items-center gap-3"
                        >
                          <span className="font-mono text-[10px] text-primary bg-primary/10 rounded px-1.5 py-0.5">D{d.day}</span>
                          <span className="font-mono text-xs text-foreground">{d.topic}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Predicted Questions */}
              <div className="panel-elevated rounded-lg p-4 md:p-5 mt-4 md:mt-5">
                <h3 className="font-mono text-xs font-semibold text-primary mb-4 tracking-widest uppercase">Predicted Exam Questions</h3>
                <div className="space-y-2">
                  {demoResults.predicted_questions.slice(0, 3).map((q, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      className="flex items-start gap-3 text-left"
                    >
                      <span className="font-mono text-[10px] text-primary mt-0.5 shrink-0">Q{i + 1}</span>
                      <p className="font-sans text-xs text-muted-foreground leading-relaxed">{q}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Why This Matters */}
      <section className="max-w-4xl mx-auto px-4 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="panel-elevated rounded-lg p-6 md:p-10 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.04] to-transparent" />
          <div className="relative">
            <h2 className="font-mono text-2xl font-bold text-foreground mb-4">Why This Matters</h2>
            <p className="text-muted-foreground font-sans max-w-2xl mx-auto mb-8 leading-relaxed">
              Students often study the entire syllabus without knowing which topics matter most.
              SyllabiX helps you focus on the <span className="text-primary font-semibold">20% of topics</span> that
              generate <span className="text-primary font-semibold">80% of exam questions</span>.
            </p>
            <div className="flex items-center justify-center gap-6 sm:gap-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <div className="font-mono text-3xl sm:text-4xl font-bold text-primary">20%</div>
                <div className="text-xs text-muted-foreground font-sans mt-1">Topics to Study</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="font-mono text-2xl text-primary/40"
              >
                →
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
              >
                <div className="font-mono text-3xl sm:text-4xl font-bold text-primary">80%</div>
                <div className="text-xs text-muted-foreground font-sans mt-1">Exam Questions Covered</div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Team */}
      <section className="max-w-4xl mx-auto px-4 py-16 md:py-24">
        <h2 className="font-mono text-2xl font-bold text-foreground mb-14 text-center">Team — CodersDuo</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-xl mx-auto">
          {[
            { name: "J Joshua Haniel", role: "AI & Full Stack Developer" },
            { name: "Eswaramuthu M", role: "Backend & Data Systems Engineer" },
          ].map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="panel-elevated rounded-lg p-6 text-center group hover:border-primary/20 transition-colors duration-300"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center group-hover:bg-primary/15 transition-colors duration-300">
                <span className="font-mono text-lg text-primary font-semibold">{member.name[0]}</span>
              </div>
              <h3 className="font-mono text-sm font-semibold text-foreground">{member.name}</h3>
              <p className="text-xs text-muted-foreground font-sans mt-1">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 py-16 md:py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-mono text-2xl md:text-3xl font-bold text-foreground mb-4">Ready to study smarter?</h2>
          <p className="text-muted-foreground font-sans mb-8">Upload your syllabus and get AI-powered insights in seconds.</p>
          <Button onClick={() => navigate("/auth")} className="h-12 px-10 font-mono text-sm tracking-wider gold-glow group">
            Get Started <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 px-6 py-8">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center">
          <span className="font-mono text-sm text-foreground">SyllabiX</span>
          <span className="text-xs text-muted-foreground font-sans">CodeVerse 2026 Hackathon</span>
        </div>
      </footer>
    </div>
  );
};

export default Index;
