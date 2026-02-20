import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import RoleButton from "@/components/RoleButton"; // Crearemos este pequeño componente

export default async function OnboardingPage() {
  const user = await currentUser();

  // Si ya tiene rol, lo mandamos al dashboard directamente
  if (user?.publicMetadata?.role) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] px-6">
      <div className="max-w-md w-full text-center">
        <h1 className="text-4xl font-black text-[#1A1A1A] tracking-tighter mb-2">
          BIENVENIDO A <span className="text-[#D9FF66] bg-black px-2">VETGUARDIAN</span>
        </h1>
        <p className="text-gray-500 font-medium mb-10">Para continuar, selecciona tu función en la clínica.</p>

        <div className="grid gap-4">
          {/* Botón Veterinario */}
          <RoleButton 
            role="vet" 
            title="Veterinario / Especialista" 
            description="Acceso total a fichas clínicas y registros SOAP."
          />

          {/* Botón Secretaría / Personal */}
          <RoleButton 
            role="secretary" 
            title="Personal Administrativo" 
            description="Registro de pacientes y gestión de agenda."
          />
        </div>
      </div>
    </div>
  );
}