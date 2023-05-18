"use strict"; 
var module=mvc.module("patterns");
//Routing configuration.  
module.routing().when('/home',   "html/welcome.html",null)
				.when('/search', "html/search.html",null)
	 			.when('/about',  "html/about.html",null )
	 			.when('/signup', "html/signup.html",null)
	 			.otherwise("html/search");
module.run(function(){
	console.log("run funciton");
});

module.controller("headerController", ($scope,$http,$html,$log) => {
	$scope.userName="Venugopal Reddy";
	$scope.appName=()=>{
		$html("suggest").toggle();
	}
},["$http","$html","$log"]);

module.controller("searchController", function($scope,$http,$html,$log){
	$scope.suggest=false;
	$scope.suggestList=["suggest1","suggest2","suggest3","suggest4"];
	$scope.results=[];

	$scope.opensuggest=function(){
		$html("suggest").toggle();
		
	}
	$scope.closesuggest=function(){
		$log.info("suggest")
		$html("suggest").toggle();
	}

	$scope.suggestions=function(){
		var query=$scope.q;
		if(query.length>=2){
			var url="/app/suggest?query="+$scope.query;	
			$http.get(url,{}).then((value)=>{
				$log.info(value);
				$scope.suggestList=value;
				$html("suggest").toggle();
				$scope.suggest=true;
			},(error)=>{
				console.log(error)
			});
		}
      }

	 $scope.search=function(){
	    	var query=$scope.q;
	    	if(query.length>=2){
	    		var url="/app/search?query="+$scope.q;
	    		$http.get(url,{}).then(
                    (value)=> { $log.info(value);
						$scope.results=value;
					  },
					(error)=> {console.log(error)},
				);
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
	       $scope.names=["venu","gopal","reddy"];
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
	o.watch("p",()=>{ alert("temp has changed:");});
	o.p=100;
});