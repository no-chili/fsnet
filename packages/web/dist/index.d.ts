import { PvPlugin } from './plugins/behavior/pv';
import { Starter } from './Starter';
declare const persight: {
    Starter: typeof Starter;
    PvPlugin: typeof PvPlugin;
};
export default persight;
