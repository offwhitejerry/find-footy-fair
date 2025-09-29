import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { fetchTicketmaster } from "@/providers/ticketmaster";

export default function Debug() {
  const [out, setOut] = useState<any>(null);
  
  return (
    <div className="p-6 space-x-2 text-sm">
      <button 
        className="px-3 py-1 border rounded" 
        onClick={async () => {
          const { data, error } = await supabase.functions.invoke("ticketmaster-health", { method: "GET" as any });
          setOut(error ? { error } : data);
        }}
      >
        Check Health
      </button>
      <button 
        className="px-3 py-1 border rounded" 
        onClick={async () => {
          try { 
            const r = await fetchTicketmaster({ q: "LAFC" }); 
            setOut({ count: r.length, sample: r[0] }); 
          } catch (e: any) { 
            setOut({ error: String(e?.message || e) }); 
          }
        }}
      >
        Test Adapter
      </button>
      <pre className="mt-3 text-xs whitespace-pre-wrap">
        {JSON.stringify(out, null, 2)}
      </pre>
    </div>
  );
}