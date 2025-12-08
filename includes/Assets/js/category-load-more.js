jQuery(function ($) {
	$(".category-load-more-button").on("click", function (e) {
		e.preventDefault();

		const button = $(this);
		const container = $(button.data("container-selector"));
		let currentPage = parseInt(button.attr("data-current-page"));
		const maxPages = parseInt(button.attr("data-max-pages"));

		// Prevent double clicking while loading
		if (button.hasClass("loading")) {
			return;
		}

		// Prepare data for AJAX
		const data = {
			action: loadmore_params.action_hook,
			security: loadmore_params.nonce,
			query_args: button.attr("data-query-args"),
			current_page: currentPage,
            display_attributes: button.attr("data-display-attrs"),
		};
		// AJAX Request

		$.ajax({
			url: loadmore_params.ajax_url,
			data: data,
			type: 'POST',
			beforeSend: function (xhr) {
				button.text("Loading...");
				button.addClass("loading");
			},

			success: function (response) {
				if (response.success && response.data.html) {
					// Append the new categories to the container
                    const list = container.find(".product-category-list");
					list.append(response.data.html);
					// Update the page count
					currentPage++;
					button.attr("data-current-page", currentPage);
					// Check if all pages have been loaded
					if (currentPage >= maxPages) {
						button.remove(); // Remove the button if it's the last page
					} else {
						button.text("Load More Categories");
					}
				} else {
					button.text("No More Categories");
					button.remove();
				}
			},

			error: function (jqXHR, textStatus, errorThrown) {
				console.error("AJAX Error:", textStatus, errorThrown);
				button.text("Error loading categories. Try again.");
				button.removeClass("loading");
			},
			complete: function () {
				button.removeClass("loading");
			},
		});
	});
});
