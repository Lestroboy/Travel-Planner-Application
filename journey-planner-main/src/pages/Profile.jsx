import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  User, Mail, Phone, MapPin, Calendar, Settings, 
  LogOut, Edit2, Camera, Shield, CreditCard, Bell, Heart
} from "lucide-react";
import toast from "react-hot-toast";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-16 text-center">
          <h1 className="text-2xl font-heading font-bold mb-4">Please Login</h1>
          <p className="text-muted-foreground mb-6">You need to be logged in to view your profile</p>
          <button onClick={() => navigate("/login")} className="btn-primary">
            Go to Login
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const tabs = [
    { id: "profile", name: "Profile", icon: User },
    { id: "bookings", name: "My Bookings", icon: Calendar },
    { id: "wishlist", name: "Wishlist", icon: Heart },
    { id: "settings", name: "Settings", icon: Settings },
  ];

  const stats = [
    { label: "Trips Planned", value: "12" },
    { label: "Countries Visited", value: "8" },
    { label: "Reviews Given", value: "24" },
    { label: "Points Earned", value: "2,450" },
  ];

  const recentBookings = [
    {
      id: 1,
      type: "Flight",
      title: "Delhi → Mumbai",
      date: "Jan 15, 2026",
      status: "Confirmed",
      price: 4500,
    },
    {
      id: 2,
      type: "Hotel",
      title: "Taj Palace, Mumbai",
      date: "Jan 15-17, 2026",
      status: "Confirmed",
      price: 12000,
    },
    {
      id: 3,
      type: "Train",
      title: "Mumbai → Goa",
      date: "Jan 18, 2026",
      status: "Pending",
      price: 850,
    },
  ];

  return (
    <div className="min-h-screen bg-muted">
      <Header />

      {/* Profile Header */}
      <section className="pt-24 pb-8 bg-gradient-sunset">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <img
                src={user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200"}
                alt={user?.name}
                className="w-28 h-28 rounded-full border-4 border-primary-foreground object-cover"
              />
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-background rounded-full flex items-center justify-center shadow-lg hover:bg-muted transition-colors">
                <Camera className="w-5 h-5 text-foreground" />
              </button>
            </div>

            {/* Info */}
            <div className="text-center md:text-left text-primary-foreground">
              <h1 className="text-3xl font-heading font-bold mb-1">{user?.name}</h1>
              <p className="text-primary-foreground/80 flex items-center justify-center md:justify-start gap-2">
                <Mail className="w-4 h-4" /> {user?.email}
              </p>
              <p className="text-primary-foreground/80 flex items-center justify-center md:justify-start gap-2 mt-1">
                <MapPin className="w-4 h-4" /> Mumbai, India
              </p>
            </div>

            {/* Actions */}
            <div className="md:ml-auto flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground rounded-lg transition-colors">
                <Edit2 className="w-4 h-4" /> Edit Profile
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4 text-center text-primary-foreground"
              >
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-primary-foreground/80">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="sticky top-16 bg-background border-b border-border z-40">
        <div className="container-custom">
          <div className="flex gap-1 overflow-x-auto hide-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8">
        <div className="container-custom">
          {activeTab === "profile" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid md:grid-cols-3 gap-6"
            >
              {/* Personal Info */}
              <div className="md:col-span-2 bg-card rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-heading font-bold mb-6">Personal Information</h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-muted-foreground">Full Name</label>
                    <p className="font-medium mt-1">{user?.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Email Address</label>
                    <p className="font-medium mt-1">{user?.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Phone Number</label>
                    <p className="font-medium mt-1">+91 98765 43210</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Date of Birth</label>
                    <p className="font-medium mt-1">January 15, 1995</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Gender</label>
                    <p className="font-medium mt-1">Male</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Nationality</label>
                    <p className="font-medium mt-1">Indian</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-4">
                <div className="bg-card rounded-2xl p-6 shadow-lg">
                  <h3 className="font-heading font-semibold mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors text-left">
                      <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-secondary" />
                      </div>
                      <div>
                        <p className="font-medium">Security</p>
                        <p className="text-xs text-muted-foreground">Password & 2FA</p>
                      </div>
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors text-left">
                      <div className="w-10 h-10 rounded-full bg-accent-green/10 flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-accent-green" />
                      </div>
                      <div>
                        <p className="font-medium">Payment Methods</p>
                        <p className="text-xs text-muted-foreground">Manage cards</p>
                      </div>
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors text-left">
                      <div className="w-10 h-10 rounded-full bg-accent-orange/10 flex items-center justify-center">
                        <Bell className="w-5 h-5 text-accent-orange" />
                      </div>
                      <div>
                        <p className="font-medium">Notifications</p>
                        <p className="text-xs text-muted-foreground">Email & push</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "bookings" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="p-6 border-b border-border">
                <h2 className="text-xl font-heading font-bold">Recent Bookings</h2>
              </div>
              <div className="divide-y divide-border">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="p-6 flex items-center justify-between hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        booking.type === "Flight" ? "bg-secondary/10 text-secondary" :
                        booking.type === "Hotel" ? "bg-accent-purple/10 text-accent-purple" :
                        "bg-accent-green/10 text-accent-green"
                      }`}>
                        {booking.type === "Flight" ? "✈️" : booking.type === "Hotel" ? "🏨" : "🚂"}
                      </div>
                      <div>
                        <p className="font-medium">{booking.title}</p>
                        <p className="text-sm text-muted-foreground">{booking.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{booking.price.toLocaleString()}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        booking.status === "Confirmed" 
                          ? "bg-accent-green/10 text-accent-green" 
                          : "bg-accent-yellow/10 text-accent-yellow"
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-6 bg-muted/50 text-center">
                <button className="text-primary font-medium hover:underline">
                  View All Bookings →
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === "wishlist" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-heading font-bold mb-2">Your Wishlist is Empty</h2>
              <p className="text-muted-foreground mb-6">Start exploring and save your favorite destinations</p>
              <button onClick={() => navigate("/hotels/search")} className="btn-primary">
                Explore Hotels
              </button>
            </motion.div>
          )}

          {activeTab === "settings" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto bg-card rounded-2xl p-6 shadow-lg"
            >
              <h2 className="text-xl font-heading font-bold mb-6">Account Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-muted">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive booking updates via email</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-muted">
                  <div>
                    <p className="font-medium">SMS Alerts</p>
                    <p className="text-sm text-muted-foreground">Get trip reminders via SMS</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-muted">
                  <div>
                    <p className="font-medium">Marketing Emails</p>
                    <p className="text-sm text-muted-foreground">Receive deals and offers</p>
                  </div>
                  <input type="checkbox" className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-border">
                <h3 className="font-heading font-semibold mb-4 text-destructive">Danger Zone</h3>
                <button className="px-4 py-2 border border-destructive text-destructive rounded-lg hover:bg-destructive hover:text-destructive-foreground transition-colors">
                  Delete Account
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Profile;
