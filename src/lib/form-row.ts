// IDs belong to editable rows in this browser session, independently of item selection.
let nextRowId = 0;

export function createFormRowId(): string {
  nextRowId += 1;
  return `form-row-${nextRowId}`;
}
