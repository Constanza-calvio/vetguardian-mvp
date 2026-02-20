import { sql } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";

export default function NewPatientPage() {
  async function createPatient(formData: FormData) {
    "use server";

    const name = formData.get("name") as string;
    const species = formData.get("species") as string;
    const breed = formData.get("breed") as string;
    const owner = formData.get("owner") as string;
    const age = formData.get("age") as string;

    await sql`
      INSERT INTO patients (name, species, breed, owner, age)
      VALUES (
        ${name},
        ${species},
        ${breed},
        ${owner},
        ${age ? Number(age) : null}
      )
    `;

    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] px-6">
      <div className="relative w-full max-w-lg bg-white p-12 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-100">
        
        {/* Decoración sutil */}
        <div className="absolute top-0 left-0 w-24 h-24 bg-[#D9FF66] opacity-20 blur-[60px] -ml-10 -mt-10"></div>

        <div className="relative mb-10">
          <Link href="/dashboard" className="text-[10px] font-black text-gray-400 hover:text-black transition tracking-widest mb-4 block">
            ← VOLVER AL DASHBOARD
          </Link>
          <h1 className="text-4xl font-black text-[#1A1A1A] tracking-tighter">
            NUEVO <span className="text-[#D9FF66]">PACIENTE</span>
          </h1>
          <p className="text-sm text-gray-500 font-medium mt-2">
            Ingresa los datos del paciente para el análisis médico.
          </p>
        </div>

        <form action={createPatient} className="relative space-y-4">
          
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-2">Nombre de la Mascota</label>
            <input
              name="name"
              placeholder="Ej. Max"
              required
              className="w-full bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-[#D9FF66] font-bold text-[#1A1A1A] transition-all placeholder:text-gray-300"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-2">Especie</label>
              <select
                name="species"
                required
                className="w-full bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-[#D9FF66] font-bold text-[#1A1A1A] transition-all appearance-none"
              >
                <option value="">Seleccionar...</option>
                <option value="dog">Perro</option>
                <option value="cat">Gato</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-2">Edad</label>
              <input
                name="age"
                type="number"
                placeholder="Ej. 5"
                className="w-full bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-[#D9FF66] font-bold text-[#1A1A1A] transition-all placeholder:text-gray-300"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-2">Raza</label>
            <input
              name="breed"
              placeholder="Ej. Golden Retriever"
              required
              className="w-full bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-[#D9FF66] font-bold text-[#1A1A1A] transition-all placeholder:text-gray-300"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-2">Nombre del Dueño</label>
            <input
              name="owner"
              placeholder="Ej. Constanza"
              required
              className="w-full bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-[#D9FF66] font-bold text-[#1A1A1A] transition-all placeholder:text-gray-300"
            />
          </div>

          <div className="pt-6">
            <button
              type="submit"
              className="w-full bg-[#1A1A1A] text-[#D9FF66] py-5 rounded-2xl font-black text-sm tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-black/10 uppercase"
            >
              Registrar en Sistema
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}