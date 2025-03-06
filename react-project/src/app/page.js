"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [user, setUser] = useState(null);
  const router = useRouter(); 

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };

    fetchUser();
    supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user || null));
  }, []);

  useEffect(() => {
    if (!user) {
      router.push("/auth"); 
    }
  }, [user, router]);
}
