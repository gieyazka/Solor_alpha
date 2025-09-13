"use server";

import {
  Client,
  Account,
  Databases,
  Users,
  Storage,
  Messaging,
} from "node-appwrite";
import { cookies } from "next/headers";
let clientInstance: Client | null = null;
export async function createSessionClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

  const session = (await cookies()).get("appwrite-session");
  if (!session || !session.value) {
    throw new Error("No session");
  }

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
    get database() {
      return new Databases(client);
    },
  };
}

function getAppwriteClient() {
  if (!clientInstance) {
    clientInstance = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
      .setKey(process.env.NEXT_APPWRITE_KEY!);
  }
  return clientInstance;
}
export async function createAdminClient() {
  const client = getAppwriteClient();


  return {
    get account() {
      return new Account(client);
    },

    get database() {
      return new Databases(client);
    },
    get user() {
      return new Users(client);
    },
    get storage() {
      return new Storage(client);
    },
    get message() {
      return new Messaging(client);
    },
  };
}
