// Fournie : transforme 220 en "2,20 €". Tu n'as pas à la modifier.
function formatPrice(cents) {
  return (cents / 100).toFixed(2).replace(".", ",") + " €";
}

const MAXSIZE = 16;
const categories = ["coffee", "tea", "pastry"];

const order =
{
  lines: [],
  add: function (product) 
  {  
    const subTotalSpan = document.querySelector("#ticket-total");
    const line = document.createElement("li");
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
        document.querySelector("#ticket-lines").removeChild(line);
        const indexToRemove = this.lines.findIndex((element) => element.id === product.id);
        if(indexToRemove >=0) this.lines.splice(indexToRemove, 1);    
        subTotalSpan.textContent = this.getSubTotal();
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
          subTotalSpan.textContent = this.getSubTotal();
        }
        else
        {
          document.querySelector("#ticket-lines").removeChild(line);
          const indexToRemove = this.lines.findIndex((element) => element.id === product.id);
          if(indexToRemove >=0) this.lines.splice(indexToRemove, 1);    
          subTotalSpan.textContent = this.getSubTotal();
          document.querySelector("#ticket-empty").classList.remove("is-hidden");
        }
      });

      document.querySelector("#ticket-empty").classList.add("is-hidden");
      document.querySelector("#ticket-lines").appendChild(line);
    }
    else
    {
      const ticketLines = document.querySelector("#ticket-lines");
      for(ticketLine of ticketLines.childNodes)
      {
        if(ticketLine.querySelector(".line-name").textContent === product.name)
        { 
          ticketLine.querySelector(".line-qty").textContent = (parseInt(ticketLine.querySelector(".line-qty").textContent) +1) + " X";
        }
      }
      
    }
    subTotalSpan.textContent = this.getSubTotal();
  },
  // remove: function(id)
  // {

  // },
  getSubTotal: function()
  {
    let subTotal = 0;
    for(let i = 0; i < this.lines.length; i++)
    {
      subTotal += this.lines[i].price * this.lines[i].quantity;
    }
    return formatPrice(subTotal);
  }
}

function createProductCard(product)    //createProductCard(name, category, )
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
  productCategory.textContent = product.category;
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
