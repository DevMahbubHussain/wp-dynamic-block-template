import { InspectorControls, useBlockProps } from "@wordpress/block-editor";
import {
	PanelBody,
	ToggleControl,
	SelectControl,
	RangeControl,
	Spinner, // Used for the loading state
	BaseControl,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useSelect } from "@wordpress/data"; // Core hook for fetching data
import apiFetch from "@wordpress/api-fetch"; // For custom API calls (though useSelect is preferred)
import { useState, useEffect } from "@wordpress/element"; // For managing component state

// --- EDIT FUNCTION START ---
const Edit = ({ attributes, setAttributes }) => {
	const {
		layoutStyle,
		columns,
		categoriesToShow,
		parentFilter,
		orderBy,
		order,
		showImage,
		showCount,
		showDescription,
		imageSize,
		// We will manage selectedCategories and excludeCategories as arrays of IDs
		selectedCategories,
		excludeCategories,
	} = attributes;

	const blockProps = useBlockProps();

	// ---------------------------------------------
	// 1. Data Fetching and Management
	// ---------------------------------------------

	const [allCategories, setAllCategories] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Fetch all product categories using the WooCommerce REST API endpoint
		// NOTE: This assumes your site has WP_Store_API enabled and the current user has permission.
		// The path is typically /wp-json/wc/v3/products/categories for v3, but we'll use the
		// general structure for a Storefront/Store API implementation, which is often /wc/store/products/categories
		// For demonstration, let's assume we use a simplified version:

		const fetchCategories = async () => {
			try {
				// Fetching a large number just to get a comprehensive list for the selectors
				const categories = await apiFetch({
					path: "/wc/store/products/categories?per_page=100",
					method: "GET",
				});
				setAllCategories(categories);
			} catch (error) {
				console.error("Error fetching product categories:", error);
				setAllCategories([]); // Set to empty array on error
			} finally {
				setIsLoading(false);
			}
		};

		fetchCategories();
	}, []);

	// Prepare options for SelectControl
	const categoryOptions = allCategories
		? allCategories.map((cat) => ({
				label: cat.name + ` (${cat.count})`,
				value: cat.id,
		  }))
		: [];

	// ---------------------------------------------
	// 2. Sidebar Controls Implementation
	// ---------------------------------------------

	// Helper to handle the multi-select category IDs
	const handleCategorySelection = (newIds, attributeName) => {
		// newIds comes as an array of strings (the category IDs). Convert to numbers.
		const numericIds = newIds
			.map((id) => parseInt(id))
			.filter((id) => !isNaN(id));
		setAttributes({ [attributeName]: numericIds });
	};

	const CategorySelectControl = ({ label, attributeName, selectedIds }) => (
		<BaseControl
			label={label}
			help={__("Select one or more categories.", "your-textdomain")}
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
						handleCategorySelection(selectedOptions, attributeName);
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

	// Filter the categories that match the current block attributes for preview
	const getFilteredCategories = () => {
		if (!allCategories) return [];

		let filtered = [...allCategories];

		// 1. Filtering by Parent
		if (parentFilter === "top-level") {
			filtered = filtered.filter((cat) => cat.parent === 0);
		} else if (parentFilter === "sub-categories") {
			filtered = filtered.filter((cat) => cat.parent !== 0);
		}

		// 2. Filtering by Inclusion/Exclusion
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

		// 4. Limiting
		filtered = filtered.slice(0, categoriesToShow);

		return filtered;
	};

	const categoriesForPreview = getFilteredCategories();

	return (
		<div {...blockProps}>
			<InspectorControls>
				<PanelBody title={__("Layout & Appearance", "your-textdomain")}>
					<SelectControl
						label={__("Layout Style", "your-textdomain")}
						value={layoutStyle}
						options={[
							{ label: __("Grid", "your-textdomain"), value: "grid" },
							{ label: __("List", "your-textdomain"), value: "list" },
							{ label: __("Carousel", "your-textdomain"), value: "carousel" },
						]}
						onChange={(newStyle) => setAttributes({ layoutStyle: newStyle })}
					/>
					{layoutStyle === "grid" && (
						<RangeControl
							label={__("Number of Columns", "your-textdomain")}
							value={columns}
							onChange={(newColumns) => setAttributes({ columns: newColumns })}
							min={1}
							max={6}
						/>
					)}
					<ToggleControl
						label={__("Show Category Image", "your-textdomain")}
						checked={showImage}
						onChange={() => setAttributes({ showImage: !showImage })}
					/>
					<ToggleControl
						label={__("Show Product Count", "your-textdomain")}
						checked={showCount}
						onChange={() => setAttributes({ showCount: !showCount })}
					/>
					<ToggleControl
						label={__("Show Description", "your-textdomain")}
						checked={showDescription}
						onChange={() =>
							setAttributes({ showDescription: !showDescription })
						}
					/>
				</PanelBody>

				<PanelBody
					title={__("Filtering & Selection", "your-textdomain")}
					initialOpen={false}
				>
					<RangeControl
						label={__("Categories to Show", "your-textdomain")}
						value={categoriesToShow}
						onChange={(newLimit) =>
							setAttributes({ categoriesToShow: newLimit })
						}
						min={1}
						max={50}
					/>

					<SelectControl
						label={__("Parent/Hierarchy Filter", "your-textdomain")}
						value={parentFilter}
						options={[
							{
								label: __("Show All Categories", "your-textdomain"),
								value: "all",
							},
							{
								label: __("Show Top-Level Only", "your-textdomain"),
								value: "top-level",
							},
							{
								label: __("Show Sub-Categories Only", "your-textdomain"),
								value: "sub-categories",
							},
						]}
						onChange={(newFilter) => setAttributes({ parentFilter: newFilter })}
					/>

					{/* IMPLEMENTED: Multi-Select for Inclusion */}
					<CategorySelectControl
						label={__("Include Specific Categories", "your-textdomain")}
						attributeName="selectedCategories"
						selectedIds={selectedCategories}
					/>

					{/* IMPLEMENTED: Multi-Select for Exclusion */}
					<CategorySelectControl
						label={__("Exclude Categories", "your-textdomain")}
						attributeName="excludeCategories"
						selectedIds={excludeCategories}
					/>
				</PanelBody>

				<PanelBody title={__("Sorting", "your-textdomain")} initialOpen={false}>
					<SelectControl
						label={__("Order By", "your-textdomain")}
						value={orderBy}
						options={[
							{
								label: __("Name (Alphabetical)", "your-textdomain"),
								value: "name",
							},
							{ label: __("Product Count", "your-textdomain"), value: "count" },
							{ label: __("ID", "your-textdomain"), value: "id" },
						]}
						onChange={(newOrderBy) => setAttributes({ orderBy: newOrderBy })}
					/>

					<SelectControl
						label={__("Order Direction", "your-textdomain")}
						value={order}
						options={[
							{ label: __("Ascending (ASC)", "your-textdomain"), value: "asc" },
							{
								label: __("Descending (DESC)", "your-textdomain"),
								value: "desc",
							},
						]}
						onChange={(newOrder) => setAttributes({ order: newOrder })}
					/>
				</PanelBody>
			</InspectorControls>

			<div
				className={`wp-block-woocommerce-categories-preview layout-${layoutStyle}`}
			>
				<h3 style={{ textAlign: "center" }}>
					{__("WooCommerce Product Categories Preview", "your-textdomain")}
				</h3>
				<p style={{ textAlign: "center", fontSize: "12px", color: "#777" }}>
					**Layout:** {layoutStyle} | **Columns:** {columns} | **Showing:**{" "}
					{categoriesForPreview.length} of{" "}
					{allCategories ? allCategories.length : 0}
				</p>

				{isLoading && (
					<div style={{ textAlign: "center", padding: "20px" }}>
						<Spinner /> Loading Categories...
					</div>
				)}

				{!isLoading && categoriesForPreview.length === 0 && (
					<div
						style={{
							textAlign: "center",
							padding: "20px",
							border: "1px solid #ccc",
						}}
					>
						No categories match your current filtering criteria.
					</div>
				)}

				{categoriesForPreview.length > 0 && (
					<div
						style={{
							display: "grid",
							gridTemplateColumns: `repeat(${
								layoutStyle === "grid" ? columns : 1
							}, 1fr)`,
							gap: "20px",
							padding: "10px",
						}}
					>
						{categoriesForPreview.map((category) => (
							<div
								key={category.id}
								style={{
									border: "1px solid #ddd",
									padding: "15px",
									borderRadius: "4px",
									textAlign: "center",
									backgroundColor: "#f9f9f9",
								}}
							>
								{showImage && category.image && (
									<img
										src={category.image.thumbnail || category.image.src}
										alt={category.name}
										style={{
											width: "100%",
											height: "auto",
											maxHeight: "100px",
											objectFit: "cover",
											marginBottom: "10px",
										}}
									/>
								)}

								<h4>{category.name}</h4>

								{showCount && (
									<p style={{ fontSize: "14px", color: "#555" }}>
										({category.count} Products)
									</p>
								)}

								{showDescription && category.description && (
									<p
										style={{
											fontSize: "12px",
											color: "#888",
											marginTop: "5px",
										}}
									>
										{category.description.substring(0, 50)}...
									</p>
								)}
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default Edit;
