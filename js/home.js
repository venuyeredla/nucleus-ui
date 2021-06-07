"use strict";
var module=mvc.module("patterns");
//Routing configuration.
var routes=[
	 {"p":"/home",    "c":"testController",   "v":"/html/welcome.html"},
	 {"p":"/search",  "c":"searchController",   "v":"/html/search.html"},
	 {"p":"/signup",  "c":"signup",             "v":"/html/signup.html"}
]

module.routing().addRoutes(routes);

module.run(function(){
	  console.log("run funciton");
});

module.controller("headerController", function($scope,$http,$html,$log){
		    $scope.suggestions=function(){
	    	var query=$scope.query;
				var parent=document.getElementById("suggest");
				parent.innerHTML='';
	    	if(query.length>=2){
	    		var url="suggestions.htm?query="+$scope.query;
	    		$http.get(url,{},function(json){
	    			var array=json.suggestions;
	    			for (var int = 0; int < array.length; int++) {
						var li=	document.createElement("li");
							li.innerHTML='<strong>'+array[int]+'</strong>'
	    				parent.appendChild(li)
					}
	    			$log.info(json);
	    		  });
	    		$html("suggest").toggle();
	    	}
       }

	$scope.opensuggest=function(){
		$html("suggest").toggle();

	}
	$scope.closesuggest=function(){
		$log.info("suggest")
		$html("suggest").toggle();
	}

},["$http","$html","$log"]);

module.controller("searchController", function($scope,$http,$html,$log){
	 $scope.search=function(){
	    	var query=$scope.q;
	    	if(query.length>=2){
	    		var url="sresults.htm?query="+$scope.q;
	    		var parent=document.getElementById("sr");parent.innerHTML='';
	    		$http.get(url,{},function(json){
	    			$log.info(json);
	    			$html("resultsSize").setHtml(json.totalHits);
	    			$html("time").setHtml(json.time);
	    			var docs=json.docs;
						var facets=json.facets;
				   for(var i=0;i<docs.length;i++){
					   var template='<b class=\'resultsHead\' >'+(i+1)+'. <a class=\'resultsHead\' href=\''+docs[i]['url']+'\'>'+docs[i]['word']+'</a></b>';
					   template=template+'<p class=\'resultsteaser\' >'+docs[i]['example']+'</p>';
					   template=template+'<p class=\'resultsauthor\'>  Author: <b>'+'venu'+'</b>';
					   template=template+' , Age: <b>'+'28'+'</b>';
					   template=template+' , Country : <b>'+'india'+'</b> <p>';
	    			   var div=document.createElement("div");
	    			     div.className="result";
							 div.innerHTML=template;
							 parent.appendChild(div);
						 }
						if(facets.length>0)
							{
								var fac=document.getElementById("facets");
								fac.innerHTML='';
								for(var k=0;k<facets.length;k++){
									  var authors=facets[k]["alphabet"];
									  for(var m=0;m<authors.length-1;m++){
											var authTemp=document.createElement("li");
											authTemp.innerHTML=authors[m];
											fac.appendChild(authTemp);
										}
								}

							}
	    		});
	    	}
  }

	   $scope.showQueries=function(){
			$html("lquery").toggle();
		}

	 $scope.qboxChange=function(){
		 $log.info("Old className : "+$html("qbox").getClass());
		 $html("qbox").addClass("queryboxTop");
		 $html("sheader").show();


	 }

 },["$http","$html","$log"]);

    module.controller("signin", function($scope,$http,$html,$log){
	$scope.login=function(){
		   var form=$html("loginform");
		   var fdata=form.getFormdata({uname:null,pwd:null});
	  	  if (form.validate()){
				var url = "login.htm" + "?uname="+fdata.uname+"&pwd="+fdata.pwd;
				$http.post({url:url,rt:"json",
						success:function(result){
							if(result.token=="true"){
								location.href="user.htm";
							}else{
								$html("error").show();
							}
						}
					});
			}else {
				$html("error").show();
				form.validate();
				return false;
			}
	}

},["$http","$html","$log"]);

module.controller("signup", function($scope,$http,$html,$log){
    $scope.validMail=function(){
	 var mail=$html("email").getVal();
	 var url="vmail.htm"+"?mail="+mail;
	 $http.get(url,{},function(json){ console.log(json.valid); 	});
   }

    $scope.register=function(){
    	var form=$html("signup");
		//var fdata=form.getFormdata({uname:null,pwd:null});
    	if(form.validate()){
    		 $log.info("Test string");
    		}
    	}
    $scope.retype=function(){
    	console.log("done retype:");
    }

},["$http","$html","$log"]);

module.controller("testController", function($scope,$http,$html,$log){
	     $scope.fname="venu";$scope.lname="Ready";
		   $scope.slide=function(){$html("slide").slide(100,100);  };
		   $scope.toggle=function(){$html("toggle").toggle(); }
		   $scope.move=function(){ $html("move").fadeIn(100,100); }
		   $scope.fade=function(){ $html("fade").fadeIn();}
 	},["$http","$html","$log"]);

module.service("UserInfo", function(){
	this.name="venugopal Reddy";
    this.getName=function() {
    	return this.name;
     }
   });

module.controller("watch",function(){
	var o = { p: 1 };
	o.watch("p",function(){ alert("temp has changed:");});
	o.p=100;
});
