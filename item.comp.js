const mItemTemplate = document.createElement('template');

mItemTemplate.innerHTML = `
<style>
    #base{
        background-color: #ffffff;
        border: 3px solid black;
        border-radius: 10px;
        margin: 5px;
        padding: 10px;
    }
</style>
<div id='base'>

</div>
`
class MItem extends HTMLElement{
    constructor(itemName){
        super();
        this.attachShadow({ mode: 'open' })
        this.shadowRoot.appendChild(mItemTemplate.content.cloneNode(true));
        this.R = this.shadowRoot;
        this.base = this.R.querySelector('#base')
        if(itemName){
            this.name = itemName;
        }
    }
    connectedCallback(){
        this.base.innerHTML = this.name;
        this.base.addEventListener('dblclick', () => {
            mav.navigate(mav.cd + this.name);
        });
    }
}
window.customElements.define('m-item', MItem);

module.exports = { MItem }