// checks for Unset (undefined) and Result (error) values
//
// typically, since interfaces can have undefined values,
// you should check some(val) first, then ok(val) to check
// if there was an API error

function ok<T>(r: Result<T>): boolean {
  return !(r instanceof Error);
}

function errored<T>(r: Result<T>): boolean {
  return (r instanceof Error);
}

function some<T>(r: Unset<T>): boolean {
  // https://stackoverflow.com/a/28984306/9348376
  // think using double equals is right here?
  return r != null;
}

export {
  some,
  errored,
  ok,
}
