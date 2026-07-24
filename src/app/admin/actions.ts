"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Não autorizado.");
  }
}

function slugify(nome: string): string {
  return nome
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function tenantFieldsFromForm(formData: FormData) {
  return {
    nome: String(formData.get("nome") || "").trim(),
    cnpj: String(formData.get("cnpj") || "").trim(),
    representante: String(formData.get("representante") || "").trim(),
    cpfRepresentante: String(formData.get("cpfRepresentante") || "").trim(),
    rgRepresentante: String(formData.get("rgRepresentante") || "").trim(),
    endereco: String(formData.get("endereco") || "").trim(),
    dadosBancariosPadrao:
      String(formData.get("dadosBancariosPadrao") || "").trim() || null,
  };
}

export async function createTenant(formData: FormData) {
  await requireAdmin();

  const fields = tenantFieldsFromForm(formData);
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (
    !fields.nome ||
    !fields.cnpj ||
    !fields.representante ||
    !fields.cpfRepresentante ||
    !fields.rgRepresentante ||
    !fields.endereco ||
    !email ||
    !password
  ) {
    throw new Error("Preencha todos os campos obrigatórios.");
  }

  const baseSlug = slugify(fields.nome) || "cliente";
  let slug = baseSlug;
  let counter = 1;
  while (await prisma.tenant.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter++}`;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.tenant.create({
    data: {
      slug,
      ...fields,
      users: {
        create: { email, passwordHash },
      },
    },
  });

  revalidatePath("/admin");
  redirect("/admin");
}

export async function updateTenant(tenantId: string, formData: FormData) {
  await requireAdmin();

  const fields = tenantFieldsFromForm(formData);
  if (
    !fields.nome ||
    !fields.cnpj ||
    !fields.representante ||
    !fields.cpfRepresentante ||
    !fields.rgRepresentante ||
    !fields.endereco
  ) {
    throw new Error("Preencha todos os campos obrigatórios.");
  }

  await prisma.tenant.update({ where: { id: tenantId }, data: fields });

  revalidatePath("/admin");
  revalidatePath(`/admin/${tenantId}`);
  redirect(`/admin/${tenantId}`);
}

export async function updateContractTemplate(tenantId: string, formData: FormData) {
  await requireAdmin();

  const isDefault = String(formData.get("isDefault") || "") === "true";
  const html = String(formData.get("html") || "").trim();

  await prisma.tenant.update({
    where: { id: tenantId },
    data: { contratoModeloHtml: isDefault ? null : html || null },
  });

  revalidatePath(`/admin/${tenantId}`);
  redirect(`/admin/${tenantId}`);
}

export async function createContratoModelo(tenantId: string, formData: FormData) {
  await requireAdmin();

  const tipoEvento = String(formData.get("tipoEvento") || "").trim();
  const html = String(formData.get("html") || "").trim();
  if (!tipoEvento || !html) {
    throw new Error("Preencha o tipo de evento e o modelo de contrato.");
  }

  await prisma.tenantContratoModelo.create({
    data: { tenantId, tipoEvento, html },
  });

  revalidatePath(`/admin/${tenantId}`);
  redirect(`/admin/${tenantId}`);
}

export async function updateContratoModelo(
  modeloId: string,
  tenantId: string,
  formData: FormData
) {
  await requireAdmin();

  const tipoEvento = String(formData.get("tipoEvento") || "").trim();
  const html = String(formData.get("html") || "").trim();
  if (!tipoEvento || !html) {
    throw new Error("Preencha o tipo de evento e o modelo de contrato.");
  }

  await prisma.tenantContratoModelo.update({
    where: { id: modeloId },
    data: { tipoEvento, html },
  });

  revalidatePath(`/admin/${tenantId}`);
  redirect(`/admin/${tenantId}`);
}

export async function deleteContratoModelo(modeloId: string, tenantId: string) {
  await requireAdmin();
  await prisma.tenantContratoModelo.delete({ where: { id: modeloId } });
  revalidatePath(`/admin/${tenantId}`);
  redirect(`/admin/${tenantId}`);
}

export async function setTenantBlocked(tenantId: string, bloqueado: boolean) {
  await requireAdmin();
  await prisma.tenant.update({ where: { id: tenantId }, data: { bloqueado } });
  revalidatePath("/admin");
  revalidatePath(`/admin/${tenantId}`);
  redirect(`/admin/${tenantId}`);
}

export async function deleteTenant(tenantId: string) {
  await requireAdmin();
  await prisma.tenant.delete({ where: { id: tenantId } });
  revalidatePath("/admin");
  redirect("/admin");
}

export async function addUser(tenantId: string, formData: FormData) {
  await requireAdmin();

  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  if (!email || !password) {
    throw new Error("E-mail e senha são obrigatórios.");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({ data: { email, passwordHash, tenantId } });

  revalidatePath(`/admin/${tenantId}`);
  redirect(`/admin/${tenantId}`);
}

export async function deleteUser(userId: string, tenantId: string) {
  await requireAdmin();

  const count = await prisma.user.count({ where: { tenantId } });
  if (count <= 1) {
    throw new Error("Não é possível excluir o último usuário do cliente.");
  }

  await prisma.user.delete({ where: { id: userId } });
  revalidatePath(`/admin/${tenantId}`);
  redirect(`/admin/${tenantId}`);
}
