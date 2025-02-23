/**
 * Copyright 2025 mbisch11
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

/**
 * `counter-app`
 * 
 * @demo index.html
 * @element counter-app
 */
export class CounterApp extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "counter-app";
  }

  constructor() {
    super();
    this.counter = 1;
    this.min = 0;
    this.max = 99;
    this.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/counter-app.ar.json", import.meta.url).href +
        "/../",
      locales: ["ar", "es", "hi", "zh"],
    });
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      counter: { type: Number },
      min: { type : Number },
      max: { type : Number }
    };
  }

  // Lit scoped styles
  static get styles() {
    return [super.styles,
    css`
      :host {
        display: grid;
        color: var(--ddd-theme-primary);
        background-color: var(--ddd-theme-accent);
        font-family: var(--ddd-font-navigation);
      }
      .wrapper {
        margin: var(--ddd-spacing-2);
        padding: var(--ddd-spacing-4);
        border: 3px solid black; 
        border-radius: 30px;
        background-color: lightblue;
        width: 100px;
        display: grid;
      }
      h3 span {
        font-size: var(--counter-app-label-font-size, var(--ddd-font-size-s));
        margin: auto;
      }
      .num{
        margin: auto;
        font-size: 50px;
        color: white;
      }
      .bttn {
        margin: auto;
        height: 30px;
        width: 30px;
        font-size: 24px;
        border-radius : 3px;
        background-color: black;
        font-size: white;
      }
      .bttn:hover {
        background-color : light-gray;
        color: red;
      }
      .bttn:active{
        background-color : white;
        color: red;
      }
      .button_wrapper { 
        display: flex;
        margin: auto;
      }
      #minus {
        padding-top: 0px;
        padding-bottom: 7px;
        padding-right: 9px;
        padding-left: 9px;
        margin-left: 5px;
      }
      #plus {
        padding-top: 0px;
        padding-bottom: 7px;
        padding-right: 5px;
        padding-left: 5px;
        margin-right: 5px;
      }
    `];
  }


  updateCounter(change){
    let newNumber = this.counter + change;
    if(newNumber >= this.min && newNumber <= this.max) {
      this.counter = newNumber;
    }
  }

  firstUpdated() {
    this.shadowRoot.getElementById("plus").addEventListener("click", () => {
      this.updateCounter(1);
    });
    this.shadowRoot.getElementById("minus").addEventListener("click", () => {
      this.updateCounter(-1);
    });
  }

  
updated(changedProperties) {
  if (changedProperties.has('counter') && this.counter === 21) {
    this.makeItRain();
  }
  if (this.counter === 18){
    this.shadowRoot.querySelector(".num").style.color = 'yellow';
  }else if(this.counter === 21){
    this.shadowRoot.querySelector(".num").style.color = "green";
  }else if(this.counter === this.max || this.counter === this.min){
    this.shadowRoot.querySelector(".num").style.color = "red";
  }else if(this.counter !== this.max || this.counter !== this.max){
    this.shadowRoot.querySelector(".num").style.color = "white";
  }
}

makeItRain() {
  // this is called a dynamic import. It means it won't import the code for confetti until this method is called
  // the .then() syntax after is because dynamic imports return a Promise object. Meaning the then() code
  // will only run AFTER the code is imported and available to us
  import("@lrnwebcomponents/multiple-choice/lib/confetti-container.js").then(
    (module) => {
      // This is a minor timing 'hack'. We know the code library above will import prior to this running
      // The "set timeout 0" means "wait 1 microtask and run it on the next cycle.
      // this "hack" ensures the element has had time to process in the DOM so that when we set popped
      // it's listening for changes so it can react
      setTimeout(() => {
        // forcibly set the poppped attribute on something with id confetti
        // while I've said in general NOT to do this, the confetti container element will reset this
        // after the animation runs so it's a simple way to generate the effect over and over again
        this.shadowRoot.querySelector("#confetti").setAttribute("popped", "");
      }, 0);
    }
  );
}

  // Lit render the HTML
  render() {
    return html`
<confetti-container id="confetti">
<div class="wrapper">
  <h3 class="num"><slot>${this.counter}</slot></h3>
  <div class="button_wrapper">
    <button class="bttn" id="plus" ?disabled="${this.max === this.counter}">+</button>
    <button class="bttn" id="minus" ?disabled="${this.min === this.counter}">-</button>
  </div>
</div>
</confetti-container> `;
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(CounterApp.tag, CounterApp);