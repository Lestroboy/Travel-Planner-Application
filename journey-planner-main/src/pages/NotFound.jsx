import { Link } from "react-router-dom";
import { FiHome, FiMapPin } from "react-icons/fi";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <div className="text-center">
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <FiMapPin className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-6xl font-heading font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-heading font-semibold mb-2">Page Not Found</h2>
        <p className="text-muted-foreground mb-8 max-w-md">
          Looks like you've wandered off the map. Let's get you back on track!
        </p>
        <Link
          to="/"
          className="btn-primary inline-flex items-center gap-2"
        >
          <FiHome className="w-5 h-5" /> Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
