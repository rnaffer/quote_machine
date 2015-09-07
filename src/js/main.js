var Quotes = {

    currentQuote: {},
    nextQuote: {},
    $content: $('#console .console-content'),
    $nextButton: $('#next'),
    $tweetButton: $('#tweet'),

    getQuote: function() {
        return $.ajax({
            url: 'https://wisdomapi.herokuapp.com/v1/random',
            dataType: 'jsonp'
        });
    },

    showQuote: function() {
        if ($.isEmptyObject(this.currentQuote) &&
            $.isEmptyObject(this.nextQuote)) {

            var _this = this;

            this.getQuote().
            then(function(response) {

                _this.currentQuote = response;
                _this.loadContent(response);

                return _this.getQuote();
            }).
            then(function(response) {
                _this.nextQuote = response;
                _this.prepareTweet();

            }, _this.throwError);
        } else {

            this.currentQuote = this.nextQuote;
            this.loadContent(this.currentQuote);
            
            this.prepareTweet();

            var _this = this;

            this.getQuote().
            then(function(response) {
                
                _this.nextQuote = response;

            }, _this.throwError);
        }
    },

    loadContent: function(response) {

       	var $paragraph = $('<p>').html('><br>><br>> "' + response.content + '"<br>><br>><br>> ' + response.author.name + '<br>> ' + response.author.company + '<br>> <span>|</span>');
       	$paragraph.css({display: "none"});
       	
       	this.$content.html($paragraph);

        $paragraph.slideDown('slow');
        
    },

    prepareTweet: function() {
        var content = this.currentQuote.content;
        var author = this.currentQuote.author.name;
        var company = this.currentQuote.author.company;
        var url = 'https://twitter.com/intent/tweet?text=';
        var text = '"' + content + '" - ' + author + ' - ' + company;
        
        var href = url + encodeURI(text);
        this.$tweetButton.attr('href', href);
    },

    throwError: function(xhr, status, error) {
        Quotes.$content.html('<p>Sorry, we have an error<br>' + error.toString() + '</p> ');
    }
};

$(document).ready(function() {
	Quotes.showQuote();

    Quotes.$nextButton.on('click', function(event) {
        event.preventDefault();

        Quotes.showQuote();
    });

    // Quotes.$tweetButton.on('click', function(event) {

    // });


});
