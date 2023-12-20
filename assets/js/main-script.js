window.addEventListener('DOMContentLoaded', () => {
    /*<----- Header adaptive sidebar ----->*/
    const mainHtmlTag = document.documentElement;
    const catalogLink = document.querySelector('.header__menu--catalog');
    const headerMenuListFirst = document.querySelector('.header__menu--list-dropdown-first');
    const nextBtnFirst = document.querySelectorAll('.next-btn--first');
    const listDropdownFirst = document.querySelector('.header__menu--list-dropdown-first');
    const listDropdownFirstItems = listDropdownFirst.querySelectorAll(':scope > .header__menu--list-dropdown-item');
    const nextBtnThird = document.querySelectorAll('.next-btn--third');
    const backBtnSecond = document.querySelectorAll('.back-btn--second');
    const backBtnThird = document.querySelectorAll('.back-btn--third');
    const closeMenuBtn = document.querySelector('.close-menu');

    window.addEventListener('resize', () => {
        if (window.innerWidth <= 640) catalogLink.href = 'javascript:void(0);';
        else catalogLink.href = 'catalog.html';
    })

    catalogLink.addEventListener('click', () => {
        headerMenuListFirst.classList.add('list_show-first');
        mainHtmlTag.classList.add('overflow-hide');
    })

    nextBtnFirst.forEach(btn => {
        btn.addEventListener('click', () => {
            listDropdownFirstItems.forEach(li => {
                btn.closest('.header__menu--list-dropdown-item').classList.add('list-items--z-ind');
                li.classList.add('list-items--first_move');
            })

            btn.nextElementSibling.classList.add('list_show-second');
        })
    })

    nextBtnThird.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.list_show-second').classList.add('list_hide-second')

            btn.nextElementSibling.classList.add('list_show-third');
        })
    })

    backBtnSecond.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.header__menu--list-dropdown-second').classList.remove('list_show-second');

            listDropdownFirstItems.forEach(li => {
                li.classList.remove('list-items--z-ind');
                li.classList.remove('list-items--first_move');
            })
        })
    })

    backBtnThird.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.header__menu--list-dropdown-third').classList.remove('list_show-third');

            btn.closest('.header__menu--list-dropdown-second').classList.remove('list_hide-second');
        })
    })

    closeMenuBtn.addEventListener('click', () => {
        listDropdownFirstItems.forEach(li => li.classList.remove('list-items--first_move'))

        document.querySelectorAll('.header__menu--list-dropdown-second').forEach(list => {
            if (list.classList.contains('list_show-second')) list.classList.add('list_hide-second--non-visible');

            setTimeout(() => {
                if (list.classList.contains('list_show-second')) {
                    list.classList.remove('list_show-second');
                    list.classList.remove('list_hide-second');
                    list.classList.remove('list_hide-second--non-visible');
                }
            }, 1200)
        })

        document.querySelectorAll('.header__menu--list-dropdown-third').forEach(list => {
            if (list.classList.contains('list_show-third')) list.classList.add('list_hide-third--non-visible');

            setTimeout(() => {
                if (list.classList.contains('list_show-third')) {
                    list.classList.remove('list_show-third');
                    list.classList.remove('list_hide-third');
                    list.classList.remove('list_hide-third--non-visible');
                }
            }, 1200)
        })

        headerMenuListFirst.classList.remove('list_show-first');
        mainHtmlTag.classList.remove('overflow-hide');
    })

    /*<----- Header links ----->*/
    const dataCategory = document.querySelectorAll('[data-category]');

    function removeUnnecessaryKeys(exceptKey) {
        for (let i = 0; i < sessionStorage.length; i++) {
            const key = sessionStorage.key(i);
            if (key !== exceptKey && key !== 'sort-option') sessionStorage.removeItem(key);
        }
    }

    dataCategory.forEach(elem => {
        const categoryValue = elem.getAttribute('data-category');
        const nameValue = elem.textContent.replace(/\s+/g, ' ').trim();

        elem.addEventListener('click', () => {
            removeUnnecessaryKeys(categoryValue);
            sessionStorage.setItem(categoryValue, nameValue);
        });
    });

    /*<----- Presentation slider ----->*/
    const swiper = new Swiper('.banner__swiper', {
        slidesPerView: 1,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        autoplay: {
            delay: 2500,
        },
    })

    /*<----- Assortment ----->*/
    const assortmentDropdown = document.querySelectorAll('.assortment__item--dropdown');

    assortmentDropdown.forEach(item => {
        item.addEventListener('click', () => {
            item.querySelector('.assortment__item--dropdown-list').classList.toggle('list_open');
            item.querySelector('.assortment__item--dropdown-btn').classList.toggle('btn_back');
        })
    })

    /*<----- Recall modal ----->*/
    const recallModalFields = document.querySelectorAll('.recall__form input[type="text"], .recall__form textarea');
    const recallBtn = document.querySelector('.contacts-links--recall');
    const recallModal = document.querySelector('.recall__modal');
    const recallCloseModal = document.querySelector('.recall__modal-close');

    const recallForm = document.querySelector('.recall__form');
    const recallFormMessage = document.querySelector('.recall__form-message');

    function labelFieldUp(element, valueName) {
        element.forEach((field, index) => {
            if (sessionStorage.getItem(`${valueName} ${index}`) !== null) {
                field.value = sessionStorage.getItem(`${valueName} ${index}`);
                field.previousElementSibling.classList.add('field_up');
            }

            field.addEventListener('focus', (e) => {
                const label = e.target.previousElementSibling;
                if (label) label.classList.add('field_up');
            })

            field.addEventListener('blur', (e) => {
                const field = e.target;
                const label = field.previousElementSibling;

                if (field.value !== '') {
                    sessionStorage.setItem(`${valueName} ${index}`, field.value);
                } else if (field.value === '') {
                    sessionStorage.removeItem(`${valueName} ${index}`);
                    label.classList.remove('field_up');
                }
            })
        })
    }

    function openModal() {
        mainHtmlTag.classList.add('overflow-hide');
        recallModal.classList.remove('hide');
    }

    function closeModal() {
        mainHtmlTag.classList.remove('overflow-hide');
        recallModal.classList.add('hide');
    }

    function handleKeydown(event) {
        if (event.keyCode === 27) closeModal();
    }

    function updateFormMessage(message) {
        if (recallFormMessage) recallFormMessage.innerHTML = message;
    }

    function closeRecallModal() {
        if (recallModal) recallModal.classList.add('hide');
        if (recallForm) recallForm.reset();
        if (recallFormMessage) recallFormMessage.innerHTML = '';
    }

    labelFieldUp(recallModalFields, 'recall');
    recallBtn.addEventListener('click', openModal);
    recallCloseModal.addEventListener('click', closeModal);
    document.addEventListener('keydown', handleKeydown);

    if (recallForm) {
        recallForm.addEventListener('submit', event => {
            event.preventDefault();
            const formData = new FormData(event.target);

            fetch('./php/send_mail.php', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.text();
            })
            .then(() => {
                updateFormMessage('Thank you for your message. We will contact you shortly.');
                setTimeout(closeRecallModal, 2000);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
                updateFormMessage('Oops! Something went wrong. Please try again.');
            });
        });
    }
})