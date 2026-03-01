import { motion } from "framer-motion";

const Loader = ({ size = "default", text = "" }) => {
  const sizeClasses = {
    small: "w-6 h-6",
    default: "w-10 h-10",
    large: "w-16 h-16",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <motion.div
        className={`${sizeClasses[size]} rounded-full border-4 border-muted border-t-primary`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      {text && <p className="text-muted-foreground text-sm">{text}</p>}
    </div>
  );
};

export const PageLoader = () => {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-4"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-sunset mx-auto flex items-center justify-center mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-3 border-primary-foreground border-t-transparent rounded-full"
            />
          </div>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-muted-foreground"
        >
          Loading your adventure...
        </motion.p>
      </div>
    </div>
  );
};

export const SkeletonCard = () => {
  return (
    <div className="bg-card rounded-2xl overflow-hidden animate-pulse">
      <div className="h-48 bg-muted" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-1/2" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-5 bg-muted rounded w-1/4" />
          <div className="h-8 bg-muted rounded w-1/3" />
        </div>
      </div>
    </div>
  );
};

export const SkeletonList = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-card rounded-xl p-4 animate-pulse">
          <div className="flex gap-4">
            <div className="w-24 h-24 bg-muted rounded-lg" />
            <div className="flex-1 space-y-3">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
              <div className="h-3 bg-muted rounded w-1/4" />
            </div>
            <div className="w-24 space-y-2">
              <div className="h-5 bg-muted rounded" />
              <div className="h-8 bg-muted rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Loader;
