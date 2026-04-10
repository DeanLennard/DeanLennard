import { Buffer } from "node:buffer";

import { getClientById, updateClient } from "@/lib/clients-store";
import { getAppSettings } from "@/lib/settings-store";

function asFormUrlEncoded(input: Record<string, string>) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(input)) {
    params.append(key, value);
  }

  return params;
}

async function ensureStripeCustomer(clientId: string) {
  const settings = await getAppSettings();
  const client = await getClientById(clientId);

  if (!client) {
    throw new Error("Client not found.");
  }

  if (!settings.enableStripe || !settings.stripeSecretKey) {
    throw new Error("Stripe is not configured.");
  }

  if (client.stripeCustomerId) {
    return {
      client,
      stripeCustomerId: client.stripeCustomerId,
    };
  }

  const response = await fetch("https://api.stripe.com/v1/customers", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${settings.stripeSecretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: asFormUrlEncoded({
      name: client.contactName || client.businessName,
      email: client.email || "",
      phone: client.phone || "",
      "metadata[clientId]": client.clientId,
      "metadata[businessName]": client.businessName,
    }),
  });

  const payload = (await response.json()) as { id?: string; error?: { message?: string } };

  if (!response.ok || !payload.id) {
    throw new Error(payload.error?.message || "Unable to create Stripe customer.");
  }

  await updateClient(client.clientId, {
    status: client.status,
    businessName: client.businessName,
    contactName: client.contactName,
    email: client.email,
    phone: client.phone,
    website: client.website,
    address: client.address,
    billingAddress: client.billingAddress,
    companyNumber: client.companyNumber,
    vatNumber: client.vatNumber,
    notes: client.notes,
    tags: client.tags,
    acquisitionSource: client.acquisitionSource,
    defaultCurrency: client.defaultCurrency,
    defaultPaymentTerms: client.defaultPaymentTerms,
    defaultHourlyInternalCost: client.defaultHourlyInternalCost,
    carePlanStatus: client.carePlanStatus,
    stripeCustomerId: payload.id,
    gocardlessCustomerId: client.gocardlessCustomerId,
    gocardlessMandateId: client.gocardlessMandateId,
  });

  return {
    client: {
      ...client,
      stripeCustomerId: payload.id,
    },
    stripeCustomerId: payload.id,
  };
}

export async function createStripeInvoiceForLocalInvoice(input: {
  clientId: string;
  invoiceId: string;
  invoiceNumber: string;
  description: string;
  dueDate: string;
  currency: string;
  lineItems: Array<{
    title: string;
    description?: string;
    quantity: number;
    unitPrice: number;
  }>;
}) {
  const settings = await getAppSettings();
  const { stripeCustomerId } = await ensureStripeCustomer(input.clientId);

  if (!settings.stripeSecretKey) {
    throw new Error("Stripe secret key is missing.");
  }

  const dueDateTimestamp = Math.floor(
    new Date(`${input.dueDate}T00:00:00Z`).getTime() / 1000
  );

  const invoiceResponse = await fetch("https://api.stripe.com/v1/invoices", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${settings.stripeSecretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: asFormUrlEncoded({
      customer: stripeCustomerId,
      collection_method: "send_invoice",
      due_date: String(dueDateTimestamp),
      description: input.description,
      "metadata[invoiceId]": input.invoiceId,
      "metadata[invoiceNumber]": input.invoiceNumber,
    }),
  });

  const invoicePayload = (await invoiceResponse.json()) as {
    id?: string;
    hosted_invoice_url?: string;
    error?: { message?: string };
  };

  if (!invoiceResponse.ok || !invoicePayload.id) {
    throw new Error(invoicePayload.error?.message || "Unable to create Stripe invoice.");
  }

  for (const item of input.lineItems) {
    const itemResponse = await fetch("https://api.stripe.com/v1/invoiceitems", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${settings.stripeSecretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: asFormUrlEncoded({
        customer: stripeCustomerId,
        invoice: invoicePayload.id,
        currency: input.currency.toLowerCase(),
        amount: String(Math.round(item.unitPrice * item.quantity * 100)),
        description: item.description
          ? `${item.title}: ${item.description}`
          : item.title,
        "metadata[invoiceId]": input.invoiceId,
        "metadata[invoiceNumber]": input.invoiceNumber,
      }),
    });

    if (!itemResponse.ok) {
      const payload = (await itemResponse.json().catch(() => null)) as {
        error?: { message?: string };
      } | null;
      throw new Error(payload?.error?.message || "Unable to create Stripe invoice item.");
    }
  }

  const finalizeResponse = await fetch(
    `https://api.stripe.com/v1/invoices/${invoicePayload.id}/finalize`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${settings.stripeSecretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(),
    }
  );

  const finalPayload = (await finalizeResponse.json()) as {
    id?: string;
    hosted_invoice_url?: string;
    error?: { message?: string };
  };

  if (!finalizeResponse.ok || !finalPayload.id) {
    throw new Error(finalPayload.error?.message || "Unable to finalize Stripe invoice.");
  }

  return {
    stripeInvoiceId: finalPayload.id,
    hostedInvoiceUrl: finalPayload.hosted_invoice_url || invoicePayload.hosted_invoice_url,
  };
}

export async function voidStripeInvoice(stripeInvoiceId: string) {
  const settings = await getAppSettings();

  if (!settings.stripeSecretKey) {
    throw new Error("Stripe secret key is missing.");
  }

  const response = await fetch(
    `https://api.stripe.com/v1/invoices/${stripeInvoiceId}/void`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${settings.stripeSecretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(),
    }
  );

  const payload = (await response.json().catch(() => null)) as {
    error?: { message?: string };
  } | null;

  if (!response.ok) {
    throw new Error(payload?.error?.message || "Unable to void Stripe invoice.");
  }
}

export async function removeStripeInvoice(stripeInvoiceId: string) {
  const settings = await getAppSettings();

  if (!settings.stripeSecretKey) {
    throw new Error("Stripe secret key is missing.");
  }

  const fetchResponse = await fetch(`https://api.stripe.com/v1/invoices/${stripeInvoiceId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${settings.stripeSecretKey}`,
    },
  });

  const invoicePayload = (await fetchResponse.json().catch(() => null)) as {
    status?: string;
    total?: number;
    amount_paid?: number;
    error?: { message?: string };
  } | null;

  if (!fetchResponse.ok) {
    throw new Error(invoicePayload?.error?.message || "Unable to load Stripe invoice.");
  }

  if (invoicePayload?.status === "draft") {
    const deleteResponse = await fetch(`https://api.stripe.com/v1/invoices/${stripeInvoiceId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${settings.stripeSecretKey}`,
      },
    });

    const deletePayload = (await deleteResponse.json().catch(() => null)) as {
      error?: { message?: string };
    } | null;

    if (!deleteResponse.ok) {
      throw new Error(deletePayload?.error?.message || "Unable to delete draft Stripe invoice.");
    }

    return;
  }

  if (invoicePayload?.status === "open") {
    await voidStripeInvoice(stripeInvoiceId);
    return;
  }

  if (invoicePayload?.status === "void") {
    return;
  }

  if (
    invoicePayload?.status === "paid" &&
    (invoicePayload.total ?? 0) === 0 &&
    (invoicePayload.amount_paid ?? 0) === 0
  ) {
    return;
  }

  throw new Error(
    `Existing Stripe invoice is in ${invoicePayload?.status || "an unsupported"} state and cannot be replaced automatically.`
  );
}

export async function createGoCardlessBillingRequestForInvoice(input: {
  clientId: string;
  invoiceId: string;
  invoiceNumber: string;
  description: string;
  total: number;
  currency: string;
}) {
  const settings = await getAppSettings();
  const client = await getClientById(input.clientId);

  if (!client) {
    throw new Error("Client not found.");
  }

  if (!settings.enableGoCardless || !settings.gocardlessAccessToken) {
    throw new Error("GoCardless is not configured.");
  }

  const payload = {
    billing_requests: {
      metadata: {
        invoiceId: input.invoiceId,
        invoiceNumber: input.invoiceNumber,
        clientId: input.clientId,
      },
      payment_request: {
        amount: String(Math.round(input.total * 100)),
        currency: input.currency,
        description: input.description,
      },
      ...(client.gocardlessMandateId
        ? {
            links: {
              mandate_request_mandate: client.gocardlessMandateId,
            },
          }
        : {}),
    },
  };

  const response = await fetch("https://api.gocardless.com/billing_requests", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${settings.gocardlessAccessToken}`,
      "Content-Type": "application/json",
      "GoCardless-Version": "2015-07-06",
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as {
    billing_requests?: { id?: string };
    billing_request_flows?: { authorisation_url?: string };
    error?: { message?: string };
    errors?: Array<{ message?: string }>;
  };

  if (!response.ok || !data.billing_requests?.id) {
    throw new Error(
      data.error?.message || data.errors?.[0]?.message || "Unable to create GoCardless billing request."
    );
  }

  const flowResponse = await fetch("https://api.gocardless.com/billing_request_flows", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${settings.gocardlessAccessToken}`,
      "Content-Type": "application/json",
      "GoCardless-Version": "2015-07-06",
    },
    body: JSON.stringify({
      billing_request_flows: {
        redirect_uri: "https://www.deanlennard.com/admin/invoices",
        exit_uri: "https://www.deanlennard.com/admin/invoices",
        links: {
          billing_request: data.billing_requests.id,
        },
      },
    }),
  });

  const flowData = (await flowResponse.json()) as {
    billing_request_flows?: { authorisation_url?: string };
    error?: { message?: string };
    errors?: Array<{ message?: string }>;
  };

  if (!flowResponse.ok) {
    throw new Error(
      flowData.error?.message || flowData.errors?.[0]?.message || "Unable to create GoCardless billing flow."
    );
  }

  return {
    billingRequestId: data.billing_requests.id,
    paymentUrl: flowData.billing_request_flows?.authorisation_url,
  };
}

export function toBase64(bytes: Uint8Array) {
  return Buffer.from(bytes).toString("base64");
}
