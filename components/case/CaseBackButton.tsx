import { MeshButton } from "@/components/ui/MeshButton";
import { TriArrow } from "@/components/ui/TriArrow";

/**
 * Botão fixo de voltar aos projetos — disponível em qualquer ponto do case
 * (flutua sobre as seções), pra o usuário não precisar rolar até o fim.
 *
 * Volta pra grade da home, de onde a maioria chega. "Paisagem" era o nome da
 * home WebGL, que hoje vive em /experiencia.
 */
export function CaseBackButton() {
  return (
    <div className="fixed left-5 top-5 z-50">
      <MeshButton
        label="Projetos"
        size="sm"
        showArrow={false}
        lead={<TriArrow dir="left" />}
        href="/#projetos"
        aria-label="Voltar aos projetos"
      />
    </div>
  );
}
