// checks for Nullable and Result values
//
// typically, since interfaces can have undefined values,
// you should check some(val) first, then ok(val) to check
// if there was an API error

function ok<T>(r: Result<T>): boolean {
  return !(r instanceof Error);
}

function some<T>(r: Nullable<T | undefined>): boolean {
  // https://stackoverflow.com/a/28984306/9348376
  // think using double equals is right here?
  return r != null;
}

export {
  some,
  ok,
}
