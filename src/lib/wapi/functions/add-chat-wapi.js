import { injectConfig, filterModule, filterObjects } from '../helper';

export async function addChatWapi() {
  window[injectConfig.webpack].push([
    [injectConfig.parasite],
    {},
    async function (o) {
      let modules = [];
      for (let idx in o.m) {
        modules.push(o(idx));
      }

      const filterMod = await filterModule(filterObjects, modules);

      filterMod.forEach((needObj) => {
        if (needObj.yesModule) {
          if (!window.Store[needObj.type]) {
            window.Store[needObj.type] = needObj.yesModule;
          }
        }
      });

      if (Store && Store.BusinessProfile) {
        Store.Chat._findAndParse = Store.BusinessProfile._findAndParse;
        Store.Chat._find = Store.BusinessProfile._find;
      }
    }
  ]);
}
