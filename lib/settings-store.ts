import { getDatabase } from "@/lib/mongodb";

export type AppSettingsRecord = {
  settingsId: "default";
  businessName: string;
  registeredAddress: string;
  companyNumber: string;
  vatNumber?: string;
  defaultCurrency: string;
  defaultPaymentTerms: number;
  invoicePrefix: string;
  quotePrefix: string;
  nextInvoiceNumber: number;
  nextQuoteNumber: number;
  bankAccountName?: string;
  bankSortCode?: string;
  bankAccountNumber?: string;
  bankIban?: string;
  bankBic?: string;
  bankPaymentReferenceInstructions?: string;
  invoiceDefaultNotes?: string;
  invoiceDefaultFooterText?: string;
  stripePublicKey?: string;
  stripeSecretKey?: string;
  stripeWebhookSecret?: string;
  gocardlessAccessToken?: string;
  gocardlessWebhookSecret?: string;
  resendApiKey?: string;
  resendFromEmail?: string;
  resendReplyToEmail?: string;
  automationSecret?: string;
  enableStripe: boolean;
  enableGoCardless: boolean;
  enableBankTransfer: boolean;
  defaultInternalHourlyCost: number;
  defaultProjectMarginTarget?: number;
  updatedAt: string;
};

export type BankDetailsSnapshot = {
  accountName?: string;
  sortCode?: string;
  accountNumber?: string;
  iban?: string;
  bic?: string;
  paymentReferenceInstructions?: string;
};

const DEFAULT_SETTINGS: AppSettingsRecord = {
  settingsId: "default",
  businessName: "Outbreak LTD",
  registeredAddress: "241 Tixall Road, Stafford, ST16 3XS",
  companyNumber: "10977129",
  defaultCurrency: "GBP",
  defaultPaymentTerms: 14,
  invoicePrefix: "INV",
  quotePrefix: "Q",
  nextInvoiceNumber: 1,
  nextQuoteNumber: 1,
  invoiceDefaultNotes: "",
  invoiceDefaultFooterText: "Thank you for your business.",
  enableStripe: false,
  enableGoCardless: false,
  enableBankTransfer: true,
  defaultInternalHourlyCost: 0,
  updatedAt: new Date().toISOString(),
};

function getSettingsCollection() {
  return getDatabase().then((db) =>
    db.collection<AppSettingsRecord>("settings")
  );
}

function getSettingsInsertDefaults() {
  const defaults = normalizeSettings();

  return {
    settingsId: defaults.settingsId,
    businessName: defaults.businessName,
    registeredAddress: defaults.registeredAddress,
    companyNumber: defaults.companyNumber,
    vatNumber: defaults.vatNumber,
    defaultCurrency: defaults.defaultCurrency,
    defaultPaymentTerms: defaults.defaultPaymentTerms,
    invoicePrefix: defaults.invoicePrefix,
    quotePrefix: defaults.quotePrefix,
    bankAccountName: defaults.bankAccountName,
    bankSortCode: defaults.bankSortCode,
    bankAccountNumber: defaults.bankAccountNumber,
    bankIban: defaults.bankIban,
    bankBic: defaults.bankBic,
    bankPaymentReferenceInstructions: defaults.bankPaymentReferenceInstructions,
    invoiceDefaultNotes: defaults.invoiceDefaultNotes,
    invoiceDefaultFooterText: defaults.invoiceDefaultFooterText,
    stripePublicKey: defaults.stripePublicKey,
    stripeSecretKey: defaults.stripeSecretKey,
    stripeWebhookSecret: defaults.stripeWebhookSecret,
    gocardlessAccessToken: defaults.gocardlessAccessToken,
    gocardlessWebhookSecret: defaults.gocardlessWebhookSecret,
    resendApiKey: defaults.resendApiKey,
    resendFromEmail: defaults.resendFromEmail,
    resendReplyToEmail: defaults.resendReplyToEmail,
    automationSecret: defaults.automationSecret,
    enableStripe: defaults.enableStripe,
    enableGoCardless: defaults.enableGoCardless,
    enableBankTransfer: defaults.enableBankTransfer,
    defaultInternalHourlyCost: defaults.defaultInternalHourlyCost,
    defaultProjectMarginTarget: defaults.defaultProjectMarginTarget,
  };
}

function normalizeSettings(record?: Partial<AppSettingsRecord> | null) {
  return {
    ...DEFAULT_SETTINGS,
    ...record,
    settingsId: "default",
    defaultPaymentTerms:
      record?.defaultPaymentTerms ?? DEFAULT_SETTINGS.defaultPaymentTerms,
    nextInvoiceNumber:
      record?.nextInvoiceNumber ?? DEFAULT_SETTINGS.nextInvoiceNumber,
    nextQuoteNumber: record?.nextQuoteNumber ?? DEFAULT_SETTINGS.nextQuoteNumber,
    defaultInternalHourlyCost:
      record?.defaultInternalHourlyCost ?? DEFAULT_SETTINGS.defaultInternalHourlyCost,
    enableStripe: record?.enableStripe ?? DEFAULT_SETTINGS.enableStripe,
    enableGoCardless:
      record?.enableGoCardless ?? DEFAULT_SETTINGS.enableGoCardless,
    enableBankTransfer:
      record?.enableBankTransfer ?? DEFAULT_SETTINGS.enableBankTransfer,
    updatedAt: record?.updatedAt ?? DEFAULT_SETTINGS.updatedAt,
  } satisfies AppSettingsRecord;
}

export async function getAppSettings() {
  const collection = await getSettingsCollection();
  const record = await collection.findOne({ settingsId: "default" });

  if (!record) {
    const normalized = normalizeSettings();
    await collection.insertOne(normalized);
    return normalized;
  }

  return normalizeSettings(record);
}

export async function saveAppSettings(
  input: Omit<AppSettingsRecord, "settingsId" | "updatedAt">
) {
  const collection = await getSettingsCollection();
  const now = new Date().toISOString();
  const current = await getAppSettings();
  const record = normalizeSettings({
    ...current,
    ...input,
    updatedAt: now,
  });

  await collection.updateOne(
    { settingsId: "default" },
    {
      $set: record,
    },
    { upsert: true }
  );

  return record;
}

function formatNumberWithPrefix(prefix: string, sequence: number) {
  return `${prefix}-${new Date().getUTCFullYear()}-${String(sequence).padStart(4, "0")}`;
}

export async function reserveNextInvoiceNumber() {
  const collection = await getSettingsCollection();
  const previous = await collection.findOneAndUpdate(
    { settingsId: "default" },
    {
      $setOnInsert: {
        ...getSettingsInsertDefaults(),
        nextQuoteNumber: DEFAULT_SETTINGS.nextQuoteNumber,
      },
      $inc: {
        nextInvoiceNumber: 1,
      },
      $set: {
        updatedAt: new Date().toISOString(),
      },
    },
    { upsert: true, returnDocument: "before", includeResultMetadata: false }
  );
  const current = normalizeSettings(previous);

  return formatNumberWithPrefix(
    current.invoicePrefix || DEFAULT_SETTINGS.invoicePrefix,
    current.nextInvoiceNumber
  );
}

export async function reserveNextQuoteNumber() {
  const collection = await getSettingsCollection();
  const previous = await collection.findOneAndUpdate(
    { settingsId: "default" },
    {
      $setOnInsert: {
        ...getSettingsInsertDefaults(),
        nextInvoiceNumber: DEFAULT_SETTINGS.nextInvoiceNumber,
      },
      $inc: {
        nextQuoteNumber: 1,
      },
      $set: {
        updatedAt: new Date().toISOString(),
      },
    },
    { upsert: true, returnDocument: "before", includeResultMetadata: false }
  );
  const current = normalizeSettings(previous);

  return formatNumberWithPrefix(
    current.quotePrefix || DEFAULT_SETTINGS.quotePrefix,
    current.nextQuoteNumber
  );
}

export async function getBankDetailsSnapshot() {
  const settings = await getAppSettings();

  return {
    accountName: settings.bankAccountName,
    sortCode: settings.bankSortCode,
    accountNumber: settings.bankAccountNumber,
    iban: settings.bankIban,
    bic: settings.bankBic,
    paymentReferenceInstructions: settings.bankPaymentReferenceInstructions,
  } satisfies BankDetailsSnapshot;
}

export async function getDefaultInternalHourlyCost() {
  const settings = await getAppSettings();
  return settings.defaultInternalHourlyCost ?? 0;
}
