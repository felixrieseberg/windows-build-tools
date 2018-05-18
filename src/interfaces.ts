export interface Installer {
  fileName: string;
  directory: string;
  url: string;
  path: string;
}

export interface InstallationDetails {
  buildTools: {
    toConfigure: boolean;
  };
  python: {
    toConfigure: boolean;
    path: string;
  };
}
