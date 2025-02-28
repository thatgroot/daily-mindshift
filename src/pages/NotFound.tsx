
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-[70vh]">
        <Card className="max-w-md w-full p-6">
          <CardContent className="flex flex-col items-center justify-center pt-6">
            <h1 className="text-6xl font-bold mb-4">404</h1>
            <p className="text-xl text-muted-foreground mb-6">Page not found</p>
            <Button asChild size="lg">
              <a href="/">Return to Dashboard</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default NotFound;
