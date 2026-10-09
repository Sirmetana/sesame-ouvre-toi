import {formatPrice} from "./formatPrice.js";
import { MAXSIZE, CATEGORIES } from "./config.js";

export const order =
{
    lines: localStorage.getItem("lines") ? JSON.parse(localStorage.getItem("lines")) : [],
    customer: "",
    promo: localStorage.getItem("promoValid") === "true",
    add: function (product) 
    {
        if(!product) throw new Error("Illegal argument, product added to the order is null.");
        if(product.id < 1 || product.id > MAXSIZE) throw new Error("Illegal argument, product id doesn't exist.");

        const foundElement = this.lines.find( (element) => element.id === product.id);

        if(foundElement === undefined)  //Avoid duplicates. Only create elements once
        {
            this.lines.push({id: product.id, name: product.name, price: product.price, category: product.category, quantity: 1});
        }
        else
        {
            foundElement.quantity++;
        }
        localStorage.setItem("lines", JSON.stringify(this.lines));
        document.querySelector("#ticket-empty").classList.add("is-hidden");

        this.createTicketLines();
        this.getSubTotal();
    },
    createTicketLines: function ()
    {
        const ticketLines = document.querySelector("#ticket-lines");
        while(ticketLines.hasChildNodes())
        {
            ticketLines.removeChild(ticketLines.lastChild);
        }

        for(const line of this.lines)
        {
            const lineElement = document.createElement("li");
            const lineName = document.createElement("span");
            const lineQuantity = document.createElement("span");
            const linePrice = document.createElement("span");
            const lineRemoveButton = document.createElement("button");
            const lineRemoveOneButton = document.createElement("button");
            
            lineElement.classList.add("ticket-line");
            lineName.classList.add("line-name");
            lineQuantity.classList.add("line-qty");
            linePrice.classList.add("line-price");
            lineRemoveButton.classList.add("line-remove");
            lineRemoveOneButton.classList.add("line-remove");
            
            lineName.textContent = line.name;
            lineQuantity.textContent = `${line.quantity} X`;
            linePrice.textContent = formatPrice(line.price);
            lineRemoveButton.textContent = "X";
            lineRemoveOneButton.textContent = "-";

            lineElement.dataset.id = line.id;
            
            lineElement.appendChild(lineName);
            lineElement.appendChild(lineQuantity);
            lineElement.appendChild(linePrice);
            lineElement.appendChild(lineRemoveButton);
            lineElement.appendChild(lineRemoveOneButton);

            lineRemoveButton.addEventListener("click", (event ) =>
            {
                this.remove(line.id);
                localStorage.setItem("lines", JSON.stringify(this.lines));
            });

            lineRemoveOneButton.addEventListener("click", () =>
            {
                const currentQuantity = line.quantity;
                if(currentQuantity > 1) 
                {
                    lineQuantity.textContent = (currentQuantity -1) + " X";
                    line.quantity--;
                    this.getSubTotal();
                }
                else
                {
                    this.remove(line.id);
                }
                localStorage.setItem("lines", JSON.stringify(this.lines));
            });          
            ticketLines.appendChild(lineElement);
        }
    },
    remove: function(id)
    {
        // const line = document.querySelector(`#ticket-lines > [data-id="${id}"]`);
        // line.parentNode.removeChild(line);
        const indexToRemove = this.lines.findIndex((element) => element.id === id);
        if(indexToRemove >=0) this.lines.splice(indexToRemove, 1);
        this.createTicketLines();
        this.getSubTotal();
        localStorage.setItem("lines", JSON.stringify(this.lines));

        if(this.lines.length === 0) document.querySelector("#ticket-empty").classList.remove("is-hidden");
    },
    getNbFormulas:  function ()
    {
        let beverageCount = 0;
        let pastryCount = 0;
        for(const line of this.lines)
        {
            if(line.category === "coffee" || line.category === "tea") beverageCount+= line.quantity;
            if(line.category === "pastry") pastryCount+= line.quantity;
        }
        return Math.min(beverageCount, pastryCount);
    },
    getSubTotal: function()
    {
        let subTotal = 0;
        for(let i = 0; i < this.lines.length; i++)
        {
            subTotal += this.lines[i].price * this.lines[i].quantity;
        }
        const nbFormulas = this.getNbFormulas();
        document.querySelector("#ticket-formulas").textContent = formatPrice(parseInt(nbFormulas*100));
        subTotal -= nbFormulas*100;

        const discount = subTotal * 0.1 * this.promo;
        document.querySelector("#ticket-discount").textContent = formatPrice(parseInt(discount));
        document.querySelector("#ticket-total").textContent = formatPrice(subTotal - discount);
        return formatPrice(isNaN(subTotal - discount) ? 0 : subTotal - discount);
    }
};