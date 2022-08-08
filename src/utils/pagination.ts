export interface Query {
  size: number | string
  page: number | string
}

export interface PagedData<Model> {
  size: number
  content: Model[]
  number: number
  totalPages: number
  totalElements: number
  sort: {
    sorted: boolean
    unsorted: boolean
  }
}

export default function getPagedData<Model>(query: Query) {
  return (content: Model[]): PagedData<Model> => {
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
}
