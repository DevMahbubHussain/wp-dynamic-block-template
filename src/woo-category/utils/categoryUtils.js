/**
 * Filters and sorts the list of categories based on block attributes.
 * This function handles the preview logic for the editor.
 *
 * @param {Array} allCategories - The full list of categories from the API.
 * @param {object} attributes - The current block attributes.
 * @returns {Array} The filtered, sorted, and limited array of categories for preview.
 */
export const getFilteredCategories = (allCategories, attributes) => {
    if (!allCategories) return [];

    const {
        categoriesToShow,
        parentFilter,
        orderBy,
        order,
        selectedCategories,
        excludeCategories,
    } = attributes;

    let filtered = [...allCategories];

    // 1. Filtering by Parent
    if (parentFilter === "top-level") {
        filtered = filtered.filter((cat) => cat.parent === 0);
    } else if (parentFilter === "sub-categories") {
        filtered = filtered.filter((cat) => cat.parent !== 0);
    }

    // 2. Filtering by Inclusion/Exclusion (Inclusion takes priority)
    if (selectedCategories.length > 0) {
        filtered = filtered.filter((cat) => selectedCategories.includes(cat.id));
    } else if (excludeCategories.length > 0) {
        filtered = filtered.filter((cat) => !excludeCategories.includes(cat.id));
    }

    // 3. Sorting
    filtered.sort((a, b) => {
        let comparison = 0;
        const aVal = a[orderBy];
        const bVal = b[orderBy];

        if (orderBy === "name") {
            comparison = aVal.localeCompare(bVal);
        } else {
            // 'count' or 'id'
            comparison = aVal - bVal;
        }

        return order === "asc" ? comparison : comparison * -1;
    });

    // 4. Limiting (Slicing)
    filtered = filtered.slice(0, categoriesToShow);

    return filtered;
};