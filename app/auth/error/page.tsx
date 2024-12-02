import Link from 'next/link';

export default function AuthError() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-destructive mb-4">
          Erro de Autenticação
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Ocorreu um erro durante o processo de login. Por favor, tente novamente.
        </p>
        <Link
          href="/"
          className="text-primary hover:underline"
        >
          Voltar para a página inicial
        </Link>
      </div>
    </div>
  );
}
