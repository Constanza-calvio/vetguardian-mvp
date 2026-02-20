"use client";
import { setRole } from "@/app/actions/setRole";
import { useRouter } from "next/navigation";

export default function RoleButton({ role, title, description }: { role: string, title: string, description: string }) {
  const router = useRouter();

  const handleSelect = async () => {
    try {
      await setRole(role);
      // Forzamos el refresco para que Clerk actualice la sesión en el cliente
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Error al asignar rol:", error);
    }
  };

  return (
    <button
      onClick={handleSelect}
      className="group w-full text-left p-6 bg-white border border-gray-100 rounded-[32px] hover:border-[#D9FF66] transition-all shadow-sm hover:shadow-xl active:scale-95 mb-4"
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-black text-[#1A1A1A] tracking-tighter uppercase group-hover:text-[#D9FF66]">
          {title}
        </h3>
        <span className="bg-gray-50 group-hover:bg-[#D9FF66] p-2 rounded-full transition-colors">
          →
        </span>
      </div>
      <p className="text-sm text-gray-400 font-medium leading-relaxed">
        {description}
      </p>
    </button>
  );
}