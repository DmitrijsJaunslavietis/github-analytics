import RNSecureStorage, { ACCESSIBLE } from 'rn-secure-storage';

interface ITokenStorage {
  haveToken: () => Promise<boolean>;
  removeToken: () => Promise<boolean>;
  setToken: (token: string) => Promise<boolean>;
  getToken: () => Promise<string | null>;
}

export const useTokenStorage = (): ITokenStorage => {

  const haveToken = async () => {
    try {
      const value = await RNSecureStorage.getItem(`bearer`);
      if (value !== null) {
        return true;
      }
      return false
    } catch (e) {
      console.log("haveToken error", e);
    }
    return false;
  };

  const removeToken = async () => {
    try {
      return await RNSecureStorage.removeItem('bearer').then(() => {
        return true;
      });
    } catch (e) {
      console.log("removeToken error", e);
    }
    return false;
  };

  const setToken = async (token: string) => {
    try {
      return await RNSecureStorage.setItem('bearer', token, { accessible: ACCESSIBLE.WHEN_UNLOCKED }).then(() => {
        return true;
      });
    } catch (e) {
      console.log("setToken error", e);
    }
    return false;
  };

  const getToken = async () => {
    let value = null;
    try {
      await RNSecureStorage.getItem(`bearer`).then((result) => {
        value = result;
      });
    } catch (e) {
      console.log("getToken error", e);
    }
    return value;
  };
  return { haveToken, setToken, getToken, removeToken };
}
