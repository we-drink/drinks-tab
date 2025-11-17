// ======================
// DRINK LIST
// ======================
const drinks = [
  { name: "Espresso", price: 1.50 },
  { name: "Macchiato", price: 1.80 },
  { name: "Cappuccino", price: 2.20 },
  { name: "Latte", price: 2.50 },
  { name: "Tea", price: 1.80 },
  { name: "Beer 0.5L", price: 3.00 },
  { name: "Radler 0.5L", price: 3.20 },
  { name: "Wine (glass)", price: 2.80 },
  { name: "Cola", price: 2.00 },
  { name: "Juice", price: 2.20 },
  { name: "Water 0.5L", price: 1.20 }
];

// ======================
// TABLE DATA
// ======================
let tables = [
  { id: 1, name: "Table 1", orderLines: [] },
  { id: 2, name: "Table 2", orderLines: [] },
  { id: 3, name: "Table 3", orderLines: [] },
  { id: 4, name: "Bar",     orderLines: [] }
];

let currentTableId = 1;
let nextTableId = 5;

// ======================
// DOM ELEMENTS
// ======================
const drinkButtonsContainer = document.getElementById("drinkButtons");
const orderBody = document.getElementById("orderBody");
const totalAmountEl = document.getElementById("totalAmount");
const clearOrderBtn = document.getElementById("clearOrder");
const chargeOrderBtn = document.getElementById("chargeOrder");
const tableNameInput = document.getElementById("tableNameInput");
const tablesTabsContainer = document.getElementById("tablesTabs");
const addTableBtn = document.getElementById("addTableBtn");

function getCurrentTable() {
  return tables.find(t => t.id === currentTableId);
}

// ======================
// RENDER DRINK BUTTONS
// ======================
function renderDrinkButtons() {
  drinkButtonsContainer.innerHTML = "";
  drinks.forEach(drink => {
    const btn = document.createElement("button");
    btn.innerHTML = `
      <span>${drink.name}</span>
      <span class="price">${drink.price.toFixed(2)} €</span>
    `;
    btn.addEventListener("click", () => addDrinkToTable(drink));
    drinkButtonsContainer.appendChild(btn);
  });
}

// ======================
// RENDER TABLE TABS
// ======================
function renderTableTabs() {
  tablesTabsContainer.innerHTML = "";
  tables.forEach(table => {
    const btn = document.createElement("button");
    btn.className = "table-tab";
    if (table.id === currentTableId) btn.classList.add("active");

    const nameSpan = document.createElement("span");
    nameSpan.textContent = table.name;

    const total = calculateTotal(table);
    const totalSpan = document.createElement("span");
    totalSpan.className = "total";
    totalSpan.textContent = total > 0 ? `${total.toFixed(2)} €` : "";

    btn.appendChild(nameSpan);
    btn.appendChild(totalSpan);

    btn.addEventListener("click", () => {
      currentTableId = table.id;
      updateUI();
    });

    tablesTabsContainer.appendChild(btn);
  });
}

// ======================
// RENDER ORDER TABLE
// ======================
function renderOrderTable() {
  const table = getCurrentTable();
  orderBody.innerHTML = "";

  table.orderLines.forEach((line, index) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${line.name}</td>
      <td>${line.quantity}</td>
      <td>${line.price.toFixed(2)}</td>
      <td>${(line.price * line.quantity).toFixed(2)}</td>
    `;

    const removeTd = document.createElement("td");
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "✕";
    removeBtn.style.border = "none";
    removeBtn.style.background = "transparent";
    removeBtn.style.cursor = "pointer";
    removeBtn.addEventListener("click", () => {
      table.orderLines.splice(index, 1);
      updateUI();
    });

    removeTd.appendChild(removeBtn);
    tr.appendChild(removeTd);

    orderBody.appendChild(tr);
  });

  totalAmountEl.textContent = calculateTotal(table).toFixed(2);
  tableNameInput.value = table.name;
}

// ======================
// CALCULATE TOTAL
// ======================
function calculateTotal(table) {
  return table.orderLines.reduce((sum, line) => sum + line.price * line.quantity, 0);
}

// ======================
// ADD DRINK
// ======================
function addDrinkToTable(drink) {
  const table = getCurrentTable();
  const existing = table.orderLines.find(line => line.name === drink.name);

  if (existing) {
    existing.quantity += 1;
  } else {
    table.orderLines.push({
      name: drink.name,
      price: drink.price,
      quantity: 1
    });
  }

  updateUI();
}

// ======================
// CLEAR TABLE
// ======================
clearOrderBtn.addEventListener("click", () => {
  const table = getCurrentTable();
  if (table.orderLines.length === 0) return;
  if (confirm(`Clear order for ${table.name}?`)) {
    table.orderLines = [];
    updateUI();
  }
});

// ======================
// CHARGE TABLE
// ======================
chargeOrderBtn.addEventListener("click", () => {
  const table = getCurrentTable();
  const total = calculateTotal(table);

  if (total === 0) {
    alert("No items in order.");
    return;
  }

  let msg = `Bill for ${table.name}\n\n`;
  table.orderLines.forEach(line => {
    msg += `${line.quantity} × ${line.name} = ${(line.price * line.quantity).toFixed(2)} €\n`;
  });
  msg += `\nTOTAL: ${total.toFixed(2)} €`;

  alert(msg);

  table.orderLines = [];
  updateUI();
});

// ======================
// RENAME TABLE
// ======================
tableNameInput.addEventListener("input", () => {
  const table = getCurrentTable();
  table.name = tableNameInput.value || "Unnamed table";
  renderTableTabs();
});

// ======================
// ADD NEW TABLE
// ======================
addTableBtn.addEventListener("click", () => {
  const newTable = {
    id: nextTableId,
    name: `Table ${nextTableId}`,
    orderLines: []
  };
  tables.push(newTable);
  currentTableId = nextTableId;
  nextTableId++;
  updateUI();
});

// ======================
// UPDATE UI
// ======================
function updateUI() {
  renderTableTabs();
  renderOrderTable();
}

// ======================
// INIT
// ======================
renderDrinkButtons();
updateUI();
