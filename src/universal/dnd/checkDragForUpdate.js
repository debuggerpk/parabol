import {SORT_STEP} from 'universal/utils/constants';
import {findDOMNode} from 'react-dom';

export default function checkDragForUpdate(monitor, dragState, itemArray, sortField, isDescending) {
  const sourceProps = monitor.getItem();
  const {id} = sourceProps;
  const {components, minY, maxY, thresholds} = dragState;
  const {y: sourceOffsetY} = monitor.getClientOffset();

  if (minY !== null && sourceOffsetY >= minY && sourceOffsetY <= maxY) {
    return undefined;
  }
  if (thresholds.length === 0) {
    for (let i = 0; i < components.length; i++) {
      const component = components[i];
      const node = findDOMNode(component);
      const {top, height} = node.getBoundingClientRect();
      thresholds[i] = top + height / 2;
    }
  }

  // console.log('finding the best threshold', thresholds, sourceOffsetY);
  let i;
  for (i = 0; i < thresholds.length; i++) {
    const centerY = thresholds[i];
    if (sourceOffsetY < centerY) {
      // console.log('found a good threshold', i, thresholds[i]);
      break;
    }
  }
  const updatedDoc = {id};
  const itemToReplace = itemArray[i];
  const prevItem = itemArray[i - 1];
  const dFactor = isDescending ? 1 : -1;
  if (thresholds.length === 0) {
    // console.log('no thresholds, setting to first in the column');
    updatedDoc[sortField] = 0;
  } else if (i === 0) {
    // if we're trying to put it at the top, make sure it's not already at the top
    if (itemToReplace.id === id) {
      // console.log('best place is where it is, at the top. setting min and max Y')
      // don't listen to any upwards movement, we'll still be on top
      dragState.minY = -1;
      // if there is a second card, start listening if we're halfway down it. otherwise, never listen to downward movement
      dragState.maxY = thresholds.length > 1 ? thresholds[1] + 1 : 10e6;
      return undefined;
    }
    // console.log('setting', id,  'to first in the column behind', itemToReplace);
    updatedDoc[sortField] = itemToReplace[sortField] + (SORT_STEP * dFactor);
  } else if (i === thresholds.length) {
    // console.log('putting card at the end')
    // if we wanna put it at the end, make sure it's not already at the end
    if (prevItem.id === id) {
      // console.log('best place is where it is (at the bottom), setting min and max Y')
      // only listen to upward movement starting halfway up the card above it
      dragState.minY = thresholds[i - 1] - 1;
      // don't listen to downward movement. we're on the bottom & that ain't changing
      dragState.maxY = thresholds.length > i + 1 ? thresholds[i + 1] + 1 : 10e6;
      return undefined;
    }
    // console.log('setting to last in the column after', prevItem);
    updatedDoc[sortField] = prevItem[sortField] - (SORT_STEP * dFactor);
  } else {
    // console.log('putting card in the middle')
    // if we're somewhere in the middle, make sure we're actually gonna move
    if (itemToReplace.id === id || prevItem.id === id) {
      // only listen to upward movement starting halfway up the card above it
      dragState.minY = thresholds[i - 1] - 1;
      // start listening if we're halfway down the card below
      dragState.maxY = thresholds[i] + 1;
      // console.log('cannot assign to middle, setting min max', dragState.minY, dragState.maxY)
      return undefined;
    }
    // console.log('setting', id,  'in between', prevItem.id, itemToReplace.id);
    updatedDoc[sortField] = (prevItem[sortField] + itemToReplace[sortField]) / 2;
    // console.log('new sort', updatedDoc[sortField], 'in between', prevItem[sortField], itemToReplace[sortField])
  }
  // mutative for fast response
  sourceProps[sortField] = updatedDoc[sortField];

  // close it out! we know we're moving
  dragState.clear();
  return {
    prevItem,
    updatedDoc
  }
}
