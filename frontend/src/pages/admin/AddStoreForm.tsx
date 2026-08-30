import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import api from "../../lib/axios";

const createStoreSchema = z.object({
  name: z.string().min(20).max(60),
  email: z.string().email(),
  address: z.string().max(400),
  ownerId: z.string().uuid("Must be a valid owner user id"),
});

type CreateStoreValues = z.infer<typeof createStoreSchema>;

const AddStoreForm = ({ onCreated }: { onCreated: () => void }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateStoreValues>({ resolver: zodResolver(createStoreSchema) });

  const onSubmit = async (values: CreateStoreValues) => {
    await api.post("/admin/stores", values);
    reset();
    onCreated();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-3 sm:grid-cols-2" noValidate>
      <div>
        <input placeholder="Store name (20-60 chars)" {...register("name")} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
      </div>
      <div>
        <input placeholder="Store email" {...register("email")} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
      </div>
      <div className="sm:col-span-2">
        <input placeholder="Address" {...register("address")} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
        {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address.message}</p>}
      </div>
      <div className="sm:col-span-2">
        <input placeholder="Owner user ID (existing STORE_OWNER)" {...register("ownerId")} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
        {errors.ownerId && <p className="mt-1 text-xs text-red-600">{errors.ownerId.message}</p>}
      </div>
      <button type="submit" disabled={isSubmitting} className="rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50 sm:col-span-2">
        {isSubmitting ? "Adding..." : "Add store"}
      </button>
    </form>
  );
};

export default AddStoreForm;