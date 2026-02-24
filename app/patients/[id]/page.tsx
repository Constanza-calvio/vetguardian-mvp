import { sql } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

export default async function PatientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { sessionClaims } = await auth();
  const claims = sessionClaims as any; // Esto silencia el error de TypeScript
  const role = claims?.metadata?.role || "vet";

  const numericId = parseInt(id, 10);
  if (!numericId || isNaN(numericId)) return notFound();

  // 1. Obtener datos del paciente
  const patientResult = await sql`
    SELECT * FROM patients WHERE id = ${numericId}
  `;
  if (patientResult.length === 0) return notFound();
  const patient = patientResult[0];

  // 2. Obtener historial de registros SOAP (Historia 2: Ver lo de otros médicos)
  const history = await sql`
    SELECT id, vet_name, created_at, assessment 
    FROM soap_records 
    WHERE patient_id = ${numericId} 
    ORDER BY created_at DESC
  `;

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        
        {/* ENCABEZADO DE FICHA */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <Link href="/dashboard" className="text-[10px] font-black text-gray-400 hover:text-black tracking-[0.2em] mb-4 block uppercase">
              ← Dashboard
            </Link>
            <h1 className="text-5xl font-black text-[#1A1A1A] tracking-tighter uppercase">
              {patient.name}
            </h1>
            <p className="text-[#D9FF66] font-bold tracking-widest uppercase text-xs mt-2 bg-black inline-block px-2">
              Expediente #{patient.id}
            </p>
          </div>

          {/* Botón para crear nuevo registro (Historia 1 y 2) */}
          {role === "vet" && (
            <Link 
              href={`/patients/${id}/soap`}
              className="bg-[#D9FF66] text-black px-6 py-4 rounded-2xl font-black text-xs tracking-widest hover:bg-black hover:text-[#D9FF66] transition-all shadow-xl shadow-lime-500/10"
            >
              + NUEVA ATENCIÓN (SOAP)
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* COLUMNA IZQUIERDA: DATOS BÁSICOS */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
              <h2 className="text-[10px] font-black text-gray-400 tracking-widest uppercase mb-6">Información General</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-bold text-gray-300 uppercase">Dueño</p>
                  <p className="font-bold text-[#1A1A1A]">{patient.owner}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-300 uppercase">Raza</p>
                  <p className="font-bold text-[#1A1A1A]">{patient.breed}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-300 uppercase">Edad</p>
                  <p className="font-bold text-[#1A1A1A]">{patient.age} años</p>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: LÍNEA DE TIEMPO / HISTORIAL (Historia 2) */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-[10px] font-black text-gray-400 tracking-widest uppercase ml-4">Historial de Atenciones</h2>
            
            {history.length === 0 ? (
              <div className="bg-white p-12 rounded-[40px] border-2 border-dashed border-gray-100 text-center">
                <p className="text-gray-400 font-bold text-xs tracking-widest uppercase">No hay registros médicos aún</p>
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((record: any) => (
                  <div key={record.id} className="bg-white p-6 rounded-[32px] border border-gray-100 hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-[10px] font-black text-[#D9FF66] bg-black px-2 py-0.5 rounded inline-block mb-2 uppercase italic">
                          Atendido por: {record.vet_name}
                        </p>
                        <h3 className="text-lg font-bold text-[#1A1A1A] leading-tight">
                          {record.assessment}
                        </h3>
                      </div>
                      <span className="text-[10px] font-bold text-gray-300 uppercase">
                        {new Date(record.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {/* El veterinario 2 puede ver lo que hizo el veterinario 1 */}
                    <div className="flex justify-end">
                      <Link 
                          href={`/soap/${record.id}`}
                            className="text-[10px] font-black text-gray-400 group-hover:text-black tracking-widest uppercase transition-colors flex items-center gap-2"
                            >
                          Ver Ficha Completa <span className="text-lg">⊕</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}