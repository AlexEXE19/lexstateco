import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Compass } from "lucide-react";

const RedirectPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate("/"), 2600);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-canvas px-6">
      <div className="max-w-md text-center">
        <Compass size={28} className="mx-auto text-ink-subtle" />
        <h1 className="mt-6 font-display text-display-sm text-ink">
          This page doesn't exist
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">
          The link may be out of date. We'll take you back to the homepage in a
          moment.
        </p>
        <Link to="/" className="btn-primary mt-8">
          Back to home
        </Link>
      </div>
    </div>
  );
};

export default RedirectPage;
