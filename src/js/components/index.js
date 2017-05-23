import Btns from './btn/index';
import Containers from './container/index';
import Navbars from './navbar/index';

function bootstrap(...components) {
  const entries = {};

  components.forEach((component) => {
    Object.keys(component).forEach((key) => {
      entries[key] = component[key];
    });
  });

  return entries;
}

export default bootstrap(
    Btns,
    Containers,
    Navbars,
);
