const DEFAULT_BASE_URL = "https://proxysmart.net";
const DEFAULT_TIMEOUT_MS = 10_000;

export class ProxySmartToolsClient {
  constructor({ baseUrl = DEFAULT_BASE_URL, timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
    this.baseUrl = new URL(baseUrl).origin;
    this.timeoutMs = timeoutMs;
  }

  async checkIp(value = "") {
    const query = value ? `?value=${encodeURIComponent(value)}` : "";
    return this.#request(`/api/tools/ip${query}`);
  }

  async checkDns(domain, type = "A") {
    if (!domain) throw new Error("Domain is required.");
    const query = new URLSearchParams({ value: domain, type: type.toUpperCase() });
    return this.#request(`/api/tools/dns?${query}`);
  }

  async validateProxy(proxy) {
    if (!proxy) throw new Error("Proxy value is required.");
    return this.#request("/api/tools/proxy", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ proxy }),
    });
  }

  async checkBlacklist(ip) {
    if (!ip) throw new Error("IPv4 address is required.");
    return this.#request(`/api/tools/blacklist?value=${encodeURIComponent(ip)}`);
  }

  async #request(path, init = {}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        ...init,
        signal: controller.signal,
        headers: {
          accept: "application/json",
          "user-agent": "proxysmart-tools-nodejs/1.0",
          ...init.headers,
        },
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        const message = payload?.error || `Request failed with HTTP ${response.status}`;
        const error = new Error(message);
        error.status = response.status;
        error.code = payload?.code || "HTTP_ERROR";
        throw error;
      }
      return payload;
    } catch (error) {
      if (error?.name === "AbortError") throw new Error(`Request timed out after ${this.timeoutMs}ms.`);
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }
}
