import { Client, Account, Databases } from 'appwrite';

export default defineNuxtPlugin((nuxtApp) => {
  const client = new Client();

  client
    .setEndpoint(nuxtApp.$config.public.appwriteEndpoint)
    .setProject(nuxtApp.$config.public.appwriteProjectId);

  const account = new Account(client);
  const databases = new Databases(client);

  return {
    provide: {
      account,
      databases
    }
  }
});