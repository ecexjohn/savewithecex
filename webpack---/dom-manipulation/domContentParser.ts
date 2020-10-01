import { NodeToRender } from '../types';

/**
 * Parses the embed content to be able to attach it to the DOM and make it run
 * @param content
 */
function parseEmbedData(content: string | any): NodeToRender[] {
  const toRender: NodeToRender[] = [];
  const div = document.createElement('DIV');
  div.innerHTML = content;
  Array.prototype.forEach.call(div.childNodes, node => {
    const nodeType = node.nodeType;
    const domContent = node.innerHTML || node.textContent || node.nodeValue;
    toRender.push({
      nodeType,
      tag: node.nodeName,
      attributes: node.attributes,
      content: domContent,
    });
  });
  return toRender;
}

export { parseEmbedData };
