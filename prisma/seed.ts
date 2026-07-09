import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("dms123456", 10);

  const tenant = await prisma.tenant.upsert({
    where: { slug: "dms" },
    update: {},
    create: {
      slug: "dms",
      nome: "DMS ILUMINAÇÃO EM LEDS LTDA",
      cnpj: "57.055.201/0001-03",
      representante: "Daniel Pinheiro Setton Seabra",
      cpfRepresentante: "028.711.555-00",
      rgRepresentante: "SSP/SE",
      endereco:
        "Rua Itaporanga, Galeria Maison Junior, sala 05, nº 265, Bairro Centro, Aracaju/SE, CEP 49010-140",
      dadosBancariosPadrao:
        "PIX: 57055201000103 (CNPJ) / DMS ILUMINACAO EM LED\nSICRED / BANCO: 748 / COOP: 2102 / CONTA: 33910-5",
    },
  });

  await prisma.user.upsert({
    where: { email: "contato@dmsiluminacao.com.br" },
    update: {},
    create: {
      email: "contato@dmsiluminacao.com.br",
      passwordHash,
      tenantId: tenant.id,
    },
  });

  console.log("Seed concluído. Tenant:", tenant.slug);
  console.log("Usuário de teste: contato@dmsiluminacao.com.br / dms123456");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
