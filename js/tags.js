class PopUpInfo extends HTMLElement {
	constructor() {
	  // Always call super first in constructor
	  super();
	}
	connectedCallback(){
	  // Create a shadow root
	   this.attachShadow({mode: 'open'});

	   let textContent = this.getAttribute('data-text');
	   let imgUrl=this.hasAttribute('img')?this.getAttribute('img'):'img/default.png';

	    let vEle=dom.vEle("div",{class:"wrapper"},[
			       dom.vEle("span",{class:"icon"},[
					dom.vEle("img",{src:imgUrl})
				   ]),
				   dom.vEle("span",{class:"info","textContent":textContent})
		]);
  
      var newEle= dom.createEle(vEle);

	  // Create some CSS to apply to the shadow dom
	  const style = document.createElement('style');
	  console.log(style.isConnected);
  
	  style.textContent = `
		.wrapper {
		  position: relative;
		}
		.info {
		  font-size: 0.8rem;
		  width: 200px;
		  display: inline-block;
		  border: 1px solid black;
		  padding: 10px;
		  background: white;
		  border-radius: 10px;
		  opacity: 0;
		  transition: 0.6s all;
		  position: absolute;
		  bottom: 20px;
		  left: 10px;
		  z-index: 3;
		}
		img {
		  width: 1.2rem;
		}
		.icon:hover + .info, .icon:focus + .info {
		  opacity: 1;
		}
	  `;
	  this.shadowRoot.append(style,newEle)
	  console.log(style.isConnected);
	}

  }
  
  customElements.define('popup-info', PopUpInfo);

  class FooterTag extends HTMLElement{
	constructor(){
		super()
        //const shadow = this.attachShadow({mode: 'open'});
	}
	connectedCallback(){
		let vEle= dom.vEle("p",{"class":"link",value:"gopal","innerHTML":"Copy Right :&copy;Venugopal reddy -from custom"});
        dom.renderVEle(this,vEle);
	}
  }

customElements.define('footer-tag', FooterTag);