import { auth, currentUser } from "@clerk/nextjs/server";
import { SignOutButton } from "@clerk/nextjs";
import { sql } from "@/lib/db";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const { userId } = await auth();
  const user = await currentUser();
  const role = (user?.publicMetadata?.role as string);

  // Mapeo de nombres para la interfaz
  const roleNames: Record<string, string> = {
    vet: "Médico Veterinario",
    secretary: "Personal Administrativo",
  };

  if (!role) redirect("/onboarding");

  // Consulta a Neon: Ordenamos por Triage (Rojo > Amarillo > Verde) y luego por fecha
  const patients = await sql`
    SELECT id, name, owner, species, triage_color, reason 
    FROM patients 
    ORDER BY 
      CASE 
        WHEN triage_color = 'red' THEN 1 
        WHEN triage_color = 'yellow' THEN 2 
        ELSE 3 
      END ASC, 
      created_at DESC
  `;

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* BARRA SUPERIOR / CERRAR SESIÓN */}
        <div className="flex justify-end mb-6">
          <SignOutButton>
            <button className="group flex items-center gap-2 text-[10px] font-bold text-gray-400 hover:text-red-500 transition-all tracking-[0.2em] uppercase">
              Finalizar Sesión 
              <span className="bg-gray-100 group-hover:bg-red-50 p-1 rounded-full text-lg leading-none">×</span>
            </button>
          </SignOutButton>
        </div>

        {/* CABECERA PRINCIPAL */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-5xl font-black text-[#1A1A1A] tracking-tighter uppercase leading-none">
              {role === "vet" ? "Panel Clínico" : "Gestión de Recepción"}
            </h1>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-[#1A1A1A] bg-[#D9FF66] px-3 py-1 rounded-full text-[10px] italic font-black uppercase tracking-widest shadow-sm">
                {roleNames[role] || role}
              </span>
              <p className="text-gray-400 text-sm font-semibold tracking-tight">
                Sesión: {user?.firstName} {user?.lastName}
              </p>
            </div>
          </div>

          <Link
            href="/patients/new"
            className="bg-[#D9FF66] text-black px-10 py-5 rounded-[24px] font-black text-xs tracking-widest hover:bg-black hover:text-[#D9FF66] transition-all shadow-[0_20px_40px_rgba(217,255,102,0.2)] hover:scale-105 active:scale-95"
          >
            + REGISTRAR PACIENTE
          </Link>
        </div>

        {/* PANEL DE INTELIGENCIA ARTIFICIAL (Contextual para Vets) */}
        {role === "vet" && (
          <div className="mb-12 bg-[#1A1A1A] p-10 rounded-[45px] relative overflow-hidden shadow-2xl border border-white/5">
            <div className="absolute -right-10 -top-10 w-64 h-64 bg-[#D9FF66] opacity-10 blur-[100px]"></div>
            <div className="relative">
              <div className="flex items-center gap-2 mb-5">
                <span className="flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-[#D9FF66] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#D9FF66]"></span>
                </span>
                <p className="text-[#D9FF66] text-[10px] font-black tracking-[0.4em] uppercase">VetGuardian IA • Análisis de Triage</p>
              </div>
              
              <h2 className="text-white text-2xl md:text-3xl font-bold leading-[1.2] max-w-4xl tracking-tight">
                {user?.firstName?.toLowerCase().includes("juan") 
                  ? <>"Hoy tienes en agenda el <span className="text-[#D9FF66] italic">chequeo de Candy</span> después de su cirugía a las 4:00 PM. Moly y Sushi están estables en espera."</>
                  : <>"Bienvenido. Se han priorizado <span className="text-[#D9FF66]">{patients.length} pacientes</span>. Candy lidera la lista por riesgo post-operatorio crítico."</>
                }
              </h2>
            </div>
          </div>
        )}

        {/* LISTADO DE PACIENTES */}
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-[11px] font-black text-gray-400 tracking-[0.3em] uppercase whitespace-nowrap">
            {role === "vet" ? "Cola de Atención Priorizada" : "Pacientes en Recepción"}
          </h2>
          <div className="h-px bg-gray-200 w-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {patients.map((p: any) => (
            <div key={p.id} className="group bg-white p-8 rounded-[48px] border border-gray-100 shadow-sm hover:shadow-2xl hover:border-[#D9FF66]/50 transition-all duration-500 relative overflow-hidden">
              
              {/* Indicador de Triage Dinámico */}
              <div className={`absolute left-0 top-0 bottom-0 w-3 ${
                p.triage_color === 'red' ? 'bg-red-500' : 
                p.triage_color === 'yellow' ? 'bg-yellow-400' : 'bg-green-400'
              }`}></div>

              <div className="flex justify-between items-start mb-8">
                <span className={`text-[9px] font-black px-4 py-1.5 rounded-full uppercase italic tracking-wider ${
                  p.triage_color === 'red' ? 'bg-red-50 text-red-600' : 
                  p.triage_color === 'yellow' ? 'bg-yellow-50 text-yellow-700' : 'bg-green-50 text-green-700'
                }`}>
                  {p.triage_color === 'red' ? '🔴 Crítico / Prioridad' : 
                   p.triage_color === 'yellow' ? '🟡 Urgencia Media' : '🟢 Control General'}
                </span>
                <span className="text-[10px] font-bold text-gray-300 tracking-tighter">ID-00{p.id}</span>
              </div>
              
              <h3 className="text-4xl font-black text-[#1A1A1A] tracking-tighter mb-2 group-hover:text-[#D9FF66] transition-colors">
                {p.name}
              </h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.15em] mb-8">
                {p.species === 'dog' ? 'Canino' : 'Felino'} • {p.reason}
              </p>

              <div className="flex flex-col gap-3 pt-6 border-t border-gray-50">
                <Link 
                  href={`/patients/${p.id}`} 
                  className="w-full text-center py-4 rounded-2xl font-black text-[10px] bg-gray-50 text-gray-500 hover:bg-gray-200 transition-all uppercase tracking-widest"
                >
                  Ver Expediente
                </Link>
                
                {role === "vet" && (
                  <Link 
                    href={`/patients/${p.id}/soap`} 
                    className="w-full text-center bg-black text-[#D9FF66] py-5 rounded-2xl font-black text-[10px] hover:scale-[1.02] transition-all uppercase tracking-[0.2em] shadow-lg"
                  >
                    Crear Registro SOAP
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ESTADO VACÍO */}
        {patients.length === 0 && (
          <div className="text-center py-32 bg-white rounded-[50px] border-2 border-dashed border-gray-100 mt-10">
            <p className="text-gray-300 font-black tracking-[0.4em] text-xs uppercase">Sin pacientes en sistema</p>
          </div>
        )}
      </div>
    </div>
  );
}