export interface JobFilterValue {
  search: string;
  skills: string[];
  remote: boolean;
  salaryMin: number;
}

export const EMPTY_JOB_FILTERS: JobFilterValue = {
  search: '',
  skills: [],
  remote: false,
  salaryMin: 0,
};
