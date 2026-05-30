const initialState = {
  keyword: "",
  type: "",
  location: "",
  salaryMin: 0,
  sortBy: "newest",
};

export const filterReducer = (state, action) => {
  switch (action.type) {
    case "set keyword":
      return { ...state, keyword: action.payload };
    case "SET_TYPE":
      return { ...state, type: action.payload };
    case "SET_LOCATION":
      return { ...state, location: action.payload };
    case "SET_SALARY_MIN":
      return { ...state, salaryMin: Number(action.payload) };
    case "SET_SORT":
      return { ...state, sortBy: action.payload };
    case "RESET":
      return initialState;
    default:
      return state;
  }
};

export const applyFilter = (jobs, filters) => {
  let result = [...jobs];
  if (filters.keyword) {
    const kw = filters.keyword.toLowerCase();

    result =
      result.filter((j) => j.title.includes(kw)) ||
      j.skills?.some((s) => s.toLowerCase.includes(kw));
  }

  if (filters.type) {
    result = jobs.filter((j) => j.type === filter.type);
  }

  if (filters.location) {
    const loc = filters.location.toLowerCase();
    result = result.filter((j) => j.location?.toLowerCase().includes(loc));
  }
  if (filters.sortBy === "salary_high") {
    result.sort((a, b) => (b.salary_max ?? 0) - (a.salary_max ?? 0));
  } else if (filters.sortBy === "salary_low") {
    result.sort((a, b) => (a.salary_min ?? 0) - (b.salary_min ?? 0));
  }

  return result;
};
