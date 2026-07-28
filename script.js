/**
 *  =========================================================================================
 *  🚀 AEROSTREET LANDING PAGE - INTERACTIVE SCRIPT
 *  =========================================================================================

 *  👤 Author       : Winanda Dev
 *  📅 Year         : 2026
 *  📦 Description  : Script utama untuk mengelola interaktivitas landing page Aerostreet.
 *                    Menghadirkan pengalaman pengguna yang dinamis dan responsif.

 *  ✨ FITUR UTAMA :
 *  ---------------------------------------------------------------------------------------
 *  1. 📱 Mobile Navigation   : Menu responsif dengan animasi smooth toggle & dropdown.
 *  2. 🏎️ Product Slider     : Konfigurasi Swiper.js dengan autoplay & breakpoints responsif.
 *  3. 🚚 Truck Animation    : Animasi tombol 'Add to Cart' (GSAP) & logika counter keranjang.
 *  4. 📅 Dynamic Utility    : Update tahun copyright otomatis di footer.
 *  5. ⚙️ Global Handlers    : Event resize window & kontrol tampilan credit developer.
 *  6. 🛡️ Content Protection : Blokir klik kanan & inspect element untuk keamanan.
 *  7. 🔔 Notification Popup : Logika notifikasi visual saat item ditambahkan.
 *  8. 💾 Scroll Restoration : Sistem restore posisi scroll & state animasi.
 *  9. 🎭 Scroll Animation   : Inisialisasi AOS (Animate On Scroll) dengan offset adaptif.

 *  🛠️ Library :
 *     - Swiper.js (Slider)
 *     - AOS (Animate On Scroll)
 *     - GSAP (GreenSock Animation Platform)

 *  =========================================================================================
 */

const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mobileDropdown = document.getElementById("mobileDropdown");

let cartItemCount = 0;
const cartCounter = document.getElementById("cartCounter");

/**
 * ============================================================================
 *  1. MOBILE NAVIGATION LOGIC
 *  Mengatur interaksi menu hamburger dan dropdown pada perangkat mobile.
 * ============================================================================
 */
mobileMenuBtn.addEventListener("click", function () {
    mobileMenuBtn.classList.toggle("active");
    
    if (mobileDropdown.classList.contains("active")) {
        mobileDropdown.classList.add("closing");
        
        setTimeout(function() {
            mobileDropdown.classList.remove("active");
            mobileDropdown.classList.remove("closing");
        }, 300);
    } else {
        mobileDropdown.classList.add("active");
    }
});

const mobileMenuLinks = document.querySelectorAll(".Mobile-Menu li a");
mobileMenuLinks.forEach((link) => {
    link.addEventListener("click", function () {
        mobileDropdown.classList.add("closing");
        mobileMenuBtn.classList.remove("active");
        
        setTimeout(function() {
            mobileDropdown.classList.remove("active");
            mobileDropdown.classList.remove("closing");
        }, 300);
    });
});

/**
 * ============================================================================
 *  2. PRODUCT SLIDER CONFIGURATION (SWIPER.JS)
 *  Inisialisasi carousel produk dengan setting responsif dan autoplay.
 * ============================================================================
 */
const swiper = new Swiper('.Products-Swiper', {
    // Optional parameters
    direction: 'horizontal',
    loop: true,
    slidesPerView: 3,
    spaceBetween: 30,
    observer: true,
    observeParents: true,

    // Perbaikan: Refresh AOS saat Swiper selesai inisialisasi
    on: {
        init: function() {
            setTimeout(function() {
                if (typeof AOS !== 'undefined') AOS.refresh();
            }, 500);
        }
    },

    // Autoplay configuration
    autoplay: {
        delay: 2000, // 2 detik
        disableOnInteraction: true, // Hentikan autoplay setelah interaksi pengguna
        pauseOnMouseEnter: true, // Jeda autoplay saat kursor berada di atas slider
    },

    // If we need pagination
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },

    // Navigation arrows
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },

    // Responsive breakpoints
    breakpoints: {
        // jika lebar layar >= 320px
        320: {
            slidesPerView: 1,
            spaceBetween: 20
        },
        // jika lebar layar >= 768px
        768: {
            slidesPerView: 2,
            spaceBetween: 20
        },
        // jika lebar layar >= 1024px
        1024: {
            slidesPerView: 3,
            spaceBetween: 30
        }
    }
});

/**
 * ============================================================================
 *  3. ADD TO CART ANIMATION (GSAP)
 *  Logika animasi tombol belanja:
 *  Kotak jatuh -> Truk jalan -> Update keranjang -> Reset tombol.
 * ============================================================================
 */
document.querySelectorAll('.truck-button').forEach(button => {
    button.addEventListener('click', e => {

        e.preventDefault();

        // Cek apakah ada tombol lain animasi truk sedang berjalan
        if (document.querySelector('.truck-button.animation')) {
            return;
        }

        let box = button.querySelector('.box'),
            truck = button.querySelector('.truck');
        
        if(!button.classList.contains('done')) {
            
            if(!button.classList.contains('animation')) {

                // Hentikan autoplay Swiper saat animasi tombol dimulai
                swiper.autoplay.stop();

                button.classList.add('animation');

                document.querySelectorAll('.Product-Card').forEach(card => {
                    card.style.cursor = 'wait';
                });

                document.querySelectorAll('.truck-button').forEach(btn => {
                    btn.style.cursor = 'wait';
                });

                gsap.to(button, {
                    '--box-s': 1,
                    '--box-o': 1,
                    duration: .3,
                    delay: .5
                });

                gsap.to(box, {
                    x: 0,
                    duration: .4,
                    delay: .7
                });

                gsap.to(button, {
                    '--hx': -5,
                    '--bx': 50,
                    duration: .18,
                    delay: .92
                });

                gsap.to(box, {
                    y: 0,
                    duration: .1,
                    delay: 1.15
                });

                gsap.set(button, {
                    '--truck-y': 0,
                    '--truck-y-n': -26
                });

                gsap.to(button, {
                    '--truck-y': 1,
                    '--truck-y-n': -25,
                    duration: .2,
                    delay: 1.25,
                    onComplete() {
                        gsap.timeline({
                            onComplete() {
                                button.classList.add('done');

                                // Efek goyang pada ikon keranjang di navbar
                                const cartIcon = document.querySelector('.Cart .Cart-Icon');
                                if (cartIcon) {
                                    cartIcon.classList.add('cart-shake');
                                    setTimeout(() => cartIcon.classList.remove('cart-shake'), 500);
                                }

                                // Tampilkan notifikasi popup box
                                showAddedToCartNotification();

                                // Update cart counter
                                cartItemCount++;
                                if (cartCounter) {
                                    cartCounter.textContent = cartItemCount > 99 ? "99+" : cartItemCount;
                                    if (!cartCounter.classList.contains('visible')) {
                                        cartCounter.classList.add('visible');
                                    }
                                }

                                // 1. Get the button's current height
                                const buttonHeight = button.offsetHeight;
                                // 2. Lock the height to prevent it from collapsing
                                button.style.height = `${buttonHeight}px`; // Lock height
                                button.style.position = 'relative'; // Set as positioning context
                                if (button.revertTimeout) {
                                    clearTimeout(button.revertTimeout);
                                }
                                let defaultSpan = button.querySelector('.default');
                                if (defaultSpan) {
                                    defaultSpan.outerHTML = `<span class="success" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); display: flex; align-items: center; justify-content: center; white-space: nowrap;">
                                        Cart Placed
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 10" style="width: 12px; height: 10px; margin-left: 8px; transform: translateY(-2px); fill: none; stroke: #198754; stroke-width: 2px; stroke-linecap: round; stroke-linejoin: round; flex-shrink: 0;">
                                            <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                                        </svg>
                                    </span>`;
                                }
                                button.revertTimeout = setTimeout(() => {
                                    if (button.classList.contains('done')) {
                                        let successSpan = button.querySelector('.success');
                                        if (successSpan) {
                                            successSpan.outerHTML = `<span class="default" style="display: inline-flex; align-items: center; gap: 8px;">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none"
                                                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                                    class="lucide lucide-shopping-cart w-5 h-5 transition-transform group-hover:scale-110" aria-hidden="true">
                                                    <circle cx="8" cy="21" r="1"></circle>
                                                    <circle cx="19" cy="21" r="1"></circle>
                                                    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
                                                </svg>
                                                <span>Add to Cart</span>
                                            </span>`;
                                        }
                                        button.classList.remove('animation', 'done');
                                        // 3. Remove the locked height when reverting
                                        button.style.height = ''; // Unlock height
                                        button.style.position = ''; // Remove positioning context
                                        document.querySelectorAll('.Product-Card').forEach(card => {
                                            card.style.removeProperty('cursor');
                                        });
                                        document.querySelectorAll('.truck-button').forEach(btn => {
                                            btn.style.removeProperty('cursor');
                                        });
                                        gsap.set(truck, { x: 4 });
                                        // Mulai kembali autoplay Swiper setelah animasi selesai
                                        swiper.autoplay.start();
                                        gsap.set(button, { '--progress': 0, '--hx': 0, '--bx': 0, '--box-s': .5, '--box-o': 0, '--truck-y': 0, '--truck-y-n': -26 });
                                        gsap.set(box, { x: -24, y: -6 });
                                    }
                                }, 2000);
                            }
                        }).to(truck, { x: 0, duration: .4 })
                        .to(truck, { x: button.offsetWidth * 0.4, duration: 1 })
                        .to(truck, { x: button.offsetWidth * 0.25, duration: .6 })
                        .to(truck, { x: button.offsetWidth * 0.73, duration: .4 });
                        gsap.to(button, { '--progress': 1, duration: 2.4, ease: "power2.in" });
                    }
                });
            }
        }
    });
});

/**
 * ============================================================================
 *  4. UTILITY & DYNAMIC DATA
 *  Fungsi-fungsi pembantu untuk data dinamis (Tahun Copyright).
 * ============================================================================
 */
const Year = document.getElementById('copyright-year');
if (Year) {
    Year.textContent = new Date().getFullYear();
}

/**
 * ============================================================================
 *  5. GLOBAL EVENT HANDLERS
 *  Listener untuk resize window dan scroll (Responsive adjustments).
 * ============================================================================
 */
window.addEventListener('resize', function() {
    if (swiper) {
        swiper.update();
        if (!document.querySelector('.truck-button.animation')) {
            swiper.autoplay.start();
        }
    }
    // Beri sedikit jeda agar refresh dilakukan setelah layout benar-benar stabil
    setTimeout(function() {
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }, 200);
});

// Logika untuk menyembunyikan credit developer saat footer terlihat
window.addEventListener('scroll', function() {
    const footerSection = document.querySelector('.Footer-Section');
    const devCredit = document.querySelector('.Dev-Credit');

    if (!footerSection || !devCredit) return;

    const footerTop = footerSection.offsetTop;
    const windowBottom = window.scrollY + window.innerHeight;

    if (windowBottom > footerTop) {
        devCredit.style.display = 'none';
    } else {
        devCredit.style.display = 'block';
    }
});

/**
 * ============================================================================
 *  6. CONTENT PROTECTION (ANTI-INSPECT)
 *  Mencegah klik kanan dan shortcut keyboard untuk Developer Tools.
 * ============================================================================
 */
document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});

document.addEventListener('keydown', function (e) {
    // Mencegah tombol F12
    if (e.keyCode === 123) {
        e.preventDefault();
    }
    // Mencegah Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
    if (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) {
        e.preventDefault();
    }
    // Mencegah Ctrl+U (View Source)
    if (e.ctrlKey && e.keyCode === 85) {
        e.preventDefault();
    }
});

/**
 * ============================================================================
 *  7. NOTIFICATION POPUP LOGIC
 *  Menampilkan box notifikasi saat barang masuk keranjang.
 * ============================================================================
 */
function showAddedToCartNotification() {
    let notification = document.querySelector('.cart-notification');
    
    // Jika elemen belum ada, buat secara dinamis dan masukkan ke body
    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <div class="cart-notification-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
            </div>
            <span class="cart-notification-text">Ditambahkan ke keranjang</span>
        `;
        document.body.appendChild(notification);
    }
    
    // Reset animasi (trigger reflow) agar animasi bisa diputar ulang
    notification.classList.remove('show');
    void notification.offsetWidth; 
    
    // Tampilkan notifikasi
    notification.classList.add('show');
    
    // Hapus timeout sebelumnya jika ada
    if (notification.hideTimeout) clearTimeout(notification.hideTimeout);
    
    // Sembunyikan otomatis setelah 2 detik
    notification.hideTimeout = setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}

/**
 * ============================================================================
 *  8. CART SCROLL RESTORATION SYSTEM
 *  Menyimpan posisi scroll terakhir saat klik Cart, dan mengembalikannya
 *  saat user kembali ke halaman ini.
 * ============================================================================
 */

// Konfigurasi agar saat refresh manual posisi scroll kembali ke atas
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// Simpan posisi scroll saat klik Cart
const navCartLink = document.querySelector('.Cart a[href="cart.html"]');
if (navCartLink) {
    navCartLink.addEventListener('click', function() {
        sessionStorage.setItem('aerostreet_scrollPos', window.scrollY);
        
        // Simpan index elemen yang sudah teranimasi (memiliki class aos-animate)
        const animatedIndices = [];
        document.querySelectorAll('[data-aos]').forEach((el, index) => {
            if (el.classList.contains('aos-animate')) {
                animatedIndices.push(index);
            }
        });
        sessionStorage.setItem('aerostreet_animatedIndices', JSON.stringify(animatedIndices));
    });
}

// Restore state animasi AOS jika user kembali dari halaman cart
const preRestoreIndices = JSON.parse(sessionStorage.getItem('aerostreet_animatedIndices') || '[]');
const preRestoreScroll = sessionStorage.getItem('aerostreet_scrollPos');

// Scroll segera setelah script dieksekusi untuk mencegah kedipan (blink) ke posisi atas
if (preRestoreScroll) {
    window.scrollTo({ top: parseInt(preRestoreScroll), behavior: 'instant' });
}

if (preRestoreScroll && preRestoreIndices.length > 0) {
    document.querySelectorAll('[data-aos]').forEach((el, index) => {
        if (preRestoreIndices.includes(index)) {
            el.classList.add('aos-animate');
            el.style.setProperty('transition-duration', '0s', 'important');
            el.style.setProperty('transition-delay', '0s', 'important');
        }
    });
}

/**
 * ============================================================================
 *  9. ANIMATE ON SCROLL (AOS) SETUP
 *  Konfigurasi animasi scroll dengan penyesuaian untuk berbagai ukuran layar.
 *  (Moved here to run after restoration logic)
 * ============================================================================
 */
var screenWidth = window.innerWidth;

// Untuk device destop
var aosOffset = 100;
var aosDuration = 1000;

// Untuk device mobile
if (screenWidth < 768) {
    aosOffset = 50;
    aosDuration = 600;
// Untuk device tablet
} else if (screenWidth >= 768 && screenWidth <= 1024) {
    aosOffset = 80;
    aosDuration = 800;
}

AOS.init({
    duration: aosDuration,
    once: true,
    offset: aosOffset,
    easing: 'ease-out-cubic',
    anchorPlacement: 'top-bottom'
});

window.addEventListener('load', function() {
    AOS.refresh();
    const savedScrollPos = sessionStorage.getItem('aerostreet_scrollPos');
    const savedAnimatedIndices = JSON.parse(sessionStorage.getItem('aerostreet_animatedIndices') || '[]');

    // Jika ada posisi tersimpan dan user datang dari halaman cart
    if (savedScrollPos) {
        // Gunakan behavior 'instant' agar terasa tidak di-refresh (langsung lompat)
        window.scrollTo({ top: parseInt(savedScrollPos), behavior: 'instant' });
        
        // Restore status animasi AOS
        const aosElements = document.querySelectorAll('[data-aos]');
        const windowHeight = window.innerHeight;

        aosElements.forEach((el, index) => {
            const rect = el.getBoundingClientRect();
            // Jika elemen sudah teranimasi sebelumnya ATAU berada di viewport/di atasnya saat ini
            const shouldSkip = savedAnimatedIndices.includes(index) || (rect.top < windowHeight);

            if (shouldSkip) {
                el.classList.add('aos-animate');
                // Disable transisi sesaat agar instan
                el.style.setProperty('transition-duration', '0s', 'important');
                el.style.setProperty('transition-delay', '0s', 'important');
                
                setTimeout(() => {
                    el.style.removeProperty('transition-duration');
                    el.style.removeProperty('transition-delay');
                }, 500);
            }
        });

        // Force refresh AOS untuk sinkronisasi
        setTimeout(() => {
            if (typeof AOS !== 'undefined') AOS.refresh();
        }, 100);

        // Bersihkan data setelah dipakai agar tidak mengganggu
        sessionStorage.removeItem('aerostreet_scrollPos');
        sessionStorage.removeItem('aerostreet_animatedIndices');
    } else {
        // Jika user melakukan refresh manual (tidak ada data posisi tersimpan), paksa ke atas
        window.scrollTo(0, 0);
    }
});