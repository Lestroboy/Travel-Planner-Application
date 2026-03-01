import { motion } from "framer-motion";
import { Plane, Home, MapPin, Coffee, Truck, MoreHorizontal } from "lucide-react";
import { formatCurrency } from "../../utils/helpers";
import BudgetRing from "./BudgetRing";

const BudgetOverview = ({ budget = {}, currency = "INR" }) => {
  const { total = 0, spent = 0, planned = 0, categories = {} } = budget;
  const remaining = total - spent;

  const categoryConfig = {
    flights: { icon: Plane, color: "bg-secondary", label: "Flights" },
    hotels: { icon: Home, color: "bg-accent-purple", label: "Hotels" },
    activities: { icon: MapPin, color: "bg-accent-green", label: "Activities" },
    food: { icon: Coffee, color: "bg-primary", label: "Food" },
    transport: { icon: Truck, color: "bg-accent-orange", label: "Transport" },
    other: { icon: MoreHorizontal, color: "bg-muted-foreground", label: "Other" },
  };

  const categoryData = Object.entries(categories).map(([key, value]) => ({
    key,
    amount: value,
    percentage: total > 0 ? (value / total) * 100 : 0,
    ...(categoryConfig[key] || categoryConfig.other),
  })).filter(c => c.amount > 0);

  return (
    <div className="bg-card rounded-2xl border border-border p-6">
      <h3 className="font-heading font-semibold text-lg mb-6">Budget Overview</h3>

      {/* Main Stats */}
      <div className="flex items-center gap-6 mb-6">
        <BudgetRing spent={spent} total={total} size={100} strokeWidth={8} />
        <div className="flex-1 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Spent</span>
            <span className="font-semibold">{formatCurrency(spent, currency)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Planned</span>
            <span className="font-medium text-muted-foreground">{formatCurrency(planned, currency)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Remaining</span>
            <span className={`font-semibold ${remaining < 0 ? "text-destructive" : "text-accent-green"}`}>
              {formatCurrency(remaining, currency)}
            </span>
          </div>
          <div className="pt-2 border-t border-border">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Total Budget</span>
              <span className="font-bold text-lg">{formatCurrency(total, currency)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      {categoryData.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">By Category</h4>
          {categoryData.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <motion.div
                key={category.key}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3"
              >
                <div className={`w-8 h-8 rounded-lg ${category.color}/10 flex items-center justify-center`}>
                  <IconComponent className={`w-4 h-4 ${category.color.replace('bg-', 'text-')}`} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">{category.label}</span>
                    <span className="text-sm font-medium">{formatCurrency(category.amount, currency)}</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${category.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${category.percentage}%` }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Budget Alert */}
      {spent / total >= 0.9 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20"
        >
          <p className="text-sm text-destructive font-medium">
            ⚠️ You've used {Math.round((spent / total) * 100)}% of your budget
          </p>
        </motion.div>
      )}
      {spent / total >= 0.7 && spent / total < 0.9 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 rounded-xl bg-accent-orange/10 border border-accent-orange/20"
        >
          <p className="text-sm text-accent-orange font-medium">
            ⚡ You've used {Math.round((spent / total) * 100)}% of your budget
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default BudgetOverview;
