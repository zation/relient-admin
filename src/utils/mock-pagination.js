import { slice } from 'lodash/fp';

export default ({ page, size }, items) => {
  const sizeNumber = Number(size);
  const pageNumber = Number(page);
  const content = slice(pageNumber * sizeNumber, (pageNumber + 1) * sizeNumber)(items);
  return {
    content,
    number: pageNumber,
    size: sizeNumber,
    totalElements: items.length,
  };
};
