import type { Metadata } from "next";
import { LegalPage, Pending } from "@/components/legal-page";
import { formattedPrice, siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Termos de uso e compra",
  description: "Condições de compra e uso do Guia de Tráfego Pago da Metodaria.",
  alternates: { canonical: "/termos" },
};

export default function TermosPage() {
  const { seller, support, product, checkout, refund, legal } = siteConfig;
  const contact = support.email ?? (support.whatsapp ? `WhatsApp +${support.whatsapp}` : null);
  const hasPending =
    !seller.legalName || !seller.document || !seller.address || !contact || !refund.channel || !legal.termsUpdatedAt;

  return (
    <LegalPage title="Termos de uso e compra" updatedAt={legal.termsUpdatedAt} hasPending={hasPending}>
      <h2>1. Quem vende</h2>
      <p>
        O {product.name} é vendido por <Pending value={seller.legalName} label="nome ou razão social" />,
        inscrito no CPF/CNPJ <Pending value={seller.document} label="CPF ou CNPJ" />, com endereço em{" "}
        <Pending value={seller.address} label="endereço" />. Contato: <Pending value={contact} label="e-mail ou WhatsApp de suporte" />.
      </p>

      <h2>2. O produto</h2>
      <p>
        {product.name}: {product.subtitle}. Guia em {product.format} com {product.pages} páginas,{" "}
        {product.modules} módulos e {product.lessons} lições, {product.edition.toLowerCase()}. É um material
        educacional independente. Não inclui videoaulas, atendimento individual, certificação oficial nem
        acompanhamento de campanhas, e não tem vínculo com Meta, Google ou outras plataformas citadas.
      </p>

      <h2>3. Preço e pagamento</h2>
      <p>
        O preço é {formattedPrice}, em {siteConfig.price.terms}. O pagamento é processado pela {checkout.provider},
        plataforma que intermedeia a venda, com os meios disponíveis no checkout no momento da compra. As
        condições da {checkout.provider} também se aplicam ao pagamento. O investimento em anúncios não está
        incluído e, se você decidir anunciar, é pago diretamente às plataformas de anúncios.
      </p>

      <h2>4. Entrega</h2>
      <p>{checkout.delivery}</p>

      <h2>5. Arrependimento e reembolso</h2>
      <p>
        Conforme o art. 49 do Código de Defesa do Consumidor, você pode desistir da compra em até{" "}
        {refund.legalDays} dias, contados da compra ou do recebimento do produto, com devolução imediata dos
        valores pagos, monetariamente atualizados. Para pedir:{" "}
        <Pending value={refund.channel} label="canal de cancelamento e reembolso" />.
        {refund.extraConditions ? ` ${refund.extraConditions}` : null}
      </p>

      <h2>6. Licença de uso</h2>
      <ul>
        <li>O exemplar permite leitura e impressão por quem comprou.</li>
        <li>Os modelos podem ser adaptados ao seu trabalho e a projetos de clientes.</li>
        <li>A compra não autoriza redistribuir, compartilhar publicamente ou revender o arquivo.</li>
        <li>Marcas e materiais de terceiros citados permanecem sujeitos aos direitos de seus titulares.</li>
      </ul>

      <h2>7. Sem garantia de resultados</h2>
      <p>
        O guia ensina a planejar, medir e analisar anúncios. Ele não promete vendas, renda ou desempenho de
        campanhas, que dependem da oferta, do atendimento, do orçamento, das regras das plataformas e da execução
        de cada pessoa. Os exemplos e números do guia são simulações didáticas. As decisões de investimento e a
        configuração das contas de anúncio são de responsabilidade de quem as executa.
      </p>

      <h2>8. Alterações</h2>
      <p>
        Estes termos podem ser atualizados. A versão vigente fica publicada nesta página, com a data da última
        atualização. Compras já realizadas seguem as condições exibidas no momento da compra.
      </p>

      <h2>9. Legislação</h2>
      <p>
        Aplica-se a legislação brasileira, incluindo o Código de Defesa do Consumidor e o Decreto nº 7.962/2013.
        Eventuais disputas podem ser levadas ao foro do domicílio do consumidor.
      </p>
    </LegalPage>
  );
}
