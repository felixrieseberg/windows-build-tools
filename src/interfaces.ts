export interface Installer {
  fileName: string;
  directory: string;
  url: string;
  path: string;
}

export interface InstallationDetails {
  buildTools: InstallationReport;
  python: InstallationReport;
}

export interface InstallationReport {
  success: boolean;
  toConfigure?: boolean;
  installPath?: string;
}
