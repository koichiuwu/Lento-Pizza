document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Глобальне налаштування (дані прокручування та кошика) ---
    const headerOffset = 80;
    
    // Кошик (масив об'єктів)
    let cart = [];

    // --- 2. Логіка КОШИКА ---
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartCloseBtn = document.getElementById('close-cart-sidebar');
    // Кнопка в хедері (знаходимо по класу .cart-btn)
    const cartTriggerBtn = document.querySelector('.cart-btn'); 
    
    const cartItemsList = document.getElementById('cart-items-list');
    const cartEmptyMsg = document.getElementById('cart-empty-msg');
    const cartTotalPrice = document.getElementById('cart-total-price');

    // Відкриття кошика
    function openCart() {
        if(cartSidebar) {
            cartSidebar.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
    }

    // Закриття кошика
    function closeCart() {
        if(cartSidebar) {
            cartSidebar.classList.remove('open');
            document.body.style.overflow = '';
        }
    }

    // Слухачі для кошика
    if(cartTriggerBtn) cartTriggerBtn.addEventListener('click', openCart);
    if(cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);
    if(cartOverlay) cartOverlay.addEventListener('click', closeCart);

    // --- Додати товар в масив ---
    function addToCart(product) {
        cart.push(product);
        renderCart(); // Перемальовуємо кошик
        
        // Відкриваємо кошик автоматично, щоб користувач бачив результат
        openCart(); 
    }

    // --- Видалити товар ---
    window.removeCartItem = function(index) {
        cart.splice(index, 1); // Видаляємо елемент за індексом
        renderCart();
    }

    // --- Відмалювати товари ---
    function renderCart() {
        if (!cartItemsList) return;

        // Очищаємо список
        cartItemsList.innerHTML = '';

        if (cart.length === 0) {
            cartItemsList.appendChild(cartEmptyMsg);
            cartEmptyMsg.style.display = 'block';
            cartTotalPrice.innerText = '0 ₴';
            return;
        } else {
            cartEmptyMsg.style.display = 'none'; // Ховаємо повідомлення "порожньо"
        }

        let total = 0;

        // Генеруємо HTML для кожного товару
        cart.forEach((item, index) => {
            total += item.price;

            const itemHTML = document.createElement('div');
            itemHTML.classList.add('cart-item');
            itemHTML.innerHTML = `
                <img src="${item.img}" alt="${item.title}" class="cart-item-img">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-desc">${item.desc}</div>
                </div>
                <div style="text-align: right;">
                    <div class="cart-item-price">${item.price} ₴</div>
                    <button class="cart-remove-btn" onclick="removeCartItem(${index})">Видалити</button>
                </div>
            `;
            cartItemsList.appendChild(itemHTML);
        });

        cartTotalPrice.innerText = `${total} ₴`;
        
        // Оновлюємо лічильник на кнопці кошика
        const cartBtnHeader = document.querySelector('.cart-btn');
        if(cartBtnHeader) {
            if(cart.length > 0) cartBtnHeader.innerText = `Кошик (${cart.length})`;
            else cartBtnHeader.innerText = `Кошик`;
        }
        // Оновлення лічильника в нижньому меню при додаванні товару (Для мобілок)
            const mobileCount = document.querySelector('.mobile-cart-count');
    if(mobileCount) {
        mobileCount.innerText = cart.length;
        if(cart.length > 0) mobileCount.style.display = 'flex';
        else mobileCount.style.display = 'none';
    }

    }

    // --- 3. ЛОГІКА МОДАЛКИ ТОВАРУ ---
    const productModal = document.getElementById('product-modal');
    
    // Вага піци
    const pizzaWeights = {
        '20 см': '300',
        '25 см': '400',
        '30 см': '500',
        '35 см': '650'
    };

    if (productModal) {
        // Елементи модалки, які ми будемо змінювати
        const modalTitle = document.querySelector('.modal-title');
        const modalImg = document.getElementById('modal-img');
        const modalDesc = document.querySelector('.modal-description');
        const modalSubtitle = document.querySelector('.modal-subtitle');
        const addToCartBtn = document.querySelector('.add-to-cart-btn');
        const productCloseBtn = document.getElementById('close-modal');
        const productOpenBtns = document.querySelectorAll('.btn-select');

        // Функція відкриття
        const openProductModal = (e) => {
            // 1. Отримуємо кнопку, на яку натиснули
            const btn = e.currentTarget;

            // 2. Зчитуємо дані з data-атрибутів
            const title = btn.getAttribute('data-title');
            const imgSrc = btn.getAttribute('data-img');
            const desc = btn.getAttribute('data-desc');
            const price = btn.getAttribute('data-price');

            // 3. Підставляємо ці дані у модальне вікно
            if(modalTitle) modalTitle.innerText = title || "Піца";
            if(modalImg) modalImg.src = imgSrc || "https://placehold.co/540x540";
            if(modalDesc) modalDesc.innerText = desc || "Опис відсутній";
            
            // Скидаємо селектори на початковий стан (30 см / Традиційне)
            resetSelectors();

            // Відкриваємо вікно
            productModal.classList.add('open');
            document.body.style.overflow = 'hidden';
            resetAddToCartButton();
        };

        const closeProductModal = () => {
            productModal.classList.remove('open');
            document.body.style.overflow = '';
        };

        // Функція скидання селекторів (щоб при відкритті нової піци було 30см)
        function resetSelectors() {
            // Знаходимо всі кнопки
            const sizeBtns = document.querySelectorAll('.size-selector .selector-item');
            const doughBtns = document.querySelectorAll('.dough-selector .selector-item');
            
            // Видаляємо клас active у всіх
            sizeBtns.forEach(b => b.classList.remove('active'));
            doughBtns.forEach(b => b.classList.remove('active'));

            // Робимо активними дефолтні
            // Індекс 2 = 30 см
            if(sizeBtns[2]) sizeBtns[2].classList.add('active'); 
            if(doughBtns[0]) doughBtns[0].classList.add('active');

            // Оновлюємо бігунки та текст опису
            updateSelectorPosition('size-selector', 'size-highlighter');
            updateSelectorPosition('dough-selector', 'dough-highlighter');
            updateProductDescription();
        }

        // --- ДИНАМІЧНИЙ ОПИС ---
        function getSelectedOptions() {
            const activeSizeBtn = document.querySelector('.size-selector .selector-item.active');
            const activeDoughBtn = document.querySelector('.dough-selector .selector-item.active');
            return {
                size: activeSizeBtn ? activeSizeBtn.innerText : '30 см',
                dough: activeDoughBtn ? activeDoughBtn.innerText : 'Традиційне тісто'
            };
        }

        function updateProductDescription() {
            const options = getSelectedOptions();
            if (modalSubtitle) {
                const weight = pizzaWeights[options.size] || '500';
                modalSubtitle.innerText = `${options.size}, ${options.dough.toLowerCase()}, ${weight} г`;
            }
        }

        // --- ДОДАВАННЯ В КОШИК ---
        function handleAddToCart() {
            if (!addToCartBtn) return;

            const options = getSelectedOptions();
            // Тут ми беремо вже оновлені дані з модалки
            const productToAdd = {
                title: modalTitle.innerText, 
                img: modalImg.src,
                desc: `${options.size}, ${options.dough}`,
                price: 200
            };

            addToCart(productToAdd);

            // Анімація кнопки
            const originalText = addToCartBtn.innerText;
            addToCartBtn.innerText = "Додано ✔";
            addToCartBtn.classList.add('added');

            const cartBtnHeader = document.querySelector('.cart-btn');
            if (cartBtnHeader) {
                cartBtnHeader.classList.remove('cart-shake');
                void cartBtnHeader.offsetWidth; 
                cartBtnHeader.classList.add('cart-shake');
            }

            setTimeout(() => {
                resetAddToCartButton(originalText);
            }, 1500);
        }

        function resetAddToCartButton(text = "Додати до кошика") {
            if (addToCartBtn) {
                addToCartBtn.innerText = text;
                addToCartBtn.classList.remove('added');
            }
        }

        // ПІДКЛЮЧЕННЯ ПОДІЙ
        productOpenBtns.forEach(btn => btn.addEventListener('click', (e) => openProductModal(e)));
        
        if(productCloseBtn) productCloseBtn.addEventListener('click', closeProductModal);
        productModal.addEventListener('click', (e) => {
            if (e.target === productModal) closeProductModal();
        });

        if(addToCartBtn) addToCartBtn.addEventListener('click', handleAddToCart);

        // Ініціалізація селекторів
        setupSelector('size-selector', 'size-highlighter', true);
        setupSelector('dough-selector', 'dough-highlighter', true);
    }

    // --- 4. Логіка АВТОРИЗАЦІЇ---
    const authModal = document.getElementById('auth-modal');
    const authContainer = document.getElementById('auth-action-container');
    const closeAuthBtn = document.getElementById('close-auth');

    if (localStorage.getItem('isLoggedIn') === 'true') renderLoggedInState();

    if (authContainer) {
        authContainer.addEventListener('click', (e) => {
            if(e.target.id === 'open-auth-btn' || e.target.id === 'open-register-btn') {
                if(authModal) {
                    authModal.classList.add('open');
                    document.body.style.overflow = 'hidden';
                    showStep(1);
                }
            }
            if(e.target.id === 'logout-btn') logoutUser();
        });
    }
    if (closeAuthBtn) {
        closeAuthBtn.addEventListener('click', () => {
            authModal.classList.remove('open');
            document.body.style.overflow = '';
        });
    }
    if(authModal) {
        authModal.addEventListener('click', (e) => {
            if(e.target === authModal) {
                authModal.classList.remove('open');
                document.body.style.overflow = '';
            }
        });
    }
    // Кнопки всередині автентифікації
    const btnGetCode = document.getElementById('btn-get-code');
    const btnVerify = document.getElementById('btn-verify-code');
    const btnBack = document.getElementById('btn-auth-back');
    const btnFinish = document.getElementById('btn-finish-auth');

    if(btnGetCode) btnGetCode.addEventListener('click', () => showStep(2));
    if(btnBack) btnBack.addEventListener('click', () => showStep(1));
    if(btnVerify) btnVerify.addEventListener('click', () => showStep(3));
    if(btnFinish) btnFinish.addEventListener('click', () => { loginUser(); authModal.classList.remove('open'); document.body.style.overflow = ''; });

    function showStep(stepNumber) {
        document.querySelectorAll('.auth-step').forEach(step => step.classList.remove('active'));
        const target = document.getElementById(`auth-step-${stepNumber}`);
        if(target) target.classList.add('active');
    }
    function loginUser() { localStorage.setItem('isLoggedIn', 'true'); renderLoggedInState(); }
    function logoutUser() { localStorage.removeItem('isLoggedIn'); renderLoggedOutState(); }
    
    function renderLoggedInState() {
        if(!authContainer) return;
        authContainer.innerHTML = `<div class="user-profile" style="display:flex; align-items:center; gap:10px;"><span style="font-weight:600; font-size:14px; color: #181818;">Привіт, Клієнт!</span><button class="btn btn--primary" id="logout-btn" style="background:#333;">Вийти</button></div>`;
    }
    function renderLoggedOutState() {
        if(!authContainer) return;
        authContainer.innerHTML = `<button class="btn btn--primary" id="open-auth-btn">Увійти</button><button class="btn btn--secondary" id="open-register-btn">Реєстрація</button>`;
    }

    // --- Помічники ---
    function setupSelector(selectorClass, highlighterId, shouldUpdateDescription = false) {
        const container = document.querySelector(`.${selectorClass}`);
        if(!container) return;
        const highlighter = document.getElementById(highlighterId);
        const buttons = container.querySelectorAll('.selector-item');
        buttons.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                moveHighlighter(btn, highlighter, container);
                if (shouldUpdateDescription) updateProductDescription();
                if(selectorClass === 'size-selector') {
                   const img = document.getElementById('modal-img');
                   if(img) img.style.transform = `rotate(${index * 45}deg)`;
                }
            });
        });
        const activeBtn = container.querySelector('.active');
        if (activeBtn) moveHighlighter(activeBtn, highlighter, container);
    }
    function moveHighlighter(targetBtn, highlighter, container) {
        const btnRect = targetBtn.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const left = btnRect.left - containerRect.left;
        highlighter.style.width = `${btnRect.width}px`;
        highlighter.style.transform = `translateX(${left}px)`;
    }
    // Підказка та логіка прокручування
    const infoBtn = document.getElementById('info-toggle');
    const tooltip = document.getElementById('nutrition-info');
    if(infoBtn && tooltip) {
        infoBtn.addEventListener('click', (e) => { e.stopPropagation(); tooltip.classList.toggle('show'); });
        document.addEventListener('click', (e) => { if (!infoBtn.contains(e.target) && !tooltip.contains(e.target)) tooltip.classList.remove('show'); });
    }
    document.querySelectorAll('.addon-card').forEach(card => card.addEventListener('click', () => card.classList.toggle('selected')));
    
    const scrollLinksActual = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    scrollLinksActual.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            try {
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    e.preventDefault();
                    const elementPosition = targetSection.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.scrollY - headerOffset;
                    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                }
            } catch (error) {}
        });
    });

    // --- 5. ЛОГІКА ДЛЯ КАРУСЕЛІ (Часто замовляють) ---
    const carouselItems = document.querySelectorAll('.carousel-item');
    
    if (carouselItems.length > 0) {
        let currentIndex = 1; // Починаємо з 2-ї картки (індекс 1), щоб була по центру
        const totalItems = carouselItems.length;

        function updateCarousel() {
            // Очищаємо всі класи
            carouselItems.forEach(item => {
                item.classList.remove('active', 'prev', 'next');
            });

            // Визначаємо індекси сусідів
            // (currentIndex + 1) % totalItems -> наступний (зациклено)
            // (currentIndex - 1 + totalItems) % totalItems -> попередній (зациклено)
            const nextIndex = (currentIndex + 1) % totalItems;
            const prevIndex = (currentIndex - 1 + totalItems) % totalItems;

            // Присвоюємо класи
            carouselItems[currentIndex].classList.add('active');
            carouselItems[nextIndex].classList.add('next');
            carouselItems[prevIndex].classList.add('prev');
        }

        function nextSlide() {
            // наступна стає активною (ефект руху справа наліво)
            currentIndex = (currentIndex + 1) % totalItems;
            updateCarousel();
        }

        // Запуск
        updateCarousel();

        // Автоперемикання кожні 1.5 секунди
        let carouselInterval = setInterval(nextSlide, 1500);

        // Зупинка при наведенні мишки (щоб зручно було клікнути)
        const track = document.getElementById('carousel-track');
        if(track) {
            track.addEventListener('mouseenter', () => clearInterval(carouselInterval));
            track.addEventListener('mouseleave', () => carouselInterval = setInterval(nextSlide, 1500));
        }
    }

     function updateSelectorPosition(selectorClass, highlighterId) {
        const container = document.querySelector(`.${selectorClass}`);
        if(!container) return;
        const activeBtn = container.querySelector('.active');
        const highlighter = document.getElementById(highlighterId);
        if(activeBtn && highlighter) moveHighlighter(activeBtn, highlighter, container);
    }

    // --- 6. ЛОГІКА ДЛЯ ВИПАДНОГО СПИСКУ "ІНШЕ" ---
    
    const otherBtn = document.getElementById('other-dropdown-btn');
    const otherMenu = document.getElementById('other-dropdown-menu');

    if (otherBtn && otherMenu) {
        // Клік на кнопку
        otherBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Зупиняємо, щоб не спрацював клік по документу
            
            // Перемикаємо класи
            otherBtn.classList.toggle('active');
            otherMenu.classList.toggle('open');
        });

        // Закриття при кліку будь-де поза меню
        document.addEventListener('click', (e) => {
            if (!otherBtn.contains(e.target) && !otherMenu.contains(e.target)) {
                otherBtn.classList.remove('active');
                otherMenu.classList.remove('open');
            }
        });
    }


    // --- 7. ЛОГІКА ЛИПКОГО МЕНЮ ---
    const navbar = document.querySelector('.category-nav');
    
    // Перевіряємо, чи існує меню на сторінці
    if (navbar) {
        // Отримуємо початкову позицію меню відносно верху сторінки
        const stickyThreshold = navbar.offsetTop;

        function handleStickyNavbar() {
            // Якщо прокрутили більше, ніж відстань до меню, то ми ліпимо його
            if (window.pageYOffset >= stickyThreshold) {
                navbar.classList.add('sticky');
                // Додаємо відступ body, щоб контент не "підстрибував"
                // (бо fixed елемент випадає з потоку документа)
                document.body.style.paddingTop = navbar.offsetHeight + 'px';
            } else {
                // Якщо повернулися нагору, то відліплюємо
                navbar.classList.remove('sticky');
                document.body.style.paddingTop = 0;
            }
        }

        // Слухаємо скрол
        window.addEventListener('scroll', handleStickyNavbar);
    }

    /* --- МОБІЛЬНА НАВІГАЦІЯ --- */

// Прив'язка кнопки Кошика в нижньому меню до відкриття кошика
const mobileCartBtn = document.getElementById('mobile-cart-btn');
if(mobileCartBtn) {
    mobileCartBtn.addEventListener('click', openCart); // Використовуємо існуючу функцію openCart
}

// Прив'язка кнопки Профіль до авторизації
const mobileProfileBtn = document.getElementById('mobile-profile-btn');
const authModalRef = document.getElementById('auth-modal'); 
if(mobileProfileBtn && authModalRef) {
    mobileProfileBtn.addEventListener('click', () => {
        // Перевіряємо чи залогінений
        if (localStorage.getItem('isLoggedIn') === 'true') {
             alert("Ви вже увійшли як Клієнт!");
        } else {
            authModalRef.classList.add('open');
            document.body.style.overflow = 'hidden';
            // Показати перший крок
            const step1 = document.getElementById('auth-step-1');
            if(step1) {
                document.querySelectorAll('.auth-step').forEach(s => s.classList.remove('active'));
                step1.classList.add('active');
            }
        }
    });
}

/* --- ЛОГІКА БІЧНОГО МЕНЮ --- */
const burgerBtn = document.getElementById('burger-btn');
const mobileMenu = document.getElementById('mobile-menu-sidebar');
const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
const closeMobileMenuBtn = document.getElementById('close-mobile-menu');

function openMobileMenu() {
    if(mobileMenu) mobileMenu.classList.add('open');
    if(mobileMenuOverlay) mobileMenuOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
    if(mobileMenu) mobileMenu.classList.remove('open');
    if(mobileMenuOverlay) mobileMenuOverlay.classList.remove('open');
    document.body.style.overflow = '';
}

if(burgerBtn) burgerBtn.addEventListener('click', openMobileMenu);
if(closeMobileMenuBtn) closeMobileMenuBtn.addEventListener('click', closeMobileMenu);
if(mobileMenuOverlay) mobileMenuOverlay.addEventListener('click', closeMobileMenu);

});