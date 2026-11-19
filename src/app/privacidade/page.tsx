import type { Metadata } from "next";
import { LegalPage, Pending } from "@/components/legal-page";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Política de privacidade",
  description: "Como a página do Guia de Tráfego Pago trata dados pessoais e cookies.",
  alternates: { canonical: "/privacidade" },
};

export default function PrivacidadePage() {
  const { seller, support, checkout, legal, analytics } = siteConfig;
  const contact = support.email ?? (support.whatsapp ? `WhatsApp +${support.whatsapp}` : null);
  const tools = [analytics.ga4Id ? "Google Analytics 4" : null, analytics.metaPixelId ? "Meta Pixel" : null].filter(
    Boolean,
  );
  const hasPending = !seller.legalName || !seller.document || !contact || !legal.retention || !legal.privacyUpdatedAt;

  return (
    <LegalPage title="Política de privacidade" updatedAt={legal.privacyUpdatedAt} hasPending={hasPending}>
      <h2>1. Controlador</h2>
      <p>
        O responsável pelos dados tratados nesta página é{" "}
        <Pending value={seller.legalName} label="nome ou razão social" />, CPF/CNPJ{" "}
        <Pending value={seller.document} label="CPF ou CNPJ" />. Contato para assuntos de privacidade:{" "}
        <Pending value={contact} label="e-mail ou WhatsApp" />.
      </p>

      <h2>2. O que esta página coleta</h2>
      <ul>
        <li>
          <strong>Nenhum formulário.</strong> A página não pede nome, e-mail, telefone ou documento.
        </li>
        <li>
          <strong>Registros técnicos da hospedagem</strong>, como endereço IP, navegador e horário de acesso,
          usados para segurança e funcionamento do site.
        </li>
        <li>
          <strong>Estatísticas de visitas agregadas</strong> (Vercel Web Analytics), sem cookies: páginas vistas,
          origem do acesso, país, navegador e tipo de dispositivo, contados de forma agregada, sem identificar quem
          visita.
        </li>
        <li>
          <strong>Sua escolha sobre cookies</strong>, guardada no armazenamento local do navegador.
        </li>
        <li>
          <strong>Cookies de medição</strong>
          {tools.length > 0 ? ` (${tools.join(" e ")})` : ""}, somente se você aceitar no aviso de cookies. Eles
          registram páginas visitadas, cliques nos botões de compra e dados do dispositivo, com identificadores
          pseudônimos, para medir visitas e o desempenho de anúncios. Nenhum dado de contato é enviado nesses
          eventos.
          {tools.length === 0 ? " No momento, nenhuma ferramenta de medição está ativa." : null}
        </li>
      </ul>

      <h2>3. Dados da compra</h2>
      <p>
        A compra acontece no checkout da {checkout.provider}, que coleta os dados necessários ao pagamento e à
        entrega de acordo com a política de privacidade dela. O vendedor pode receber da {checkout.provider} os
        dados necessários para entregar o produto, prestar suporte e cumprir obrigações fiscais.
      </p>

      <h2>4. Bases legais (LGPD)</h2>
      <ul>
        <li>Consentimento, para cookies de medição (art. 7º, I).</li>
        <li>Execução de contrato, para a venda e a entrega do guia (art. 7º, V).</li>
        <li>Cumprimento de obrigação legal, para registros fiscais (art. 7º, II).</li>
        <li>Legítimo interesse, para registros de segurança do site (art. 7º, IX).</li>
      </ul>

      <h2>5. Com quem os dados são compartilhados</h2>
      <p>
        Com a Vercel, que hospeda o site e gera as estatísticas agregadas de visitas, com a {checkout.provider} na
        compra e, apenas com o seu
        consentimento, com Google e Meta para medição. Esses fornecedores podem tratar dados fora do Brasil, com as
        salvaguardas previstas na LGPD.
      </p>

      <h2>6. Por quanto tempo</h2>
      <p>
        Pelo tempo necessário às finalidades acima e às obrigações legais:{" "}
        <Pending value={legal.retention} label="prazos de retenção" />. A escolha sobre cookies fica no seu
        navegador até você apagá-la ou mudá-la.
      </p>

      <h2>7. Seus direitos</h2>
      <p>
        Pelo art. 18 da LGPD, você pode pedir confirmação do tratamento, acesso, correção, anonimização,
        portabilidade, eliminação, informação sobre compartilhamento e revogação do consentimento. Para revogar o
        consentimento de medição, use o link “Preferências de cookies” no rodapé. Para os demais pedidos, use o
        contato indicado no item 1. Você também pode reclamar à Autoridade Nacional de Proteção de Dados (ANPD).
      </p>

      <h2>8. Alterações</h2>
      <p>Esta política pode ser atualizada. A versão vigente fica nesta página, com a data da última revisão.</p>
    </LegalPage>
  );
}
