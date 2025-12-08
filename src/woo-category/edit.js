import { InspectorControls, useBlockProps } from "@wordpress/block-editor";
import {
	PanelBody,
	ToggleControl,
	SelectControl,
	RangeControl,
	Spinner,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";

// IMPORTS FROM NEW FILES
import useCategoriesData from "./hooks/useCategoriesData";
import { getFilteredCategories } from "./utils/categoryUtils";
import CategorySelectControl from "./components/CategorySelectControl";
import CategorySkeleton from "./components/CategorySkeleton";
import CategoryPlaceholder from "../components/CategoryPlaceholder";
import { TextControl } from "@wordpress/components";

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
		selectedCategories,
		excludeCategories,
		paginationType,
		scrollThreshold,
		placeholderBehavior,
		customPlaceholderUrl,
	} = attributes;

	const blockProps = useBlockProps();

	// ---------------------------------------------
	// 1. Hook for Data Fetching
	// ---------------------------------------------
	const { allCategories, categoryOptions, isLoading, totalCategories } =
		useCategoriesData();

	// ---------------------------------------------
	// 2. Data Filtering/Preview
	// ---------------------------------------------
	const categoriesForPreview = getFilteredCategories(allCategories, attributes);

	// Pagination Preview Calc
	const categoriesPerPage = categoriesToShow;
	const maxPages =
		totalCategories > 0 ? Math.ceil(totalCategories / categoriesPerPage) : 1;

	// ---------------------------------------------
	// 3. Render UI
	// ---------------------------------------------
	return (
		<div {...blockProps}>
			<InspectorControls>
				{/* ... (Layout & Appearance PanelBody - remains the same) ... */}
				<PanelBody title={__("Layout & Appearance", "woo-builder")}>
					<SelectControl
						label={__("Layout Style", "woo-builder")}
						value={layoutStyle}
						options={[
							{ label: __("Grid", "woo-builder"), value: "grid" },
							{ label: __("List", "woo-builder"), value: "list" },
							{ label: __("Carousel", "woo-builder"), value: "carousel" },
						]}
						onChange={(newStyle) => setAttributes({ layoutStyle: newStyle })}
					/>
					{layoutStyle === "grid" && (
						<RangeControl
							label={__("Number of Columns", "woo-builder")}
							value={columns}
							onChange={(newColumns) => setAttributes({ columns: newColumns })}
							min={1}
							max={6}
						/>
					)}
					<ToggleControl
						label={__("Show Category Image", "woo-builder")}
						checked={showImage}
						onChange={() => setAttributes({ showImage: !showImage })}
					/>
					<ToggleControl
						label={__("Show Product Count", "woo-builder")}
						checked={showCount}
						onChange={() => setAttributes({ showCount: !showCount })}
					/>
					<ToggleControl
						label={__("Show Description", "woo-builder")}
						checked={showDescription}
						onChange={() =>
							setAttributes({ showDescription: !showDescription })
						}
					/>
				</PanelBody>

				{/* ----------------------------------- */}

				<PanelBody
					title={__("Filtering & Selection", "woo-builder")}
					initialOpen={false}
				>
					<RangeControl
						label={__("Categories to Show", "woo-builder")}
						value={categoriesToShow}
						onChange={(newLimit) =>
							setAttributes({ categoriesToShow: newLimit })
						}
						min={1}
						max={50}
					/>
					<SelectControl
						label={__("Parent/Hierarchy Filter", "woo-builder")}
						value={parentFilter}
						options={[
							{ label: __("Show All Categories", "woo-builder"), value: "all" },
							{
								label: __("Show Top-Level Only", "woo-builder"),
								value: "top-level",
							},
							{
								label: __("Show Sub-Categories Only", "woo-builder"),
								value: "sub-categories",
							},
						]}
						onChange={(newFilter) => setAttributes({ parentFilter: newFilter })}
					/>

					{/* REPLACED WITH REUSABLE COMPONENT */}
					<CategorySelectControl
						label={__("Include Specific Categories", "woo-builder")}
						attributeName="selectedCategories"
						selectedIds={selectedCategories}
						categoryOptions={categoryOptions}
						setAttributes={setAttributes}
						isLoading={isLoading}
					/>

					{/* REPLACED WITH REUSABLE COMPONENT */}
					<CategorySelectControl
						label={__("Exclude Categories", "woo-builder")}
						attributeName="excludeCategories"
						selectedIds={excludeCategories}
						categoryOptions={categoryOptions}
						setAttributes={setAttributes}
						isLoading={isLoading}
					/>
				</PanelBody>

				{/* ----------------------------------- */}

				{/* Sorting PanelBody - remains the same structure */}
				<PanelBody title={__("Sorting", "woo-builder")} initialOpen={false}>
					<SelectControl
						label={__("Order By", "woo-builder")}
						value={orderBy}
						options={[
							{
								label: __("Name (Alphabetical)", "woo-builder"),
								value: "name",
							},
							{ label: __("Product Count", "woo-builder"), value: "count" },
							{ label: __("ID", "woo-builder"), value: "id" },
						]}
						onChange={(newOrderBy) => setAttributes({ orderBy: newOrderBy })}
					/>
					<SelectControl
						label={__("Order Direction", "woo-builder")}
						value={order}
						options={[
							{ label: __("Ascending (ASC)", "woo-builder"), value: "asc" },
							{ label: __("Descending (DESC)", "woo-builder"), value: "desc" },
						]}
						onChange={(newOrder) => setAttributes({ order: newOrder })}
					/>
				</PanelBody>

				{/* ----------------------------------- */}

				{/* Pagination Settings PanelBody - remains the same structure */}
				<PanelBody
					title={__("Pagination Settings", "your-textdomain")}
					initialOpen={false}
				>
					<SelectControl
						label={__("Pagination Type", "your-textdomain")}
						value={paginationType}
						options={[
							{
								label: __("Load More Button (AJAX)", "your-textdomain"),
								value: "loadmore",
							},
							{
								label: __("Standard Numbered Pages", "your-textdomain"),
								value: "number",
							},
							{
								label: __("Infinite Scroll (AJAX)", "your-textdomain"),
								value: "infinite",
							},
						]}
						onChange={(newType) => setAttributes({ paginationType: newType })}
					/>
					{paginationType === "infinite" && (
						<RangeControl
							label={__("Scroll Threshold (px)", "your-textdomain")}
							help={__(
								"Distance from the bottom to trigger auto-load.",
								"your-textdomain",
							)}
							value={scrollThreshold}
							onChange={(newValue) =>
								setAttributes({ scrollThreshold: newValue })
							}
							min={50}
							max={500}
							step={10}
						/>
					)}
					<RangeControl
						label={__("Categories Per Page", "your-textdomain")}
						value={categoriesToShow}
						disabled // Disabled since it's redundant with Categories to Show, but kept for preview calculation context
					/>
				</PanelBody>

				{/* ----------------------------------- */}

				{/* Image Settings PanelBody - remains the same structure */}
				<PanelBody title={__("Image Settings", "woo-builder")}>
					<SelectControl
						label={__("Select Image Size", "woo-builder")}
						value={imageSize}
						options={[
							{
								label: __("Thumbnail (150px)", "woo-builder"),
								value: "thumbnail",
							},
							{ label: __("Medium (300px)", "woo-builder"), value: "medium" },
							{ label: __("Large (1024px)", "woo-builder"), value: "large" },
							{ label: __("Full (Original)", "woo-builder"), value: "full" },
							{
								label: __("WooCommerce Thumbnail", "woo-builder"),
								value: "woocommerce_thumbnail",
							},
						]}
						onChange={(newSize) => setAttributes({ imageSize: newSize })}
					/>
					<SelectControl
						label={__("Missing Image Behavior", "woo-builder")}
						value={placeholderBehavior}
						options={[
							{
								label: __("Show Default Placeholder", "woo-builder"),
								value: "default_icon",
							},
							{
								label: __("Hide Missing Image Spot", "woo-builder"),
								value: "hide_placeholder",
							},
							{
								label: __("Use Custom Image URL", "woo-builder"),
								value: "custom_image",
							},
						]}
						onChange={(newBehavior) =>
							setAttributes({ placeholderBehavior: newBehavior })
						}
					/>
					{placeholderBehavior === "custom_image" && (
						<TextControl
							label={__("Custom Placeholder URL", "woo-builder")}
							value={customPlaceholderUrl}
							onChange={(newUrl) =>
								setAttributes({ customPlaceholderUrl: newUrl })
							}
							help={__("Enter the URL of your default image.", "woo-builder")}
						/>
					)}
				</PanelBody>
			</InspectorControls>

			{/* --- Block Preview Rendering (remains the same) --- */}
			<div
				className={`wp-block-woocommerce-categories-preview layout-${layoutStyle}`}
			>
				<h3 style={{ textAlign: "center" }}>
					{__("WooCommerce Product Categories Preview", "woo-builder")}
				</h3>
				<p style={{ textAlign: "center", fontSize: "12px", color: "#777" }}>
					**Layout:** {layoutStyle} | **Columns:** {columns} | **Showing:**{" "}
					{categoriesForPreview.length} of {totalCategories}{" "}
					{maxPages > 1 && `(Page 1 of ${maxPages})`}
				</p>

				{isLoading && (
					<CategorySkeleton
						count={parseInt(categoriesToShow) || 6}
						layoutStyle={layoutStyle}
						columns={columns}
					/>
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
					// This section shows the live preview of filtered categories
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
								{/* ... Category content preview (Image, Name, Count, Description) ... */}
								{showImage &&
									(category.image ? (
										<img
											src={category.image.thumbnail || category.image.src}
											alt={category.name}
											data-size={imageSize}
											style={{
												width: "100%",
												height: "auto",
												maxHeight: "100px",
												objectFit: "cover",
												marginBottom: "10px",
											}}
										/>
									) : (
										<CategoryPlaceholder
											behavior={placeholderBehavior}
											customUrl={customPlaceholderUrl}
											name={category.name}
											imageSize={imageSize}
										/>
									))}
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

				{/* --- Pagination Preview (remains the same) --- */}
				{!isLoading && maxPages > 1 && (
					<div style={{ marginTop: "20px", padding: "10px" }}>
						{paginationType === "loadmore" && (
							<button
								style={{
									display: "block",
									width: "250px",
									margin: "10px auto",
									padding: "10px 20px",
									backgroundColor: "#1e88e5",
									color: "white",
									border: "none",
									borderRadius: "4px",
									cursor: "pointer",
									fontWeight: "bold",
									opacity: 0.8,
								}}
								disabled
							>
								{__("Load More Categories (Preview)", "woo-builder")}
							</button>
						)}
						{paginationType === "infinite" && (
							<div
								style={{
									textAlign: "center",
									padding: "10px",
									fontSize: "14px",
									color: "#888",
								}}
							>
								<Spinner style={{ marginRight: "5px" }} />
								{__(
									"Infinite Scroll Active (Loading next page when user scrolls)",
									"woo-builder",
								)}
							</div>
						)}
						{paginationType === "number" && (
							<div
								style={{
									display: "flex",
									justifyContent: "center",
									gap: "5px",
								}}
							>
								<button
									disabled
									style={{
										padding: "8px 12px",
										border: "1px solid #ccc",
										background: "#f0f0f0",
									}}
								>
									&laquo;
								</button>
								<button
									disabled
									style={{
										padding: "8px 12px",
										border: "1px solid #ccc",
										background: "#007bff",
										color: "white",
									}}
								>
									1
								</button>
								{maxPages >= 2 && (
									<button
										disabled
										style={{
											padding: "8px 12px",
											border: "1px solid #ccc",
											background: "white",
										}}
									>
										2
									</button>
								)}
								{maxPages >= 3 && (
									<button
										disabled
										style={{
											padding: "8px 12px",
											border: "1px solid #ccc",
											background: "white",
										}}
									>
										3
									</button>
								)}
								{maxPages > 3 && <span>...</span>}
								<button
									disabled
									style={{
										padding: "8px 12px",
										border: "1px solid #ccc",
										background: "#f0f0f0",
									}}
								>
									&raquo;
								</button>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default Edit;
