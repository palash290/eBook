$(document).ready(function () {
  AOS.init();

  $(".ct_open_menu").click(function () {
    $(".ct_nav_menu_list").addClass("ct_menu_show");
  });
  $(".ct_close_menu").click(function () {
    $(".ct_nav_menu_list").removeClass("ct_menu_show");
  });

  // $(".ct_top_author_slider").owlCarousel({
  //   loop: true,
  //   margin: 10,
  //   nav: true,
  //   responsive: {
  //     0: {
  //       items: 1,
  //     },
  //     600: {
  //       items: 2,
  //     },
  //     1356: {
  //       items: 3,
  //     },
  //   },
  // });
  // $(".ct_top_selling_book_slider").owlCarousel({
  //   loop: true,
  //   margin: 10,
  //   nav: true,
  //   center: true,
  //   responsive: {
  //     0: {
  //       items: 1,
  //     },
  //     600: {
  //       items: 2,
  //     },
  //     1000: {
  //       items: 5,
  //     },
  //   },
  // });

  // Product Detail Slider js S
  // var owl = $(".ct_product_detail_slider");

  // owl.owlCarousel({
  //   items: 1,
  //   loop: true,
  //   autoplay: false,
  //   autoplayTimeout: 3000,
  //   dots: false, // Disable default dots
  //   nav: false,
  // });

  // // Custom Dots Click Event
  // $(".ct_dot").click(function () {
  //   var slideIndex = $(this).data("slide");
  //   owl.trigger("to.owl.carousel", [slideIndex, 300]);
  // });

  // // Update Active Dot on Slide Change
  // owl.on("changed.owl.carousel", function (event) {
  //   var currentIndex =
  //     event.item.index - event.relatedTarget._clones.length / 2;
  //   $(".ct_dot").removeClass("active");
  //   $(".ct_dot").eq(currentIndex).addClass("active");
  // });

  // Set initial active dot
  // $(".ct_dot").eq(0).addClass("active");
  // Product Detail Slider js E

  $(".chat-list a").click(function () {
    $(".chatbox").addClass("showbox");
    return false;
  });

  $(".chat-icon").click(function () {
    $(".chatbox").removeClass("showbox");
  });
});
document.addEventListener("DOMContentLoaded", function () {
  const swiper = new Swiper(".mySwiper", {
    spaceBetween: 15,
    slidesPerView: 5,
    loop: true,
    autoplay: {
      delay: 0, // No delay between transitions
      disableOnInteraction: false,
    },
    allowTouchMove: false,
    speed: 3000,

    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      320: { slidesPerView: 1, spaceBetween: 10 }, // Mobile screens
      480: { slidesPerView: 2, spaceBetween: 10 }, // Small tablets
      768: { slidesPerView: 3, spaceBetween: 15 }, // Tablets
      1024: { slidesPerView: 3, spaceBetween: 20 }, // Small desktops
      1300: { slidesPerView: 4, spaceBetween: 20 }, // Large desktops
      1500: { slidesPerView: 5, spaceBetween: 20 }, // Large desktops
    },
  });
});

function updateProgress(step) {
  const steps = document.querySelectorAll(".progress-step");
  const progressFill = document.getElementById("progressFill");
  steps.forEach((stepElement, index) => {
    if (index < step) {
      stepElement.classList.add("active");
    } else {
      stepElement.classList.remove("active");
    }
  });
  progressFill.style.width = `${((step - 1) / (steps.length - 1)) * 100}%`;
}

// Simulating step updates
// let currentStep = 1;
// setInterval(() => {
//   if (currentStep <= 4) {
//     updateProgress(currentStep);
//     currentStep++;
//   }
// }, 2000);

$(window).scroll(function () {
  var scroll = $(window).scrollTop();

  //>=, not <=
  if (scroll >= 50) {
    //clearHeader, not clearheader - caps H
    $("header").addClass("ct_sticky_menu");
  } else {
    $("header").removeClass("ct_sticky_menu");
  }
}); //missing );

$(window).on("load", function () {
  $(".ct_loader_main").fadeOut();
});

$(document).ready(function () {
  $(".ct_notification_click").click(function (event) {
    event.stopPropagation();
    $(".ct_notification_custom_dropdown").removeClass("ct_notification_active");
    $(this)
      .next(".ct_notification_custom_dropdown")
      .toggleClass("ct_notification_active");
  });

  $(document).click(function (event) {
    if (!$(event.target).closest(".ct_notification_custom_dropdown").length) {
      $(".ct_notification_custom_dropdown").removeClass(
        "ct_notification_active"
      );
    }
  });
});
