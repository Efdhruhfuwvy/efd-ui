declare module "node-gsettings-wrapper" {
  interface Key {
    getValue(): unknown;
  }

  export default {
    Key: {
      findById(schema: string, key: string): Key;
    }
  };
}
