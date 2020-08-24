import OTString from "./OTString";

enum Operation {
  Delete = "delete",
  Insert = "insert",
  Skip = "skip",
}

type OperationalTransformation = {
  /** The operation to be performed */
  op: Operation;
};

type SkipTransformation = OperationalTransformation & {
  /** The number of characters to be skipped */
  count: number;
};

type DeleteTransformation = OperationalTransformation & {
  /** The number of characters to be deleted */
  count: number;
};

type InsertTransformation = OperationalTransformation & {
  /** The characters to insert into the `OTString` */
  chars: string;
};

const isSkipTransformation = (obj: any): obj is SkipTransformation =>
  obj.op === Operation.Skip;
const isDeleteTransformation = (obj: any): obj is DeleteTransformation =>
  obj.op === Operation.Delete;
const isInsertTransforamtion = (obj: any): obj is InsertTransformation =>
  obj.op === Operation.Insert;

/**
 *
 * @param stale The old string to apply transformations to
 * @param latest The current version of the string that `stale` should match when the transformations are applied
 * @param otJson The JSON string of an array of transformations to be applied and checked
 * @returns boolean Whether the specified transformations will bring `stale` to `latest` when applied
 * @throws Error if invalid JSON data is passed to `otJson`
 */
export const is_valid = (stale: string, latest: string, otJson: string) => {
  let transforms: OperationalTransformation[];

  try {
    transforms = JSON.parse(otJson);
  } catch (err) {
    throw new Error(`Unable to parse transformations: ${err}`);
  }

  const transformedString = new OTString(stale);

  for (let i = 0; i < transforms.length; i++) {
    const transform = transforms[i];

    // use TypeScript's type checking to determine which operation we are doing
    // this has the added benefit of the object becoming type-aware, so
    // while `transform` above will not have the properties of the transformation,
    // it will once it passes the type check below, thus making the object's
    // additional properties visible

    if (isSkipTransformation(transform)) {
      if (transformedString.isValidSeek(transform.count)) {
        transformedString.skip(transform.count);
      } else {
        return false;
      }
    } else if (isInsertTransforamtion(transform)) {
      transformedString.insert(transform.chars);
    } else if (isDeleteTransformation(transform)) {
      // if we can't "seek" past the end of the string from the current position,
      // we can't delete past it either
      if (transformedString.isValidSeek(transform.count)) {
        transformedString.delete(transform.count);
      } else {
        return false;
      }
    } else throw new Error(`Unknown operation: ${transform.op}`);
  }

  return transformedString.get() === latest;
};
