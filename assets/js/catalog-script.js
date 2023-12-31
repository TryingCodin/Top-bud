const FILTER_KEY = 'filtering-options';
let allProducts = [];

const getDataFromStorage = () => {
    try {
        const data = sessionStorage.getItem(FILTER_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.log(error.message);
    }
};

const getValueFromStorage = (items = [], key) => {
    return [...new Set(items.map((item) => item[key]))];
};

window.addEventListener('DOMContentLoaded', () => {
    /*<----- Manipulation with input labels ----->*/
    const recallModalFields = document.querySelectorAll('.recall__form input[type="text"], .recall__form textarea');
    const contactsFormFields = document.querySelectorAll('.contacts-content__form input[type="text"], .contacts-content__form textarea');
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
            });

            field.addEventListener('blur', (e) => {
                const field = e.target;
                const label = field.previousElementSibling;

                if (field.value !== '') {
                    sessionStorage.setItem(`${valueName} ${index}`, field.value);
                } else if (field.value === '') {
                    sessionStorage.removeItem(`${valueName} ${index}`);
                    label.classList.remove('field_up');
                }
            });
        });
    }

    if (contactsFormFields) labelFieldUp(contactsFormFields, 'contacts');
    labelFieldUp(recallModalFields, 'recall');

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

    /*<----- Catalog - sort ----->*/
    function hideLoadingPattern() {
        const loadingEmptyItem = document.querySelectorAll('.empty-item');
        loadingEmptyItem.forEach((item) => item.classList.add('hide'));
    }

    function addStorageKey() {
        const menuCatalog = document.querySelector('.header__menu--catalog');
        const menuCatalogCategoryValue = menuCatalog.getAttribute('data-category');
        const menuCatalogNameValue = menuCatalog.textContent.replace(/\s+/g, ' ').trim();

        sessionStorage.setItem(menuCatalogCategoryValue, menuCatalogNameValue);
    }

    function createProductItems(products) {
        return products
            .map((product) => {
                let characteristicsHTML = '';
                let characteristicsCount = 0;

                for (let i = 1; i <= 10; i++) {
                    const nameKey = `Назва_характеристики_${i}`;
                    const valueKey = `Значення_характеристики_${i}`;
                    if (product[nameKey] && product[valueKey]) {
                        characteristicsHTML += `<span>${product[nameKey]}: ${product[valueKey]}</span>`;
                        characteristicsCount++;
                    }
                }

                const bottomValue = -25.8 * characteristicsCount;

                return `
                        <div class="catalog__item-wrap">
                            <div class="catalog__item">
                                <span class="catalog__item--title">${product['Назва_позиції']}</span>
                                
                                <div class="catalog__item--img">
                                    <img src="./assets/images/products/${product['Зображення']}" alt="${product['Назва_позиції']}">
                                </div>
                                
                                <span>${product['Ціна']} грн/${product['Одиниця_виміру']}</span>
                                
                                <div class="catalog__item--descr" style="bottom: ${bottomValue}px">
                                    ${characteristicsHTML}
                                </div>
                            </div>
                        </div>
                    `;
            })
            .join('');
    }

    const key1 = 'Назва_характеристики_1';
    const key2 = 'Назва_характеристики_2';
    const value1 = 'Значення_характеристики_1';
    const value2 = 'Значення_характеристики_2';

    function showProducts(products) {
        const dataStorage = getDataFromStorage();
        const names = getValueFromStorage(dataStorage, 'name');
        const selectedValue = getValueFromStorage(dataStorage, 'value');

        const arr = products.filter((item) => {
            return (
                (names.includes(item[key1]) && selectedValue.includes(item[value1].toString())) || (names.includes(item[key2]) && selectedValue.includes(item[value2].toString()))
            );
        });
        const markup = arr.length > 0 ? createProductItems(arr) : createProductItems(products);

        if (markup !== '') {
            document.querySelector('.catalog__grid').innerHTML = markup;
        } else {
            document.querySelector(
                '.catalog__grid'
            ).innerHTML = `<div class="catalog__item-no-data">Даних немає. Вибачте за незручності.</div>`;
        }
    }

    function sortProducts(products, sortType) {
        const sortedProducts = [...products];

        switch (sortType) {
            case 'name-asc':
                return sortedProducts.sort((a, b) => a['Назва_позиції'].localeCompare(b['Назва_позиції']));
            case 'name-desc':
                return sortedProducts.sort((a, b) => b['Назва_позиції'].localeCompare(a['Назва_позиції']));
            case 'price-asc':
                return sortedProducts.sort((a, b) => parseFloat(a['Ціна']) - parseFloat(b['Ціна']));
            case 'price-desc':
                return sortedProducts.sort((a, b) => parseFloat(b['Ціна']) - parseFloat(a['Ціна']));
            default:
                return sortedProducts.sort((a, b) => parseFloat(a['Номер_позиції']) - parseFloat(b['Номер_позиції']));
        }
    }

    function removeUnnecessaryKeys(exceptKey) {
        for (let i = 0; i < sessionStorage.length; i++) {
            const key = sessionStorage.key(i);
            if (key !== exceptKey && key !== 'sort-option') sessionStorage.removeItem(key);
        }
    }

    function addActiveClass() {
        const elementsWithDataCategory = document.querySelectorAll('[data-category]');
        const categoriesContainer = document.querySelector('.catalog__sidebar--categories');
        const activeCategory = categoriesContainer.querySelector('.category_active');
        const showList = categoriesContainer.querySelectorAll('.list_show');

        if (activeCategory) activeCategory.classList.remove('category_active');
        if (showList) showList.forEach((list) => list.classList.remove('list_show'));

        elementsWithDataCategory.forEach((elem) => {
            const categoryName = elem.textContent.replace(/\s+/g, ' ').trim();
            const firstStorageKey = sessionStorage.getItem(sessionStorage.key(0));
            const secondStorageKey = sessionStorage.getItem(sessionStorage.key(1));

            if (!sessionStorage.getItem('Каталог')) {
                if (categoryName === firstStorageKey || categoryName === secondStorageKey) {
                    elem.classList.add('category_active');

                    if (elem.nextElementSibling !== null && elem.nextElementSibling.classList.contains('categories__list-first')) {
                        elem.nextElementSibling.classList.add('list_show');
                    } else if (elem.closest('.categories__list-first') !== null) {
                        elem.closest('.categories__list-first').classList.add('list_show');

                        if (elem.nextElementSibling !== null && elem.nextElementSibling.querySelector('.categories__list-second')) {
                            elem.nextElementSibling.querySelector('.categories__list-second').classList.add('list_show');
                        } else if (elem.closest('.categories__list-second') !== null) {
                            elem.closest('.categories__list-second').classList.add('list_show');
                        }
                    }
                }
            }
        });
    }

    function getFilterCategories(products) {
        return products.reduce((map, item) => {
            const key1 = item['Назва_характеристики_1'];
            const value1 = item['Значення_характеристики_1'];

            if (key1) {
                const values1 = map.get(key1) || new Set();
                values1.add(value1);
                map.set(key1, values1);
            }

            const key2 = item['Назва_характеристики_2'];
            const value2 = item['Значення_характеристики_2'];

            if (key2) {
                const values2 = map.get(key2) || new Set();
                values2.add(value2);
                map.set(key2, values2);
            }

            return map;
        }, new Map());
    }

    const container = document.querySelector('.catalog__sidebar--filter');
    container.addEventListener('change', (e) => {
        const data = [...e.currentTarget.querySelectorAll('input[type="checkbox"]:checked'),].map((item) => {
            return {
                name: item.name,
                value: item.value,
            };
        });

        sessionStorage.setItem(FILTER_KEY, JSON.stringify(data));
        showProducts(allProducts);
    });

    function showFilters(products) {
        container.innerHTML = '';
        const dataStorage = getDataFromStorage();
        const names = getValueFromStorage(dataStorage, 'name');
        const selectedValue = getValueFromStorage(dataStorage, 'value');

        getFilterCategories(products).forEach((values, key) => {
            const sortedValues = Array.from(values).sort((a, b) => a - b);
            const listItemsHtml = sortedValues.map((value, index) => {
                const hiddenClass = index < 5 ? 'expanded' : '';
                const toggle = names.includes(key) && selectedValue.includes(value.toString());

                return `<li class="${hiddenClass}">
                            <label>
                                <input type="checkbox" name="${key}" value="${value}" ${toggle ? 'checked' : ''}>
                                ${value}
                            </label>
                        </li>`;
            }).join('');

            const showMoreHtml = sortedValues.length > 5 ? `<li class="show-more expanded">Показати більше</li>` : '';
            const htmlContent =
                `<div>
                    <span class="filter__characteristics-title">${key}:</span>
                    <ul class="filter__characteristics-list">${listItemsHtml}${showMoreHtml}</ul>
                </div>`;

            container.insertAdjacentHTML('beforeend', htmlContent);
        });
    }

    fetch('catalog.json')
        .then((response) => {
            return response.json();
        })
        .then((productsData) => {
            hideLoadingPattern();

            function showFilteredProducts(productsArr) {
                const sortOption = sessionStorage.getItem('sort-option');
                switch (sortOption) {
                    case 'name-asc':
                        allProducts = sortProducts(productsArr, 'name-asc');
                        break;
                    case 'name-desc':
                        allProducts = sortProducts(productsArr, 'name-desc');
                        break;
                    case 'price-asc':
                        allProducts = sortProducts(productsArr, 'price-asc');
                        break;
                    case 'price-desc':
                        allProducts = sortProducts(productsArr, 'price-desc');
                        break;
                    default:
                        allProducts = sortProducts(productsArr, 'default');
                        break;
                }
                showProducts(allProducts);
            }

            function addListenerOfSortSelect(data) {
                const sortSelect = document.getElementById('sortSelect');
                sortSelect.addEventListener('change', () => {
                    sessionStorage.setItem('sort-option', sortSelect.value);
                    showFilteredProducts(data);
                });

                const savedOption = sessionStorage.getItem('sort-option');
                sortSelect.value = savedOption ? savedOption : sortSelect.value;
            }

            function showProductFromStorage() {
                let foundItem = null;
                for (let i = 0; i < sessionStorage.length; i++) {
                    let key = sessionStorage.key(i);
                    if (key.includes('Назва_групи')) {
                        foundItem = {key: key, value: sessionStorage.getItem(key)};
                        break;
                    }
                }

                if (foundItem !== null) {
                    addActiveClass();

                    const filteredProducts = productsData.filter(
                        (item) => item[foundItem.key] === foundItem.value
                    );
                    showFilteredProducts(filteredProducts);
                    addListenerOfSortSelect(filteredProducts);

                    function getCharacteristicValues(filteredProducts) {
                        let characteristicsDetails = [];

                        filteredProducts.forEach((item) => {
                            let characteristicDetail = {
                                name1: null,
                                value1: null,
                                name2: null,
                                value2: null,
                            };

                            if ('Назва_характеристики_1' in item) characteristicDetail.name1 = item['Назва_характеристики_1'];
                            if ('Значення_характеристики_1' in item) characteristicDetail.value1 = item['Значення_характеристики_1'];
                            if ('Назва_характеристики_2' in item) characteristicDetail.name2 = item['Назва_характеристики_2'];
                            if ('Значення_характеристики_2' in item) characteristicDetail.value2 = item['Значення_характеристики_2'];

                            if (characteristicDetail.name1 || characteristicDetail.value1 || characteristicDetail.name2 || characteristicDetail.value2) {
                                characteristicsDetails.push(characteristicDetail);
                            }
                        });

                        return characteristicsDetails;
                    }

                    const filteredProducts2 = productsData.filter(
                        (item) => item[foundItem.key] === foundItem.value
                    );
                    const characteristicsDetails =
                        getCharacteristicValues(filteredProducts2);

                    function showCharacteristicsFilters(characteristicsDetails) {
                        const container = document.querySelector('.catalog__sidebar--filter');
                        container.innerHTML = '';

                        const groupedDetails = characteristicsDetails.reduce(
                            (acc, {name1, value1, name2, value2}) => {
                                if (name1) {
                                    acc[name1] = acc[name1] || new Set();
                                    if (value1) acc[name1].add(value1);
                                }
                                if (name2) {
                                    acc[name2] = acc[name2] || new Set();
                                    if (value2) acc[name2].add(value2);
                                }
                                return acc;
                            },
                            {}
                        );

                        const sortedGroups = Object.entries(groupedDetails).sort((a, b) =>
                            a[0].localeCompare(b[0])
                        );
                        const dataStorage = getDataFromStorage();
                        const names = getValueFromStorage(dataStorage, 'name');
                        const selectedValue = getValueFromStorage(dataStorage, 'value');

                        sortedGroups.forEach(([name, values]) => {
                            const sortedValues = Array.from(values).sort((a, b) => parseFloat(a) - parseFloat(b));
                            const listItemsHtml = sortedValues.map((value, index) => {
                            const hiddenClass = index < 5 ? 'expanded' : '';
                            const toggle = names.includes(name) && selectedValue.includes(value.toString());

                                return `<li class="${hiddenClass}">
                                            <label>
                                                <input type="checkbox" name="${name}" value="${value}" ${toggle ? 'checked' : ''}>
                                                    ${value}
                                            </label>
                                        </li>`;
                            }).join('');

                            const showMoreHtml = sortedValues.length > 5 ? `<li class="show-more expanded">Показати більше</li>` : '';
                            const htmlContent =
                                `<div>
                                    <span class="filter__characteristics-title">${name}:</span>
                                    <ul class="filter__characteristics-list">${listItemsHtml}${showMoreHtml}</ul>
                                </div>`;

                            container.insertAdjacentHTML('beforeend', htmlContent);
                        });
                    }
                    showCharacteristicsFilters(characteristicsDetails);
                }
            }

            if (sessionStorage.length === 0 || sessionStorage.getItem('Каталог')) {
                addStorageKey();
                showFilteredProducts(productsData);
                addListenerOfSortSelect(productsData);

                showFilters(productsData);
            } else {
                showProductFromStorage();
            }

            const dataCategory = document.querySelectorAll('[data-category]');
            dataCategory.forEach((elem) => {
                elem.addEventListener('click', () => {
                    const categoryValue = elem.getAttribute('data-category');
                    const nameValue = elem.textContent.replace(/\s+/g, ' ').trim();

                    if (categoryValue === 'Каталог') {
                        removeUnnecessaryKeys(categoryValue);
                        addStorageKey();
                        addActiveClass();
                        showFilteredProducts(productsData);
                        addListenerOfSortSelect(productsData);

                        showFilters(productsData);
                    } else {
                        removeUnnecessaryKeys(categoryValue);
                        sessionStorage.setItem(categoryValue, nameValue);
                        showProductFromStorage();
                    }
                });
            });

            container.addEventListener('click', function (event) {
                if (!event.target.classList.contains('show-more')) return;

                const button = event.target;
                const listItems = button.parentNode.querySelectorAll('li');
                const isExpanded = button.getAttribute('data-expanded') === 'true';

                listItems.forEach((item, index) => {
                    if (index >= 5) item.classList.toggle('expanded');
                });

                button.textContent = isExpanded ? 'Показати більше' : 'Приховати';
                button.setAttribute('data-expanded', !isExpanded);
                button.classList.toggle('expanded');
            });
        })
        .catch((error) => {
            console.error('Error:', error);
            hideLoadingPattern();
        });
});
