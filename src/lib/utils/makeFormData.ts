/**
 * Function to create a FormData object from an object with key-value pairs,
 * including handling file objects from Ant Design's Upload component.
 * @param data - The object containing key-value pairs (including file objects).
 * @returns FormData instance with appended key-value pairs.
 */
const makeFormData = (data: { [key: string]: any }): FormData => {
  const formData = new FormData();

  // Loop through the object keys and append each key-value pair to the FormData
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const value = data[key];
      if (value !== undefined && value !== null) {
        // Handle file uploads with "file__" prefix
        const fileKey = key.split("__");
        if (
          fileKey?.length > 1 &&
          fileKey[0] === "file" &&
          Array.isArray(value)
        ) {
          // Get only files that have originFileObj (new uploads)
          value.forEach((fileItem) => {
            if (fileItem?.originFileObj) {
              formData.append(fileKey[1], fileItem.originFileObj);
            } else if (fileItem?.id) {
              // For existing files that are kept, send their IDs
              formData.append(`${fileKey[1]}Ids[]`, fileItem.id.toString());
            }
          });
        } else if (key === "deletedImageIds" && Array.isArray(value)) {
          // Handle deleted image IDs
          value.forEach((id) => {
            formData.append("deletedImageIds[]", id.toString());
          });
        } else {
          if (Array.isArray(value)) {
            value.forEach((item) => {
              // Skip null or undefined items in arrays
              if (item !== undefined && item !== null) {
                formData.append(`${key}[]`, item);
              }
            });
          } else {
            // Append other non-file fields to FormData
            formData.append(key, value);
          }
        }
      }
    }
  }

  return formData;
};

export default makeFormData;
