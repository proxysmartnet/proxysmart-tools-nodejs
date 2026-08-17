import test from "node:test";
import assert from "node:assert/strict";
import { ProxySmartToolsClient } from "../src/client.mjs";

test("normalizes a custom base URL to its origin", () => {
  const client = new ProxySmartToolsClient({ baseUrl: "https://proxysmart.net/tools" });
  assert.equal(client.baseUrl, "https://proxysmart.net");
});

test("rejects missing required inputs before any network request", async () => {
  const client = new ProxySmartToolsClient();
  await assert.rejects(() => client.checkDns(""), /Domain is required/);
  await assert.rejects(() => client.validateProxy(""), /Proxy value is required/);
  await assert.rejects(() => client.checkBlacklist(""), /IPv4 address is required/);
});
