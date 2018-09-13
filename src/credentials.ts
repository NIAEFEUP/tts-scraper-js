// tslint:disable-next-line no-var-requires
const prompt = require("prompt");

interface Credentials {
  username: string;
  password: string;
}

export async function getCredentials(): Promise<Credentials> {
  const schema = {
    properties: {
      username: {
        required: true
      },
      password: {
        required: true,
        hidden: true
      }
    }
  };

  return new Promise((resolve: (credentials: Credentials) => void, reject) => {
    prompt.start();
    prompt.get(schema, (error: any, result: Credentials) => {
      if (error) {
        reject(error);
      }

      resolve(result);
    });
  });
}
