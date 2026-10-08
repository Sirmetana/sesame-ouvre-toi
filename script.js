// Fournie : transforme 220 en "2,20 €". Tu n'as pas à la modifier.
function formatPrice(cents) {
  return (cents / 100).toFixed(2).replace(".", ",") + " €";
}

//Optimally, these should be externalised in a config file
const MAXSIZE = 16;
const categories = ["coffee", "tea", "pastry"];
const promoCode = "BARISTA";

let promo = false;
let nbCheckouts = 0;

document.querySelector("#categories").addEventListener("click", (event) =>
{
  const products =  document.querySelectorAll(".product");
  
  document.querySelector(".is-active").classList.remove("is-active");
  event.target.classList.add("is-active");
  switch(event.target.value)
  {
    case "all" :
      for(product of products)
      {
        product.classList.remove("is-hidden");
      }
      break;
    case "coffee" : 
      for(product of products)
      {
        if(product.querySelector(".product-category").textContent === "product-coffee")
        {
          product.classList.remove("is-hidden");
        }
        else
        {
          product.classList.add("is-hidden");
        } 
      }
      break;
    case "tea" :
      for(product of products)
      {
        if(product.querySelector(".product-category").textContent === "product-tea")
        {
          product.classList.remove("is-hidden");
        }
        else
        {
          product.classList.add("is-hidden");
        } 
      }
      break;
    case "pastry" :
      for(product of products)
      {
        if(product.querySelector(".product-category").textContent === "product-pastry")
        {
          product.classList.remove("is-hidden");
        }
        else
        {
          product.classList.add("is-hidden");
        } 
      }
      break;
      default :
        throw new Error("Illegal argument, unknown product category");   
  }
});

document.querySelector("#promo-form").addEventListener("submit", (event) =>
{
  event.preventDefault();
  if(document.querySelector("#promo-code").value.toUpperCase() === promoCode)
  {
    promo = true;
    document.querySelector("#promo-message").textContent = "Code promo validé, vous profitez de -10 % !";
  }
  else
  {
    promo = false;
    document.querySelector("#promo-message").textContent = "Code inconnu. N'essayez pas de tricher !";
  }
  document.querySelector("#promo-code").value = "";
  order.getSubTotal();
});

document.querySelector("#checkout").addEventListener("click", (event) =>
{
  event.preventDefault();
  console.log("Checkout");
  
  if(order.lines.length !=0)
  {
    const total = parseInt(document.querySelector("#ticket-total").textContent);

    order.lines.splice(0, order.lines.length);
    const ticketLines = document.querySelector("#ticket-lines");
    ticketLines.childNodes.forEach( (child) => ticketLines.removeChild(child));
    order.getSubTotal();

    promo = false;
    nbCheckouts ++;
    document.querySelector("#promo-code").value = "";
    document.querySelector("#customer-name").value = "";
    document.querySelector("#ticket-empty").classList.remove("is-hidden");
    document.querySelector("#ticket-title").value = `Ticket n°${nbCheckouts}`;

  }
});

const order =
{
  lines: [],
  customer: "",
  add: function (product) 
  {
    let found = false;

    if(!product) throw new Error("Illegal argument, product added to the order is null.");
    if(product.id < 1 || product.id > MAXSIZE) throw new Error("Illegal argument, product id doesn't exist.");

    for(let i = 0; i < this.lines.length && !found; i++)
    {
      if(this.lines[i].id === product.id)
      {
        this.lines[i].quantity++;
        found = true;
      }
    }
    if(!found)  //Avoid duplicates. Only create elements once
    {
      this.lines.push({id: product.id, name: product.name, price: product.price, quantity: 1});
      const line = document.createElement("li");
      const lineName = document.createElement("span");
      const lineQuantity = document.createElement("span");
      const linePrice = document.createElement("span");
      const lineRemoveButton = document.createElement("button");
      const lineRemoveOneButton = document.createElement("button");

      line.classList.add("ticket-line");
      lineName.classList.add("line-name");
      lineQuantity.classList.add("line-qty");
      linePrice.classList.add("line-price");
      lineRemoveButton.classList.add("line-remove");
      lineRemoveOneButton.classList.add("line-remove");

      lineName.textContent = product.name;
      lineQuantity.textContent = "1 X";
      linePrice.textContent = formatPrice(product.price);
      lineRemoveButton.textContent = "X";
      lineRemoveOneButton.textContent = "-";

      line.appendChild(lineName);
      line.appendChild(lineQuantity);
      line.appendChild(linePrice);
      line.appendChild(lineRemoveButton);
      line.appendChild(lineRemoveOneButton);

      lineRemoveButton.addEventListener("click", (event ) =>
      {
        //this.remove(product.id);
        document.querySelector("#ticket-lines").removeChild(line);
        const indexToRemove = this.lines.findIndex((element) => element.id === product.id);
        if(indexToRemove >=0) this.lines.splice(indexToRemove, 1);    
        this.getSubTotal();
        document.querySelector("#ticket-empty").classList.remove("is-hidden");
      });

      lineRemoveOneButton.addEventListener("click", (event ) =>
      {
        const currentQuantity = parseInt(lineQuantity.textContent);
        if(currentQuantity > 1) 
        {
          lineQuantity.textContent = (currentQuantity -1) + " X";
          const indexToReduce = this.lines.findIndex((element) => element.id === product.id);
          this.lines[indexToReduce].quantity = parseInt(this.lines[indexToReduce].quantity) - 1;
          this.getSubTotal();
        }
        else
        {
          //this.remove(id);
          document.querySelector("#ticket-lines").removeChild(line);
          const indexToRemove = this.lines.findIndex((element) => element.id === product.id);
          if(indexToRemove >=0) this.lines.splice(indexToRemove, 1);    
          this.getSubTotal();
          document.querySelector("#ticket-empty").classList.remove("is-hidden");
        }
      });

      document.querySelector("#ticket-empty").classList.add("is-hidden");
      document.querySelector("#ticket-lines").appendChild(line);
    }
    else
    {
      const ticketLines = document.querySelector("#ticket-lines");
      for(const ticketLine of ticketLines.childNodes)
      {
        if(ticketLine.querySelector(".line-name").textContent === product.name)
        { 
          ticketLine.querySelector(".line-qty").textContent = (parseInt(ticketLine.querySelector(".line-qty").textContent) +1) + " X";
        }
      }
      
    }
    this.getSubTotal();
  },
  remove: function(id)
  {//Comment récupérer line à partir de l'id seul ?
    // const ticketLines = document.querySelector("#ticket-lines");
    // const line = ticketLines.
    // ticketLines.removeChild(line);
    // const indexToRemove = this.lines.findIndex((element) => element.id === id);
    // if(indexToRemove >=0) this.lines.splice(indexToRemove, 1);
    // subTotalSpan.textContent = this.getSubTotal();
    // if(this.lines.length === 0) document.querySelector("#ticket-empty").classList.remove("is-hidden");
  },
  getSubTotal: function()
  {
    let subTotal = 0;
    for(let i = 0; i < this.lines.length; i++)
    {
      subTotal += this.lines[i].price * this.lines[i].quantity;
    }
    const discount = subTotal * 0.1 * promo;
    document.querySelector("#ticket-discount").textContent = formatPrice(parseInt(discount));
    document.querySelector("#ticket-total").textContent = formatPrice(subTotal - discount);
    return formatPrice(subTotal - discount);
  }
}

const form = document.querySelector("#customer-form").addEventListener("submit", (event) =>
{
  event.preventDefault();
  const customerName = document.querySelector("#customer-name");
  const customerError = document.querySelector("#customer-error");
  if(!customerName.value || customerName.value.replaceAll(" ", "") === "")
  {  
    customerError.textContent = "Vous n'avez écris aucun nom. Veuillez réessayer";
  }
  else
  {
    customerError.textContent = "";
    order.customer = customerName.value;
    document.querySelector("#ticket-title").textContent = `Ticket de ${customerName.value}`;
    customerName.value = "";
  }
})


function createProductCard(product)
{
  if(!product) throw new Error("Illegal argument, no product given.");
  if(product.name === undefined || product.category === undefined || product.price === undefined || product.available === undefined) throw new Error("Illegal property, missing properties");
  if(product.price <=0) throw new Error("Illegal property, negative price");
  let legalCategory = false;
  for(let i = 0; i < categories.length && !legalCategory; i++)
    {
      if(product.category == categories[i] ) legalCategory = true;
    }
    if(!legalCategory)  throw new Error("Illegal category");
  
  const productArticle = document.createElement("article");
  const productCategory = document.createElement("span");
  const productName = document.createElement("h3");
  const productPrice = document.createElement("p");
  const productAddButton = document.createElement("button");

  productArticle.classList.add("product");
  productCategory.classList.add("product-category");
  productName.classList.add("product-name");
  productPrice.classList.add("product-price");
  productAddButton.classList.add("product-add");

  productName.textContent = product.name;
  productCategory.textContent = `product-${product.category}`;
  productPrice.textContent = formatPrice(product.price);
  productAddButton.textContent = "Ajouter";

  if(!product.available)
  {
    productArticle.classList.add("is-sold-out");
    productAddButton.disabled = true;
  }

  productAddButton.addEventListener("click", () => order.add(product));
  
  productArticle.appendChild(productCategory);
  productArticle.appendChild(productName);
  productArticle.appendChild(productPrice);
  productArticle.appendChild(productAddButton);

  document.querySelector("#menu").appendChild(productArticle);
}

function renderMenu()
{
  const menuContainer = document.querySelector("#menu");
  while(menuContainer.hasChildNodes())
  {
    menuContainer.removeChild(menuContainer.lastElementChild);
  }
  
  if(menu.length != MAXSIZE) throw new Error(`Illegal number of articles. Menu should have exactly ${MAXSIZE} products, instead has ${menu.length}.`)
  for(let i = 0; i < menu.length; i++)
  {
    if(!categories.includes(menu[i].category) ) throw new Error(`Illegal argument. Product #${i}'s category isn't a standard one.`)
    createProductCard(menu[i]);
  }
}

// Étape 1 · Afficher la carte
renderMenu();


// Étape 2 · Les produits épuisés


// Étape 3 · L'objet order

// Étape 4 · Afficher le ticket


// Étape 5 · Retirer une ligne


// Étape 6 · Filtrer par catégorie


// Étape 7 · Le prénom du client


// Étape 8 · Le code promo


// Bonus
