import {order} from "./order.js";
import {menu} from "./menu.js";
import {formatPrice} from "./formatPrice.js";
import { MAXSIZE, CATEGORIES, PROMOCODE } from "./config.js";

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
  if(document.querySelector("#promo-code").value.toUpperCase() === PROMOCODE)
  {
    order.promo = true;
    document.querySelector("#promo-message").textContent = "Code promo validé, vous profitez de -10 % !";
  }
  else
  {
    order.promo = false;
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

    order.promo = false;
    nbCheckouts ++;
    document.querySelector("#promo-code").value = "";
    document.querySelector("#customer-name").value = "";
    document.querySelector("#ticket-empty").classList.remove("is-hidden");
    document.querySelector("#ticket-title").value = `Ticket n°${nbCheckouts}`;
  }
});

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
  for(let i = 0; i < CATEGORIES.length && !legalCategory; i++)
    {
      if(product.category == CATEGORIES[i] ) legalCategory = true;
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
    if(!CATEGORIES.includes(menu[i].category) ) throw new Error(`Illegal argument. Product #${i}'s category isn't a standard one.`)
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
