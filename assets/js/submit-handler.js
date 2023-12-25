const STORAGE_KEY = "products-list";

$(document).ready(function () {
  $(".order-form").validate({
    rules: {
      name: {
        required: true,
        minlength: 2,
      },
      tel: {
        required: true,
      },
      region: {
        required: true,
      },
      city: {
        required: true,
      },
      addresses: {
        required: true,
      },
    },
    messages: {
      name: {
        required: "Поле 'ПІБ' обов'язкове для заповнення",
        minlength: "Довжина поля 'Ім'я' повинно бути мінімум 2 символи",
      },
      tel: {
        required: "Поле 'Телефон' обов'язкове для заповнення",
      },
      region: {
        required: "Поле 'Регіон' обов'язкове для заповнення",
      },
      city: {
        required: "Поле 'Місто' обов'язкове для заповнення",
      },
      addresses: {
        required: "Поле 'Адреса' обов'язкове для заповнення",
      },
    },
    submitHandler: function (form) {
      const data = Object.fromEntries(new FormData(form));
      const products = getFromLocalStorage().map(
        ({ nomer, nazva, cina, count }) => {
          return { nomer, nazva, cina, count };
        }
      );
      data.products = products;
      sendData(data)
        .then((r) => {
          console.log(r);
        })
        .catch(console.log)
        .finally(() => {
          form.reset();
        });
    },
  });

  $("#tel").inputmask({ mask: "+38 (999) 999-99-99" });

  function getFromLocalStorage() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.log(error.message);
    }
  }

  function sendData(data) {
    return fetch("./php/send_order.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((r) => {
      return r.json();
    });
  }
});
