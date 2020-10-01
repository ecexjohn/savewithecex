import { AccordionCorvidModel } from '../Accordion.types';

const entry: AccordionCorvidModel = {
  componentType: 'Accordion',
  sdkType: 'Gallery',
  loadSDK: () =>
    import('./Accordion.corvid' /* webpackChunkName: "Accordion.corvid" */),
};

export default entry;
