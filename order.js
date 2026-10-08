import {formatPrice} from "./formatPrice.js";
import { MAXSIZE, CATEGORIES } from "./config.js";

// let promo = false;
export const order =
{
  lines: [],
  customer: "",
  promo: false,
  add: function (product) 
  {
    if(!product) throw new Error("Illegal argument, product added to the order is null.");
    if(product.id < 1 || product.id > MAXSIZE) throw new Error("Illegal argument, product id doesn't exist.");

    const foundElement = this.lines.find( (element) => element.id === product.id);
    if(foundElement === undefined)  //Avoid duplicates. Only create elements once
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
      foundElement.quantity++;
    }
    this.getSubTotal();
  },
  remove: function(id)
  {//Comment récupérer line à partir de l'id seul ?
    // const ticketLines = document.querySelector("#ticket-lines");
    // const line = ticketLines.
    // ticketLines.removeChild(line);
    // const indexToRemove = this.lines.findIndex((element) => element.id === id);
    // if(indexToRemove >=0) this.lines.remove(indexToRemove);
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
    const discount = subTotal * 0.1 * this.promo;
    document.querySelector("#ticket-discount").textContent = formatPrice(parseInt(discount));
    document.querySelector("#ticket-total").textContent = formatPrice(subTotal - discount);
    return formatPrice(subTotal - discount);
  }
};