import Image from "next/image";
import Link from "next/link";

const WHATSAPP_URL =
  "https://wa.me/5579999495525?text=" +
  encodeURIComponent("Olá, quero contratar o Contrato Express");

const FEATURES = [
  {
    title: "Mais segurança, menos riscos",
    description:
      "Contratos gerados a partir do modelo que seu cliente já usava, com menos chance de erro manual.",
  },
  {
    title: "Mais agilidade, mais tempo",
    description:
      "Preencha os dados e gere o contrato em minutos, sem perder tempo redigindo do zero.",
  },
  {
    title: "Padronização profissional",
    description: "Todo contrato segue o mesmo padrão, sem inconsistência entre atendimentos.",
  },
  {
    title: "Foco no que realmente importa",
    description:
      "Menos tempo com burocracia, mais tempo cuidando do seu negócio e dos seus clientes.",
  },
];

const STEPS = [
  {
    number: "1",
    title: "Acesse a plataforma",
    description: "Faça login e escolha para qual cliente você vai gerar o contrato.",
  },
  {
    number: "2",
    title: "Preencha os dados",
    description: "Informe as informações daquele atendimento direto no formulário do contrato.",
  },
  {
    number: "3",
    title: "Gere e envie para assinatura",
    description: "O contrato é gerado automaticamente, pronto para revisão e assinatura.",
  },
];

export function LandingPage() {
  return (
    <main className="min-h-screen bg-brand-navy text-brand-light">
      <header className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center overflow-hidden">
            <Image
              src="/prosperar360-logo.png"
              alt="Prosperar 360"
              width={40}
              height={40}
              priority
            />
          </div>
          <span className="font-bold tracking-tight">
            Prosperar<span className="text-brand-gold">360°</span>
          </span>
        </div>
        <Link
          href="/login"
          className="text-sm font-semibold rounded-lg border border-brand-gold text-brand-gold px-4 py-2 hover:bg-brand-gold hover:text-brand-navy transition-colors"
        >
          Entrar
        </Link>
      </header>

      <section className="max-w-4xl mx-auto text-center px-6 pt-16 pb-20">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gray mb-4">
          Contrato Express
        </p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
          Pronto para transformar{" "}
          <span className="text-brand-gold">sua rotina</span>?
        </h1>
        <p className="text-lg text-brand-gray max-w-2xl mx-auto mb-8">
          Implantação rápida, sistema exclusivo e suporte contínuo para o seu
          negócio.
        </p>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-lg bg-brand-gold text-brand-navy font-semibold px-8 py-3 hover:opacity-90 transition-opacity"
        >
          Quero contratar
        </a>
        <p className="mt-4 text-sm text-brand-gray">
          Já é cliente?{" "}
          <Link href="/login" className="text-brand-gold underline">
            Entrar
          </Link>
        </p>
      </section>

      <section className="max-w-md mx-auto px-6 pb-20">
        <div className="rounded-2xl border border-brand-gold/60 bg-brand-surface/40 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold text-center mb-6">
            Investimento
          </p>
          <div className="text-center mb-2">
            <div className="w-14 h-14 mx-auto mb-3 rounded-full border border-brand-gold/60 flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="w-7 h-7 text-brand-gold"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M3 10h18M8 2v4M16 2v4" />
              </svg>
            </div>
            <p className="text-sm text-brand-gray">
              Mensalidade{" "}
              <span className="text-[10px] uppercase tracking-wide">(recorrente)</span>
            </p>
            <p className="text-4xl font-bold text-brand-gold">
              R$ 29<span className="text-xl font-semibold">,90</span>
              <span className="text-sm text-brand-gray">/mês</span>
            </p>
          </div>
          <p className="text-center text-xs font-semibold text-brand-gold mb-6">
            🔥 Oferta de lançamento por tempo limitado
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-brand-gray mb-6">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="w-4 h-4 text-brand-gold shrink-0"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            <span>
              + implantação única de{" "}
              <span className="line-through text-brand-gray/70">R$ 200,00</span>{" "}
              <span className="font-semibold text-brand-light">
                por R$ 100,00 <span className="text-brand-gold">(-50%)</span>
              </span>
            </span>
          </div>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center rounded-lg bg-brand-gold text-brand-navy font-semibold px-6 py-3 hover:opacity-90 transition-opacity"
          >
            Quero contratar
          </a>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-20">
        <h2 className="text-center text-2xl font-bold mb-10">
          Feito para quem gera contratos todos os dias
        </h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-brand-border bg-brand-surface/40 p-6"
            >
              <h3 className="font-semibold text-brand-gold mb-2">{feature.title}</h3>
              <p className="text-sm text-brand-gray">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="text-center text-2xl font-bold mb-10">Como funciona</h2>
        <div className="grid sm:grid-cols-3 gap-8">
          {STEPS.map((step) => (
            <div key={step.number} className="text-center">
              <div className="w-10 h-10 mx-auto rounded-full bg-brand-gold text-brand-navy font-bold flex items-center justify-center mb-4">
                {step.number}
              </div>
              <h3 className="font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-brand-gray">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-12">
        <p className="text-xs text-brand-gray text-center border border-brand-border rounded-xl px-4 py-3">
          O Contrato Express é uma ferramenta de organização e padronização.{" "}
          <span className="text-brand-gold">Não substitui</span> assessoria
          jurídica. Consulte seu advogado.
        </p>
      </section>

      <section className="max-w-3xl mx-auto text-center px-6 pb-24">
        <h2 className="text-2xl font-bold mb-4">Pronto para simplificar seus contratos?</h2>
        <p className="text-brand-gray mb-8">
          Fale com a gente e comece a usar o Contrato Express no seu negócio.
        </p>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-lg bg-brand-gold text-brand-navy font-semibold px-8 py-3 hover:opacity-90 transition-opacity"
        >
          Quero contratar
        </a>
      </section>

      <footer className="border-t border-brand-border px-6 py-8 text-center text-xs text-brand-gray">
        Prosperar 360° · Ecossistema de Soluções Empresariais
      </footer>
    </main>
  );
}
