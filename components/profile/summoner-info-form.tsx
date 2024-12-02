'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ProfileFormData } from "@/types/user"

const formSchema = z.object({
  summonerName: z.string().min(3, {
    message: "Summoner name must be at least 3 characters.",
  }),
  tagLine: z.string().min(3, {
    message: "Tag line must be at least 3 characters.",
  }),
}) satisfies z.ZodType<ProfileFormData>

interface SummonerInfoFormProps {
  initialValues?: ProfileFormData
  onSubmit: (values: ProfileFormData) => Promise<void>
  isLoading: boolean
}

export function SummonerInfoForm({ initialValues, onSubmit, isLoading }: SummonerInfoFormProps) {
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      summonerName: initialValues?.summonerName || "",
      tagLine: initialValues?.tagLine || "",
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-3 bg-[#1E2124] p-4 rounded-lg">
          <FormField
            control={form.control}
            name="summonerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-200">
                  Summoner Name
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Your summoner name" 
                    {...field}
                    className="bg-[#2B2D31] border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-yellow-500"
                  />
                </FormControl>
                <FormMessage className="text-[#ED4245]" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tagLine"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-200">
                  Tag Line
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Your tag line" 
                    {...field}
                    className="bg-[#2B2D31] border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-yellow-500"
                  />
                </FormControl>
                <FormMessage className="text-[#ED4245]" />
              </FormItem>
            )}
          />
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-[#5865F2] hover:bg-[#5865F2]/90 text-white py-2.5 mt-2"
          >
            {isLoading ? "Linking..." : "Link Riot Account"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
