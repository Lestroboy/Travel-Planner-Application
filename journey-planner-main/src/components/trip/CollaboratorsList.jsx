import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Mail, Shield, Edit2, Eye, X, Check } from "lucide-react";

const CollaboratorsList = ({ collaborators = [], onInvite, onRemove, onUpdateRole, isOwner = true }) => {
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("viewer");

  const roleConfig = {
    owner: { icon: Shield, color: "bg-primary/10 text-primary", label: "Owner" },
    editor: { icon: Edit2, color: "bg-accent-green/10 text-accent-green", label: "Editor" },
    planner: { icon: Edit2, color: "bg-secondary/10 text-secondary", label: "Planner" },
    viewer: { icon: Eye, color: "bg-muted text-muted-foreground", label: "Viewer" },
  };

  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.split(" ");
    return parts.length > 1
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
      : name.substring(0, 2).toUpperCase();
  };

  const handleInvite = () => {
    if (inviteEmail && onInvite) {
      onInvite(inviteEmail, inviteRole);
      setInviteEmail("");
      setInviteRole("viewer");
      setShowInviteForm(false);
    }
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-heading font-semibold text-lg">Collaborators</h3>
        {isOwner && (
          <button
            onClick={() => setShowInviteForm(true)}
            className="btn-ghost text-sm flex items-center gap-1.5 text-primary"
          >
            <UserPlus className="w-4 h-4" /> Invite
          </button>
        )}
      </div>

      {/* Invite Form */}
      <AnimatePresence>
        {showInviteForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 overflow-hidden"
          >
            <div className="p-4 rounded-xl bg-muted/50 border border-border space-y-3">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="input-field pl-10 py-2"
                  />
                </div>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="input-field py-2 w-28"
                >
                  <option value="editor">Editor</option>
                  <option value="planner">Planner</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleInvite}
                  className="btn-primary py-2 px-4 text-sm flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Send Invite
                </button>
                <button
                  onClick={() => setShowInviteForm(false)}
                  className="btn-ghost py-2 px-4 text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collaborators List */}
      <div className="space-y-3">
        {collaborators.map((collaborator, index) => {
          const roleInfo = roleConfig[collaborator.role] || roleConfig.viewer;
          const RoleIcon = roleInfo.icon;

          return (
            <motion.div
              key={collaborator.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors group"
            >
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
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
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium truncate">{collaborator.name}</span>
                  {collaborator.status === "pending" && (
                    <span className="badge bg-accent-orange/10 text-accent-orange text-xs">Pending</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground truncate">{collaborator.email}</p>
              </div>

              {/* Role Badge */}
              <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${roleInfo.color} flex items-center gap-1`}>
                <RoleIcon className="w-3 h-3" />
                {roleInfo.label}
              </div>

              {/* Remove Button (for non-owners) */}
              {isOwner && collaborator.role !== "owner" && (
                <button
                  onClick={() => onRemove?.(collaborator.id)}
                  className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-full hover:bg-destructive/10 flex items-center justify-center text-muted-foreground hover:text-destructive transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </motion.div>
          );
        })}
      </div>

      {collaborators.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No collaborators yet</p>
          <p className="text-sm">Invite team members to plan together</p>
        </div>
      )}
    </div>
  );
};

export default CollaboratorsList;
