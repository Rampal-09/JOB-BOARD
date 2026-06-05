export const initialState = {
  keyword: "",
  type: "",
  location: "",
  salaryMin: 0,
  sortBy: "newest",
};

export const filterReducer = (state, action) => {
  switch (action.type) {
    case "SET_KEYWORD":
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

    result = result.filter((j) => {
      const titleMatch = j.title?.toLowerCase().includes(kw);
      const skillsMatch = j.skills?.some((s) => s.toLowerCase().includes(kw));
      return Boolean(titleMatch || skillsMatch);
    });
  }

  if (filters.type) {
    result = result.filter((j) => j.type === filters.type);
  }

  if (filters.location) {
    const loc = filters.location.toLowerCase();
    result = result.filter((j) => j.location?.toLowerCase().includes(loc));
  }
  if (filters.sortBy === "salary_high") {
    result.sort((a, b) => (b.max_salary ?? 0) - (a.max_salary ?? 0));
  } else if (filters.sortBy === "salary_low") {
    result.sort((a, b) => (a.min_salary ?? 0) - (b.min_salary ?? 0));
  }

  return result;
};
