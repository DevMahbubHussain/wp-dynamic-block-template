import { useState, useEffect } from "@wordpress/element";
import apiFetch from "@wordpress/api-fetch";

/**
 * Custom hook to fetch all WooCommerce product categories for use in the editor.
 * @returns {object} { allCategories, categoryOptions, isLoading, totalCategories }
 */
const useCategoriesData = () => {
    const [allCategories, setAllCategories] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // Fetch all categories (up to 100)
                const categories = await apiFetch({
                    path: "/wc/store/products/categories?per_page=100",
                    method: "GET",
                });
                setAllCategories(categories);
            } catch (error) {
                console.error("Error fetching product categories:", error);
                setAllCategories([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // Memoize the options calculation
    const categoryOptions = allCategories
        ? allCategories.map((cat) => ({
              label: cat.name + ` (${cat.count})`,
              value: cat.id,
          }))
        : [];
        
    const totalCategories = allCategories ? allCategories.length : 0;

    return { allCategories, categoryOptions, isLoading, totalCategories };
};

export default useCategoriesData;