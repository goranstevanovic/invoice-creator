'use strict';

const model = {
  invoiceItems: [],
  invoiceSubtotal: 0,
  invoiceTaxRate: 0,
  invoiceTotal: 0,

  saveItem(data) {
    this.invoiceItems.push(data);
  },

  removeItem(id) {
    const index = this.invoiceItems.findIndex((item) => item.id === id);
    console.log(index);
    this.invoiceItems.splice(index, 1);
  },
};

const view = {
  invoiceItemsBody: document.getElementById('invoice-items__body'),
  itemNameEl: document.getElementById('invoice-item__description'),
  itemQtyEl: document.getElementById('invoice-item__quantity'),
  itemPriceEl: document.getElementById('invoice-item__price'),
  formRowEl: document.getElementById('form-row'),
  addItemBtn: document.getElementById('add-item-btn'),

  addTableRow(data) {
    const tableRow = document.createElement('tr');
    tableRow.dataset.id = data.id;
    tableRow.id = data.id;
    tableRow.classList.add('invoice-item__row');
    tableRow.innerHTML = `
      <td class="invoice-item__description">
        ${data.description}
      </td>
      <td class="invoice-item__quantity">
        ${data.quantity}
      </td>
      <td class="invoice-item__price">
        ${utils.formatNumberDisplay(data.price, 2)}
      </td>
      <td class="invoice-item__amount">
        ${utils.formatNumberDisplay(data.quantity * data.price, 2)}
      </td>
      <td class="invoice-item__edit">
        <button id="edit-item-btn" class="invoice-item__button">
          <i class="fa-regular fa-pen-to-square"></i>
        </button>
      </td>
      <td class="invoice-item__remove">
        <button id="remove-item-btn" class="invoice-item__button">
          <i class="fa-regular fa-square-minus"></i>
        </button>
      </td>
    `;
    this.formRowEl.insertAdjacentElement('beforebegin', tableRow);
  },

  deleteTableRow(id) {
    document.getElementById(id).remove();
  },

  clearForm() {
    this.itemNameEl.value = '';
    this.itemQtyEl.value = '';
    this.itemPriceEl.value = '';
  },
};

const utils = {
  getNavigatorLanguage() {
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
  },

  formatNumberDisplay(number, decimals) {
    const locale = this.getNavigatorLanguage();
    const options = {
      style: 'decimal',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    };
    return new Intl.NumberFormat(locale, options).format(number);
  },
};

const controller = {
  getItemData() {
    const data = {
      id: Math.random().toString().substring(2),
      description: view.itemNameEl.value.trim(),
      quantity: Number.parseInt(view.itemQtyEl.value),
      price: Number.parseFloat(view.itemPriceEl.value).toFixed(2),
    };

    return data;
  },

  handleAddItem() {
    const itemData = this.getItemData();

    if (
      itemData.description.trim() === '' ||
      itemData.quantity < 0 ||
      Number.isNaN(itemData.quantity) ||
      itemData.price < 0 ||
      Number.isNaN(itemData.price)
    ) {
      return;
    }

    model.saveItem(itemData);
    view.addTableRow(itemData);
    view.clearForm();
  },

  handleDeleteItem(e) {
    if (!e.target.closest('#remove-item-btn')) {
      return;
    }

    const tableRow = e.target.closest('.invoice-item__row');
    const id = tableRow.dataset.id;

    model.removeItem(id);
    view.deleteTableRow(id);
  },
};

view.addItemBtn.addEventListener(
  'click',
  controller.handleAddItem.bind(controller)
);

view.invoiceItemsBody.addEventListener('click', controller.handleDeleteItem);
