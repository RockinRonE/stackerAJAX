$(document).ready( function() {
	$('.unanswered-getter').submit( function(event){
		// zero out results if previous search has run
		$('.results').html('');
		// get the value of the tags the user submitted
		var tags = $(this).find("input[name='tags']").val();
		getUnanswered(tags);
	});

	$('.inspiration-getter').submit( function(event) {    //when submit button is clicked in inspiration getter
		var answerers = $(this).find("input[name='answerers']").val(); //take this value from the input into a var
		getTopAnswerers(answerers); //pass input var into ajax request 

	}); 
});

var showTopAnswerers = function(topAnswerersResults) {

	var result = $('.templates .answerers').clone(); 

	var avatar = result.find('.avatar img')
	avatar.attr('src', topAnswerersResults.profile_image); 
	console.log(topAnswerersResults.profile_image); 

	var name = result.find('.name')
	name.text(topAnswerersResults.display_name);

	var rate = result.find('.rate');
	rate.text(topAnswerersResults.accept_rate);

	var reputation = result.find('.reputation');
	reputation.text(topAnswerersResults.reputation); 

	return result; 
};








// this function takes the question object returned by StackOverflow 
// and creates new result to be appended to DOM
var showQuestion = function(question) {
	
	// clone our result template code
	var result = $('.templates .question').clone();
	
	// Set the question properties in result
	var questionElem = result.find('.question-text a');
	questionElem.attr('href', question.link);
	questionElem.text(question.title);

	// set the date asked property in result
	var asked = result.find('.asked-date');
	var date = new Date(1000*question.creation_date);
	asked.text(date.toString());

	// set the #views for question property in result
	var viewed = result.find('.viewed');
	viewed.text(question.view_count);

	// set some properties related to asker
	var asker = result.find('.asker');
	asker.html('<p>Name: <a target="_blank" href=http://stackoverflow.com/users/' + question.owner.user_id + ' >' +
													question.owner.display_name +
												'</a>' +
							'</p>' +
 							'<p>Reputation: ' + question.owner.reputation + '</p>'
	);

	return result;
};


// this function takes the results object from StackOverflow
// and creates info about search results to be appended to DOM
var showSearchResults = function(query, resultNum) {
	var results = resultNum + ' results for <strong>' + query;
	return results;
};

// takes error string and turns it into displayable DOM element
var showError = function(error){
	var errorElem = $('.templates .error').clone();
	var errorText = '<p>' + error + '</p>';
	errorElem.append(errorText);
};

// takes a string of semi-colon separated tags to be searched
// for on StackOverflow
var getUnanswered = function(tags) {
	
	// the parameters we need to pass in our request to StackOverflow's API
	var request = {tagged: tags,
								site: 'stackoverflow',
								order: 'desc',
								sort: 'creation'};
	
	var result = $.ajax({
		url: "http://api.stackexchange.com/2.2/questions/unanswered",
		data: request,
		dataType: "jsonp",
		type: "GET",
		})
	.done(function(result){
		var searchResults = showSearchResults(request.tagged, result.items.length);

		$('.search-results').html(searchResults);

		$.each(result.items, function(i, item) {
			var question = showQuestion(item);
			$('.results').append(question);
		});
	})
	.fail(function(jqXHR, error, errorThrown){
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});
};

//=====================================My Ajax Request ===========================// 
var getTopAnswerers = function(answerers) { 

var request = {
    tag: answerers, //from input passed into ajax request fxn
    site: 'stackoverflow', 
    order: 'desc',
    sort: 'creation' 
}; 


    var result = $.ajax({
        url: "http://api.stackexchange.com/2.2/tags/" + request.tag  + "/top-answerers/all_time", 
        data: request,
        dataType: "jsonp",
        type: "GET",
    })
        .done(function (result) {
        //console.log(result);
        $(result.items).each(function (i, index) {
        	//var topAnswerersResults = result.items[i];
        	var topAnswerersResults = result.items[i].user;
        	console.log(topAnswerersResults);
        	$('.results').append(showTopAnswerers(topAnswerersResults));
        //$.each(result.items, function(i, item) {
        	//console.log(topAnswerersResults); 
            //console.log(result.items[i]);
            //var topAnswerersResults = result.items[i]; //stores index results 
            //console.log(topAnswerersResults.user);
            //topAnswerersResults.AppendTo('.results'); 
            //var topAnswer = topAnswerersResults.user; 
            //$('.results').append(topAnswer); 


           

			var searchResults = showSearchResults(request.tag, result.items.length);  //result count 
			$('.search-results').html(searchResults);
        });

    })
        .fail(function (jqXHR, error, errorThrown) {
        console.log(error);
    });

};


