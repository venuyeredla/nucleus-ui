"use strict"; 
var module=mvc.module("patterns");
module.routing().when('/home',"/views/home_main.jsp", null )
	 				.when('/profile',"/views/profile.jsp",null)
	 				.when('/admin', "/views/admin.jsp", null)
	 				.when('/friend', "/views/friend.jsp", null)
	 				.when('/photos', "/views/photos.jsp", null)
	 				.when('/msg', "/views/msg.jsp", null)
   				.otherwise("/home");
   	
module.controller("menuController", function($scope,$http,$html,$log){
	 $scope.suggArry=[];
	 $scope.suggestions=function(){
	    	var query=$scope.query;
			var parent=document.getElementById("suggest");
			parent.innerHTML='';
	    	if(query.length>=2){
	    		var url="suggestions.htm?query="+$scope.query;
	    		$http.get(url,{},function(json){ 
	    			var array=json.suggestions;
	    			$scope.suggArry=array;
	    			if(array.length>0){
	    				for (var int = 0; int < array.length; int++) {
							var li=	document.createElement("li");
								li.innerHTML='<li><strong>'+array[int]+'</strong></li>'
		    				parent.appendChild(li)
						}	
	    			}else{
	    				$html("hide").hide();
	    			}
	    			
	    				
	    			$log.info(json);
	    		  });
	    		$html("suggest").toggle();
	    	}else{
	    		$html("hide").hide();
	    	}
		
    }
	
	$scope.opensuggest=function(){
		if($scope.suggArry.length>0){
			$html("suggest").toggle();	
		}
		
		
	}
	
	$scope.closesuggest=function(){
		if($scope.suggArry.length>0){
		$html("suggest").toggle();
		}
	}
	
	  $scope.openMenu=function(){
		  $html("fade").show();
	  }
	  $scope.closeMenu=function(){
		  $html("fade").hide();
	  }
	  $scope.slide=function(){ $html("slide").slide(100,100);}
	  
   },["$http","$html","$log"]);

module.controller("toggleIMG", function($scope,$factory){
	   $html("imgSH").toggle(); 
  },["$html"]);

   
module.controller("imgupload", function($scope,$http,$factory){
			var cb=function(json){ var res=json; alert(res);	}
			$http.upload("imgf","/upload.htm",cb);
  },["http","factory"] );
  
module.controller("msg", function($scope,$http,$html,$template){  
		$http.post({
			url:"messages.htm",
			rt:"json",
			success:function(js){ 
				var mc =$html("msg_container").getEle();
				var res=mc.firstElementChild.cloneNode(true);
			 if(mc!=null){
				    	var len=js.messages.length;
				    	for ( var i = 0; i < len; i++) {
								var im=js.messages[i].image;
								var m=js.messages[i].msg;
								var resu=$template.bind(mc.innerHTML,{img:im,msg:m});
								res.innerHTML=resu;
								mc.appendChild(res);				
				    	}
				    }
			}
		});
	},["$http","$html","$template"]);

module.controller("friend", function($scope,$http){
		$http.post({
			url:"messages.htm",
			rt:"json",
			success:function(js){console.log(js);}
		});
	},["$http"]);

module.controller("profile", function($scope,$http){
		$http.post({
			url:"messages.htm",
			rt:"json",
			success:function(js){console.log(js);}
		});
		},["$http"]);
   
module.controller("online",function($scope,$http){
		$http.post({
			url:"messages.htm",
			rt:"json",
			success:function(js){console.log(js);}
		});
	},["$http"]);
   
module.controller("photos",function($scope,$http){
		$http.post({
			url:"messages.htm",
			rt:"json",
			success:function(js){console.log(js);}
		});
	},["$http"]);