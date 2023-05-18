
function createElement(name,attributes,innerHTML){
    const element= document.createElement(name);
     for(let key in attributes){
         element.setAttribute(key,attributes[key])
     }
     if(innerHTML!=undefined){
        element.innerHTML=innerHTML;
     }
     return element;
 }
 

class PopUpInfo extends HTMLElement {
	constructor() {
	  // Always call super in constructor first.
	  super();
	  // Create a shadow root
	  const shadow = this.attachShadow({mode: 'open'});
	  // Create spans
	  const wrapper =createElement('span',{"class":"wrapper"});
	  const icon =createElement('span',{"class":"icon","tabindex":0});
	  const info = createElement('span',{"class":"info"});
	  // Take attribute content and put it inside the info span
	  const text = this.getAttribute('data-text');
	  info.textContent = text;
  
	  // Insert icon
	  let imgUrl;
	  if(this.hasAttribute('img')) {
		imgUrl = this.getAttribute('img');
	  } else {
		imgUrl = 'img/default.png';
	  }
  
	  const img =createElement('img',{"src":imgUrl});
	  icon.appendChild(img);
  
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
		  display: block;
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
	  // Attach the created elements to the shadow dom
	 // shadow.appendChild(style);
	 // this.shadowRoot.appendChild(style)
	  console.log(style.isConnected);
	  wrapper.appendChild(icon);
	  wrapper.appendChild(info);
      shadow.appendChild(wrapper);
	 
	
	}

  }
  customElements.define('popup-info', PopUpInfo);

  class FooterTag extends HTMLElement{
	constructor(){
		super()
        //const shadow = this.attachShadow({mode: 'open'});
        let element= createElement("p",{"class":"link",value:"gopal"},"Copy Right :&copy;Venugopal reddy -from custom");
        this.appendChild(element)
	}
  }

  customElements.define('footer-tag', FooterTag);