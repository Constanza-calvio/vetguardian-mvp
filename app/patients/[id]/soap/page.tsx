import { sql } from "@/lib/db";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function NewSoapPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await currentUser();

  async function createSoap(formData: FormData) {
    "use server";
    
    const patientId = id;
    const vetName = formData.get("vetName") as string;
    const subjective = formData.get("subjective") as string;
    const objective = formData.get("objective") as string;
    const complementary = formData.get("complementary") as string;
    const assessment = formData.get("assessment") as string;
    const plan = formData.get("plan") as string;

    await sql`
      INSERT INTO soap_records (patient_id, vet_name, subjective, objective, complementary_tests, assessment, plan)
      VALUES (${patientId}, ${vetName}, ${subjective}, ${objective}, ${complementary}, ${assessment}, ${plan})
    `;

    redirect(`/patients/${patientId}`);
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6] p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        
        <div className="mb-10">
          <Link href={`/patients/${id}`} className="text-[10px] font-black text-gray-500 hover:text-black tracking-[0.2em] mb-4 block">
            ← VOLVER A LA FICHA
          </Link>
          <h1 className="text-4xl font-black text-[#1A1A1A] tracking-tighter uppercase">
            NUEVO REGISTRO <span className="text-[#D9FF66] bg-black px-2">SOAP</span>
          </h1>
          <p className="text-sm text-gray-500 font-medium mt-2">Historia Clínica Digital - VetGuardian Intelligence</p>
        </div>

        <form action={createSoap} className="space-y-6">
          
          {/* SECCIÓN: INFORMACIÓN GENERAL */}
          <div className="bg-black p-8 rounded-[32px] text-white shadow-2xl">
            <label className="text-[10px] font-black text-[#D9FF66] tracking-widest uppercase mb-2 block">Médico Tratante</label>
            <input 
              name="vetName"
              defaultValue={user?.firstName + " " + user?.lastName}
              className="w-full bg-transparent border-b border-gray-700 py-2 text-xl font-bold focus:outline-none focus:border-[#D9FF66] transition-colors text-white placeholder:text-gray-600"
              placeholder="Nombre del veterinario"
              required
            />
            <p className="text-[10px] text-gray-500 mt-4 uppercase tracking-tighter font-bold">Fecha de registro: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* S - SUBJETIVO */}
            <div className="bg-white p-6 rounded-[32px] border border-gray-200 shadow-sm">
              <label className="text-[10px] font-black text-gray-400 tracking-widest uppercase mb-4 block">1. Subjetivo (Hallazgos y Motivo)</label>
              <textarea 
                name="subjective"
                rows={4}
                placeholder="¿Qué reporta el dueño? Síntomas observados..."
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-bold text-black focus:ring-2 focus:ring-[#D9FF66] focus:bg-white outline-none transition-all placeholder:text-gray-400"
              />
            </div>

            {/* O - OBJETIVO */}
            <div className="bg-white p-6 rounded-[32px] border border-gray-200 shadow-sm">
              <label className="text-[10px] font-black text-gray-400 tracking-widest uppercase mb-4 block">2. Objetivo (Examen Clínico)</label>
              <textarea 
                name="objective"
                rows={4}
                placeholder="Constantes vitales, FC, FR, T°, mucosas, palpación..."
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-bold text-black focus:ring-2 focus:ring-[#D9FF66] focus:bg-white outline-none transition-all placeholder:text-gray-400"
              />
            </div>

            {/* EXÁMENES COMPLEMENTARIOS */}
            <div className="bg-white p-6 rounded-[32px] border border-gray-200 shadow-sm md:col-span-2">
              <label className="text-[10px] font-black text-gray-400 tracking-widest uppercase mb-4 block">Exámenes Complementarios</label>
              <input 
                name="complementary"
                placeholder="Hemograma, Ecografía, Rayos X, etc."
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-bold text-black focus:ring-2 focus:ring-[#D9FF66] focus:bg-white outline-none transition-all placeholder:text-gray-400"
              />
            </div>

            {/* A - ANÁLISIS / DIAGNÓSTICO */}
            <div className="bg-white p-6 rounded-[32px] border border-gray-200 shadow-sm">
              <label className="text-[10px] font-black text-black bg-[#D9FF66] px-2 py-1 rounded inline-block tracking-widest uppercase mb-4">3. Análisis (Diagnóstico)</label>
              <textarea 
                name="assessment"
                rows={4}
                placeholder="Diagnóstico presuntivo o definitivo..."
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-black text-black focus:ring-2 focus:ring-[#D9FF66] focus:bg-white outline-none transition-all placeholder:text-gray-400"
                required
              />
            </div>

            {/* P - PLAN / TRATAMIENTO */}
            <div className="bg-white p-6 rounded-[32px] border border-gray-200 shadow-sm">
              <label className="text-[10px] font-black text-gray-400 tracking-widest uppercase mb-4 block">4. Plan (Tratamiento)</label>
              <textarea 
                name="plan"
                rows={4}
                placeholder="Medicamentos, dosis, frecuencia y próximas citas..."
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-bold text-black focus:ring-2 focus:ring-[#D9FF66] focus:bg-white outline-none transition-all placeholder:text-gray-400"
                required
              />
            </div>

          </div>

          <button 
            type="submit"
            className="w-full bg-[#D9FF66] text-black py-6 rounded-[24px] font-black text-sm tracking-[0.3em] uppercase hover:bg-black hover:text-[#D9FF66] transition-all shadow-xl shadow-lime-500/20 active:scale-95"
          >
            Guardar Registro Clínico
          </button>

        </form>
      </div>
    </div>
  );
}