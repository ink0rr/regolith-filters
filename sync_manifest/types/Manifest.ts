export interface Manifest {
  format_version: number;
  header: {
    name: string;
    description: string;
    uuid: string;
    version: number[];
    min_engine_version: number[];
  };
  modules: [
    {
      type: string;
      uuid: string;
      version: number[];
    },
  ];
  dependencies: [
    {
      uuid: string;
      version: number[];
    },
  ];
}
