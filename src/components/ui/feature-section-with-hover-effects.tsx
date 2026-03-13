import { cn } from "@/lib/utils";
import {
  IconChartBar,
  IconTarget,
  IconChartPie,
  IconBook2,
} from "@tabler/icons-react";

const features = [
  {
    title: "Topic Frequency Analysis",
    description:
      "Detects the most frequently appearing topics across exam papers to identify patterns.",
    icon: <IconChartBar />,
  },
  {
    title: "Priority Topic Ranking",
    description:
      "Ranks topics by exam importance — High, Medium, and Low priority levels.",
    icon: <IconTarget />,
  },
  {
    title: "Exam Coverage Estimator",
    description:
      "Predicts how much of the exam is covered by studying the top priority topics.",
    icon: <IconChartPie />,
  },
  {
    title: "AI Study Plan Generator",
    description:
      "Creates an optimized day-by-day study roadmap tailored to your syllabus.",
    icon: <IconBook2 />,
  },
];

export function FeaturesSectionWithHoverEffects() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 max-w-7xl mx-auto">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r py-10 relative group/feature border-border/50",
        (index === 0 || index === 4) && "lg:border-l border-border/50",
        index < 4 && "lg:border-b border-border/50"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-primary/10 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-muted-foreground">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-border group-hover/feature:bg-primary transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-foreground font-mono">
          {title}
        </span>
      </div>
      <p className="text-sm text-muted-foreground max-w-xs relative z-10 px-10 font-sans">
        {description}
      </p>
    </div>
  );
};
