export const timeStamp = (...args: unknown[]) => {
  console.log(
    '[' + new Date().toISOString().substring(11, 23) + '] -',
    ...args,
  );
};

export const debugLog = (...args: unknown[]) => {
  if (process.env.DEBUG === '1') {
    timeStamp(...args);
  }
};

export const renderJson = (
  ctx: { body: string; status: number },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  object: any,
) => {
  if (object) {
    ctx.body = object;
  } else {
    ctx.status = 404;
    ctx.body = 'Not found';
  }
};

export const mapAsync = (array: unknown[], callbackfn: () => void) => {
  return Promise.all(array.map(callbackfn));
};
