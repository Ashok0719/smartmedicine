"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { 
  ChevronLeft, 
  Plus, 
  Trash2, 
  Clock, 
  Pill, 
  Calendar,
  Loader2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

import { OCRScanner } from "@/components/features/ocr-scanner";

const medicineSchema = z.object({
  name: z.string().min(1, "Name is required"),
  dosage: z.string().min(1, "Dosage is required (e.g. 500mg)"),
  frequency: z.string().min(1, "Frequency is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional().nullable(),
  schedules: z.array(z.object({
    time: z.string().min(1, "Time is required"),
  })).min(1, "At least one time slot is required"),
});

type MedicineValues = z.infer<typeof medicineSchema>;

export default function AddMedicinePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, control, setValue, formState: { errors } } = useForm<MedicineValues>({
    resolver: zodResolver(medicineSchema),
    defaultValues: {
      frequency: "daily",
      startDate: new Date().toISOString().split('T')[0],
      schedules: [{ time: "09:00" }],
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "schedules",
  });

  const handleOCRExtracted = (data: any) => {
    if (data.name) setValue("name", data.name, { shouldValidate: true });
    if (data.dosage) setValue("dosage", data.dosage, { shouldValidate: true });
    if (data.frequency) setValue("frequency", data.frequency);
  };

  const onSubmit = async (data: MedicineValues) => {
    setIsLoading(true);
    try {
      const payload = {
        ...data,
        schedules: data.schedules.map(s => s.time)
      };
      await axios.post("/api/medicine", payload);
      toast.success("Medicine added successfully!");
      router.push("/medicines");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to add medicine");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/medicines">
            <Button variant="ghost" size="icon" className="rounded-full bg-white shadow-sm border border-slate-100">
              <ChevronLeft size={20} />
            </Button>
          </Link>
          <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase">Add Neural Dose</h1>
        </div>
      </div>

      <OCRScanner onExtracted={handleOCRExtracted} />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card className="border-none shadow-sm rounded-3xl p-4 md:p-8 bg-white">
          <CardContent className="p-0 space-y-8">
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm uppercase tracking-widest">
                <Pill size={18} /> Basic Information
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Medicine Name</Label>
                  <Input id="name" placeholder="e.g. Paracetamol" {...register("name")} className="h-12 border-slate-200 rounded-xl" />
                  {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dosage">Dosage</Label>
                  <Input id="dosage" placeholder="e.g. 500mg, 1 tablet" {...register("dosage")} className="h-12 border-slate-200 rounded-xl" />
                  {errors.dosage && <p className="text-xs text-red-500 font-medium">{errors.dosage.message}</p>}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm uppercase tracking-widest">
                <Calendar size={18} /> Schedule & Date
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select onValueChange={(val) => register("frequency").onChange({ target: { value: val } })} defaultValue="daily">
                    <SelectTrigger className="h-12 border-slate-200 rounded-xl">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input id="startDate" type="date" {...register("startDate")} className="h-12 border-slate-200 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date (Optional)</Label>
                  <Input id="endDate" type="date" {...register("endDate")} className="h-12 border-slate-200 rounded-xl" />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm uppercase tracking-widest">
                  <Clock size={18} /> Reminder Times
                </div>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => append({ time: "09:00" })}
                  className="rounded-full border-indigo-100 text-indigo-600 font-bold"
                >
                  <Plus size={16} className="mr-1" /> Add Time
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-end gap-3 p-4 bg-slate-50 rounded-2xl group border border-transparent hover:border-indigo-100 transition-colors">
                    <div className="flex-1 space-y-2">
                      <Label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Time slot {index + 1}</Label>
                      <Input 
                        type="time" 
                        {...register(`schedules.${index}.time` as const)} 
                        className="h-10 bg-white border-slate-200 rounded-xl" 
                      />
                    </div>
                    {fields.length > 1 && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => remove(index)}
                        className="text-red-400 h-10 w-10 hover:text-red-500 hover:bg-red-50"
                      >
                        <Trash2 size={18} />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button 
            type="submit" 
            className="flex-1 h-14 bg-indigo-600 hover:bg-indigo-700 rounded-2xl text-lg font-bold shadow-lg shadow-indigo-100" 
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Save Medicine"}
          </Button>
          <Link href="/medicines" className="flex-1">
            <Button type="button" variant="outline" className="w-full h-14 rounded-2xl text-lg font-bold border-slate-200">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
