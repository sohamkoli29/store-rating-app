import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import api from "../../lib/axios";

const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;

const createUserSchema = z.object({
  name: z.string().min(20).max(60),
  email: z.string().email(),
  address: z.string().max(400),
  password: z.string().min(8).max(16).regex(passwordRegex, "Needs 1 uppercase + 1 special char"),
  role: z.enum(["ADMIN", "NORMAL_USER", "STORE_OWNER"]),
});

type CreateUserValues = z.infer<typeof createUserSchema>;

const AddUserForm = ({ onCreated }: { onCreated: () => void }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserValues>({ resolver: zodResolver(createUserSchema) });

  const onSubmit = async (values: CreateUserValues) => {
    await api.post("/admin/users", values);
    reset();
    onCreated();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-3 sm:grid-cols-2" noValidate>
      <div>
        <input placeholder="Full name (20-60 chars)" {...register("name")} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
      </div>
      <div>
        <input placeholder="Email" {...register("email")} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
      </div>
      <div>
        <input placeholder="Address" {...register("address")} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
        {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address.message}</p>}
      </div>
      <div>
        <input placeholder="Password" type="password" {...register("password")} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
        {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
      </div>
      <div>
        <select {...register("role")} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
          <option value="">Select role</option>
          <option value="NORMAL_USER">Normal user</option>
          <option value="ADMIN">Admin</option>
          <option value="STORE_OWNER">Store owner</option>
        </select>
        {errors.role && <p className="mt-1 text-xs text-red-600">{errors.role.message}</p>}
      </div>
      <button type="submit" disabled={isSubmitting} className="rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50 sm:col-span-2">
        {isSubmitting ? "Adding..." : "Add user"}
      </button>
    </form>
  );
};

export default AddUserForm;