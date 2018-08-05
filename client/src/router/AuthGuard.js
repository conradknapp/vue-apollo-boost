/* Don't have access to this, so we bring in store */
import { store } from "../store";

export default (to, from, next) => {
  if (store.getters.user) {
    next();
  } else {
    next("/signin");
  }
};
