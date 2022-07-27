// main.js

// grab a reference to all "delete" icons (these are spans with the class "fa-trash"
const deleteBtn = document.querySelectorAll(".fa-trash");
// grab a reference to all spans with class "item"
const item = document.querySelectorAll(".item span");
// grab a reference to all spans with "item" class and "completed" class
const itemCompleted = document.querySelectorAll(".item span.completed");

// turn the deleteBtn collection into an array, and iterate it with forEach
Array.from(deleteBtn).forEach((element) => {
  // add 'deleteItem' function to the click event of each item
  element.addEventListener("click", deleteItem);
});

// turn the item collection into an array, and iterate it with forEach
Array.from(item).forEach((element) => {
  // add 'markComplete' function to the click event of each item
  element.addEventListener("click", markComplete);
});

// turn the itemCompleted collection into an array, and iterate it with forEach
Array.from(itemCompleted).forEach((element) => {
  // add 'markUnComplete' function to the click event of each item
  element.addEventListener("click", markUnComplete);
});

// define the deleteItem async function for removing items from the list when clicked
async function deleteItem() {
  // get the second child of the parentNode of this item - this selects the span, and assign the text from the span to itemText
  const itemText = this.parentNode.childNodes[1].innerText;
  // start try block
  try {
    // send a network request via fetch, to the 'deleteItem' endpoint
    const response = await fetch("deleteItem", {
      // HTTP method 'delete'
      method: "delete",
      // set basic headers
      headers: { "Content-Type": "application/json" },
      // send a body containing JSON of the itemText, this is the item to delete
      body: JSON.stringify({
        // set the property 'itemFromJS:' to 'itemText'
        itemFromJS: itemText,
      }),
    });
    // process the response stream to json data
    const data = await response.json();
    // log the json data
    console.log(data);
    // reload the window
    location.reload();
  } catch (err) {
    // log any errors
    console.log(err);
  }
}

async function markComplete() {
  // get the second child of the parentNode of this item - this selects the span, and assign the text from the span to itemText
  const itemText = this.parentNode.childNodes[1].innerText;
  // start try block
  try {
    // send a network request via fetch, to the 'markComplete' endpoint
    const response = await fetch("markComplete", {
      // HTTP method 'put'
      method: "put",
      // set basic headers
      headers: { "Content-Type": "application/json" },
      // send a body containing JSON of the itemText, this is the item to mark complete
      body: JSON.stringify({
        // set the property 'itemFromJS:' to 'itemText'
        itemFromJS: itemText,
      }),
    });
    // process the response stream to json data
    const data = await response.json();
    // log the json data
    console.log(data);
    // reload the window
    location.reload();
  } catch (err) {
    // log any errors
    console.log(err);
  }
}

async function markUnComplete() {
  // get the second child of the parentNode of this item - this selects the span, and assign the text from the span to itemText
  const itemText = this.parentNode.childNodes[1].innerText;
  // start try block
  try {
    // send a network request via fetch, to the 'markUnComplete' endpoint
    const response = await fetch("markUnComplete", {
      // HTTP method 'put'
      method: "put",
      // set basic headers
      headers: { "Content-Type": "application/json" },
      // send a body containing JSON of the itemText, this is the item to mark incomplete
      body: JSON.stringify({
        // set the property 'itemFromJS:' to 'itemText'
        itemFromJS: itemText,
      }),
    });
    // process the response stream to json data
    const data = await response.json();
    // log the json data
    console.log(data);
    // reload the window
    location.reload();
  } catch (err) {
    // log any errors
    console.log(err);
  }
}
