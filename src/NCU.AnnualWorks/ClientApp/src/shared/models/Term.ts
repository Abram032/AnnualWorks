export type Term = {
  id: string,
  startDate: Date,
  endDate: Date,
  finishDate: Date,
  names: {
    pl: string,
    en: string,
  }
};

export default Term;