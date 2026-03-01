import { motion } from "framer-motion";

const StatsCard = ({ icon: Icon, label, value, sublabel, color = "primary", index = 0 }) => {
  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    green: "bg-accent-green/10 text-accent-green",
    orange: "bg-accent-orange/10 text-accent-orange",
    purple: "bg-accent-purple/10 text-accent-purple",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-card rounded-2xl border border-border p-5 hover:shadow-lg transition-shadow"
    >
      {/* <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl ${colorClasses[color]} flex items-center justify-center`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold font-heading">{value}</p>
          {sublabel && <p className="text-xs text-muted-foreground mt-0.5">{sublabel}</p>}
        </div>
      </div> */}
    </motion.div>
  );
};

export default StatsCard;
