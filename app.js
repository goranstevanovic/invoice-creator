'use strict';

const model = {
  invoiceItems: [],
  invoiceSubtotal: 0,
  invoiceTaxRate: 0,
  invoiceShippingCost: 0,
  invoiceTotal: 0,

  saveItem(data) {
    this.invoiceItems.push(data);
  },

  removeItem(id) {
    const index = this.invoiceItems.findIndex((item) => item.id === id);
    console.log(index);
    this.invoiceItems.splice(index, 1);
  },

  updateTaxRate(rate) {
    this.invoiceTaxRate = rate;
  },

  updateShippingCost(amount) {
    this.invoiceShippingCost = amount;
  },

  updateSubtotal(amount) {
    this.invoiceSubtotal += amount;
  },

  updateTotal() {
    const taxAmount = (this.invoiceSubtotal * this.invoiceTaxRate) / 100;
    this.invoiceTotal =
      this.invoiceSubtotal + taxAmount + this.invoiceShippingCost;
  },
};

const view = {
  invoiceItemsBody: document.getElementById('invoice-items__body'),
  itemNameEl: document.getElementById('invoice-item__description'),
  itemQtyEl: document.getElementById('invoice-item__quantity'),
  itemPriceEl: document.getElementById('invoice-item__price'),
  formRowEl: document.getElementById('form-row'),
  addItemBtn: document.getElementById('add-item-btn'),
  subtotalInvoiceAmount: document.getElementById('invoice-summary__subtotal'),
  taxRateInput: document.getElementById('tax-rate-input'),
  taxRateAmount: document.getElementById('invoice-summary__tax-amount'),
  shippingCostInput: document.getElementById('shipping-cost-input'),
  totalInvoiceAmount: document.getElementById('invoice-summary__total-amount'),

  setUpInitialValues() {
    this.subtotalInvoiceAmount.textContent = utils.formatNumberDisplay(
      model.invoiceSubtotal
    );
    this.taxRateInput.value = utils.formatNumberDisplay(model.invoiceTaxRate);
    this.taxRateAmount.textContent = utils.formatNumberDisplay(0);
    this.shippingCostInput.value = utils.formatNumberDisplay(
      model.invoiceShippingCost
    );
    this.totalInvoiceAmount.textContent = utils.formatNumberDisplay(
      model.invoiceTotal
    );
  },

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
        ${utils.formatNumberDisplay(data.amount, 2)}
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

  updateTaxRate(amount) {
    this.taxRateAmount.textContent = utils.formatNumberDisplay(amount);
  },

  updateSubtotal(amount) {
    this.subtotalInvoiceAmount.textContent = utils.formatNumberDisplay(amount);
  },

  updateTotal(amount) {
    this.totalInvoiceAmount.textContent = utils.formatNumberDisplay(amount);
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

  formatNumberDisplay(number, decimals = 2) {
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
      price: Number.parseFloat(view.itemPriceEl.value),
    };

    data.amount = data.quantity * data.price;

    console.log(data);

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
    model.updateSubtotal(itemData.quantity * itemData.price);
    model.updateTotal();
    view.addTableRow(itemData);
    view.updateSubtotal(model.invoiceSubtotal);
    view.updateTotal(model.invoiceTotal);
    view.clearForm();
  },

  handleDeleteItem(e) {
    if (!e.target.closest('#remove-item-btn')) {
      return;
    }

    const tableRow = e.target.closest('.invoice-item__row');
    const id = tableRow.dataset.id;

    const selectedItem = model.invoiceItems.find((item) => item.id === id);

    model.removeItem(id);
    view.deleteTableRow(id);
    model.updateSubtotal(-selectedItem.amount);
    model.updateTotal();
    view.updateSubtotal(model.invoiceSubtotal);
    view.updateTotal(model.invoiceTotal);
  },

  handleTaxRateChange(e) {
    model.updateTaxRate(Number(e.target.value));
    view.updateTaxRate((model.invoiceSubtotal * model.invoiceTaxRate) / 100);
    model.updateTotal();
    view.updateTotal(model.invoiceTotal);
  },

  handleShippingCostChange(e) {
    const shippingCost = Number(e.target.value);
    model.updateShippingCost(shippingCost);
    model.updateTotal();
    view.updateTotal(model.invoiceTotal);
  },
};

view.setUpInitialValues();

view.addItemBtn.addEventListener(
  'click',
  controller.handleAddItem.bind(controller)
);

view.invoiceItemsBody.addEventListener(
  'click',
  controller.handleDeleteItem.bind(controller)
);

view.taxRateInput.addEventListener(
  'change',
  controller.handleTaxRateChange.bind(controller)
);

view.shippingCostInput.addEventListener(
  'change',
  controller.handleShippingCostChange.bind(controller)
);
