"use strict";
(function(window , document){
	 //Variables declaration
	 var location = window.location,uid=0;
	 const getUid = ()=>"00"+(++uid)
	 const toJson=(str) => JSON.parse(str)
	 //const toStr=(obj)=>JSON.stringify(obj)
	 let ATTR_PREFIX="mvc";
	 const cntrlAttr="mvc-con";
	 const props=["bind","model", "if","for"];

	 function foreach(array,fn){  for(let ele of array){ fn(ele);} }

      class Logger{
		constructor(){}
		info(txt){ console.info(txt);}
		error(txt){ console.error(txt);}
		log(txt){ console.log(txt);}
		warn(txt){ console.warn(txt);}
	  }

	 class HTTPService {
		constructor(){}
		get(url,conf){ 
			return this.newPromise(url,"GET",conf);
		}
		post(conf){ 
			return this.newPromise(conf.url,"POST",conf,conf.data);
	  	 }
		upload(formid,action){              // for uploading files
			file = document.getElementById(formid),
			formData = new FormData();   
			formData.append("upload", file.files[0]);// apply
			return this.newPromise(conf.url,"POST",conf,formData);
		}
    	newPromise(url,method,conf,data){
				var xhr=window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"); 
				var async=conf.async ? true:false, type=conf.rt=="html"?"html":"json";
				return new Promise((resolve, reject) => {
				var visited=false;
				xhr.onreadystatechange=()=>{
					if(visited==false){
						if(xhr.readyState==4 && xhr.status==200){
							visited=true;
							console.log("Content got from server")
                            var response=type=="html"?xhr.responseText:JSON.parse(xhr.responseText)
							resolve(response);  
						}else if(xhr.readyState==4 && xhr.status!=200){
							reject(xhr.responseText);
						}
					}
			};
			xhr.open(method,url,async);
			if(method=="POST"){
				xhr.send(data); 
			}else{
				xhr.send();
			}
			});
		}
	  }

     class HashRouter{ 
			constructor($http){
				this.routeMap=new Map();
				this._routes=[]; 
				this._root="/";
				this.$http=$http;
			} 
			when(route,view,controller){
				this.routeMap.set(route,{"controller":controller,"view":view});
				this._routes[route]={"controller":controller,"view":view}; return this;	
			}
			otherwise(to){this._root=to; }
			change(arg){location.hash=arg;}
			append(arg){location.hash=location.hash.concat(arg);}
			handleHashChange(){
					 var hv=location.hash.slice(1),route=this._routes[hv];
					 var temp=this.routeMap.get(hv);
					 if(route != undefined){
						 var controller=route.controller, viewUrl=route.view;
						 $http.get(viewUrl,{"async":true,"rt":"html"})
						 	  .then((value)=>{
									  if($html("view").getEle()!=undefined){
										$html("view").setHtml(value); 
										$domParser.parseDom();
										}
									   },
									(error)=> {
										$log.info(error);
							   }).catch((error)=>{
								console.error(error);
							   });
					}else{
						 this.change(this._root);
					}
			 }
		  }

	
	// Provides ioc and dependency Injection.
    class IOC{
		constructor(){
			this._controllers = [];
			this._services=[];
		} 
		setController(n, calback,di_arr) {
			this._controllers[n] = {"fn":calback,"di":di_arr};}
		getInjectedScope(ctrlName){
			//Implementing dependency injection
			var con=this._controllers[ctrlName];
			var scope={"id": getUid(),"views":[],"events":[]};
			var fn=con.fn;var args=[scope];
			if(con.di!=undefined){
				for(var i=0;i<con.di.length;i++){
						args.push(this.getService(con.di[i]));					 
				}
				}
			fn.apply(this,args);
			return scope;
		}
		setService(name,obj){this._services[name]=obj; }
		getService(name){return this._services[name]; }
		}
	 //Template engine
	  class Template{
		  constructor(){}
		  render(tmpl,data){
			var exp=/{{([^}}]+)?}}/i;var match; 
				   while (match = exp.exec(tmpl)) {
					   tmpl = tmpl.replace(match[0], data[match[1]]);
					}
				   return tmpl;
			  }
		bind(ele,obj){
				 var exp=/{{([^}}]+)?}}/i; var match;
					   var html=ele.innerHTML;
						  while (match = exp.exec(html)) {
								html = html.replace(match[0], obj[match[1]]);
						   }
				   ele.innerHTML=html;
				}
	    }

  // For parsing dom.
    class DomParser{
		constructor(){
		}
		isController(element){ return element!=null && element.hasAttribute(cntrlAttr); }
		hasChilderen(ele){ return ele!=null && ele.childElementCount > 0; }
	    parseDom() {
			var appRoot = document.getElementById("mvc");
			 if(appRoot!=null){
				 if(this.isController(appRoot)){ 
					  this.processCtrlTree(appRoot);
				  }else{
					 this.processChildTree(appRoot);
				  }
				 } 
			 }
		  processCtrlTree(cntrlEle) {
				var cntrlName=cntrlEle.getAttribute(cntrlAttr);
				var scope = $ioc.getInjectedScope(cntrlName);
				this.readAttr(cntrlEle,scope);
				updateViews(scope);
		   }	
		 processChildTree(ele) {
			  if(this.hasChilderen(ele)) {
				  for(let child of ele.children){
					 if(this.isController(child)){ 
							this.processCtrlTree(child); 
					  }else{
							this.processChildTree(child); 
						}
					 }
				}
			}
	   
		readAttr(ele,scope) {
				for(let child of ele.children){
				 const attrList=child.attributes;
				 for(const attr of  attrList){
					 if(attr.name.startsWith(ATTR_PREFIX)){
						this.processAttributes(scope,child,attr.name,attr.value)
					 }
				  }				
				  if(this.hasChilderen(child)){
					 this.readAttr(child,scope);		
					}	 
				}
		 }
		processAttributes(scope,ele,attrName,value) {
				    const name=attrName.split("-")[1];
					switch (name) {
					case "bind":
						var view={"ele":ele,"name":value,"tmpl":ele.innerHTML};
						    scope.views.push(view);
						   /* view.ele.innerHTML=$template.render(view.tmpl,scope); */
						break;
					case "model":
							if(scope.hasOwnProperty(value)){
								ele.value=scope[value]==undefined?"":scope[value];
							 }else {scope[value]=""; }
							ele.addEventListener("input",function(){
									 scope[value]=ele.value;
								updateViews(scope);
							 });
						break;
					case "for":
					    let forParent= ele.getAttribute(attrName)
					    let parts =forParent.split(" ");
					    let arraName=parts[2];
						let loopEle=ele.children[0];
						loopEle.remove()
						var templ=loopEle.innerHTML;
						 for(let value of scope[arraName]){
						     var clone=loopEle.cloneNode(true);
							 templ=templ.replace(parts[0],"value")
							 let dataMap={"value":value};
							 clone.innerHTML=$template.render(templ,dataMap)
							 ele.appendChild(clone);
						 }
            
					  break;
					case "if" :

					   break;
					default:// events of controller		
							scope.events.push({"ele":ele,"name":value});
							var fn=value.substring(0,value.length-2)
							ele.addEventListener(name,function(){
								  scope[fn].apply(scope);
							});
																
						break;
					}
				}
	}

	function updateViews(scope){
		foreach(scope.views,function(view){
				 view.ele.innerHTML= $template.render(view.tmpl,scope);
			  });
	 }

  //html function provides wrapper for html elements.
  function $html(selector){  
	     function HTML(selector){this.ele=document.getElementById(selector); }
         HTML.prototype={
		 		 getEle:function(){ return this.ele;},
		 		 getVal:function(){ return this.ele.value;},
		 		 setVal:function(val){ this.ele.value=val;},
		 		 getHtml:function(){ return this.ele.innerHTML;},
		 		 setHtml:function(html){this.ele.innerHTML=html;},
		 		 addClass:function(newClass){this.ele.className=newClass;},
		 		 getClass:function(){return this.ele.className;},
		 		 removeClass:function(clsName){this.ele.className=newClass},
		 		 show:function(){	this.ele.style.display="block";},
		 		 hide:function(){	this.ele.style.display="none" ;},
		 		 toggle:function(){
				    	     var val=this.ele.style.display; // val=="none"?this.show():this.hide;
				    	     if(val=='none')  this.ele.style.display="block";
				    	     else  this.ele.style.display="none";
				    	   	},
				 fadeIn:function(speed){ 
					 			var ele=this.ele;
						 		var opa=parseFloat(ele.style.opacity);
						 		if(opa>=0.0 || opa<=1){
						 		    var id=setInterval(function(){
										ele.style.opacity=opa+0.25;
									    if(ele.style.opacity=="1"){ clearInterval(id)};
										},50);
						 		}
					    	},
				 fadeOut:function(speed){
					 		var ele=this.ele;
					 		var opa=parseFloat(ele.style.opacity);
					 		if(opa>=0.0 || opa<=1){
					 		    var id=setInterval(function(){
									ele.style.opacity=opa-0.25;
								    if(ele.style.opacity=="0"){ clearInterval(id)};
									},50);
					 		}
					   },
				 slide:function(width,height){
					 			  var ele=this.ele;
							      var id=setInterval(function(){ 
											    var ew=ele.style.width; var eh=ele.style.height;
													var w=ew.substr(0,ew.indexOf('px'));
													var h=eh.substr(0,eh.indexOf('px'));
													if(w<width) ele.style.width=++w+'px';
											    if(h<height) ele.style.height=++h+'px';
											  if(w==width&& h==height){
													clearInterval(id);
												}
								},10);		
							
						},
				move:function(left,top){
							var ele=this.ele;
										  var id=setInterval(function(){
												 var ex=ele.style.letf; var ey=ele.style.top;
													var x=ex.substr(0,ex.indexOf('px'));
													var y=ey.substr(0,ey.indexOf('px'));
													if(w<left) ele.style.left=++x+'px';
											    if(h<top) ele.style.top=++y+'px';
											  if(w==width&& h==height){
													clearInterval(id);
												}
											},5);
						},
				 validate: function(){
		    	       	 function vErr(ele,errMsg){
										 ele.style.borderColor="red";ele.focus(); 
										 $html("error").setHtml(errMsg);
										 return false;
									 };
		    	       /* var numericRegex = /^[0-9]+$/,
		    	         integerRegex = /^\-?[0-9]+$/,
		    	         decimalRegex = /^\-?[0-9]*\.?[0-9]+$/,
		    	         emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
		    	         alphaRegex = /^[a-z]+$/i,
		    	         alphaNumericRegex = /^[a-z0-9]+$/i,
		    	         alphaDashRegex = /^[a-z0-9_\-]+$/i,
		    	         naturalRegex = /^[0-9]+$/i,
		    	         naturalNoZeroRegex = /^[1-9][0-9]*$/i,
		    	         ipRegex = /^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})$/i,
		    	         base64Regex = /[^a-zA-Z0-9\/\+=]/i,
		    	         numericDashRegex = /^[\d\-\s]+$/,
		    	         urlRegex = /^((http|https):\/\/(\w+:{0,1}\w*@)?(\S+)|)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/;
						 */
					 
					          for(var i=0;i<=this.ele.elements.length-1;i++){
											var ele=this.ele.elements[i];
										 if(ele.hasAttribute("mvc-validate")){
											 	ele.style.borderColor="";		
										 var evalue=ele.value, etype=ele.type, len=ele.value.length;
										 var vconf=toJson(ele.getAttribute("mvc-validate").replace(/\'/g,"\""));
										 if(etype=='text'|| etype=='password'){
											   if(evalue=="" || len <= vconf.min || len >= vconf.max){
													 return vErr(ele, "Should be greater than "+vconf.min +" and less than "+vconf.max);
													 }
										 }else if(etype=="email" && evalue==""){
											      return vErr(ele,"Please enter valid mail");
										}else if(etype=="date" && evalue==""){
											   return vErr(ele,"Please enter valid date");
										}else{
											
										}	
						      
										/**if(ele.type=='radio' && ele.value=="-1")     return vErr(ele);
						    		else if(ele.type=="select-one" && ele.value=="-1") return vErr(ele); */

										}
					 
										}
		    	       	 
					      $html("error").setHtml("Form validated");
					    			 return true;
				        },
				 submit:function(type ,callback) { 
						    if(this.validate(this.ele)){
						    	this.ele.id; var url=this.attr("action"); var data=this.data();
			       	          	Ajax.get(url+"?"+data,callback);
					     	 }
						    return false;
				 			},
				 getFormdata:function(obj){
								var felems=this.ele.elements;
								for(var int = 0; int < felems.length; int++) {
					     			var ele=felems[int];	
					     			var eleName=ele.name;
					     			if(obj.hasOwnProperty(eleName)) 
					     				obj[eleName]=ele.value;
	    	  					}
	    	  					return obj;
	    					 },
		   			formReset:function(){ this.ele.reset(); }
					}
		    return new HTML(selector);
	  }

	class Module{ 
		constructor(){}
		module(name){this.name=name; return this;}
		controller(name,fn,di_arr){	$ioc.setController(name,fn,di_arr);	}
		routing (){ return $hashRouter;}
		run(cbfn){ this.init=cbfn;}
		service (name,obj){$ioc.setService(name,obj);}
	 }

	   var $log=new Logger(), 
	   		mvc=new Module(),
       		$http=new HTTPService(),
      		$hashRouter=new HashRouter($http),
       		$ioc=new IOC(),
	   		$template=new Template(),
	   		$domParser=new DomParser()

   	   mvc.service("$http",$http);
   	   mvc.service("$html",$html);
       mvc.service("$template",$template);
       mvc.service("$log",$log);

	   	//Module of the application.

  	   window.mvc=mvc;
   /**
	 * setInterval(callback, delay); setTimeout(callback, delay)
	 * clearInterval(intervalID) clearTimeout(intervalID)
	 */
   var timerId=setInterval(() =>{
	   if (document.readyState ==="complete"){
		 		 try {
			  	 		console.log("Document loaded and parsing dom started..."); 
						clearInterval(timerId);
			   			window.addEventListener("hashchange",()=>{ $hashRouter.handleHashChange();});
		   			}catch (e) {
						console.error(e)
			     		console.log(e.message);	
		   			}
    		}
       }, 5);
 })(window,document);