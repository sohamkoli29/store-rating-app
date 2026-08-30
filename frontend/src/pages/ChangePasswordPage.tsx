import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import api from "../lib/axios";

const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;

const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8).max(16).regex(passwordRegex, "Needs 1 uppercase letter and 1 special character"),
});

type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

const ChangePasswordPage = () => {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordValues>({ resolver: zodResolver(changePasswordSchema) });

  const onSubmit = async (values: ChangePasswordValues) => {
    setStatus("idle");
    try {
      await api.put("/auth/password", values);
      setStatus("success");
      setMessage("Password updated.");
      reset();
    } catch (err: any) {
      setStatus("error");
      setMessage(err?.response?.data?.message ?? "Failed to update password");
    }
  };

  return (
    <div className="mx-auto max-w-sm space-y-6 px-6 py-8">
      <h1 className="text-lg font-semibold text-slate-900">Change password</h1>

      {message && (
        <p className={`rounded-md px-3 py-2 text-sm ${status === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Current password</label>
          <input type="password" {...register("oldPassword")} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          {errors.oldPassword && <p className="mt-1 text-xs text-red-600">{errors.oldPassword.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">New password</label>
          <input type="password" {...register("newPassword")} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          {errors.newPassword && <p className="mt-1 text-xs text-red-600">{errors.newPassword.message}</p>}
        </div>

        <button type="submit" disabled={isSubmitting} className="w-full rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50">
          {isSubmitting ? "Updating..." : "Update password"}
        </button>
      </form>
    </div>
  );
};

export default ChangePasswordPage;