export const checkIfValidProjectionId = (projectionId: string | string[]): string[] => {
  // Input checking
  if (typeof projectionId !== 'string' && !Array.isArray(projectionId)) {
    throw 'ProjectionId should be a(n array of) string(s) with non-zero length.';
  }
  if (typeof projectionId === 'string' && projectionId.length === 0) {
    throw 'ProjectionId should be a(n array of) string(s) with non-zero length.';
  }
  if (typeof projectionId !== 'string') {
    projectionId.forEach(pId => {
      if (typeof pId !== 'string' || pId.length === 0) {
        throw 'ProjectionId should be a(n array of) string(s) with non-zero length.';
      }
    });
  }

  return typeof projectionId === 'string' ? [projectionId] : projectionId;
};
