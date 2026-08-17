# ProxySmart Tools Center — Node.js examples

Small, dependency-free Node.js examples for the public diagnostic endpoints behind [ProxySmart Tools Center](https://proxysmart.net/tools?utm_source=github&utm_medium=repository&utm_campaign=tools_center).

The project demonstrates safe request timeouts, structured errors and secret-safe output for four common networking checks:

- [IP information](https://proxysmart.net/tools/kiem-tra-ip?utm_source=github&utm_medium=repository&utm_campaign=tools_center)
- [Proxy format validation](https://proxysmart.net/tools/kiem-tra-proxy?utm_source=github&utm_medium=repository&utm_campaign=tools_center)
- [DNS lookup](https://proxysmart.net/tools/kiem-tra-dns?utm_source=github&utm_medium=repository&utm_campaign=tools_center)
- [IPv4 blacklist signals](https://proxysmart.net/tools/kiem-tra-blacklist?utm_source=github&utm_medium=repository&utm_campaign=tools_center)

> These endpoints are intended for lawful diagnostics and systems you are authorized to test. They are rate limited. The proxy endpoint validates syntax only; it does not connect to the proxy, measure speed or reveal credentials in its response.

## Requirements

- Node.js 18 or newer
- No npm dependencies

## Quick start

```bash
git clone https://github.com/ProxySmart/proxysmart-tools-nodejs.git
cd proxysmart-tools-nodejs
npm test
node src/cli.mjs --help
```

## Examples

### Check a public IP

```bash
node src/cli.mjs ip 8.8.8.8
```

Omit the value to check the public IP observed by the service:

```bash
node src/cli.mjs ip
```

### Query DNS records

```bash
node src/cli.mjs dns proxysmart.net A
node src/cli.mjs dns proxysmart.net MX
```

Supported record types: `A`, `AAAA`, `CNAME`, `MX`, `TXT`, and `NS`.

### Validate proxy syntax

```bash
node src/cli.mjs proxy "203.0.113.10:8080:user:pass"
node src/cli.mjs proxy "socks5://user:pass@203.0.113.10:1080"
```

The sample credentials above are documentation-only. Do not put real secrets in shell history, issue trackers, screenshots or logs.

### Check blacklist signals

```bash
node src/cli.mjs blacklist 8.8.8.8
```

An unavailable provider is reported as unknown, never silently treated as clean.

## Use as a module

```js
import { ProxySmartToolsClient } from "./src/client.mjs";

const tools = new ProxySmartToolsClient({ timeoutMs: 8_000 });
const result = await tools.checkDns("proxysmart.net", "A");
console.log(result);
```

## Postman and video walkthrough

- Public Postman collection: will be linked here after publication.
- Video walkthrough: will be linked here after publication.

## Security notes

- Enforce a timeout on every outbound request.
- Do not log proxy usernames or passwords.
- Do not retry `4xx` validation errors automatically.
- Respect rate-limit response headers and back off on HTTP `429`.
- Treat provider timeouts or incomplete reputation data as unknown.

## License

[MIT](LICENSE)
