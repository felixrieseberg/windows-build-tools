export interface Installer {
  fileName: string;
  directory: string;
  url: string;
  path: string;
}

export interface InstallationDetails {
  buildTools: undefined;
  python: {
    path: string;
  };
}
