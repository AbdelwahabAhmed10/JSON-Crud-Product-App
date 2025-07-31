let body = document.body;
// all inputs in spec case
let ALL_INPUTS_IN_APP = document.querySelectorAll("input");

// Elements
let product_name = document.getElementById("product_name");
let product_category = document.getElementById("product_category");
let product_image = document.getElementById("product_image");
let product_count = document.getElementById("product_count");
let cost_inputs = document.querySelectorAll("#cost_inputs input");
let actions = document.getElementById("actions");
let product_counter = document.getElementById("product_counter");
let delete_all_btn = document.getElementById("delete_all_btn");
let no_products = document.getElementById("no_products");
let tbody = document.getElementById("tbody");
let add_product_btn = document.getElementById("add_product_btn");
let reset_btn = document.getElementById("reset_btn");
let modalBackdrop = document.getElementById("modalBackdrop");


// Flag
let global_id ;
let mode = 'create';


// Check Empty Product
let checkemptydata = () => {
  if (tbody.childElementCount === 0 && localStorage.local_all_products == null) {
    actions.classList.add("none");
    tbody.parentElement.classList.add("none");
    no_products.classList.remove("none");
  } else {
    actions.classList.remove("none");
    tbody.parentElement.classList.remove("none");
    no_products.classList.add("none");
  }
};

checkemptydata();

// All Products Array
let all_product_array;

if (localStorage.local_all_products) {
  all_product_array = JSON.parse(localStorage.local_all_products);
} else {
  all_product_array = [];
}

// Count The Products
let count_products = () => {
  product_counter.innerHTML = `${all_product_array.length}`;
};

// Reset inputs
let reset_inputs = () => {

  if (mode == 'update') {
    mode = 'create';
    product_count.classList.remove("none");
    reset_btn.innerHTML="Reset";
    add_product_btn.innerHTML="Add Your Product";
  }
     for (let i = 0; i < ALL_INPUTS_IN_APP.length; i++) {
    ALL_INPUTS_IN_APP[i].value = "";
  }
  
 
  count_products();
};
reset_btn.addEventListener("click", reset_inputs);

// Calc Product Cost
let product_cost = () => {
  let cost = cost_inputs[0].value;
  let Tax = cost_inputs[1].value;
  let My_Profit = cost_inputs[2].value;
  let Discount = cost_inputs[3].value;

  let TaxCost = +cost * (+Tax / 100);
  let SaleCostAfterMyProfit = +cost + TaxCost + +My_Profit;
  let DiscountCost = SaleCostAfterMyProfit * (+Discount / 100);
  let NetCost = SaleCostAfterMyProfit - DiscountCost;

  cost_inputs[4].value = Math.ceil(NetCost);
  cost_inputs[5].value = Math.ceil(NetCost - +cost);
};

// Add Event To Cost Inputs
for (let i = 0; i < cost_inputs.length; i++) {
  cost_inputs[i].addEventListener("input", product_cost);
}

// Show Data From The Array
let show_data = () => {
  checkemptydata();
  let table_row = "";
  for (let i = 0; i < all_product_array.length; i++) {
    table_row += `
      <tr data-index="${i}">
        <td>${i + 1}</td>
        <td>${all_product_array[i].name}</td>
        <td>${all_product_array[i].category}</td>
        <td><i onclick="show_data_modal(${i})" class="fa-solid fa-eye text-info"></i></td>
        <td><i onclick="update_product(${i})" class="fa-solid fa-pen-to-square text-warning"></i></td>
        <td><i onclick="trash(${i})" class="fa-solid fa-trash-can text-danger"></i></td>
      </tr>
    `;
  }
  tbody.innerHTML = table_row;
  count_products();
};

show_data();

// Show Data Modal
let show_data_modal = (index) => {
  modalBackdrop.classList.replace("none", "modal-backdrop");
  modalBackdrop.innerHTML = `
    <div class="custom-modal">
      <h2>${all_product_array[index].name}</h2>
      <hr>
      <img src="${all_product_array[index].image}" width="150px">
      <hr>
      <h5><span class='show_modal_tittles'>Category :</span> ${all_product_array[index].category}</h5>
      <hr>
      <h5><span class='show_modal_tittles'>Cost :</span> ${all_product_array[index].cost}</h5>
      <hr>
      <h5><span class='show_modal_tittles'>Tax :</span> ${all_product_array[index].Tax}</h5>
      <hr>
      <h5><span class='show_modal_tittles'>Profit :</span> ${all_product_array[index].My_Profit}</h5>
      <hr>
      <h5><span class='show_modal_tittles'>Discount :</span> ${all_product_array[index].Discount}</h5>
      <hr>
      <h5><span class='show_modal_tittles'>Net Cost :</span> ${all_product_array[index].net_cost}</h5>
      <hr>
      <h5><span class='show_modal_tittles'>Net Profit :</span> ${all_product_array[index].net_profit}</h5>
      <hr>
      <button onclick="close_the_modal()" class="btnmodalclose">Close</button>
    </div>
  `;
};

// Close The Modal
let close_the_modal = () => {
  modalBackdrop.classList.replace("modal-backdrop", "none");
};

// Delete All
let delete_all_fun = () => {
  if (confirm("Are You Sure ?")) {
    all_product_array = [];
    tbody.innerHTML = "";
    localStorage.removeItem("local_all_products");
    count_products();
    checkemptydata();
  }
};
delete_all_btn.addEventListener("click", delete_all_fun);

// Check Inputs & Create Product
let check_inputs_and_create = () => {
  let allInputsAreValid = true;

  for (let i = 0; i < ALL_INPUTS_IN_APP.length; i++) {
    if (
      ALL_INPUTS_IN_APP[i].id !== "product_image" &&
      ALL_INPUTS_IN_APP[i].value.trim() === ""
    ) {
      allInputsAreValid = false;
      break;
    }
  }

  if (!allInputsAreValid) {
    alert("Please fill in all required fields");
    return;
  }

  let newproduct = {
    name: product_name.value,
    category: product_category.value,
    cost: cost_inputs[0].value,
    Tax: cost_inputs[1].value,
    My_Profit: cost_inputs[2].value,
    Discount: cost_inputs[3].value,
    net_cost: cost_inputs[4].value,
    net_profit: cost_inputs[5].value,
    image: product_image.value,
    product_count: product_count.value,
  };

  if (mode == 'create') {
    let count = newproduct.product_count > 0 ? newproduct.product_count : 1;
    for (let i = 0; i < count; i++) {
      all_product_array.push(newproduct);
    }
  }else{
    all_product_array[global_id] = newproduct;
    mode = 'create';
    product_count.classList.remove("none");
    reset_btn.innerHTML="Reset";
    add_product_btn.innerHTML="Add Your Product";
    
  }
    
  localStorage.setItem("local_all_products", JSON.stringify(all_product_array));
  show_data();
  reset_inputs();
  checkemptydata();
};
add_product_btn.addEventListener("click", check_inputs_and_create);

// Trash Btn
let trash = (index) => {
  if (confirm("Are You Sure ?")) {
    all_product_array.splice(index, 1);
    localStorage.local_all_products = JSON.stringify(all_product_array);
    if (JSON.parse(localStorage.local_all_products).length == 0 ) {
      localStorage.removeItem("local_all_products");
    }
    show_data();
    checkemptydata();
  }
};

// Edit
let update_product = (index) =>{
     global_id = index ;
     mode = 'update';
     product_name.value=all_product_array[index].name ;
     product_category.value=all_product_array[index].category ;
     cost_inputs[0].value=all_product_array[index].cost ;
     cost_inputs[1].value=all_product_array[index].Tax ;
     cost_inputs[2].value=all_product_array[index].My_Profit ;
     cost_inputs[3].value=all_product_array[index].Discount ;
     cost_inputs[4].value=all_product_array[index].net_cost ;
     cost_inputs[5].value=all_product_array[index].net_profit ;
     product_image.value=all_product_array[index].image ;
     product_count.value=all_product_array[index].product_count ;

     add_product_btn.innerHTML = 'Update Your Product';
     reset_btn.innerHTML = 'Cancel';
     product_count.classList.add("none")
     window.scrollTo({
    top: 0,           
    behavior: "smooth" 
  });
}
