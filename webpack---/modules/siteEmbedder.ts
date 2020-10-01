import { eventNames, publishEvent } from './events';
import { createTagCallBack, runCallback } from '../utils/callbackUtils';
import { buildNode } from '../dom-manipulation/nodeBuilder';
import { parseEmbedData } from '../dom-manipulation/domContentParser';
import { NodeToRender, Position, SiteEmbededTag } from '../types';
import {
  addLoadedTag,
  addLoadErrorTag,
  setLoading,
  getSiteEmbedTags,
} from './stateCache';

/**
 *  Iterate through the embeds collection and apply them to the DOM
 *  Keep a reference to any nodes that need to be reapplied for removal
 *  Keep a reference to any embeds that should be reapplied to re-apply them
 * @param embeds
 */
function applySiteEmbeds(tags?: SiteEmbededTag[]) {
  const tagsToEmbed: SiteEmbededTag[] = (tags || getSiteEmbedTags()).filter(
    tag => !tag.embeddedNodes,
  );
  const loadingTags = tagsToEmbed.map(siteTag => siteTag.tag);
  setLoading(loadingTags);
  publishEvent(eventNames.TAGS_LOADING, window as any, loadingTags);

  tagsToEmbed.forEach((siteEmbed: SiteEmbededTag) => {
    const tag = siteEmbed.tag;
    const nodesToEmbed = parseEmbedData(tag.content);
    const embedLocation =
      tag.position && tag.position !== Position.HEAD
        ? document.body
        : document.head;

    const embeddedNodes = createSiteEmbed(
      nodesToEmbed,
      {
        onload: createTagCallBack(
          eventNames.TAG_LOADED,
          tag.name,
          tag,
          addLoadedTag,
        ),
        onerror: createTagCallBack(
          eventNames.TAG_LOAD_ERROR,
          tag.name,
          tag,
          addLoadErrorTag,
        ),
      },
      embedLocation,
      tag.position === Position.BODY_START,
    );

    siteEmbed.embeddedNodes = embeddedNodes;
  });
}
/**
 *
 * @param renderingInput - an Array of DOM Nodes to render
 * @param callbacks - { onloaded, onerror } - methods to notify when load has been completed for all nodes or failed for some
 * @param parentNode - the node to embed in
 * @param before - if to embed in the beginning of the body
 */
function createSiteEmbed(
  renderingInput: NodeToRender[],
  callbacks: {
    onload?: Function;
    onerror?: Function;
  },
  parentNode: HTMLElement,
  before: boolean,
) {
  const resultNodes: any = [];
  let counters = 0,
    errorState = false;

  const onload = () => {
    counters = counters - 1;
    if (counters >= 0) {
      runCallback(callbacks.onload, {});
    }
  };
  const onerror = () => {
    counters = counters - 1;
    errorState = true;
    if (counters >= 0) {
      runCallback(callbacks.onerror, { error: true });
    }
  };
  const firstChild = parentNode.firstChild; // captured so all nodes are inserted before it
  renderingInput.forEach((node: NodeToRender) => {
    if (node.tag === 'SCRIPT') {
      counters = counters + 1;
    }
    const resultNode = buildNode(node, { onload, onerror });
    resultNodes.push(resultNode);
    if (before) {
      parentNode.insertBefore(resultNode, firstChild);
    } else {
      parentNode.appendChild(resultNode);
    }
  });
  if (counters === 0) {
    runCallback(callbacks.onload, {}, true);
  }
  return resultNodes;
}

export { applySiteEmbeds };
