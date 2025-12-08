jQuery(function ($) {

    const LOADER_HTML = `
        <div class="category-loading-indicator">
            <div class="loader-spinner"></div>
            <p>Loading more categories...</p>
        </div>`;

    // =========================================================================
    // 1. REUSABLE AJAX FUNCTION
    // =========================================================================
    const loadNextCategoryPage = (button) => {
        const container = $(button.data("container-selector"));
        let currentPage = parseInt(button.attr("data-current-page"));
        const maxPages = parseInt(button.attr("data-max-pages"));

        if (button.hasClass("loading") || currentPage >= maxPages) {
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
        return $.ajax({
            url: loadmore_params.ajax_url,
            data: data,
            type: 'POST',
            
            beforeSend: function (xhr) {
                button.addClass("loading");
                if (!button.hasClass('infinite-scroll-trigger')) {
                    button.hide();
                    $(LOADER_HTML).insertBefore(button);
                } else {
                    const container = $(button.data("container-selector"));
                    $(LOADER_HTML).insertAfter(container);
                }
            },

            success: function (response) {
                if (response.success && response.data.html) {
                    const list = container.find(".product-category-list");
                    list.append(response.data.html);
                    currentPage++;
                    button.attr("data-current-page", currentPage);
                }
                return response.success;
            },

            error: function (jqXHR, textStatus, errorThrown) {
                console.error("AJAX Error:", textStatus, errorThrown);
                if (!button.hasClass('infinite-scroll-trigger')) {
                    button.text("Error loading categories. Try again.");
                    button.show();
                }
            },
            
            complete: function () {
                $('.category-loading-indicator').remove(); 
                button.removeClass("loading");

                // Update button state (only for the clickable loadmore button)
                if (!button.hasClass('infinite-scroll-trigger')) {
                    const newPage = parseInt(button.attr("data-current-page"));
                    if (newPage >= maxPages) {
                        button.text("No More Categories");
                        button.remove();
                    } else {
                        button.text("Load More Categories");
                        button.show();
                    }
                }
            },
        });
    };

    // =========================================================================
    // 2. LOAD MORE CLICK HANDLER
    // =========================================================================
    $(".category-load-more-button:not(.infinite-scroll-trigger)").on("click", function (e) {
        e.preventDefault();
        loadNextCategoryPage($(this));
    });

    // =========================================================================
    // 3. INFINITE SCROLL HANDLER
    // =========================================================================
    const infiniteTriggers = $(".infinite-scroll-trigger");
    
    if (infiniteTriggers.length > 0) {
        infiniteTriggers.each(function() {
            const button = $(this);
            const container = $(button.data("container-selector"));
            let isLoadingScroll = false;

            const checkScroll = () => {
                const currentPage = parseInt(button.attr("data-current-page"));
                const maxPages = parseInt(button.attr("data-max-pages"));
                const threshold = parseInt(button.data("scroll-threshold")) || 100;

                if (isLoadingScroll || currentPage >= maxPages) {
                    if (currentPage >= maxPages) {
                         $(window).off('scroll', checkScroll);
                    }
                    return;
                }
                
                const containerBottom = container.get(0).getBoundingClientRect().bottom;
                const windowHeight = window.innerHeight;

                if (containerBottom < windowHeight + threshold) {
                    isLoadingScroll = true;
                    
                    loadNextCategoryPage(button)
                        .always(function() {
                            isLoadingScroll = false;
                        });
                }
            };

            $(window).on('scroll', checkScroll);
            checkScroll();
        });
    }

});