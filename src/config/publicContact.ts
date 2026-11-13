/**
 * PUBLIC CONTACT EMAIL CONFIGURATION
 *
 * EDIT THE VALUES BELOW when the Sophis Central email aliases/mailboxes are ready.
 * Keep the addresses lowercase. Leave an address as an empty string until it is active;
 * the corresponding email action will then be shown as not yet configured.
 *
 * Suggested aliases:
 * support@YOUR-DOMAIN  – platform support
 * careers@YOUR-DOMAIN  – recruitment and career enquiries
 * info@YOUR-DOMAIN     – general enquiries
 *
 * These are display/configuration values only. They do not create mailboxes or aliases.
 */

export const publicContactEmails = {
  // EDIT: replace with the public company contact address when finalized.
  general: 'sophiscentral@gmail.com',

  // EDIT: enter the active support alias when it has been configured.
  support: '',

  // EDIT: enter the active careers alias when it has been configured.
  careers: '',

  // EDIT: enter a dedicated financial enquiries alias if one is created.
  // Until then, the general contact email from the supplied policy is used.
  financial: 'sophiscentral@gmail.com',
} as const;

export function isConfiguredEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
