/**
 * An Operational Transformation String.
 *
 * This string is contructed with a base string and provides methods for skipping, inserting,
 * or deleting from the current string. A validation method is also provided to ensure the
 * skip and delete operations do not fall out of bounds of the string.
 */
export default class OTString {
  /** The operational transformation string, including all transformations applied so far */
  private str: string;
  /** The current position in the string */
  private currentPos: number;

  /**
   * Creates a new `OTString` from the specified base string for operations to be applied to it
   * @param str The string to start with
   */
  constructor(str: string) {
    this.str = str;
    this.currentPos = 0;
  }

  /**
   * Gets the current value of the OTString
   * @returns string The value of the OTString
   */
  get = () => this.str;

  /**
   * Determines if the desired skip/delete operation is valid
   * @param count The number of characters to skip (relative to the current position)
   * @returns Boolean
   * @example isValidSkipOrDelete(302) // false - the OTString is only 6 characters long
   */
  isValidSeek = (count: number) => {
    const newPos = this.currentPos + count;

    // only valid if our new position >= 0 AND
    // our new position is not past the last character of the string
    return newPos >= 0 && newPos <= this.str.length;
  };

  /**
   * Skips the specified number of characters in the OTString
   * @param count The number of characters to skip (relative to the current position)
   * @returns number The new position
   * @example skip(4) // 7
   */
  skip = (count: number) => {
    this.currentPos += count;

    return this.currentPos;
  };

  /**
   * Returns a tuple of the current OTString before and after the current position
   * @returns [string, string] The string before the current position, and the strong after the current position
   */
  private getBeforeAfter = () => [
    this.str.substring(0, this.currentPos),
    this.str.substring(this.currentPos),
  ];

  /**
   * Insert the specified characters into the OTString relative to the current position
   * @param chars The characters to insert
   * @returns string The new OTString value
   */
  insert = (chars: string) => {
    const [before, after] = this.getBeforeAfter();

    this.str = before + chars + after;
    this.currentPos += chars.length;

    return this.str;
  };

  /**
   * Delete the specified number of characters in the OTString relative to the current position
   * @param count The number of characters to remove
   * @returns string The new OTString value
   */
  delete = (count: number) => {
    const [before, after] = this.getBeforeAfter();

    this.str = before + after.substring(count);

    return this.str;
  };
}
