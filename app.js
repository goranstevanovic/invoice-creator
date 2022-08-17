'use strict';

const invoiceItems = [];

const invoiceItemsBody = document.getElementById('invoice-items__body');
const itemNameEl = document.getElementById('invoice-item__description');
const itemQtyEl = document.getElementById('invoice-item__quantity');
const itemPriceEl = document.getElementById('invoice-item__price');
const formRowEl = document.getElementById('form-row');
const addItemBtn = document.getElementById('add-item-btn');

function getItemData() {
  const data = {
    description: itemNameEl.value.trim(),
    quantity: Number.parseInt(itemQtyEl.value),
    price: Number.parseFloat(itemPriceEl.value).toFixed(2),
  };

  return data;
}

function getNavigatorLanguage() {
  if (navigator.languages && navigator.languages.length) {
    return navigator.languages[0];
  } else {
    return (
      navigator.userLanguage ||
      navigator.language ||
      navigator.browserLanguage ||
      'en-US'
    );
  }
}

function formatNumberDisplay(number, decimals) {
  const locale = getNavigatorLanguage();
  const options = {
    style: 'decimal',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  };
  return new Intl.NumberFormat(locale, options).format(number);
}

function addItem(itemData) {
  invoiceItems.push(itemData);
  console.log(invoiceItems);
}

function addTableRow(data) {
  console.log(data);
  const tableRow = document.createElement('tr');
  tableRow.classList.add('invoice-item__row');
  tableRow.innerHTML = `
    <td class="invoice-item__description">
      ${data.description}
    </td>
    <td class="invoice-item__quantity">
      ${data.quantity}
    </td>
    <td class="invoice-item__price">
      ${formatNumberDisplay(data.price, 2)}
    </td>
    <td class="invoice-item__amount">
      ${formatNumberDisplay(data.quantity * data.price, 2)}
    </td>
    <td class="invoice-item__edit">
      <button class="invoice-item__button">
        <i class="fa-regular fa-pen-to-square"></i>
      </button>
    </td>
    <td class="invoice-item__remove">
      <button class="invoice-item__button">
        <i class="fa-regular fa-square-minus"></i>
      </button>
    </td>
  `;
  formRowEl.insertAdjacentElement('beforebegin', tableRow);
}

function clearForm() {
  itemNameEl.value = '';
  itemQtyEl.value = '';
  itemPriceEl.value = '';
}

function handleAddItem() {
  const itemData = getItemData();

  if (
    itemData.description.trim() === '' ||
    itemData.quantity < 0 ||
    Number.isNaN(itemData.quantity) ||
    itemData.price < 0 ||
    Number.isNaN(itemData.price)
  ) {
    return;
  }

  addItem(itemData);

  addTableRow(itemData);

  clearForm();
}

addItemBtn.addEventListener('click', handleAddItem);
