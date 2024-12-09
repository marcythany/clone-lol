import { createBrowserClient } from '@supabase/ssr';
import { Button } from 'components/ui/button';
import { SiGithub, SiGoogle } from '@icons-pack/react-simple-icons';
import { useRouter } from 'next/navigation';
import * as m from '@/paraglide/messages.js'; // Importando as mensagens do Paraglide

export function SocialButtons() {
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleOAuthLogin = async (provider: 'github' | 'google') => {
    try {
      // Iniciar o login com o OAuth usando o provedor
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${location.origin}/auth/callback`, // URL de redirecionamento após login
        },
      });

      if (error) {
        console.error('Erro ao fazer login com', provider, ':', error.message);
        alert('Erro ao realizar login. Tente novamente.');
        return;
      }

      // Obter a sessão do usuário autenticado
      const { data: session, error: sessionError } =
        await supabase.auth.getSession();
      if (sessionError || !session) {
        console.error('Erro ao verificar sessão:', sessionError?.message);
        alert('Erro ao verificar sessão. Tente novamente.');
        return;
      }

      // Obter o usuário autenticado
      const { data: user, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error('Erro ao obter usuário autenticado:', userError?.message);
        alert('Erro ao obter usuário. Tente novamente.');
        return;
      }

      // Verificar se o usuário já existe na tabela `users`
      const { data, error: userExistsError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.user.id)
        .single(); // Busca o usuário pelo ID

      if (userExistsError) {
        console.error(
          'Erro ao verificar usuário na tabela users:',
          userExistsError.message
        );
        alert('Erro ao verificar usuário. Tente novamente.');
        return;
      }

      if (!data) {
        // Se o usuário não existir, cria um novo registro na tabela users
        const { error: insertError } = await supabase.from('users').insert([
          {
            id: user.user.id,
            email: user.user.email,
            provider: provider, // Salvar o provedor (google ou github)
            created_at: new Date().toISOString(), // Garantir que o created_at seja uma data válida
          },
        ]);

        if (insertError) {
          console.error(
            'Erro ao criar usuário na tabela users:',
            insertError.message
          );
          alert('Erro ao criar seu usuário. Tente novamente.');
          return;
        } else {
          console.log('Usuário registrado na tabela users');
        }
      }

      // Redirecionar após login bem-sucedido (caso necessário)
      router.push('/profile'); // Substitua pela URL desejada após login
    } catch (error) {
      console.error('Erro inesperado:', error);
      alert('Ocorreu um erro. Tente novamente.');
    }
  };

  return (
    <div className='grid gap-2'>
      <Button variant='outline' onClick={() => handleOAuthLogin('google')}>
        <SiGoogle className='mr-2 h-4 w-4' />
        {m.continue_with_google()}
      </Button>
      <Button variant='outline' onClick={() => handleOAuthLogin('github')}>
        <SiGithub className='mr-2 h-4 w-4' />
        {m.continue_with_github()}
      </Button>
    </div>
  );
}
