"use client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F5F7F6]">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          router.push("/dashboard");
        }}
        className="w-full max-w-md bg-white border border-[#E5E7EB] rounded-xl p-8"
      >
        <h1 className="text-2xl font-semibold mb-1">Welcome Back</h1>
        <p className="text-sm text-[#64748B] mb-6">
          Login to manage your clinic
        </p>

        <div className="space-y-4">
          <input
            placeholder="Email"
            className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-sm"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-sm"
          />
        </div>

        <button className="w-full mt-6 bg-[#0F766E] text-white py-3 rounded-lg text-sm font-medium">
          Sign In
        </button>

        <p className="text-sm text-center text-[#64748B] mt-6">
          No account?{" "}
          <a href="/register" className="text-[#0F766E] font-medium">
            Register
          </a>
        </p>
      </form>
    </main>
  );
}
