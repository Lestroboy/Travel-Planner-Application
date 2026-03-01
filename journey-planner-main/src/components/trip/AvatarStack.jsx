import { motion } from "framer-motion";

const AvatarStack = ({ collaborators = [], max = 4, size = "md", showCount = true }) => {
  const sizeClasses = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-xs",
    lg: "w-10 h-10 text-sm",
    xl: "w-12 h-12 text-base",
  };

  const displayCollaborators = collaborators.slice(0, max);
  const remainingCount = Math.max(0, collaborators.length - max);

  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.split(" ");
    return parts.length > 1 
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
      : name.substring(0, 2).toUpperCase();
  };

  const roleColors = {
    owner: "ring-primary",
    editor: "ring-accent-green",
    planner: "ring-secondary",
    viewer: "ring-muted-foreground",
  };

  return (
    <div className="flex items-center">
      <div className="flex -space-x-2">
        {displayCollaborators.map((collaborator, index) => (
          <motion.div
            key={collaborator.id}
            initial={{ opacity: 0, scale: 0.8, x: -10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`${sizeClasses[size]} rounded-full ring-2 ring-background flex items-center justify-center overflow-hidden ${roleColors[collaborator.role] || ""}`}
            title={`${collaborator.name} (${collaborator.role})`}
          >
            {collaborator.avatar ? (
              <img
                src={collaborator.avatar}
                alt={collaborator.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-medium">
                {getInitials(collaborator.name)}
              </div>
            )}
          </motion.div>
        ))}
        {showCount && remainingCount > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`${sizeClasses[size]} rounded-full ring-2 ring-background bg-muted flex items-center justify-center font-medium text-muted-foreground`}
          >
            +{remainingCount}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AvatarStack;
