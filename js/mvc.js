"use strict";
(function(window , document){
	 //Variables declaration
	 var location = window.location,uid=0;
	 function getUid(){ ++uid;   return "00"+uid;}
	 function toJson(str){return JSON.parse(str);}
	// function toStr(obj){return JSON.stringify(obj); }
	 function foreach(array,fn){  
		     for(var i=0;i<array.length;i++){
			  	  	fn(array[i]);
				   }
		 	 }
	  var $log=(()=>{return{
						info:(txt) =>{ console.info(txt);},
						error:(txt) =>{ console.error(txt);},
						log:(txt) =>{ console.log(txt);},
						warn:(txt) =>{ console.warn(txt);}
						};
			})(window.console);
	  /**
	   * Location service and useful for building single page applications.
	   */   
        function Location(){  this._routes=[]; this._root="/"; return this;}
        Location.prototype={
		 when:function(path,view,controller){this._routes[path]={"controller":controller,"view":view}; return this;	},
		 otherwise:function(to){this._root=to; },
		 change:function(arg){location.hash=arg;},
		 append:function(arg){location.hash=location.hash.concat(arg);},
		 process:function($http){
			      var hv=location.hash.slice(1),router=this._routes[hv];
								if(router != undefined){
								   var controller=router.controller, viewUrl=router.view;
								 	 $http.get(viewUrl,{"async":false,"rt":"html"},function(html){
												   if($html("view").getEle()!=undefined){
					  								 $html("view").setHtml(html);   
				     							  }
										        else{
															throw new UserException("View is not defined in page.");
														}
											    });
									 }else{
										  this.change(this._root);
									 }
		  }
	 };
	
/*	 var mvc2=(function(){
		    	var _controllers = [];
		   	  var _services=[];
		      return {
						  module:function(name){
						       		var mname=name;
						      		return{
													 controller:function(name,fn,di_arr){	$ioc.setController(name,fn,di_arr);	},
		 	 										 routing:function(){ return $location;},
		 	 										 run:function(cbfn){ this.init=cbfn;},
		 	 										 service :function(name,obj){$ioc.setService(name,obj);}
						            	};
										}
							};
		 
		 
	 })(); */
	
	// Provides ioc and dependency Injection.
    function IOC(){ 
		   	this._controllers = [];
		   	this._services=[];
	   		return this;
		}
	IOC.prototype={
		setController:function(name, callback,di_arr) {
			   			this._controllers[name] = {"fn":callback,"di":di_arr};  	},
		getConObj:function(scope){
			     var con=this._controllers[scope.cname];
			     var fn=con.fn;var obj=[scope];
			     if(con.di!=undefined){
				   	  for(var i=0;i<con.di.length;i++){
				   	   	 	obj.push($ioc.getService(con.di[i]));					 
						 }
			    	 }
			    fn.apply(this,obj);
		    },
		setService:function(name,obj){this._services[name]=obj; },
		getService:function(name){return this._services[name]; }
  		};
	
	//Module of the application.
   function Module(){ return this; }
   Module.prototype={
		 	 module:function(name){this.name=name; return this;},
		 	 controller:function(name,fn,di_arr){	$ioc.setController(name,fn,di_arr);	},
		 	 routing:function(){ return $location;},
		 	 run:function(cbfn){ this.init=cbfn;},
		 	 service :function(name,obj){$ioc.setService(name,obj);}
	};
	
	//Http Service Code
	 function HTTP(){
		  this.xhr=(function($document){
    	      			return window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"); 
		  		})();
		 	   return this; 
	   } 
	    HTTP.prototype={
			post :function(conf){   //for ajax calls
				  var xhr=this.xhr,
				  	  url=conf.url,
				  	  rt=conf.rt=="html"?"html":"json",
				  	  success=conf.success,
				      data=conf.data;
				  xhr.onreadystatechange=function(){ 
 				  		if(xhr.readyState==4 && xhr.status==200){  
 				  			if(rt=="json"){ return success(JSON.parse(xhr.responseText));}
 				  			else           {return success(xhr.responseText);}
					       }
					};
 			  	xhr.open("POST",url,true);
 			  	xhr.send(data); 
			 },
			get : function(url,conf,cb){
				     var xhr=this.xhr,async=conf.async ? true:false, type=conf.rt=="html"?"html":"json";
		    		 xhr.onreadystatechange=function(){
							if(xhr.readyState==4 && xhr.status==200){
								if(type=='html'){ return cb(xhr.responseText);   }
								else{	return cb(JSON.parse(xhr.responseText));  }
							} 
						};
				     xhr.open("GET",url,async);
				     xhr.send();
			  },						
			upload : function upload(id,action,cb){              // for uploading files
				 			var xhr=this.xhr,
						    file = document.getElementById(id),
							formData = new FormData();   
							formData.append("upload", file.files[0]); apply
							xhr.open("post", action, true);
							xhr.setRequestHeader("Content-Type", "multipart/form-data");
							xhr.send(formData);  /* Send to server */ 
							xhr.onreadystatechange = function() {
							 if ($http.readyState == 4 && $http.status == 200){
								   return  cb(xhr.responseText);
								}
							};
		        }
	  }
	  

	 //Template engine
	  function Template(){  	}
	  Template.prototype={
			render : function(tmpl,data){
				var exp=/{{([^}}]+)?}}/i;var match; 
					   while (match = exp.exec(tmpl)) {
						   tmpl = tmpl.replace(match[0], data[match[1]]);
						}
					   return tmpl;
				  },
			bind:function(ele,obj){
			         var exp=/{{([^}}]+)?}}/i; var match;
				  		 var html=ele.innerHTML;
							  while (match = exp.exec(html)) {
									html = html.replace(match[0], obj[match[1]]);
							   }
				       ele.innerHTML=html;
					}
	 		 }
		
   function mvcloop(scope){
		foreach(scope.views,function(view){
		     view.ele.innerHTML= $template.render(view.tmpl,scope);
		  });
	  }
	 
   
  // For parsing dom.
 function compileDom(){
	   var conAttr="mvc-con",
 	   attrs=["mvc-bind","mvc-model","mvc-click","mvc-change","mvc-blur","mvc-mouseleave","mvc-mouseout","mvc-focus","mvc-input","mvc-mouseover","mvc-submit"];
 	  	
function start() {
	   var module_root = document.getElementById("mvc");
	    if(module_root!=null){
		 			if(module_root.hasAttribute(conAttr)){   registerController(module_root);  }
		 	 			parseChilds(module_root);
		    } 
		}
function parseChilds(ele) {
	 if(ele.childElementCount > 0) {
		    foreach(ele.children,function(child){
					if(child.hasAttribute(conAttr)){ 
						registerController(child); 
					}else{
						parseChilds(child); 
					}
			  });
		 }
}
 
//Registering controller.   
function registerController(conele) {
	    var scope={"id": getUid(),"views":[],"events":[]};
	    scope.cname=conele.getAttribute(conAttr),
		  $ioc.getConObj(scope);
	  // Storing attributes
    function pushAttr(ele,attr,value) {
				switch (attr) {
				case "mvc-bind":
					var view={"ele":ele,"name":value,"tmpl":ele.innerHTML};
						scope.views.push(view);
						view.ele.innerHTML=$template.render(view.tmpl,scope);
					break;
				case "mvc-model":
						if(scope.hasOwnProperty(value)){
							ele.value=scope[value]==undefined?"":scope[value];
						 }else {scope[value]=""; }
						ele.addEventListener("input",function(){
							     scope[value]=ele.value;
							mvcloop(scope);
						  });
					//	scope.watch(value,function(){mvcloop(scope);});
					break;
				default:// events of controller
						var event_name=attr.substr(4)				
						scope.events.push({"ele":ele,"name":value});
						var fn=value.substring(0,value.length-2)
						ele.addEventListener(event_name,function(){
							  scope[fn].apply(scope);
						});
															
					break;
				}
			}
	function readAttr(ele) {
		  foreach(ele.children,function(child){
				  	foreach(attrs, function(attr){
						if(child.hasAttribute(attr)) {
						    var atrval = child.getAttribute(attr);
							  pushAttr(child,attr,atrval)
					     }
						});
				  if(child.childElementCount>0){	readAttr(child)			}
				});
			}
			readAttr(conele);
			console.log(scope);
		}	
		start();
	 }
  //html function provides wrapper for html elements.
  function $html(selector){  
	     function HTML(selector){this.ele=document.getElementById(selector); }
         HTML.prototype={
		 		 getEle:function(){ return this.ele;},
		 		 getVal:function(){ return this.ele.value;},
		 		 setVal:function(val){ return this.ele.value=val;},
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
		    	     var numericRegex = /^[0-9]+$/,
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
              
   var mvc=new Module(),
       $http=new HTTP(),
       $location=new Location(),
       $ioc=new IOC(),
	     $template=new Template();

   	   mvc.service("$http",$http);
   	   mvc.service("$html",$html);
       mvc.service("$template",new Template());
       mvc.service("$log",$log);
   
  	   window.mvc=mvc;
   	   function init(){
		 			$location.process($http);
		 			compileDom();
		}
	
   /**
	 * setInterval(callback, delay); setTimeout(callback, delay)
	 * clearInterval(intervalID) clearTimeout(intervalID)
	 */
   var timerId=setInterval(() =>{
	   if (document.readyState ==="complete"){
		 		 try {
			  	 		console.log("Document loaded..!"); 
						clearInterval(timerId);
			   			init();
			   			window.addEventListener("hashchange",init);
		   			}catch (e) {
			     		console.log(e.message);	
		   			}
    		}
       }, 5);
 })(window,document);