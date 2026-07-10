import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

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

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (adminEmail && adminPassword) {
    const adminPasswordHash = await bcrypt.hash(adminPassword, 10);
    await prisma.user.upsert({
      where: { email: adminEmail.toLowerCase().trim() },
      update: {},
      create: {
        email: adminEmail.toLowerCase().trim(),
        passwordHash: adminPasswordHash,
        role: "ADMIN",
      },
    });
    console.log("Usuário admin:", adminEmail);
  } else {
    console.log("ADMIN_EMAIL/ADMIN_PASSWORD não definidos — pulando criação do admin.");
  }

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
