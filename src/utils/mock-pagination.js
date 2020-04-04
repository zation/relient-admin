export default (query) => (content) => {
  const size = Number(query.size);
  const page = Number(query.page);
  return {
    size,
    content: content.slice(page * size, (page + 1) * size),
    number: page,
    totalPages: Math.ceil(content.length / size),
    totalElements: content.length,
    sort: {
      sorted: false,
      unsorted: true,
    },
  };
};
