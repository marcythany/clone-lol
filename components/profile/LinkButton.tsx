import { Button } from 'components/ui/button';
import { useTranslations } from 'next-intl';

// Definindo explicitamente os tipos para os parâmetros
interface LinkButtonProps {
  onClick: () => void; // Função que será chamada ao clicar no botão
  isLinked: boolean; // Define se a conta já está vinculada ou não
  isLoading: boolean; // Adicionando a propriedade isLoading para controle de carregamento
}

export const LinkButton = ({
  onClick,
  isLinked,
  isLoading,
}: LinkButtonProps) => {
  const t = useTranslations('Profile'); // Usando o hook useTranslations para internacionalização

  return (
    !isLinked && (
      <Button onClick={onClick} disabled={isLoading}>
        {isLoading ? t('loading') : t('link_riot_account')}{' '}
        {/* Mostra texto de carregamento se estiver em processo */}
      </Button>
    )
  );
};
