import { isRedirectError } from "next/dist/client/components/redirect-error";
import { getErrorMessage } from "./getErrorMessage";

type Options<T> = {
  actionFn: () => Promise<T>;
};
export const executeAction = async <T>({ actionFn }: Options<T>) => {
  try {
    await actionFn();
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    throw new Error(getErrorMessage(error));
  }
};
