'use client'

import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { signInWithPassword, signUp, signInWithOAuth } from '@/app/auth/actions'

const formSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string()
    .min(6, 'A senha deve ter pelo menos 6 caracteres')
    .max(12, 'A senha não pode ter mais de 12 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
      'A senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número'
    )
})

type AuthFormProps = {
  mode: 'login' | 'register'
}

export function AuthForm({ mode }: AuthFormProps) {
  const t = useTranslations('Auth')
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('email', data.email)
      formData.append('password', data.password)

      const result = mode === 'login' 
        ? await signInWithPassword(formData)
        : await signUp(formData)

      if (!result) return // Handle redirect case

      if ('error' in result) {
        toast({
          title: t('error'),
          description: result.error,
          variant: 'destructive',
        })
      } else if ('message' in result) {
        toast({
          title: t('success'),
          description: result.message,
        })
      }
    } catch (error) {
      console.error('[AuthForm] Auth error:', error)
      toast({
        title: t('error'),
        description: error instanceof Error ? error.message : t('unknownError'),
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    try {
      const { error, url } = await signInWithOAuth(provider)
      
      if (error) {
        toast({
          title: t('error'),
          description: error,
          variant: 'destructive',
        })
      } else if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error('[AuthForm] OAuth error:', error)
      toast({
        title: t('error'),
        description: error instanceof Error ? error.message : t('unknownError'),
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="w-full max-w-md space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">{t('email')}</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="seu@email.com" 
                    className="bg-[#1E2328] border-[#785A28] focus-visible:ring-[#C89B3C] text-gray-200" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage className="text-[#CD6161]" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">{t('password')}</FormLabel>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder="••••••" 
                    className="bg-[#1E2328] border-[#785A28] focus-visible:ring-[#C89B3C] text-gray-200"
                    {...field} 
                  />
                </FormControl>
                <FormMessage className="text-[#CD6161]" />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full bg-[#C89B3C] hover:bg-[#A17A2D] text-black disabled:bg-[#785A28]" 
            disabled={isSubmitting}
          >
            {mode === 'login' ? t('login') : t('register')}
          </Button>
        </form>
      </Form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-[#785A28]" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-[#010A13] px-2 text-[#C89B3C]">
            {t('orContinueWith')}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          onClick={() => handleOAuthLogin('google')}
          disabled={isSubmitting}
          className="border-[#785A28] text-gray-300 hover:bg-[#1E2328] hover:text-white"
        >
          <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
            <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
          </svg>
          {t('google')}
        </Button>

        <Button
          variant="outline"
          onClick={() => handleOAuthLogin('github')}
          disabled={isSubmitting}
          className="border-[#785A28] text-gray-300 hover:bg-[#1E2328] hover:text-white"
        >
          <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="github" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512">
            <path fill="currentColor" d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"></path>
          </svg>
          {t('github')}
        </Button>
      </div>
    </div>
  )
}
