#!/usr/bin/env node
import { ProxySmartToolsClient } from "./client.mjs";

const [command, ...args] = process.argv.slice(2);
const client = new ProxySmartToolsClient();

const usage = `
ProxySmart Tools Center CLI

Usage:
  node src/cli.mjs ip [public-ip]
  node src/cli.mjs dns <domain> [A|AAAA|CNAME|MX|TXT|NS]
  node src/cli.mjs proxy <host:port:user:pass|proxy-url>
  node src/cli.mjs blacklist <public-ipv4>

Examples:
  node src/cli.mjs ip 8.8.8.8
  node src/cli.mjs dns proxysmart.net A
  node src/cli.mjs proxy 203.0.113.10:8080:user:pass
  node src/cli.mjs blacklist 8.8.8.8
`;

async function main() {
  if (!command || ["help", "--help", "-h"].includes(command)) {
    console.log(usage.trim());
    return;
  }

  let result;
  if (command === "ip") result = await client.checkIp(args[0] || "");
  else if (command === "dns") result = await client.checkDns(args[0], args[1] || "A");
  else if (command === "proxy") result = await client.validateProxy(args.join(" "));
  else if (command === "blacklist") result = await client.checkBlacklist(args[0]);
  else throw new Error(`Unknown command: ${command}\n\n${usage.trim()}`);

  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(`[${error.code || "ERROR"}] ${error.message}`);
  process.exitCode = 1;
});
