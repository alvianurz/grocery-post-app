import { useSession } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useAdminAuth() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (!isPending) {
      // Check if user is authenticated and has admin role
      if (session?.user) {
        // In a real app, you would check for an admin role here
        // For now, we'll assume any authenticated user is an admin
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        // Redirect to login if not authenticated
        router.push("/admin/login");
      }
    }
  }, [session, isPending, router]);

  return { isAuthenticated, isPending, session };
}