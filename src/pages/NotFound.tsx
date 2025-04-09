
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import MainLayout from "@/components/MainLayout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-7xl font-bold text-medical-600 mb-4">404</h1>
          <p className="text-2xl font-semibold mb-4">Page Not Found</p>
          <p className="text-muted-foreground mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Button size="lg" asChild>
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default NotFound;
