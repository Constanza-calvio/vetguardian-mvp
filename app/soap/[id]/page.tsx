import { sql } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function SoapDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Traer el registro SOAP con los datos del paciente para el encabezado
  const result = await sql`
    SELECT s.*, p.name as patient_name, p.species, p.breed, p.owner
    FROM soap_records s
    JOIN patients p ON s.patient_id = p.id
    WHERE s.id = ${id}
  `;

  if (result.length === 0) return notFound();
  const record = result[0];

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        
        {/* ENCABEZADO */}
        <div className="mb-10 flex justify-between items-start">
          <div>
            <Link href={`/patients/${record.patient_id}`} className="text-[10px] font-black text-gray-400 hover:text-black tracking-[0.2em] mb-4 block uppercase">
              ← Volver al Expediente
            </Link>
            <h1 className="text-4xl font-black text-[#1A1A1A] tracking-tighter uppercase">
              DETALLE CLÍNICO <span className="text-[#D9FF66] bg-black px-2">SOAP</span>
            </h1>
            <p className="text-sm text-gray-500 font-medium mt-2">
              Registro realizado por: <span className="text-black font-bold uppercase">{record.vet_name}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Fecha de Atención</p>
            <p className="text-lg font-bold text-black">{new Date(record.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        {/* INFO DEL PACIENTE (Mini Card) */}
        <div className="bg-white border border-gray-100 p-6 rounded-[32px] mb-8 flex gap-8 items-center">
            <div>
                <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Paciente</p>
                <p className="text-xl font-black text-black">{record.patient_name}</p>
            </div>
            <div className="h-10 w-px bg-gray-100"></div>
            <div>
                <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Especie/Raza</p>
                <p className="font-bold text-gray-600">{record.species} - {record.breed}</p>
            </div>
        </div>

        {/* CONTENIDO SOAP */}
        <div className="grid grid-cols-1 gap-6">
          
          {/* S & O */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
              <h3 className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase mb-4 underline decoration-[#D9FF66] decoration-4 underline-offset-8">1. Subjetivo</h3>
              <p className="text-gray-700 leading-relaxed font-medium">{record.subjective || "Sin hallazgos reportados."}</p>
            </section>

            <section className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
              <h3 className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase mb-4 underline decoration-[#D9FF66] decoration-4 underline-offset-8">2. Objetivo</h3>
              <p className="text-gray-700 leading-relaxed font-medium">{record.objective || "Sin examen clínico registrado."}</p>
            </section>
          </div>

          {/* Exámenes Complementarios */}
          <section className="bg-black p-8 rounded-[40px] text-white">
            <h3 className="text-[10px] font-black text-[#D9FF66] tracking-[0.2em] uppercase mb-4">Exámenes Complementarios</h3>
            <p className="text-gray-300 font-medium italic">{record.complementary_tests || "No se solicitaron exámenes adicionales."}</p>
          </section>

          {/* A - Análisis (Diagnóstico) */}
          <section className="bg-white p-8 rounded-[40px] shadow-md border-2 border-[#D9FF66]">
            <h3 className="text-[10px] font-black text-black tracking-[0.2em] uppercase mb-4">3. Análisis / Diagnóstico</h3>
            <p className="text-xl font-black text-black tracking-tight">{record.assessment}</p>
          </section>

          {/* P - Plan (Tratamiento) */}
          <section className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
            <h3 className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase mb-4 underline decoration-[#D9FF66] decoration-4 underline-offset-8">4. Plan / Tratamiento</h3>
            <p className="text-gray-700 leading-relaxed font-bold bg-gray-50 p-4 rounded-2xl">{record.plan}</p>
          </section>

        </div>
      </div>
    </div>
  );
}