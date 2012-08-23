var HTML = "HTML";
var TEXT = "Text";
var MOBILE = "Mobile";

function onBodyLoad(){
	document.addEventListener("deviceready", onDeviceReady, false);
	$("#clear").bind ("click", function () {
		clearSubscriber();
	});
	$("#save").bind ("click", function () {
		//alert("Saving");
		saveSubscriber();
		clearSubscriber();
	});
	$("#submit").bind ("click", function () {
		selectSubscribers(function(subscribers){
			console.log (JSON.stringify (subscribers, null, '  '));
			subscribeToList(subscribers);
		});
	});
	// $("#delete").bind ("click", function ()
	//	{
	//		deleteSubscribers();
	//	});
	$(document).ready(function() {
		$('.exit-dialog-yes').live('click',function() {
			navigator.app.exitApp();
		});
		$('.delete-dialog-yes').live('click',function() {
			deleteSubscribers();
		});
	});
}

function onDeviceReady() {
	console.log("**********  In onDeviceReady *********");
	initDB();
}

function initDB(){
	console.log("initDB");

	html5sql.openDatabase("cls_signupdb", "CLS_SIGNUP.DB", 3*1024*1024);
	console.log("DB OPENED");
	//Update the current MC Options
	//cleanMCOptions();
	$.get('js/db/Setup-Tables.SQL',function(sqlStatements){
		console.log("DB SETUP");
		html5sql.process(
			//This is the text data from the SQL file you retrieved
			sqlStatements,
			function(){
				// After all statements are processed this function will be called.
				console.log("Tables Created!");
				insertMCOptions();
				//selectMCOptions();
			},
			function(error){
				// Handle any errors here
				console.log("Error creating tables: "+error);
			}
		);
	});
}



function selectMCOptions(callback){
	console.log("selectMCOptions");
	result = {};
	html5sql.process(
		["SELECT * FROM MC_OPTIONS;"],
		function(transaction, results, rowsArray){
			for(var i = 0; i < rowsArray.length; i++){
				result = {
					mc_api_key:rowsArray[i].API_KEY,
					mc_list_id:rowsArray[i].LIST_ID
				};
				// //each row in the rowsArray represents a row retrieved from the database
				// var apiKey = rowsArray[i].API_KEY;
				// var listId = rowsArray[i].LIST_ID;
				//console.log("Retrieved MC_OPTIONS: "+apiKey+"  "+listId);
			}
			return callback(result);
		},
		function(error, statement){
			//hande error here    
			console.log("Error selecting MC Options: "+error);      
		}
	);	
}

function insertMCOptions(){
	console.log("insertMCOptions");
	html5sql.process(
		[{"sql":"INSERT INTO MC_OPTIONS (API_KEY,LIST_ID) VALUES (?, ?);",
		"data":["ff29bd63419727b044cb450e44c52ae7-us4", "ed0081b975"],
		"success": function(transaction, results){
			// After all statements are processed this function will be called.
			console.log("MC Options Inserted!");
		},}]
	);
}

function cleanMCOptions(){
	console.log("cleanMCOptions");
	html5sql.process(
		["DELETE FROM MC_OPTIONS;"],
		function(){
			// After all statements are processed this function will be called.
			console.log("Deleted from MC Options!");
		},
		function(error){
			// Handle any errors here
			console.log("Error deleting from MC Options: "+error);
		}
	);	
}

function saveSubscriber(){
	console.log("saveSubscriber");
	
	var emailAddress = $('#emailAddress').val();
	var firstName = $('#firstName').val();
	var lastName = $('#lastName').val();
	var type = HTML;
	if ($("#radio-choice-b").attr ("checked")) type = TEXT;
	else if ($("#radio-choice-c").attr ("checked")) type = MOBILE;
	
	console.log("Email Address:"+emailAddress+" First Name:"+firstName+" Last Name:"+lastName+" Type:"+type);
	// if there's a connection, then send the subscription info to Mail Chimp
	
	// If no connection, save to local storage to be uploaded later.
	insertSubscriber(emailAddress, firstName, lastName, type);
}

function insertSubscriber(emailAddress, firstName, lastName, type){
	console.log("insertSubscriber");
	html5sql.process(
		[{"sql":"INSERT INTO SUBSCRIBERS (EMAIL_ADDRESS,FIRST_NAME,LAST_NAME,PREFERRED_FORMAT) VALUES (?, ?, ?, ?);",
		"data":[emailAddress, firstName, lastName, type],
		"success": function(transaction, results){
			// After all statements are processed this function will be called.
			$("#lnkDialog").click();
			//alert("Thank You! Your subscription information has been saved!");
		},}]
	);
}

function selectSubscribers(callback){
	console.log("selectSubscribers");
	result = {};
	html5sql.process(
		["SELECT * FROM SUBSCRIBERS;"],
		function(transaction, results, rowsArray){
			for(var i = 0; i < rowsArray.length; i++){
				result[i] = {
					emailAddress:rowsArray[i].EMAIL_ADDRESS,
					firstName:rowsArray[i].FIRST_NAME,
					lastName:rowsArray[i].LAST_NAME,
					type:rowsArray[i].PREFERRED_FORMAT
				};
			}
			return callback(result);
		},
		function(error, statement){
			//hande error here    
			console.log("Error selecting Subscribers: "+error);      
		}
	);	
}

function deleteSubscribers(){
	console.log("deleteSubscribers");
	html5sql.process(
		["DELETE FROM SUBSCRIBERS;"],
		function(){
			// After all statements are processed this function will be called.
			console.log("Deleted from Subscribers!");
			alert("Deleted all the subscribers from local storage!");
		},
		function(error){
			// Handle any errors here
			console.log("Error deleting from Subscribers: "+error);
			alert("Error deleting all the subscribers from local storage: "+error);
		}
	);	
}

function subscribeToList(data){
	console.log("subscribeToList");
	
	//var data = [{emailAddress: 'jskotz@gmail.com'}];
	
	// var data = [{emailAddress: $('#emailAddress').val(), 
	//				firstName: $('#firstName').val(),
	//				lastName: $('#lastName').val(),
	//				type: $('#type').val()},
	//				{emailAddress: 'jskotz@gmail.com', 
	//				firstName: $('#firstName').val(),
	//				lastName: $('#lastName').val(),
	//				type: $('#type').val()}];
	
	//var options = {mc_api_key: "ff29bd63419727b044cb450e44c52ae7-us4", mc_list_id:"ed0081b975"};
	
	selectMCOptions(function(options){
		console.log (JSON.stringify (options, null, '  '));
	
		window.plugins.mailChimpAPI.subscribe('batch_subscribe', data, options, function(result) {
				alert("Submit to Mail Chimp: " + result);
			}, function(error) {
				alert("MailChimp subscribe failed: " + error);
			});
	});		
}

function clearSubscriber(){
	console.log("clearSubscriber");
	
	$('#emailAddress').val('');
	$('#firstName').val('');
	$('#lastName').val('');
	// HTML
	$("#radio-choice-a").attr ("checked", true).checkboxradio("refresh");
	$("#radio-choice-b").attr ("checked", false).checkboxradio("refresh");
	$("#radio-choice-c").attr ("checked", false).checkboxradio("refresh");
}
