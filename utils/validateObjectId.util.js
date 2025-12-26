const objectIdRegex = /^[a-f\d]{24}$/i;

const isValidObjectId = (id) => {
  return objectIdRegex.test(id);
};

export default isValidObjectId;
