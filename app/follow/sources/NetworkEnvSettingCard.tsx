import React from "react";

enum NetworkEnvironmentProtocol {
  HTTP = "http",
  HTTPS = "https",
  SOCKS5 = "socks5",
}

export interface NetworkEnvironment {
  id: string;
  label: string;
  protocol: NetworkEnvironmentProtocol;
  endpoint: string;
  region: string;
}

export const networkEnvironments: NetworkEnvironment[] = [
  {
    id: "1",
    label: "US HTTP Proxy",
    protocol: NetworkEnvironmentProtocol.HTTP,
    endpoint: "127.0.0.1:8080",
    region: "us",
  },
  {
    id: "2",
    label: "EU HTTPS Proxy",
    protocol: NetworkEnvironmentProtocol.HTTPS,
    endpoint: "127.0.0.1:8081",
    region: "eu",
  },
  {
    id: "3",
    label: "Asia SOCKS5 Proxy",
    protocol: NetworkEnvironmentProtocol.SOCKS5,
    endpoint: "127.0.0.1:8082",
    region: "asia",
  },
];

const NetworkEnvSettingCard = () => {
  return <div>NetworkEnvSettingCard</div>;
};

export default NetworkEnvSettingCard;
