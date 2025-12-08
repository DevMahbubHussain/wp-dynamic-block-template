import { __ } from "@wordpress/i18n";
import { BaseControl, Spinner } from "@wordpress/components";

/**
 * Handles converting an array of numeric IDs from a multi-select back to a numeric array.
 * This is a good utility function to keep in the main Edit file or utils.
 * @param {string[]} newIds - Array of string IDs from the <select multiple>.
 * @returns {number[]} Array of parsed numeric IDs.
 */
export const normalizeCategoryIds = (newIds) => {
    return newIds.map((id) => parseInt(id)).filter((id) => !isNaN(id));
};

/**
 * Component for selecting multiple categories (Include or Exclude).
 *
 * @param {object} props
 * @param {string} props.label - Label for the control.
 * @param {string} props.attributeName - The block attribute key to update.
 * @param {number[]} props.selectedIds - The current array of selected IDs.
 * @param {object[]} props.categoryOptions - The options list (label, value).
 * @param {function} props.setAttributes - Block's setAttributes function.
 * @param {boolean} props.isLoading - Whether the data is currently loading.
 * @returns {JSX.Element}
 */
const CategorySelectControl = ({
    label,
    attributeName,
    selectedIds,
    categoryOptions,
    setAttributes,
    isLoading,
}) => {
    
    // Helper function moved from the main Edit file
    const handleCategorySelection = (selectedOptions) => {
        const numericIds = normalizeCategoryIds(selectedOptions);
        setAttributes({ [attributeName]: numericIds });
    };
    
    return (
        <BaseControl
            label={label}
            help={__("Select one or more categories.", "woo-builder")}
        >
            {isLoading ? (
                <Spinner />
            ) : (
                <select
                    multiple
                    value={selectedIds.map((id) => String(id))} // Map numbers back to strings for the select value
                    onChange={(event) => {
                        const selectedOptions = Array.from(event.target.options)
                            .filter((option) => option.selected)
                            .map((option) => option.value);
                        handleCategorySelection(selectedOptions);
                    }}
                    style={{ minHeight: "150px", width: "100%" }}
                >
                    {categoryOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            )}
        </BaseControl>
    );
};

export default CategorySelectControl;