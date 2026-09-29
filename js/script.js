(function ($) {
  "use strict";

  var PRODUCTS = [
    { title: "Сursus nunc", subtitle: "blandit vel" },
    { title: "augue velit", subtitle: "luctus pulvinar" },
    { title: "bibendum sodales", subtitle: "hendrerit id" },
    { title: "bibendum sodales", subtitle: "hendrerit id" },
  ];

  var MOBILE_MQ = window.matchMedia("(max-width: 992px)");

  var servicesSwiper = null;
  var productsSwiper = null;
  var productGallerySwiper = null;
  var mapReady = false;

  function lockBody(lock) {
    $("body").toggleClass("is-locked", !!lock);
  }

  /* ---------- мобильное меню ---------- */
  function openMobileMenu() {
    closeTopbarDropdowns();
    $("#header").addClass("is-menu-open");
    $("#mobile-menu").addClass("is-open").attr("aria-hidden", "false");
    $(".burger")
      .addClass("is-active")
      .attr({ "aria-expanded": "true", "aria-label": "Закрыть меню" });
    lockBody(true);
  }

  function closeMobileMenu() {
    if (!$("#mobile-menu").hasClass("is-open")) {
      return;
    }

    $("#header").removeClass("is-menu-open");
    $("#mobile-menu").removeClass("is-open").attr("aria-hidden", "true");
    $(".burger")
      .removeClass("is-active")
      .attr({ "aria-expanded": "false", "aria-label": "Открыть меню" });

    if ($(".popup:not([hidden])").length === 0) {
      lockBody(false);
    }
  }

  /* ---------- дропдауны ---------- */
  function closeTopbarDropdowns() {
    $(".topbar__group.is-open").each(function () {
      $(this).removeClass("is-open");
      $(this).find(".topbar__trigger").attr("aria-expanded", "false");
    });
  }

  /* ---------- попапы ---------- */
  function openPopup(id) {
    var $popup = $("#" + id);

    closeMobileMenu();
    closeTopbarDropdowns();

    $(".popup").attr("hidden", true);
    $popup.removeAttr("hidden");

    lockBody(true);

    if (id === "popup-product" && productGallerySwiper) {
      productGallerySwiper.update();
    }

    $popup.find("[data-close-popup]").first().trigger("focus");
  }

  function closePopups() {
    $(".popup").attr("hidden", true);

    if (!$("#mobile-menu").hasClass("is-open")) {
      lockBody(false);
    }
  }

  function fillProductPopup(index) {
    var product = PRODUCTS[index] || PRODUCTS[0];
    var $popup = $("#popup-product");

    $popup.find(".popup-product__title").text(product.title);
    $popup.find(".popup-product__subtitle").text(product.subtitle);
    $popup.find(".qty__value").text("1");
    $popup
      .find(".product__size")
      .removeClass("is-active")
      .first()
      .addClass("is-active");

    if (productGallerySwiper) {
  productGallerySwiper.slideToLoop(0, 0);
}
  }

  /* ---------- слайдеры ---------- */
  function initServicesSwiper() {
    if (typeof Swiper === "undefined") {
      return;
    }

    servicesSwiper = new Swiper(".services-swiper", {
      slidesPerView: 1.161,
      spaceBetween: 20,
      watchOverflow: true,
      grabCursor: true,
      preventClicks: false,
      preventClicksPropagation: false,
      navigation: {
        nextEl: ".js-services-next",
        prevEl: ".js-services-prev",
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        1100: {
          slidesPerView: 3,
          spaceBetween: 24,
        },
      },
    });
  }

  function initProductsSwiper() {
    if (typeof Swiper === "undefined") {
      return;
    }

    productsSwiper = new Swiper(".products-swiper", {
      slidesPerView: 1.145,
      spaceBetween: 20,
      watchOverflow: true,
      grabCursor: true,
      preventClicks: false,
      preventClicksPropagation: false,
      breakpoints: {
        600: {
          slidesPerView: 1.6,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 2.15,
          spaceBetween: 24,
        },
        1100: {
          slidesPerView: 3,
          spaceBetween: 32,
        },
        1500: {
          slidesPerView: 4,
          spaceBetween: 42,
        },
      },
    });
  }

  function initProductGallery() {
    if (typeof Swiper === "undefined") {
      return;
    }

    productGallerySwiper = new Swiper(".product-gallery-swiper", {
      slidesPerView: 1,
      loop: true,
      navigation: {
        nextEl: ".popup-product__arrow--next",
        prevEl: ".popup-product__arrow--prev",
      },
      pagination: {
        el: ".popup-product__pagination",
        clickable: true,
        bulletElement: "button",
        bulletClass: "popup-product__bullet",
        bulletActiveClass: "popup-product__bullet--active",
      },
    });
  }

  /* ---------- Инициализация ---------- */
  $(function () {
    initServicesSwiper();
    initProductsSwiper();
    initProductGallery();

    /* панель выезжает вниз по клику на бургер */
    $(".burger").on("click", function () {
      if ($("#mobile-menu").hasClass("is-open")) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    $("[data-menu-close], .mobile-menu__link").on("click", closeMobileMenu);

    /* aккордеон контактов в мобильном меню */
    $(".mobile-accordion__trigger").on("click", function () {
      var $item = $(this).closest(".mobile-accordion");
      var opening = !$item.hasClass("is-open");

      $(".mobile-accordion")
        .removeClass("is-open")
        .find(".mobile-accordion__trigger")
        .attr("aria-expanded", "false");

      if (opening) {
        $item.addClass("is-open");
        $(this).attr("aria-expanded", "true");
      }
    });

    /* плавные тёмно-синие дропдауны */
    $(".topbar__trigger[data-dropdown]").on("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      var $trigger = $(this);
      var $group = $trigger.closest(".topbar__group");
      var wasOpen = $group.hasClass("is-open");

      closeTopbarDropdowns();

      if (!wasOpen) {
        $group.addClass("is-open");
        $trigger.attr("aria-expanded", "true");
      }
    });

    $(document).on("click", closeTopbarDropdowns);

    $(".topbar__dropdown").on("click", function (e) {
      e.stopPropagation();
    });

    /* Попапы */
    $(document).on("click", "[data-popup]", function (e) {
      e.preventDefault();
      var type = $(this).data("popup");

      if (type === "product") {
        fillProductPopup(Number($(this).data("product-index")) || 0);
        openPopup("popup-product");
        return;
      }

      if (type === "callback") {
        openPopup("popup-callback");
      }
    });

    $(document).on("click", "[data-open-callback-from-product]", function () {
      openPopup("popup-callback");
    });

    $(document).on("click", "[data-close-popup]", closePopups);

    $(document).on("keydown", function (e) {
      if (e.key === "Escape") {
        closePopups();
        closeMobileMenu();
        closeTopbarDropdowns();
      }
    });

    $(document).on("click", ".product__size", function () {
      $(this).siblings().removeClass("is-active");
      $(this).addClass("is-active");
    });

    $(document).on("click", "[data-qty]", function () {
      var delta = Number($(this).data("qty"));
      var $value = $(this).siblings(".qty__value");
      var current = Number($value.text()) || 1;
      $value.text(Math.max(1, current + delta));
    });

    $("#callback-form").on("submit", function (e) {
      e.preventDefault();
      var $form = $(this);
      var name = $.trim($form.find('[name="name"]').val());
      var phone = $.trim($form.find('[name="phone"]').val());

      if (!name || !phone) {
        window.alert("Заполните имя и телефон");
        return;
      }

      window.alert("Спасибо! Мы перезвоним вам.");
      $form[0].reset();
      closePopups();
    });

    /* При переходе на десктоп закрываем мобильное меню */
    var onBreakpointChange = function (e) {
      if (!e.matches) {
        closeMobileMenu();
      }
    };

    if (MOBILE_MQ.addEventListener) {
      MOBILE_MQ.addEventListener("change", onBreakpointChange);
    } else if (MOBILE_MQ.addListener) {
      MOBILE_MQ.addListener(onBreakpointChange);
    }
  });
})(jQuery);
