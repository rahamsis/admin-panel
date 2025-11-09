// pages/login.tsx
"use client";

/* eslint-disable */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, } from "next-auth/react";
import { Mail, LockKeyhole, Eye, EyeClosed } from "lucide-react";
import ParticlesBackground from "@/components/ParticlesBackground";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ email?: string[]; password?: string[] }>({});

  //sleep 
  // const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Manejo de cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Eliminar espacios en blanco mientras el usuario escribe
    const sanitizedValue = value.replace(/\s+/g, "");

    // Actualizar estados correctos
    if (name === "email") setEmail(sanitizedValue);
    if (name === "password") setPassword(sanitizedValue);

    // Limpiar error del campo que está siendo modificado
    setErrors((prevErrors) => {
      // Si ya no hay error en ese campo, devolver prevErrors tal cual
      if (!prevErrors[name as keyof typeof prevErrors]) return prevErrors;

      // Crear copia y eliminar error del campo actual
      const updatedErrors = { ...prevErrors };
      delete updatedErrors[name as keyof typeof prevErrors];

      return updatedErrors;
    });

    setMessage(null)
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nuevosErrores: { email?: string[]; password?: string[] } = {};

    if (!email?.trim()) nuevosErrores.email = ["El correo es obligatorio"];
    if (!password?.trim()) nuevosErrores.password = ["La contraseña es obligatoria"];

    if (Object.keys(nuevosErrores).length > 0) {
      setErrors(nuevosErrores);
      return;
    }

    setErrors({});
    setMessage(null);
    setIsLoading(true);

    const hostname = window.location.hostname; // admin.importonyperu.com.pe
    const tenantId = hostname.replace("admin.", "").split(".")[0];

    try {
      // const origin = window.location.origin;
      const res = await signIn("credentials", {
        email,
        password,
        tenantId,
        redirect: false, // Evita redirección automática
        // callbackUrl: `${origin}/dashboard`,
      });

      console.log("SignIn response:", res);

      // Simula una espera para propósitos de demostración
      // await sleep(5000);

      if (!res?.ok) {
        setIsLoading(false);
        setMessage(res?.error!);
        return;
      }

      // Redirige manualmente después de un inicio de sesión exitoso
      // window.location.href = "/dashboard";
      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error)
      setMessage("Error al iniciar sesión");
      setIsLoading(false);
    }

  };

  return (
    <div className="flex h-screen items-center justify-center">
      {/* Partículas en el fondo */}
      <div className="absolute inset-0 ">
        <ParticlesBackground />
      </div>

      <form onSubmit={handleSubmit} className="z-10 bg-white border p-8 rounded-xl shadow-md w-96 space-y-4">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-600">Iniciar sesión</h2>

        <div>
          <label htmlFor="email" className="block mb-1"> Email </label>
          <div className="relative">
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded pl-10 focus:outline-none"
              placeholder="Ingrese un email"
            />
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-secondary peer-focus:text-gray-900" />
          </div>
          {
            errors.email &&
            <p className="mt-2 text-sm text-red-500" >
              {errors.email}
            </p>
          }
        </div>


        <div>
          <label htmlFor="password" className="block mb-1"> Contraseña </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
              className="w-full px-3 py-1 border rounded pl-10"
              placeholder="Ingrese una contraseña"
            />
            <button
              type="button"
              className="absolute right-0 top-0 h-full px-3 text-secondary"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ?
                <EyeClosed /> : <Eye />
              }
            </button>
            <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-secondary peer-focus:text-gray-900" />
          </div>
          {
            errors.password &&
            <p className="mt-2 text-sm text-red-500" >
              {errors.password}
            </p>
          }
        </div>

        {
          message &&
          <div className="flex flex-row bg-red-100 rounded-lg text-red-500 px-2 py-1 items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-circle-fill" viewBox="0 0 16 16">
              <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2" />
            </svg>
            <p className="text-sm text-red-500 text-center ml-2">
              {message}
            </p>
          </div>

        }

        {/* <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Ingresar
        </button> */}
        <button type="submit" className="w-full bg-cyan-500 justify-center text-white py-2 rounded">
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l4-4-4-4v4a8 8 0 00-8 8H4z"></path>
              </svg>
              Cargando...
            </div>
          ) : (
            "Iniciar sesión"
          )}
        </button>
      </form>
    </div>
  );
}
