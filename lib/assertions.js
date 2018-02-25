const obj = () => {
  return {
    match: a => typeof a === "object",
    mock: () => ({}),
  };
};

const callback = () => {
  return {
    isCallback,
    match: a => typeof a === "function",
    mock: () => () => {},
  }
}

const string = () => {
  return {
    match: a => typeof a === "string",
    mock: () => "a string",
  }
}

const number = () => {
  return {
    match: a => typeof a === "number",
    mock: () => 1,
  }
}

export { obj, callback };
